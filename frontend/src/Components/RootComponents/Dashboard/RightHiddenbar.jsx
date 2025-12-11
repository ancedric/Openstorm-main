/* eslint-disable react-hooks/exhaustive-deps */
import './style.css'
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
import api, {baseURL} from '../../../axiosConfig';
import AddProductForm from '../../forms/addProduct/AddProduct';
import ProductViewCard from '../../view/productView';
import OrderCard from '../../cards/orderCard/OrderCard';
import RenewalForm from '../../forms/ShopRenewalForm/RenewalForm'

function RightHiddenbar() {
  const { shop, showShopSetup, completeShopSetup, isAuthenticated, isAppReady } = useAuth()

  const initialCash = shop ? shop.cash : 0;
  const [currentCashAmount, setCurrentCashAmount] = useState(initialCash);

  const [productList, setProductList] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [commands, setCommands] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const [myAccountOpen, setMyAccountOpen] = useState(true);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [cashOpen, setCashOpen] = useState(false);
  const [viewProductOpen, setViewProductOpen] = useState(false)
  const [productToDisplay, setProductToDisplay] = useState(null)
  const [productsSalesData, setProductsSalesData] = useState([])

  const [previousScrollPosition, setPreviousScrollPosition] = useState(
    window.scrollY || document.documentElement.scrollTop
  );
  const [scrollToTop, setScrollToTop] = useState(false);
  const scrollContainerRef = useRef(null);

  /*--Gestion du catalogue--*/
  const [commandsOpen, setCommandsOpen] = useState(false);

  //vaiables relatives à la gestion des produits du catalogue
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [removeProductOpen, setRemoveProductOpen] = useState(false);
  const [updateProductOpen, setUpdateProductOpen] = useState(false);
  const [openShopSetup, setOpenShopSetup] = useState(showShopSetup)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateDailyRemainingTime()
    }, 86400000);
    return () => clearInterval(intervalId);
  }, []);

  const updateDailyRemainingTime = async () => {
    try{
      const newShop = await api.put(`/shops/update-remaining-activation-time/${shop.id}`, {plan: shop.remainingactivationtime - 1}, {
        headers: { 
        }
      });
      if (newShop) {
        completeShopSetup(newShop.data.shop);
        console.log("new shop:", newShop)
      }
    }
    catch(error){
      console.error('Une erreur est survenue lors de la mise à jour de la durée d\'activation de la boutique', error)
    }
  }

  useEffect(() => {
    if(shop && shop.id){
      if(shop.remainingactivationtime === 0 || null){
        setIsBlocked(true)
      } else{
          const fetchProducts = async () => {
          try {
            const productsData = await GetProducts(shop.ref);
            setProductList(productsData);
            fetchDailySalesAPI(shop.id)

            const salesPromises = productsData.map( async product => {
              const data = await fetchProductSales(product.id)
              return data
            })

            const allSalesData = await Promise.all(salesPromises)
            setProductsSalesData(prev => [...prev, ...allSalesData])
          } catch (error) {
            console.error("Erreur lors de la récupération des produits :", error);
            // Gérer l'erreur de manière appropriée
          }
        };

        fetchProducts();
        fetchCommands();
      }
    }
  }, [isBlocked, shop]);

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
  
  const fetchDailySalesAPI = async (shopId) => {
      try {
          const res = await api.get(`/sales/get-shop-sales/${shopId}`);
          if(res.data.length === 0){
            setDailySalesData([]);
            return
          }
          const sales = res.data.salesData
          setTotalSales(sales.length)
          setDailySalesData(res.data.salesData); 
      } catch (error) {
          console.error("Erreur lors de la récupération des ventes de la boutique :", error);
          setDailySalesData([]);
      }
  };

  const fetchProductSales = async (productId) =>{
    try{
      const productData =  await api.get(`/orders/get-product-order/${productId}`)
      const orders = productData.data.order 
      
      if (!orders){
        return []
      }

      const productIds = orders.map(order => order.productid)
      const uniqueProductIds = [...new Set(productIds)]

      const productsResponse = await Promise.all(uniqueProductIds.map(async (productid) => {
        const product = await api.get(`/products/product/${productid}`)
        return product.data
      }))

      const ordersWithProducts = orders.map(order => {
        const product = productsResponse.find(prod => prod.id === order.productid)
        return {
          ...order,
          product: product || null
        }
      })
      return ordersWithProducts
    }
    catch(error){
      console.error('Une erreur est survenue lors de la récupération de la vente du produit', error)
    }
  }

