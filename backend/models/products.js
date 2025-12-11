import {supabase} from '../config/supabase.service.js';

const TABLE_NAME = 'products';

// --- Création de table gérée par Supabase directement (Retiré) ---
/*
export const createProductsTable = async () => {
    // ... La création de table est gérée par Supabase
}
*/

/**
 * Crée un nouveau produit dans la base de données.
 */
export const newProduct = async (ref, shopRef, name, category, summary, description, supplier, price, reduction, stock, status, image, date) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([
                {
                    ref, shopref: shopRef, name, category, summary, description, supplier, price, reduction, stock, status, image, createdat: date
                }
            ])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase newProduct:", error);
        throw error;
    }
}

/**
 * Récupère tous les produits.
 */
export const getAllProducts = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getAllProducts:", error);
        throw error;
    }
}

/**
 * Récupère les produits par référence de boutique.
 */
export const getProductsByShopRef = async (shopRef) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('shopref', shopRef);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getProductsByShopRef:", error);
        throw error;
    }
}

/**
 * Récupère un produit par son ID.
 */
export const getProductById = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single(); // Utilisation de .single() car ID est unique

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getProductById:", error);
        // Si l'erreur est 'No rows found', on retourne null
        if (error.code === 'PGRST116') return null; 
        throw error;
    }
}

/**
 * Récupère la quantité de stock d'un produit.
 */
export const getStock = async (productId) => {
    console.log('Récupération du stock')
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('stock')
            .eq('id', productId)
            .single();

        if (error) throw error;
        return data.stock;
    } catch (error) {
        console.error("Erreur Supabase getStock:", error);
        throw error;
    }
}

/**
 * Supprime un produit par son ID.
 */
export const deleteProductById = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Erreur Supabase deleteProductById:", error);
        throw error;
    }
}

/**
 * Met à jour les informations d'un produit (inclut l'image).
 */
export const updateProductById = async (id, name, category, summary, description, supplier, price, reduction, image) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ name, category, summary, description, supplier, price, reduction, image })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateProductById:", error);
        throw error;
    }
}

/**
 * Met à jour le stock d'un produit.
 */
export const updateStock = async (id, newStock) => {
    console.log('Mise à jour du stock: ', id, newStock)
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ stock: newStock })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateStock:", error);
        throw error;
    }
}

/**
 * Met à jour le prix d'un produit.
 */
export const updatePrice = async (id, newPrice) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ price: newPrice })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updatePrice:", error);
        throw error;
    }
}