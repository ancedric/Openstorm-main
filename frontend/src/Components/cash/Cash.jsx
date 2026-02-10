/* eslint-disable no-unused-vars */
import './style.css'
import PropTypes from "prop-types";
import useAuth from '../../Authentication/Context/useAuth';
import { useState } from "react";
import supabase from "../../supabase.config";
import Cart from '../cart/cart'
import Loader from "../Loader";
import CashCard from "../cards/cash/CashCard";

const Cash = ({ shop, products, currentStore, handleViewProduct, updateCash, updateSales }) => {

  const { stores } = useAuth();
  
  const amount = shop.cash; 
  const [cartProducts, setCartProducts] = useState([])
  const [isSearching] = useState(false)
  const [isCartLoading, setIsCartLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productResult, setProductResult] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null);

  if (!shop) return <div>Aucune boutique chargée! {':('}</div>;

  const addToCart = async (product, shopId) => {
    if (!product) return;

    setIsCartLoading(true)
    const command = {
      product: product,
      shopId: shopId,
      quantity: 1,
    }
      setCartProducts(prevCart => [...prevCart, command]); 
      setIsCartLoading(false)
  };
  const updateQuantity = (productId, newQuantity) => {
    setCartProducts(prevCart =>
        prevCart.map(command => 
            command.product.id === productId
                ? { ...command, quantity: newQuantity }
                : command
        )
    );
  };
  const totalAmount = cartProducts.reduce((sum, command) => {
      const basePrice = command.product.price;
      const reductionRate = command.product.reduction || 0;
      
      const finalPricePerUnit = basePrice * (1 - reductionRate / 100); 
      return sum + (finalPricePerUnit * command.quantity);
  }, 0);
  
const removeFromCart = (productId) => {
    if (!productId) return;

    console.log("Debug: retrait du produit ", productId)
    setCartProducts(prevCart => {
        const updatedCart = prevCart.filter(command => 
            command.product.id !== productId
        );
        return updatedCart;
    });
};

const saveCart = async () => {
    if (cartProducts.length === 0) return;
    if (!selectedStore) return alert("Veuillez sélectionner un magasin.");

    try {
        setIsCartLoading(true);

        // 1. Enregistrement du Panier avec le Magasin
        const { data: cartData, error: cartError } = await supabase
            .from('inventory_carts')
            .insert([{
                companyref: shop.ref, 
                store_id: selectedStore, // On trace quel magasin a vendu
                amount: totalAmount,
                date: new Date().toISOString()
            }])
            .select().single();

        if (cartError) throw cartError;

        // 2. Transaction financière centralisée
        // On récupère le nom du magasin pour une description comptable précise
        const storeName = stores.find(s => s.id === selectedStore)?.store_name || "Inconnu";
        
        await supabase.from('finance_transactions').insert([{
            companyref: shop.ref,
            type: 'INCOME',
            category: 'VENTE_CAISSE',
            amount: totalAmount,
            description: `Vente POS - ${storeName} (Panier #${cartData.id})`,
            date: new Date().toISOString()
        }]);

        // 3. Mise à jour des produits et commandes
        for (const item of cartProducts) {
            await supabase.from('inventory_orders').insert([{
                cartid: cartData.id,
                store_id: selectedStore,
                productref: item.product.ref,
                quantity: item.quantity,
                price: item.product.price,
                total: (item.product.price * item.quantity).toFixed(2)
            }]);

            // Dans Cash.jsx, quand tu appelles la fonction de sauvegarde
            const handleFinalizeSale = async () => {
              const { data, error } = await supabase
                .from('inventory_carts')
                .insert([{
                  shopid: shop.ref,
                  store_id: currentStore.id, // Liaison cruciale !
                  amount: totalAmount,
                  date: new Date().toISOString()
                }])
                .select().single();
                
                // ... suite de la logique (décrémentation stock, etc.)
            };
            // Décrémentation du stock
            const { error: stockErr } = await supabase
                .from('inventory_products')
                .update({ quantity: item.product.quantity - item.quantity })
                .eq('ref', item.product.ref);
            
            if (stockErr) console.error("Erreur stock pour", item.product.name);
        }

        // 4. Update Statistiques & Reset
        await updateCash();
        setCartProducts([]);
        setSearchTerm("");
        alert("Succès : Transaction comptabilisée pour " + storeName);

    } catch (error) {
        console.error("Erreur :", error);
    } finally {
        setIsCartLoading(false);
    }
};

 const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(value.toLowerCase()) || 
            p.ref.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
    } else {
        setSuggestions([]);
    }
};

const selectProduct = (product) => {
    setProductResult(product); // Affiche le produit dans la carte de sélection
    setSuggestions([]);
    setSearchTerm(product.name);
};

  return (
    <div className="cash-ctn">
      <div className="cash-header">
        <div className="header-left">
          <h3>Cash Amount : {amount} $</h3>
          <div className="search">
            <div className="search-container">
              <label>Search Product:</label>
              <div className="autocomplete-wrapper">
                  <input
                      type="text"
                      className="form-text"
                      placeholder="Type product name..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                  />
                  {suggestions.length > 0 && (
                      <ul className="suggestions-list">
                          {suggestions.map(p => (
                              <li key={p.id} onClick={() => selectProduct(p)}>
                                  <span className="p-name">{p.name}</span>
                                  <span className="p-ref">({p.ref})</span>
                                  <span className="p-price">{p.price}$</span>
                              </li>
                          ))}
                      </ul>
                  )}
              </div>
          </div>
          </div>
        </div>
        <div className="header-right">
          <div className="total"><p>Total: {totalAmount.toFixed(2)} $</p> </div>
          <button className="confirm-btn" onClick={saveCart}>Save</button>
        </div>
      </div>
      
      <div className="cash-data">
        <div className="product-result">
          {isSearching ? (
            <Loader />
          ) : productResult ? (
            <CashCard product={productResult} shop={shop} add={addToCart} setViewProduct={handleViewProduct}/>
          ) : (
            "No product found"
          )}
        </div>
        <div className="cash-cart">
          {isCartLoading ? (<Loader />
          ):(
            <Cart products={cartProducts || []} remove={removeFromCart} updateQuantity={updateQuantity}/>
          )}
          
        </div>
      </div>
    </div>
  );
};
Cash.propTypes = {
  shop: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    cash: PropTypes.number.isRequired,
    current_store_id: PropTypes.number,
  }),
  products: PropTypes.arrayOf(Object).isRequired,
  currentStore: PropTypes.object,
  handleViewProduct: PropTypes.func.isRequired,
  updateCash: PropTypes.func.isRequired,
  updateSales: PropTypes.func.isRequired,
  stores: PropTypes.shape({
    id: PropTypes.number.isRequired,
    store_name: PropTypes.string.isRequired,
  }),
};

export default Cash;
