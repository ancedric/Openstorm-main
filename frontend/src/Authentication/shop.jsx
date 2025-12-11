import api from '../axiosConfig'

// Récupération des produits d'une boutique
export const GetProducts = async (shopId) => {
  try {
    const response = await api.get(`/products/get-shop-products/${shopId}`);
    const data = response.data;

    if (data.length===0) {
      console.log("Aucun produit trouvé dans cette boutique");
      return [];
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
};

export const GetAllProducts = async () => {
  try {
    const response = await api.get(`/products/all-products`);
    const data = response.data;

    if (data.length===0) {
      console.log("Aucun produit trouvé");
      return [];
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
};

export const GetAllShops = async () => {
  try {
    const response = await api.get(`/shops/all-shops`);
    const data = response.data;

    if (data.length===0) {
      console.log("Aucune boutique trouvée");
      return [];
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des boutiques :", error);
    return [];
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await api.get(`/user/all-users`);
    const data = response.data.users;

    if (data.length===0) {
      console.log("Aucun utilisateur trouvé");
      return [];
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return [];
  }
};

export const GetAllRenewals = async () => {
  try {
    const response = await api.get(`/renewals/all-renewals`);
    const data = response.data.renewals;

    if (data.length===0) {
      console.log("Aucune demande de renouvellemnt trouvée");
      return [];
    }
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes de renouvellement :", error);
    return [];
  }
};

export const GetProduct = async (productId) => {
  const res = await api.get(`/products/product/${productId}`)
  if(!res.data.fetched){
    console.log("Aucun produit trouvé")
    return
  }
  return res.data.product
}

// Récupération des commandes
const fetchProductsForOrder = async (order) => {
    try {
        const productRes = await api.get(`/products/product/${order.productid}`);
        return {
            ...order,
            product: productRes.data
        };
    } catch (err) {
        console.error(`Erreur lors de la récupération du produit pour la commande ${order.id}:`, err);
        return { ...order, product: null };
    }
};

// Fonction principale pour récupérer tous les paniers et leurs produits
export const FetchCommands = async (shopId) => {
    try {
        const cartRes = await api.get(`/carts/get-shop-carts/${shopId}`);
        const cartsData = cartRes.data.carts || []

        if (cartsData.length === 0) {
            return [];
        }

        const cartsWithOrdersPromises = cartsData.map(async (cart) => {
            try {
                const orderRes = await api.get(`orders/get-shop-orders/${cart.id}`);
                const ordersData = orderRes.data.orders || [];

                const ordersWithProductsPromises = ordersData.map(fetchProductsForOrder);
                const ordersWithProducts = await Promise.all(ordersWithProductsPromises);
                return {
                    ...cart,
                    orders: ordersWithProducts.filter(order => order.product !== null)
                };
            } catch (err) {
                console.error(`Erreur lors de la récupération des commandes du panier ${cart.id}:`, err);
                return { ...cart, orders: [] };
            }
        });
        const finalData = await Promise.all(cartsWithOrdersPromises);
        return finalData;

    } catch (error) {
        console.error("Erreur globale lors de la récupération des commandes :", error);
        // Gérer l'erreur globale
        return [];
    }
};

export const GetCart = async (userId) => {
  try {
    const response = await api.get(`/carts/get-cart/${userId}`);
    if (response.data) {
      return response.data;
    } else {
      console.log("No cart found for this user");
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};
/* Notifications de l'utilisateur
export const GetNotifs = async () => {
  const { user } = useUser();
  try {
    const response = await axios.get(`${baseUrl}/notifications/get-notif/${user.id}`);
    const data = response.data;

    if (!data.notifications.length) {
      console.log("Aucune notification trouvée");
    } else {
      console.log("Notifications :", data.notifications);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
  }
};*/

