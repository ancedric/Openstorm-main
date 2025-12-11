import {supabase} from '../config/supabase.service.js';

const TABLE_NAME = 'renewals'; // Nom de la table des renouvellements dans Supabase

/**
 * Enregistre une nouvelle demande de renouvellement d'abonnement.
 * Le statut par défaut est 'en attente'.
 * @param {string} shopRef La référence de la boutique.
 * @param {number} userPlan L'identifiant du plan d'abonnement (e.g., 1, 2, 3).
 * @param {string} capture L'URL publique de la preuve de paiement.
 */
export const newRenewal = async (shopRef, userPlan, capture) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([
                // Assurez-vous que les noms des colonnes correspondent à votre schéma Supabase (ex: shopRef, userPlan)
                { shopref: shopRef, userplan: userPlan, capture, status: 'en attente' } 
            ])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la création de la demande de renouvellement:", error);
        throw error;
    }
}

/**
 * Récupère toutes les demandes de renouvellement.
 */
export const getAllRenewals = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la récupération des demandes de renouvellement:", error);
        throw error;
    }
}

/**
 * Récupère une demande de renouvellement par son ID.
 * @param {number} id L'ID de la demande de renouvellement.
 */
export const getRenewalById = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id);

        if (error) throw error;
        return data; 
    } catch (error) {
        console.error("Erreur Supabase lors de la récupération de la demande de renouvellement par ID:", error);
        throw error;
    }
}


/**
 * Met à jour le statut d'une demande de renouvellement et met à jour le temps d'activation de la boutique.
 * Cette opération est critique et simule une transaction pour garantir la cohérence.
 * @param {number} id L'ID de la demande de renouvellement.
 * @param {number} remainingActivationTimeToAdd Le nombre de jours à ajouter à l'abonnement de la boutique.
 */
export const approveRenewal = async (id, remainingActivationTimeToAdd) => {
    try {
        // 1. Mettre à jour le statut de la demande de renouvellement
        const { data: renewalData, error: renewalError } = await supabase
            .from(TABLE_NAME)
            .update({ status: 'approuvé', processedAt: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (renewalError) throw renewalError;
        if (renewalData.length === 0) {
            throw new Error('Demande de renouvellement non trouvée ou déjà traitée.');
        }

        const shopRef = renewalData[0].shopRef; 

        // 2. Récupérer le temps restant actuel de la boutique
        const { data: shopCurrent, error: shopError } = await supabase
            .from('shops')
            .select('remainingActivationTime')
            .eq('ref', shopRef)
            .single();

        if (shopError && shopError.code !== 'PGRST116') throw shopError; // Gérer les erreurs, ignorer "pas de lignes" à ce stade
        
        if (!shopCurrent) {
            throw new Error(`Boutique (ref: ${shopRef}) non trouvée.`);
        }

        const currentDays = shopCurrent.remainingActivationTime || 0;
        const newTotalDays = currentDays + remainingActivationTimeToAdd;

        // 3. Mettre à jour le temps restant de la boutique
        const { data: shopUpdate, error: shopUpdateError } = await supabase
            .from('shops')
            .update({ remainingActivationTime: newTotalDays })
            .eq('ref', shopRef)
            .select();

        if (shopUpdateError) throw shopUpdateError;
        if (shopUpdate.length === 0) {
             throw new Error(`Boutique (ref: ${shopRef}) non mise à jour.`);
        }

        return { renewal: renewalData[0], shop: shopUpdate[0] };

    } catch (error) {
        console.error("Erreur Supabase lors de l'approbation du renouvellement:", error);
        throw error;
    }
}