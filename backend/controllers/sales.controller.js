import * as sales from '../models/sales.js';


export const getAllDailySales = async (req, res) => {
        try {
            const dailySales = await sales.getAllDailySales();
            if (dailySales.length === 0) {
                console.log('Aucune vente journalière trouvée');
            }
            res.json({ dailySales });
        } catch (error) {
            console.error('Erreur lors de la récupération des ventes journalières:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des ventes journalières.' });
        }
}
export const getSalesByShopId = async(req, res) => {
    const shopId = req.params.shopId;
        try {
            const salesData = await sales.getDailySalesByShopId(shopId); 
            res.json({ salesData  });
        }
        catch (error) {
            console.error('Erreur lors de la récupération des ventes de la boutique:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des ventes de la boutique.' });
        }
}
export const updateDailySales = async (req, res) => {
    const {shopId} = req.params;
    // La route SQL originale utilisait 'date' dans le corps, j'ajoute une date par défaut aujourd'hui
    const { nbSales, totalAmount, date } = req.body;
    
    // Si la date n'est pas fournie dans le corps, utiliser la date du jour
    const targetDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    // Les données `nbSales` et `totalAmount` ne sont pas forcément envoyées ensemble
    if (nbSales === undefined || totalAmount === undefined) {
        return res.status(400).json({ error: 'Les champs nbSales et totalAmount sont requis dans le corps de la requête.' });
    }

    try {
            const result = await sales.updateDailySalesById(shopId, nbSales, totalAmount, targetDate);

            if (result.length === 0) {
                // Tenter de créer si l'update n'a rien trouvé (première vente du jour)
                const createResult = await sales.newDailySales(shopId, nbSales, totalAmount, targetDate);
                 return res.json({ message: 'Nouvelle entrée de ventes journalières créée avec succès (Update non trouvé).', dailySales: createResult[0] });
            }

            res.json({ message: 'Ventes journalières mises à jour avec succès.', dailySales: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour des ventes journalières:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour des ventes journalières.' });
        }
}

export const createDailySales = async (req, res) => {
    const { shopId, nbSales, totalAmount } = req.body;
    // Assurer que la date est au format 'YYYY-MM-DD' pour la cohérence
    const date = new Date().toISOString().split('T')[0];
    
        try {
            // Optionnel: vérifier si une entrée existe déjà pour cette date et cette boutique
            const existingSale = await sales.getDailySalesByDate(date);
            if (existingSale) {
                return res.status(409).json({ error: 'Une entrée de ventes journalières existe déjà pour cette date et cette boutique.' });
            }

            const result = await sales.newDailySales(shopId, nbSales, totalAmount, date);
            res.status(201).json({ message: 'Nouvelles ventes journalières créées avec succès', dailySales: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la création des ventes journalières:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la création des ventes journalières.' });
        }
}

// Nouvelle fonction pour la suppression par ID (si nécessaire, basé sur la fonction SQL originale)
export const deleteDailySale = async (req, res) => {
    const { id } = req.params;
    try {
        await sales.deleteDailySalesById(id);
        res.json({ message: 'Entrée de ventes journalières supprimée avec succès.' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de l\'entrée de ventes:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'entrée de ventes.' });
    }
}

// Nouvelle fonction pour la récupération par ID (si nécessaire, basé sur la fonction SQL originale)
export const getDailySaleById = async (req, res) => {
    const { id } = req.params;
    try {
        const sale = await sales.getDailySalesById(id);
        if (!sale) {
            return res.status(404).json({ error: 'Entrée de ventes journalières non trouvée.' });
        }
        res.json({ dailySales: sale });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'entrée de ventes:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'entrée de ventes.' });
    }
}

// Nouvelle fonction pour la récupération par date (si nécessaire, basé sur la fonction SQL originale)
export const getDailySaleByDate = async (req, res) => {
    const { date } = req.params; // La date doit être passée au format 'YYYY-MM-DD'
    try {
        const sale = await sales.getDailySalesByDate(date);
        if (!sale) {
            return res.status(404).json({ error: 'Entrée de ventes journalières non trouvée pour cette date.' });
        }
        res.json({ dailySales: sale });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'entrée de ventes par date:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'entrée de ventes par date.' });
    }
}