import * as renewal from '../models/renewal.js';

// Définir les jours ajoutés pour chaque plan (en jours)
const planDurations = {
    1: 30,  // Plan 1: 30 jours
    2: 90,  // Plan 2: 90 jours
    3: 365, // Plan 3: 365 jours
};

/**
 * Crée une nouvelle demande de renouvellement d'abonnement.
 * Utilise l'URL du fichier fourni par le middleware `uploadToSupabase`.
 */
export const addRenewal = async (req, res) => {
    // shopRef et userPlan sont dans req.body. capture est fournie par le middleware.
    const { shopRef, userPlan} = req.body;
    
    // Le middleware `uploadToSupabase` attache l'URL publique ici
    const captureUrl = req.uploadedFileUrl; 

    if (!captureUrl) {
        return res.status(400).json({ error: 'Aucun fichier capture fourni ou l\'upload a échoué. Veuillez réessayer.' });
    }
    
    // Valider le plan (simple)
    if (!userPlan) {
         return res.status(400).json({ error: 'Le plan utilisateur spécifié n\'est pas valide.' });
    }

    try {
        const result = await renewal.newRenewal(shopRef, userPlan, captureUrl);
        console.log('Nouvelle demande de renouvellement créée avec succès:', result);
        res.status(201).json({ 
            message: 'Nouvelle demande de renouvellement créée avec succès et en attente de vérification', 
            renewal: result[0] 
        });
    }
    catch (error) {
        console.error('Erreur lors de la création de la demande de renouvellement:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la création de la demande de renouvellement.' });
    }
};

//route pour récupérer toutes les demandes de renouvellement
export const allRenewals = async (req, res) => {
    try {
        const renewalsData = await renewal.getAllRenewals();
        res.json({ renewals: renewalsData });
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes de renouvellement:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des demandes de renouvellement.' });
    }
};

/**
 * Contrôleur pour approuver une demande de renouvellement (Logique Admin).
 * Met à jour le statut et augmente le temps d'abonnement de la boutique.
 */
export const approveRenewal = async (req, res) => {
    const renewalId = parseInt(req.params.id); // L'ID doit être un nombre entier
    
    if (isNaN(renewalId)) {
        return res.status(400).json({ error: 'L\'ID de la demande de renouvellement doit être un nombre valide.' });
    }
    
    try {
        // 1. Récupérer la demande pour connaître le plan
        const renewalToApprove = await renewal.getRenewalById(renewalId); 
        
        if (!renewalToApprove || renewalToApprove.length === 0) {
            return res.status(404).json({ error: 'Demande de renouvellement non trouvée.' });
        }
        
        if (renewalToApprove[0].status === 'approuvé') {
             return res.status(400).json({ error: 'Cette demande a déjà été approuvée.' });
        }
        
        const userPlan = renewalToApprove[0].userPlan;
        const daysToAdd = planDurations[userPlan];

        if (daysToAdd === undefined) {
            return res.status(400).json({ error: `Plan utilisateur ${userPlan} non reconnu. Impossible d'ajouter le temps d'activation.` });
        }

        // 2. Approuver la demande et mettre à jour le temps de la boutique
        const result = await renewal.approveRenewal(renewalId, daysToAdd);

        res.json({ 
            message: `Demande de renouvellement #${renewalId} approuvée. ${daysToAdd} jours ajoutés à la boutique.`, 
            renewal: result.renewal,
            shop: result.shop
        });
        
    } catch (error) {
        console.error('Erreur lors de l\'approbation de la demande de renouvellement:', error);
        res.status(500).json({ error: error.message || 'Une erreur est survenue lors de l\'approbation de la demande de renouvellement.' });
    }
};