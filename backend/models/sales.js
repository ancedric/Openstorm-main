import {supabase} from '../config/supabase.service.js';

const TABLE_NAME = 'dailysales'; // Nom de la table dans Supabase

// --- Création de table gérée par Supabase directement (Retiré) ---
/*
export const createSalesTable = async () => {
    // ... La création de table est gérée par Supabase
}
*/

/**
 * Crée une nouvelle entrée de ventes journalières.
 * @param {string} shopId - Référence/ID de la boutique associée.
 * @param {number} nbSales - Nombre de ventes effectuées ce jour.
 * @param {number} totalAmount - Montant total des ventes ce jour.
 * @param {string} date - Date des ventes (format 'YYYY-MM-DD').
 */
export const newDailySales = async (shopId, nbSales, totalAmount, date) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([
                { shopid: shopId, nbsales: nbSales, totalamount: totalAmount, date }
            ])
            .select();

        if (error) throw error;
        // Supabase retourne un tableau, mais on s'attend à un seul enregistrement
        return data;
    } catch (error) {
        console.error("Erreur Supabase newDailySales:", error);
        throw error;
    }
}

/**
 * Récupère toutes les ventes journalières.
 */
export const getAllDailySales = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getAllDailySales:", error);
        throw error;
    }
}

/**
 * Récupère les ventes journalières pour une boutique spécifique.
 * @param {string} shopId - Référence/ID de la boutique.
 */
export const getDailySalesByShopId = async (shopId) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('shopid', shopId)
            .order('date', { ascending: false }); // Tri par date décroissante

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase getDailySalesByShopId:", error);
        throw error;
    }
}

/**
 * Récupère une entrée de ventes journalières par son ID (Primaire).
 * @param {number} id - ID de l'entrée de ventes.
 */
export const getDailySalesById = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        // Gérer le cas où aucune ligne n'est trouvée (code PGRST116)
        if (error.code === 'PGRST116') return null;
        console.error("Erreur Supabase getDailySalesById:", error);
        throw error;
    }
}

/**
 * Récupère une entrée de ventes journalières par date.
 * (Souvent utilisé pour vérifier si une entrée existe déjà pour la journée)
 * @param {string} date - Date des ventes (format 'YYYY-MM-DD').
 */
export const getDailySalesByDate = async (date) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('date', date)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        // Gérer le cas où aucune ligne n'est trouvée (code PGRST116)
        if (error.code === 'PGRST116') return null;
        console.error("Erreur Supabase getDailySalesByDate:", error);
        throw error;
    }
}

/**
 * Supprime une entrée de ventes journalières par son ID.
 * @param {number} id - ID de l'entrée de ventes.
 */
export const deleteDailySalesById = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Erreur Supabase deleteDailySalesById:", error);
        throw error;
    }
}

/**
 * Met à jour les ventes journalières (généralement par date et shopId).
 * @param {string} shopId - Référence/ID de la boutique.
 * @param {number} nbSales - Nouveau nombre de ventes.
 * @param {number} totalAmount - Nouveau montant total.
 * @param {string} date - Date de l'enregistrement à mettre à jour.
 */
export const updateDailySalesById = async (shopId, nbSales, totalAmount, date) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ nbsales: nbSales, totalamount: totalAmount })
            .eq('date', date)
            .eq('shopid', shopId)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateDailySalesById:", error);
        throw error;
    }
}

/**
 * Met à jour le nombre de ventes seulement (par ID).
 * NOTE: La fonction SQL originale prenait un ID et un nouveau nombre de ventes.
 * @param {number} id - ID de l'entrée de ventes.
 * @param {number} newNbSales - Nouveau nombre de ventes.
 */
export const updateNbSales = async (id, newNbSales) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ nbSales: newNbSales })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateNbSales:", error);
        throw error;
    }
}

/**
 * Met à jour le montant total des ventes seulement (par ID).
 * NOTE: La fonction SQL originale prenait un ID et un nouveau montant.
 * @param {number} id - ID de l'entrée de ventes.
 * @param {number} newTotalAmount - Nouveau montant total.
 */
export const updateTotalAmount = async (id, newTotalAmount) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ totalAmount: newTotalAmount })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateTotalAmount:", error);
        throw error;
    }
}