const updateDailySales = async (itemsSold, salesAmount) => {
    const today = new Date().toISOString().split('T')[0]; 
    setTotalSales(prevTotal => prevTotal + itemsSold); 

    // 3. Mettre à jour le tableau dailySalesData
    setDailySalesData(async prevDailySales => {
        const saleIndex = prevDailySales.findIndex(sale => sale.date.split('T')[0] === today);

        // Si une vente pour 'aujourd'hui' existe déjà
        if (saleIndex !== -1) {
            const newDailySales = [...prevDailySales]; 
            const existingSale = newDailySales[saleIndex];

            newDailySales[saleIndex] = {
                ...existingSale,
                nbSales: existingSale.nbSales + itemsSold,
                totalAmount: existingSale.totalAmount + salesAmount,
            };
            try{
              const res = api.put(`/sales/update-daily-sale/${shop.id}`, {nbSales: existingSale.nbSale + itemsSold, totalAmount: existingSale.totalAmount + salesAmount, date: today})
              if(!res.data.dailySales){
                console.log(res.data.message)
                return
              }
              return newDailySales;
            }
            catch(err){
              console.error("Erreur lors de la mise à jour du daily sale", err)
            }
        } 
        
        // Si aucune vente pour 'aujourd'hui' n'existe, en ajouter une nouvelle
        else {
          
          try{
            const res = await api.post(`/sales/new-sale`, {shopId: shop.id, nbSales: itemsSold, totalAmount: salesAmount})
            if(!res.data.dailySales){
              console.log(res.data.message)
              return
            }
            console.log(res.data.message)
            return [
                ...prevDailySales,
                {
                    date: today,
                    nbSales: itemsSold,
                    totalAmount: salesAmount,
                }
            ];
          }
          catch(err){
            console.error("Erreur lors de l'ajout du daily sale", err)
          }
        }
    });
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
    setViewProductOpen(!viewProductOpen)
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
    setViewProductOpen(!viewProductOpen)
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
    setViewProductOpen(!viewProductOpen)
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
    setViewProductOpen(!viewProductOpen)
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
      const list = productList.filter(product => product.id !== removedProduct)
      setProductList(list)
    }

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
          <div className="dashboard-header">
                <div className="dash-title">
                  <h3>Shop Dashboard</h3>
                  <Timer shop={shop} />
                </div>
                <div className="popularity">
                  <div className="shop-infos">
                    <p className="shopref">{shop.ref}</p>
                    <h4>
                      Shop :{shop && shop.name}
                    </h4>
                  </div>
                  <div className="shopImage">
                    <img
                      src={shop ? (shop.image ? `${baseURL}/media/${shop.image}` : defaultShop) : defaultShop}
                      style={{ borderRadius: "13px" }}
                    />
                  </div>
                  <p className="shop-activity">Category: {shop.activity}</p>
                  <div className="caisse">
                    <h4>Cash : {currentCashAmount} $</h4>
                  </div>
                </div>
                <div className="options">
                  <Link to="/profile" className="settings">{'My Account >'}</Link>
                  <Link to="/">Privacy Policy</Link>
                  <Link to="/">Terms of Use</Link>
                  <Link to="/">Support</Link>
                  
                  <p>copyrights openstorm {copyrightYear.getFullYear()}. All rights reserved.</p>
                </div>
          </div>
          <div className="dash-data-ctn">
            <div className="user-board">
              <ul>
                <li className="profile-elements selected" onClick={handleOpen}>
                  Office
                </li>
                <li className="profile-elements" onClick={handleOpen}>
                  Catalog
                </li>
                <li className="profile-elements cash-btn" onClick={handleOpen}>
                  Cash
                </li>
                <li className="profile-elements" onClick={handleOpen}>
                  Orders
                </li>
                {/*<li className="profile-elements" onClick={handleOpen}>
                  Notifs.
                </li>*/}
              </ul>
            </div>
            <div ref={scrollContainerRef} className="dash-switcher">
              
              {myAccountOpen && (
              <div className="cash">
                <h3>Statistics</h3>
                <div className="charts">
                  <div className="chart-ctn">
                    <HistogramComponent
                      salesData={dailySalesData.map(sale => sale.nbsales)} 
                      labels={dailySalesData.map(sale => sale.date.split('T')[0])}
                      labTitle="daily sales"
                    />
                  </div>
                  <div className="chart-ctn">
                    <HistogramComponent
                      salesData={productsSalesData[0]?.map(sale => sale.quantity)} 
                      labels={productsSalesData[0]?.map(sale => sale.product?.name)}
                      labTitle="Sales per product"
                    />
                  </div>
                </div>
                
                  
                  <h4>Total commands of the week</h4>
                  <p>{totalSales} items sold this week</p>
                  <div className="sold-data">
                    {/*{bestSeller && (
                      <ProductCard product={bestSeller} shop={shop} />
                    )}
                    {lessSeller && (
                      <ProductCard viewProduct={handleViewProduct} product={lessSeller} shop={shop} />
                    )}
                    {mostFavourite && (
                      <ProductCard viewProduct={handleViewProduct} product={mostFavourite} shop={shop} />
                    )}
                    {lessFavourite && (
                      <ProductCard viewProduct={handleViewProduct} product={lessFavourite} shop={shop} />
                    )}*/}
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
                          <img
                            src="frontend\src\assets\icons\add-plus-square-svgrepo-com.svg"
                            alt="add product"
                            width="20px"
                            height="20px"
                          />
                        </button>
                        <button
                          id="remove-btn"
                          className="red-btn"
                          onClick={handleRemoveProduct}
                        > Remove product
                          <img
                            src="frontend\src\assets\icons\dustbin-bin-trush-svgrepo-com.svg"
                            alt="remove product"
                            width="20px"
                            height="20px"
                          />
                        </button>
                        <button
                          id="update-btn"
                          className="blue-btn"
                          onClick={handleUdateProduct}
                        > Update product
                          <img
                            src="frontend\src\assets\icons\update-svgrepo-com.svg"
                            alt="update product"
                            width="20px"
                            height="20px"
                          />
                        </button>
                      </div>
                    <div className="commands">
                      {productList &&
                        productList.map((product) => (
                          <ProductCard key={product.id} viewProduct={handleViewProduct} product={product} shop={shop} />
                        ))}
                    </div>
                  </div>
                </div>
              )}
              {cashOpen && <Cash shop={shopDataForCash} products={productList} handleViewProduct={handleViewProduct} updateCash={updateCashAmount} updateSales={updateDailySales} />}
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
            </div>
          </div>
            

          {addProductOpen && (
            <AddProductForm shop={shop} close={handleCloseAddProduct} onProductAdded={handleProductAddedInList} />
          )}

          {removeProductOpen && (
            <RemoveProductForm products={productList} close={handleCloseRemoveProduct} onProductRemoved={handleProductRemoveInList}/>
          )}

          {updateProductOpen && (
            <UpdateProductForm shop={shop} products={productList} close={handleCloseUpdateProduct} onProductUpdated={handleProductUpdateInList} />
          )}
          {
            viewProductOpen && (
              <ProductViewCard product={productToDisplay} close={handleViewProduct}/>
            )
          }
        </div>)
      )
    }
    </>
    
  );
}

export default RightHiddenbar;
