import supabase from '../supabase.config'

// Récupération des produits d'une boutique
export const GetProducts = async (shopId) => {
  try {
    //const response = await api.get(`/products/get-shop-products/${shopId}`);
    const {data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shopref', shopId);

    if (error) {
      throw error;
    }
    const res = data;

    if (res.length===0) {
      console.log("Aucun produit trouvé dans cette boutique");
      return [];
    }
    return res;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
};

export const GetAllProducts = async () => {
  try {
    //const response = await api.get(`/products/all-products`);

    const {data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw error;
    }
    const res = data;

    if (res.length===0) {
      console.log("Aucun produit trouvé");
      return [];
    }
    return res;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    return [];
  }
};

export const GetAllShops = async () => {
  try {
    //const response = await api.get(`/shops/all-shops`);
    const {data, error } = await supabase
      .from('shops')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    const res = data;

    if (res.length===0) {
      console.log("Aucune boutique trouvée");
      return [];
    }
    return res;
  } catch (error) {
    console.error("Erreur lors de la récupération des boutiques :", error);
    return [];
  }
};

export const GetAllUsers = async () => {
  try {
    //const response = await api.get(`/user/all-users`);
    
    const {data, error } = await supabase
      .from('users')
      .select('*');

      if(error) {
        throw error;
      }

    const res = data;

    if (res.length===0) {
      console.log("Aucun utilisateur trouvé");
      return [];
    }
    return res;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return [];
  }
};

export const GetAllRenewals = async () => {
  try {
    //const response = await api.get(`/renewals/all-renewals`);
    const {data, error } = await supabase
      .from('renewals')
      .select('*');

      if(error) {
        throw error;
      }
    
    const res = data;

    if (res.length===0) {
      console.log("Aucune demande de renouvellemnt trouvée");
      return [];
    }
    return res;
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes de renouvellement :", error);
    return [];
  }
};

export const GetProduct = async (productId) => {
  //const res = await api.get(`/products/product/${productId}`)
  
  const {data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    return null;
  }
  
  const res = data;
  if(res.length === 0){
    console.log("Aucun produit trouvé")
    return []
  }
  return res[0]
}

// Récupération des commandes
const fetchProductsForOrder = async (order) => {
    try {
        //const productRes = await api.get(`/products/product/${order.productid}`);
        
        const {data, error} = await supabase
            .from('products')
            .select('*')
            .eq('id', order.productid)
            .single();
            
        if (error) {
            throw error;
        }

        return {
            ...order,
            product: data
        };
    } catch (err) {
        console.error(`Erreur lors de la récupération du produit pour la commande ${order.id}:`, err);
        return { ...order, product: null };
    }
};

// Fonction principale pour récupérer tous les paniers et leurs produits
export const FetchCommands = async (shopId) => {
    try {
        //const cartRes = await api.get(`/carts/get-shop-carts/${shopId}`);
        
        const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('shopid', shopId);

        if (error) {
            throw error;
        }

        const res = data;
        const cartsData = res 
        if (cartsData.length === 0) {
            return [];
        }

        const cartsWithOrdersPromises = cartsData.map(async (cart) => {
            try {
                //const orderRes = await api.get(`orders/get-shop-orders/${cart.id}`);
                const {data, error} = await supabase
                    .from('orders')
                    .select('*')
                    .eq('cartid', cart.id);

                if (error) {
                    throw error;
                }

                const orderRes = data;
                
                const ordersData = orderRes;

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
    //const response = await api.get(`/carts/get-cart/${userId}`);
    const {data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('userid', userId)
    .single();

    if (error) {
      throw error;
    }

    const response = data;
    if (response) {
      return response;
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

