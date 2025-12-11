import {supabase} from '../config/supabase.service.js';

const TABLE_NAME = 'carts'; // J'utilise 'carts' car le modèle d'origine fait référence à 'carts' dans certaines fonctions

// --- Création de table gérée par Supabase directement (Retiré) ---
/*
export const createCartTable = async () => {
    // ... La création de table est gérée par Supabase
}
*/

/**
 * Crée un nouveau panier (cart).
 * @param {number} shopId - ID de la boutique associée.
 * @param {number} amount - Montant total du panier au moment de la création.
 */
export const newCart = async (shopId, amount) => {
    try {
        const now = new Date();
        // Supabase gère `date` si la colonne est configurée avec un DEFAULT `now()`,
        // mais pour la compatibilité avec l'ancienne structure, je la passe explicitement.
        const date = now.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([
                { shopid: shopId, amount, date }
            ])
            .select();

        if (error) throw error;
        // Le résultat de Supabase est un tableau des lignes insérées
        return data;
    } catch (error) {
        console.error("Erreur Supabase newCart:", error);
        throw error;
    }
}

/**
 * Récupère tous les paniers.
 */
export const getAllCarts = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getAllCarts:", error);
        throw error;
    }
}

/**
 * Récupère tous les paniers associés à une boutique (shopId).
 */
export const getCartsByShopId = async (shopId) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('shopid', shopId); // Utilisation de .eq pour la clause WHERE

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getCartsByShopId:", error);
        throw error;
    }
}

/**
 * Récupère un panier par son ID.
 */
export const getCartById = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single(); // Utilisation de .single() car ID est unique

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getCartById:", error);
        if (error.code === 'PGRST116') return null; // Gérer l'absence de ligne
        throw error;
    }
}

/**
 * Supprime un panier par son ID.
 */
export const deleteCartById = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Erreur Supabase deleteCartById:", error);
        throw error;
    }
}