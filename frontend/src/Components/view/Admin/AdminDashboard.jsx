import { useState, useEffect } from 'react'
import './style.css'
import { GetAllProducts, GetAllRenewals, GetAllShops, GetAllUsers } from '../../../Authentication/shop'
import useAuth from '../../../Authentication/Context/useAuth'
import api, { baseURL } from '../../../axiosConfig'
import Topbar from '../../RootComponents/Topbar'

const AdminDashboard = () => {
    const [isUsersViewOpen, setIsUsersViewOpen] = useState(true)
    const [isShopViewOpen, setIsShopViewOpen] = useState(false)
    const [isProductsViewOpen, setIsProductsViewOpen] = useState(false)
    const [isRenewalViewOpen, setIsRenewalViewOpen] = useState(false)
    const [isActivated, setIsActivated] = useState(false)
    const [users, setUsers] = useState([])
    const [shops, setShops] = useState([])
    const [products, setProducts] = useState([])
    const [renewals, setRenewals] = useState([])

    const {user} = useAuth()
    
    useEffect( () => {
        const fetchProducts = async () => {
            try {
                const productsData = await GetAllProducts();
                setProducts(productsData);
            } catch (error) {
                console.error("Erreur lors de la récupération des produits :", error);
                // Gérer l'erreur de manière appropriée
            }
        };

        fetchProducts()
    }, [])

    useEffect( () => {
        const fetchShops = async () => {
            try {
                const shopsData = await GetAllShops();
                setShops(shopsData);
            } catch (error) {
                console.error("Erreur lors de la récupération des boutiques :", error);
                // Gérer l'erreur de manière appropriée
            }
        };

        fetchShops()
    }, [])

    useEffect( () => {
        const fetchUsers = async () => {
            try {
                const usersData = await GetAllUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
                // Gérer l'erreur de manière appropriée
            }
        };

        fetchUsers()
    }, [])

    useEffect( () => {
        const fetchRenewals = async () => {
            try {
                const renewalsData = await GetAllRenewals();
                setRenewals(renewalsData);
            } catch (error) {
                console.error("Erreur lors de la récupération des demandes :", error);
                // Gérer l'erreur de manière appropriée
            }
        };

        fetchRenewals()
    }, [])
    const handleOpen = (event) => {
    const elements = document.querySelectorAll(".menu-item");

    // Retirez la classe "selected" de tous les éléments
    elements.forEach((element) => {
        element.classList.remove("selected");
    });

    const clickedElement = event.currentTarget;
    clickedElement.classList.add("selected");

    // Mettez à jour les états des contenus en fonction de l'élément cliqué
    if (clickedElement.textContent === "Users") {
        setIsUsersViewOpen(true);
        setIsShopViewOpen(false);
        setIsProductsViewOpen(false);
        setIsRenewalViewOpen(false);
    } else if (clickedElement.textContent === "Shops") {
        setIsUsersViewOpen(false);
        setIsShopViewOpen(true);
        setIsProductsViewOpen(false);
        setIsRenewalViewOpen(false);
    } else if (clickedElement.textContent === "Products") {
        setIsUsersViewOpen(false);
        setIsShopViewOpen(false);
        setIsProductsViewOpen(true);
        setIsRenewalViewOpen(false);
    } else if (clickedElement.textContent === "Renewal Requests") {
        setIsUsersViewOpen(false);
        setIsShopViewOpen(false);
        setIsProductsViewOpen(false);
        setIsRenewalViewOpen(true);
    }
  };

    const handleSubmit = async (shopref) => {
        console.log(shopref)
            
            try {
                if(user.plan === 'free'){
                    const newShop = await api.put(`/shops/update-remaining-activation-time/${shopref}`, {plan: 7}, {
                        headers: { 
                        }
                    });
                    if (newShop) {
                        console.log("new shop:", newShop)
                        setIsActivated(!isActivated)
                    }
                }else if(user.plan === 'monthly'){
                    const newShop = await api.put(`/shops/update-remaining-activation-time/${shopref}`, {plan: 30}, {
                        headers: { 
                        }
                    });
                    if (newShop) {
                        console.log("new shop:", newShop)
                        setIsActivated(!isActivated)
                    }
                }else if(user.plan === 'biannual'){
                    const newShop = await api.put(`/shops/update-remaining-activation-time/${shopref}`, {plan: 180}, {
                        headers: { 
                        }
                    });
                    if (newShop) {
                        console.log("new shop:", newShop)
                        setIsActivated(!isActivated)
                    }
                }else if(user.plan === 'annual') {
                    const newShop = await api.put(`/shops/update-remaining-activation-time/${shopref}`, {plan: 360}, {
                        headers: { 
                        }
                    });
                    if (newShop) {
                        console.log("new shop:", newShop)
                        setIsActivated(!isActivated)
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour du plan:', error.response?.data || error.message);
            }
        };
    return (
        <><Topbar />
        <div className="container">
            <><h3>Administration Dashboard</h3><div className="dashboard-ctn">
                <div className='header'>
                    <div className="menu-item selected" onClick={handleOpen}>Users</div>
                    <div className="menu-item" onClick={handleOpen}>Shops</div>
                    <div className="menu-item" onClick={handleOpen}>Products</div>
                    <div className="menu-item" onClick={handleOpen}>Renewal Requests</div>
                </div>
                <div className='content'>
                    {isUsersViewOpen && (
                        <div className="table-ctn">
                            <h3>Users</h3>
                            <div className="line">
                                <div className="column hd">ID</div>
                                <div className="column hd">REF</div>
                                <div className="column hd">First Name</div>
                                <div className="column hd">Last Name</div>
                                <div className="column hd">Email</div>
                                <div className="column hd">Phone</div>
                                <div className="column hd">Role</div>
                                <div className="column hd">Plan</div>
                                <div className="column hd">Subscription Date</div>
                            </div>
                            {users.map(user => {
                                return (
                                    <div className="line" key={user.id}>
                                        <div className="column">{user.id}</div>
                                        <div className="column">{user.ref}</div>
                                        <div className="column">{user.firstname}</div>
                                        <div className="column">{user.lastname}</div>
                                        <div className="column">{user.email}</div>
                                        <div className="column">{user.email}</div>
                                        <div className="column">{user.role}</div>
                                        <div className="column">{user.plan}</div>
                                        <div className="column">{user.createdat.split('T')[0]}</div>
                                    </div>)
                            })}
                        </div>
                    )}
                    {isShopViewOpen && (
                        <div className="table-ctn">
                            <h3>Shops</h3>
                            <div className="line">
                                <div className="column hd">ID</div>
                                <div className="column hd">REF</div>
                                <div className="column hd">USER REF</div>
                                <div className="column hd">Name</div>
                                <div className="column hd">Activity</div>
                                <div className="column hd">Opening Hour</div>
                                <div className="column hd">Close Hour</div>
                                <div className="column hd">Country</div>
                                <div className="column hd">City</div>
                                <div className="column hd">Remaining Days</div>
                                <div className="column hd">Creation Date</div>
                            </div>
                            {shops.map(shop => {
                                return (
                                    <div className="line" key={shop.id}>
                                        <div className="column">{shop.id}</div>
                                        <div className="column">{shop.ref}</div>
                                        <div className="column">{shop.userref}</div>
                                        <div className="column">{shop.name}</div>
                                        <div className="column">{shop.activity}</div>
                                        <div className="column">{shop.openinghour}</div>
                                        <div className="column">{shop.closehour}</div>
                                        <div className="column">{shop.country}</div>
                                        <div className="column">{shop.city}</div>
                                        <div className="column">{shop.remainingactivationtime}</div>
                                        <div className="column">{shop.createdat.split('T')[0]}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {isProductsViewOpen && (
                        <div className="table-ctn">
                            <h3>Products</h3>
                            <div className="line">
                                <div className="column hd">ID</div>
                                <div className="column hd">REF</div>
                                <div className="column hd">SHOP REF</div>
                                <div className="column hd">Name</div>
                                <div className="column hd">Category</div>
                                <div className="column hd">Summary</div>
                                <div className="column hd">Supplier</div>
                                <div className="column hd">Price</div>
                                <div className="column hd">stock</div>
                                <div className="column hd">Addition Date</div>
                            </div>
                            {products.map(product => {
                                return (
                                    <div className="line" key={product.id}>
                                        <div className="column">{product.id}</div>
                                        <div className="column">{product.ref}</div>
                                        <div className="column">{product.shopref}</div>
                                        <div className="column">{product.name}</div>
                                        <div className="column">{product.category}</div>
                                        <div className="column">{product.summary}</div>
                                        <div className="column">{product.supplier}</div>
                                        <div className="column">{product.price}</div>
                                        <div className="column">{product.stock}</div>
                                        <div className="column">{product.createdat.split('T')[0]}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {isRenewalViewOpen && (
                        <div className="table-ctn">
                            <h3>Renewals Requests</h3>
                            {renewals.map(renewal => {
                                return (
                                    <div className="card" key={renewal.id}>
                                        <div className="card-img">
                                            <img 
                                                src={renewal.capture}
                                                alt="capture-image" 
                                            />
                                        </div>
                                        <div className="data">
                                            <div className="col">Shop Reference : {renewal.shopref}</div>
                                            <div className="col">User Plan : {renewal.userplan}</div>
                                            <div className="col">
                                                <div className={`toggle ${isActivated ? 'active' : ''}`}>
                                                    <button className="toggle-btn" onClick={() => handleSubmit(renewal.shopref)}></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div></>
        </div></>
    )
}

export default AdminDashboard