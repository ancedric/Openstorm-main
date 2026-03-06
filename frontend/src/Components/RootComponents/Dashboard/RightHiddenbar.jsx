/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import './style.css'
import logo from  '../../../assets/images/corevia-logo-1.png'
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Cash from "../../cash/Cash";
import HistogramComponent from "../../histogram";
import Timer from "../../timer/Timer";
import ProductCard from "../../cards/products/productCard";
import UpdateProductForm from "../../forms/UpdateProduct";
import RemoveProductForm from "../../forms/RemoveProduct";
import ShopSetupForm from "../../forms/shopSetupForm/ShopForm";
import defaultShop from '../../../assets/images/default_shop.png'
import { FetchCommands, GetProducts } from '../../../Authentication/shop';
import useAuth from '../../../Authentication/Context/useAuth';
import supabase from '../../../supabase.config';
import AddProductForm from '../../forms/addProduct/AddProduct';
import ProductViewCard from '../../view/productView';
import OrderCard from '../../cards/orderCard/OrderCard';
import RenewalForm from '../../forms/ShopRenewalForm/RenewalForm'
import UserComponent from '../../../Authentication/user';
import StockAlerts from '../../StockAlert/StockAlert';
import SalesHistory from '../../History/SalesHistory';
import { fetchSalesHistory } from '../../../Authentication/shop';

function RightHiddenbar() {
  const { shop, showShopSetup, completeShopSetup, isAuthenticated, isAppReady } = useAuth()

  const initialCash = shop && shop.cash !== undefined ? shop.cash : 0;
  const [currentCashAmount, setCurrentCashAmount] = useState(initialCash);

  const [productList, setProductList] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [commands, setCommands] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [salesHistory, setSalesHistory] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const [myAccountOpen, setMyAccountOpen] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [cashOpen, setCashOpen] = useState(false);
  const [viewProductOpen, setViewProductOpen] = useState(false)
  const [productToDisplay, setProductToDisplay] = useState(null)
  const [productsSalesData, setProductsSalesData] = useState([])

  /*--Gestion du catalogue--*/
  const [commandsOpen, setCommandsOpen] = useState(false);

  //vaiables relatives à la gestion des produits du catalogue
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [removeProductOpen, setRemoveProductOpen] = useState(false);
  const [updateProductOpen, setUpdateProductOpen] = useState(false);
  const [openShopSetup, setOpenShopSetup] = useState(showShopSetup)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    console.log('shop:', shop);
    if(shop && shop.id){
          const fetchProducts = async () => {
            try {
              const productsData = await GetProducts(shop.ref);
              setProductList(productsData);
              fetchDailySalesAPI(shop.id);

              // 1. Calculer le total des ventes pour chaque produit
              const salesPromises = productsData.map(async (product) => {
                const orders = await fetchProductSales(product.id);
                const totalQty = orders.reduce((sum, order) => sum + (order.quantity || 0), 0);
                
                return {
                  name: product.name,
                  quantity: totalQty
                };
              });

              const aggregatedSales = await Promise.all(salesPromises);

              // 2. Trier du plus vendu au moins vendu et prendre les 5 premiers
              const top5Products = aggregatedSales
                .filter(p => p.quantity > 0) // On ignore les produits non vendus
                .sort((a, b) => b.quantity - a.quantity) // Tri décroissant
                .slice(0, 5); // On garde uniquement les 5 meilleurs

              setProductsSalesData(top5Products);

            } catch (error) {
              console.error("Erreur lors de la récupération des produits :", error);
            }
          };

        fetchProducts();
        fetchCommands();
      //}
    }
  }, [/*isBlocked,*/ shop]);


useEffect(() => {
  if (shop?.id) {
    refreshHistory();
  }
}, [shop?.id]);

