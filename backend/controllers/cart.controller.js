import {
    newCart,
    getAllCarts,
    getCartsByShopId,
    getCartById,
    deleteCartById
} from '../models/cart.js'; // Assurez-vous que le chemin est correct

export const addCart = async (req, res) => {
    const { shopId, amount } = req.body;
    try {
        const result = await newCart(shopId, amount);
        
        // Supabase retourne un tableau, nous renvoyons la première ligne
        res.status(201).json({ message: 'Nouveau panier créé avec succès', cart: result[0] });
    }
    catch (error) {
        console.error('Erreur lors de la création du panier:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la création du panier.' });
    }
};

//route pour récupérer tous les paniers
export const allCarts = async (req, res) => {
    try {
        const carts = await getAllCarts();
        res.json({ carts });
    } catch (error) {
        console.error('Erreur lors de la récupération des paniers:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des paniers.' });
    }
};

//route pour récupérer les paniers d'une boutique spécifique
export const getShopCarts = async (req, res) => {
    const {shopId} = req.params;
    try {
        const carts = await getCartsByShopId(shopId);
        res.json({ carts });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des paniers de la boutique:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des paniers de la boutique.' });
    }
}

//route pour récupérer un panier par son id
export const getCartFromId = async (req, res) => {
    const id = req.params.id;
    try {
        const cart = await getCartById(id);
        if (!cart) { // Panier non trouvé (null)
            return res.status(404).json({ error: 'Panier non trouvé.' });
        }
        // Supabase .single() retourne l'objet directement
        res.json({ cart });
    }
    catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du panier.' });
    }
}

//route pour supprimer un panier par son id
export const deleteCart = async (req, res) => {
    const id = req.params.id;
    try {
        await deleteCartById(id); // La suppression ne renvoie pas de données utiles
        res.json({ message: 'Panier supprimé avec succès.' });
    }   
    catch (error) {
        console.error('Erreur lors de la suppression du panier:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du panier.' });
    }
}