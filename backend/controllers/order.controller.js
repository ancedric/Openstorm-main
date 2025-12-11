import * as order from '../models/order.js'


export const createNewOrder = async (req, res) => {
    // NOTE: Le modèle d'origine utilise 'price' pour 'unitPrice'
    const { cartId, productId, quantity, price, reduction, total, date } = req.body;
        try {
            // Utilisation de price comme unitPrice pour correspondre au modèle
            const result = await order.newOrder(cartId, productId, quantity, price, reduction, total, date);
            
            // Le résultat de Supabase est un tableau de lignes insérées
            res.status(201).json({ message: 'Nouvelle commande créée avec succès', order: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création de la commande.' });
        }
}

export const allOrders = async (req, res) => {
    try {
            const orders = await order.getAllOrders();
            res.json({ orders });
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commandes.' });
        }
}

export const getOrdersByShopRef = async(req, res) => {
    // Le nom de paramètre de route est 'cartId' mais le nom de la fonction suggère 'ShopRef'
    // Je continue d'utiliser `cartId` comme dans votre route et modèle d'origine (`getOrdersByShopId`)
    const {cartId} = req.params; 
        try {
            const orders = await order.getOrdersByCartId(cartId); // Nom de fonction mis à jour
            res.json({ orders });
        }
        catch (error) {
            console.error('Erreur lors de la récupération des commandes de la boutique/panier:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des commandes.' });
        }
}

export const getOrderFromId = async (req, res) => {
    const id = req.params.id;
        try {
            const orderRes = await order.getOrderById(id);
            if (!orderRes) { // Supabase .single() retourne null si non trouvé (géré dans le modèle)
                return res.status(404).json({ error: 'Commande non trouvée.' });
            }
            // Supabase .single() retourne directement l'objet, pas un tableau
            res.json({ order: orderRes }); 
        }
        catch (error) {
            console.error('Erreur lors de la récupération de la commande:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande.' });
        }
}

export const getOrderFromProductId = async (req, res) => {
    console.log('Appel de getOrderFromProductId du controlleur')
    const id = req.params.id; // Cet ID est en fait le productId dans le modèle
    console.log('Identifiant produit envoyé', id)
        try {
            const orderRes = await order.getOrderByProductId(id);
            if (orderRes.length === 0) {
                // Si la fonction retourne un tableau vide, c'est que la commande n'est pas trouvée pour ce produit
                return res.status(404).json({ error: `Commande non trouvée pour le produit id ${id}` });
            }
            res.json({ order: orderRes }); // Retourne un tableau de commandes
        }
        catch (error) {
            console.error('Erreur lors de la récupération des commandes par produit:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la commande.' });
        }
}

export const deleteOrder = async (req, res) => {
    const id = req.params.id;
        try {
            await order.deleteOrdertById(id);
            // La vérification de l'existence a déjà été faite dans le modèle Supabase si l'on se fie à la logique
            // Mais la méthode Supabase .delete() ne renvoie pas de ligne, on suppose la suppression OK.
            res.json({ message: 'Commande supprimée avec succès.' });
        }   
        catch (error) {
            console.error('Erreur lors de la suppression de la commande:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la commande.' });
        }
}