const refreshHistory = async () => {
  try {
    const data = await fetchSalesHistory(shop.id);
    setSalesHistory(data);
  } catch (err) {
    console.error("Erreur lors du refresh de l'historique:", err);
  }
};

    const fetchCommands = async () => {
      try {
        const commandsData = await FetchCommands(shop.id);
        setCommands(commandsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        // Gérer l'erreur de manière appropriée
      }
    };

  const updateCashAmount = (newAmount) => {
      setCurrentCashAmount(newAmount);
  };
  
  const fetchDailySalesAPI = async (companyRef) => {
    try {
      const { data, error } = await supabase
        .from('inventory_dailysales')
        .select('*')
        // On filtre maintenant par la colonne de l'entreprise
        // Assure-toi que ta table 'dailysales' utilise 'companyref' ou 'shopid'
        .eq('companyref', companyRef) 
        .order('date', { ascending: true });

      if (error) throw error;

      // 1. Agrégation par date (au cas où il y aurait des doublons historiques)
      const aggregatedSales = data.reduce((acc, current) => {
        const dateStr = current.date.includes('T') ? current.date.split('T')[0] : current.date;
        const existing = acc.find(s => s.date.split('T')[0] === dateStr);

        if (existing) {
          existing.nbSales += current.nbsales;
          existing.totalAmount += current.totalamount;
        } else {
          acc.push({
            ...current,
            date: dateStr, // On garde une date propre YYYY-MM-DD
            nbSales: current.nbsales,
            totalAmount: current.totalamount
          });
        }
        return acc;
      }, []);

      // 2. On garde uniquement les 7 derniers jours pour le graphique
      const last7Days = aggregatedSales.slice(-7); 

      setTotalSales(aggregatedSales.reduce((sum, s) => sum + s.nbSales, 0));
      setDailySalesData(last7Days);

    } catch (error) {
      console.error("Erreur récupération ventes journalières :", error);
      setDailySalesData([]);
    }
  };

  const fetchProductSales = async (productId) => {
    try {
        // 1. Récupérer les commandes pour ce produit
        const { data: orders, error: orderError } = await supabase
            .from('inventory_orders')
            .select('*')
            .eq('productid', productId);

        if (orderError) throw orderError;
        if (!orders || orders.length === 0) return [];

        // 2. Extraire les IDs de produits uniques
        const uniqueIds = [...new Set(orders.map(o => o.productid))];

        // 3. Récupérer TOUS les produits concernés en UNE SEULE requête
        const { data: products, error: prodError } = await supabase
            .from('inventory_products')
            .select('*')
            .in('id', uniqueIds);

        if (prodError) throw prodError;

        // 4. Associer les produits aux commandes
        return orders.map(order => ({
            ...order,
            product: products.find(p => p.id === order.productid) || null
        }));

    } catch (error) {
        console.error('Erreur récupération vente produit :', error);
        return [];
    }
};

const updateDailySales = async (cartItems) => {
    try {
        // 1. Calculer les totaux globaux du panier pour un seul appel RPC
        const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.total), 0);

        // 2. Appel RPC unique (beaucoup plus rapide et propre)
        const { error } = await supabase.rpc('increment_daily_sales', {
            target_companyref: shop.ref,
            items_to_add: totalQty,      // On envoie le nombre total d'articles
            amount_to_add: totalAmount   // On envoie le montant total
        });

        if (error) throw error;

        // 3. Mise à jour du state local pour le graphique
        const today = new Date().toISOString().split('T')[0];
        setDailySalesData(prevSales => {
            const existingIndex = prevSales.findIndex(s => s.date === today);
            const newSales = [...prevSales];

            if (existingIndex > -1) {
                newSales[existingIndex].nbSales += totalQty;
                newSales[existingIndex].totalAmount += totalAmount;
            } else {
                newSales.push({
                    date: today,
                    nbSales: totalQty,
                    totalAmount: totalAmount
                });
            }
            return newSales.sort((a, b) => new Date(a.date) - new Date(b.date));
        });

        setTotalSales(prev => prev + totalQty);

    } catch (err) {
        console.error("Erreur lors de l'incrémentation des ventes :", err);
    }
};

  const shopDataForCash = shop ? { ...shop, cash: currentCashAmount } : null;
  const closeShopSetup = () => {
    setOpenShopSetup(false)
  }
  const closeRenewalForm = () => {
    setIsBlocked(false)
  }
  const handleOpen = (event) => {
    const elements = document.querySelectorAll(".profile-elements");

    // Retirez la classe "selected" de tous les éléments
    elements.forEach((element) => {
      element.classList.remove("selected");
    });

    const clickedElement = event.currentTarget;
    clickedElement.classList.add("selected");

    // Mettez à jour les états des contenus en fonction de l'élément cliqué
    if (clickedElement.textContent === "Office") {
      setMyAccountOpen(true);
      setCatalogOpen(false);
      setCashOpen(false);
      //setNotifsOpen(false);
      setCommandsOpen(false);
    } else if (clickedElement.textContent === "Catalog") {
      setMyAccountOpen(false);
      setCatalogOpen(true);
      setCashOpen(false);
      //setNotifsOpen(false);
      setCommandsOpen(false);
    } else if (clickedElement.textContent === "Cash") {
      setMyAccountOpen(false);
      setCatalogOpen(false);
      setCashOpen(true);
      //setNotifsOpen(false);
      setCommandsOpen(false);
    } else if (clickedElement.textContent === "Orders") {
      setMyAccountOpen(false);
      setCatalogOpen(false);
      setCashOpen(false);
      //setNotifsOpen(false);
      setCommandsOpen(true);
    } else if (clickedElement.textContent === "Notifs.") {
      setMyAccountOpen(false);
      setCatalogOpen(false);
      setCashOpen(false);
      //setNotifsOpen(true);
      setCommandsOpen(false);
    }
  };

  const handleAddProduct = () => {
    handleOpenAddProduct();
    handleCloseRemoveProduct();
    handleCloseUpdateProduct();
  };

  const handleViewProduct = (productId) => {
    const foundProduct = productList.filter(p => p.id === productId)
    setProductToDisplay(foundProduct[0])
    setViewProductOpen(true)
    setAddProductOpen(false)
    setRemoveProductOpen(false)
    setUpdateProductOpen(false)
  };
  const handleCloseViewProduct = (productId) => {
    const foundProduct = productList.filter(p => p.id === productId)
    setProductToDisplay(foundProduct[0])
    setViewProductOpen(false)
    setAddProductOpen(false)
    setRemoveProductOpen(false)
    setUpdateProductOpen(false)
  };

  useEffect(() => {
    const slideUpElement = document.querySelector(".slide-up-1");
    if (slideUpElement) {
      if (addProductOpen) {
        slideUpElement.classList.add("visible");
      } else {
        slideUpElement.classList.remove("visible");
      }
    }
  }, [addProductOpen]);

  const handleOpenAddProduct = () => {
    setAddProductOpen(true);
    handleCloseUpdateProduct();
    handleCloseRemoveProduct();
  };
  const handleCloseAddProduct = () => {
    setAddProductOpen(false);
    document.body.classList.remove("visible");
  };

  const handleRemoveProduct = () => {
    handleOpenRemoveProduct();
    handleCloseAddProduct();
    handleCloseUpdateProduct();
  };

  useEffect(() => {
    const slideUpElement = document.querySelector(".slide-up-2");
    if (slideUpElement) {
      if (removeProductOpen) {
        slideUpElement.classList.add("visible");
      } else {
        slideUpElement.classList.remove("visible");
      }
    }
  }, [removeProductOpen]);

  const handleOpenRemoveProduct = () => {
    setRemoveProductOpen(true);
    setViewProductOpen(false)
  };

  const handleCloseRemoveProduct = () => {
    setRemoveProductOpen(false);
    document.body.classList.remove("visible");
  };

 
  const handleUdateProduct = () => {
    handleOpenUpdateProduct();
    handleCloseAddProduct();
    handleCloseRemoveProduct();
  };

  useEffect(() => {
    const slideUpElement = document.querySelector(".slide-up");
    if (slideUpElement) {
      if (updateProductOpen) {
        slideUpElement.classList.add("visible");
      } else {
        slideUpElement.classList.remove("visible");
      }
    }
  }, [updateProductOpen]);

  const handleOpenUpdateProduct = () => {
    setUpdateProductOpen(true);
    setViewProductOpen(false)
  };

  const handleCloseUpdateProduct = () => {
    setUpdateProductOpen(false);
    document.body.classList.remove("visible");
  };

  const handleProductAddedInList = (addedProduct) => {
        setProductList(prevProducts => [...prevProducts, addedProduct]);
    };
  
  const handleProductUpdateInList = (updatedProduct) => {
        setProductList(prevProducts => {
            return prevProducts.map(product => {
                // Si l'ID correspond, retournez le produit mis à jour
                if (product.id === updatedProduct.id) {
                    return updatedProduct;
                }
                // Sinon, retournez le produit tel quel
                return product;
            });
        });
    };
    const handleProductRemoveInList = (removedProduct) => {
      const list = productList.filter(product => product.ref !== removedProduct)
      setProductList(list)
    }

    const  updateProductStock = (productId, newStock) => {
      setProductList(prevProducts => {
          return prevProducts.map(product => {
            if(product.id === productId){
              return { ...product, stock: newStock };
            }
            return product;
          });
      });
  };
  const copyrightYear = new Date

  if (!isAppReady) {
    // Le AuthProvider doit déjà afficher un écran de chargement, 
    // mais on peut ajouter une protection ici.
    return null; 
  }

  return (
    <>
   {(isAuthenticated && !isAppReady) ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#333' }}>{"Vérification de l'état de l'abonnement..."}</div>
      : (!shop ? <ShopSetupForm close={closeShopSetup} />
        : (<div className="dashboard">
            {isBlocked && <RenewalForm close={closeRenewalForm} />}
            
            <aside className="dashboard-sidebar">
                <div className="brand-section">
                  <div className="dash-title">
                    <img src={logo} alt="logo" className="dash-logo" />
                    <span className="status-dot"></span>
                  </div>
                  <Timer shop={shop} />
                </div>
                <div className="shop-card">
                  <div className="shop-identity">
                    <div className="shop-image-container">
                      <img src={shop.imageUrl || defaultShop} alt="shop" />
                    </div>
                    <h4>{shop.store_name}</h4>
                  </div>
                  
                  <div className="shop-details">
                    <p className="category-tag">{shop.activity}</p>
                    <div className="ref-badge">
                      <UserComponent />
                    </div>
                  </div>
                  <div className="balance-widget">
                    <span className="label">Available Cash</span>
                    <h4 className="amount">{currentCashAmount.toLocaleString()|| 0} $</h4>
                  </div>
                </div>

                <nav className="quick-links">
                  <Link to="/profile" className="nav-link main">Account Settings</Link>
                  <div className="legal-links">
                    <Link to="/">Privacy</Link>
                    <Link to="/">Terms</Link>
                    <Link to="/">Support</Link>
                  </div>
                  <p className="copyright">© {copyrightYear.getFullYear()} OpenStorm  - OpenTask ERP</p>
                </nav>
            </aside>

            <main className="dash-main-content">
              <header className="main-nav-tabs">
                <ul>
                  {['Office', 'Catalog', 'Cash', 'Orders'].map((tab) => (
                    <li 
                      key={tab}
                      className={`tab-item ${((tab === 'Office' && myAccountOpen) || (tab === 'Catalog' && catalogOpen) || (tab === 'Cash' && cashOpen) || (tab === 'Orders' && commandsOpen)) ? 'active' : ''}`} 
                      onClick={handleOpen}
                    >
                      {tab}
                    </li>
                  ))}
                </ul>
              </header>

              <section className="tab-content-wrapper">
              
              {myAccountOpen && (
                <div className="cash">
                  <h3>Statistics</h3>
                  <StockAlerts products={productList} threshold={10} />
                  <div className="charts">
                    <div className="chart-ctn">
                      {dailySalesData.length > 0 ? (
                        <HistogramComponent
                          // On utilise nbsales pour le volume de ventes par jour
                          salesData={dailySalesData.map(sale => sale.nbSales)} 
                          // On affiche la date simplifiée
                          labels={dailySalesData.map(sale => sale.date)}
                          labTitle="Daily Sales (Last 7 Days)"
                        />
                      ) : (
                        <div className="no-data-msg">No sales recorded this week.</div>
                      )}
                    </div>
                    <div className="chart-ctn">
                      {productsSalesData.length > 0 ? (
                        <HistogramComponent
                          // On passe les données nettoyées et triées
                          salesData={productsSalesData.map(item => item.quantity)} 
                          labels={productsSalesData.map(item => item.name)}
                          labTitle="Top 5 Best Sellers"
                        />
                      ) : (
                        <div className="no-data-msg" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                          <p>No sales data available yet.</p>
                          <small>Sell products to see your Top 5 here!</small>
                        </div>
                      )}
                    </div>
                  </div>
                
                  <SalesHistory currentStore={shop} />

                  <h4>Total commands of the week</h4>
                  <p>{totalSales} items sold this week</p>
                  <div className="sold-data">
                  </div>
                </div>
              )}
              {catalogOpen && (
                <div className="cash">
                  <h3>Catalog</h3>
                  <div className="profile-container">
                    <div className="buttons">
                        <button
                          id="add-btn"
                          className="green-btn"
                          onClick={handleAddProduct}
                        > Add Product
                        </button>
                        <button
                          id="remove-btn"
                          className="red-btn"
                          onClick={handleRemoveProduct}
                        > Remove product
                        </button>
                        <button
                          id="update-btn"
                          className="blue-btn"
                          onClick={handleUdateProduct}
                        > Update product
                        </button>
                      </div>
                    <div className="commands">
                      {productList &&
                        productList.map((product) => (
                          <ProductCard key={product.id} viewProduct={handleViewProduct} product={product} shop={shop} updateProductStock={updateProductStock} />
                        ))}
                    </div>
                  </div>
                </div>
              )}
              {cashOpen && <Cash shop={shopDataForCash} products={productList}  currentStore={shop} handleViewProduct={handleViewProduct} updateCash={refreshHistory} updateSales={updateDailySales} />}
              {commandsOpen && (
                <div className="cash">
                  <h3>Orders</h3>
                  <div className="profile-container">
                    <div className="commands">
                      {Array.isArray(commands) &&
                        commands.map((command) => {
                          return (
                            <div className="orders-group-ctn" key={command.id}>
                              <div className="cards-ctn">
                                {command.orders.map((order) =>{
                                  return(
                                    <OrderCard order={order} key={order.id} />
                                  )
                                } )}
                              </div>
                              <div className="total-amount">
                                <h4>TOTAL COST - {command.amount} $</h4>
                                <p className='order-date'>{command.date.split('T')[0]}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
              </section>
            </main>
            

          {addProductOpen && (
            <div className="overlay" onClick={handleCloseAddProduct}>
              <div onClick={(e) => e.stopPropagation()}>
                <AddProductForm shop={shop} close={handleCloseAddProduct} onProductAdded={handleProductAddedInList} />
              </div>
            </div>
            
          )}

          {removeProductOpen && (
            <div className="overlay" onClick={handleCloseRemoveProduct}>
              <div onClick={(e) => e.stopPropagation()}>
                <RemoveProductForm products={productList} close={handleCloseRemoveProduct} onProductRemoved={handleProductRemoveInList}/>
              </div>
            </div>
          )}

          {updateProductOpen && (
            <div className="overlay" onClick={handleCloseUpdateProduct}>
              <div onClick={(e) => e.stopPropagation()}>
                <UpdateProductForm shop={shop} products={productList} close={handleCloseUpdateProduct} onProductUpdated={handleProductUpdateInList} />
              </div>
            </div>
          )}
          {
            viewProductOpen && (
              <ProductViewCard product={productToDisplay} close={handleCloseViewProduct}/>
            )
          }
        </div>)
      )
    }
    </>
    
  );
}

export default RightHiddenbar;
