import './style.css'
import PropTypes from "prop-types";
import { useState } from "react";
import api from "../../axiosConfig";
import Cart from '../cart/cart'
import Loader from "../Loader";
import CashCard from "../cards/cash/CashCard";

const Cash = ({ shop, products, handleViewProduct, updateCash, updateSales }) => {
  const amount = shop.cash; 
  const [productRef, setProductRef] = useState(null)
  const [productResult, setProductResult] = useState(null)
  const [cartProducts, setCartProducts] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCartLoading, setIsCartLoading] = useState(false)

  if (!shop) return <Loader />;

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

const saveCart = async () =>{
    const itemsSold = cartProducts.reduce((sum, command) => sum + command.quantity, 0);//Nombre d'articles vendus
    const newShopCash = amount + totalAmount
    updateCash(newShopCash)
    updateSales(itemsSold, totalAmount);
    try{
      //création du panier en base de données et récupération de son id
      const res = await api.post(`/carts/new-cart`, { shopId: shop.id, amount: totalAmount });
      const newcartId = res.data.cart.id
        //ajout des produits au panier
        for (const command of cartProducts) {
            try{
                const order = await api.post(`/orders/new-order`, {
                    cartId: newcartId,
                    productId: command.product.id,
                    quantity: command.quantity,
                    price: command.product.price,
                    reduction: command.product.reduction || 0,
                    total: (command.product.price * command.quantity * (1 - (command.product.reduction || 0) / 100)).toFixed(2),
                    date: new Date().toISOString(),
                });
                if(order){
                  //On diminue le stock du produit
                  const stockRes = await api.put(`/products/update-stock/${command.product.id}`, {quantity: command.quantity})
                  if(stockRes){
                    console.log('Mise à jour du stock réussie!', stockRes)
                  }
                }
            }catch(error){
                console.error(`Erreur lors de l'ajout du produit ${command.product.productId} au panier:`, error);
            }
        }

        try{
          console.log('Mise à jour du cash')
          const updateShopRes = await api.put(`/shops/update-cash/${shop.id}`,{newCash: shop.cash + totalAmount})
          if(updateShopRes.shop){
            console.log('Mise à jour du cash réussie')
          }
        }
        catch(err){
          console.error('Erreur lors de la mise à jour du cash', err)
        }
        setCartProducts([]);
        setProductResult(null);
        setProductRef("");

    }catch(error){
      console.error("Erreur lors de l'enregistrement de la commande:", error);
    }
    setCartProducts([]);
    setProductResult(null);
    setProductRef("");
}

  const handleChange = (event) => {
    setProductRef(event.target.value)
  };

  const handleProductSearch = async (event) => {
    setIsSearching(true)
    if (event) event.preventDefault();

    if (!productRef) return;
    try {
      const res =  products.find(p => p.ref === productRef)
      setProductResult(res)
      setIsSearching(false)
    } catch (error) {
      console.error("Erreur lors de la recherche de la commandedu produit:", error);
    }
  };

  return (
    <div className="cash-ctn">
      <div className="cash-header">
        <div className="header-left">
          <h3>Cash Amount : {amount} $</h3>
          <div className="search">
            <label htmlFor="amount">Product reference:</label><br />
            <input
              type="search"
              name="search"
              id="search"
              className="form-text"
              value={productRef}
              onChange={handleChange}
            />
            <button className="search-btn" onClick={handleProductSearch}>Search</button>
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
    id: PropTypes.number.isRequired,
    cash: PropTypes.number.isRequired,
  }),
  products: PropTypes.arrayOf(Object).isRequired,
  handleViewProduct: PropTypes.func.isRequired,
  updateCash: PropTypes.func.isRequired,
  updateSales: PropTypes.func.isRequired
};

export default Cash;
