import {supabase} from '../config/supabase.service.js';

const TABLE_NAME = 'orders';

// --- Création de table gérée par Supabase directement (Retiré) ---
/*
export const createOrderTable = async () => {
    // ... La création de table est gérée par Supabase
}
*/

/**
 * Crée une nouvelle ligne de commande dans la table 'orders'.
 * @param {number} cartId - ID du panier associé.
 * @param {number} productId - ID du produit commandé.
 * @param {number} quantity - Quantité du produit.
 * @param {number} unitPrice - Prix unitaire au moment de la commande.
 * @param {number} reduction - Réduction appliquée (peut être null).
 * @param {number} total - Total de cette ligne de commande.
 * @param {string} date - Date de la commande (format ISO).
 */
export const newOrder = async (cartId, productId, quantity, unitPrice, reduction, total, date) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([
                { cartid: cartId, productid: productId, quantity, unitprice: unitPrice, reduction, total, date }
            ])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase newOrder:", error);
        throw error;
    }
}

/**
 * Récupère toutes les commandes.
 */
export const getAllOrders = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getAllOrders:", error);
        throw error;
    }
}

/**
 * Récupère toutes les commandes associées à un panier (cartId).
 * Dans votre implémentation, ceci était utilisé pour récupérer les commandes par 'shopId',
 * ce qui suggère que `cartId` est peut-être mal nommé ou qu'il y a un lien indirect.
 * Je garde la colonne `cartId` pour la requête.
 */
export const getOrdersByCartId = async (cartId) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('cartid', cartId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getOrdersByCartId:", error);
        throw error;
    }
}

/**
 * Récupère une commande par son ID.
 */
export const getOrderById = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single(); // Utilisation de .single() car ID est unique

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getOrderById:", error);
        if (error.code === 'PGRST116') return null; // Gérer l'absence de ligne
        throw error;
    }
}

/**
 * Récupère toutes les commandes contenant un produit spécifique.
 */
export const getOrderByProductId = async (productId) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('productid', productId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getOrderByProductId:", error);
        throw error;
    }
}

/**
 * Supprime une commande par son ID.
 */
export const deleteOrdertById = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Erreur Supabase deleteOrdertById:", error);
        throw error;
    }
}