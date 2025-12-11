import * as shop from '../models/shop.js';
// NOUVEAU : Importez le client Admin pour la suppression de fichier
// ASSUREZ-VOUS QUE LE CHEMIN CI-DESSOUS EST CORRECT
import { supabase, STORAGE_BUCKET_NAME } from '../config/supabase.service.js'; 


// Fonction utilitaire pour la suppression d'un fichier de Supabase Storage
// Nécessite le client `supabaseAdmin` et le `STORAGE_BUCKET_NAME` configurés.
const deleteFileByPath = async (filePath) => {
    try {
        if (!filePath || typeof filePath !== 'string' || !filePath.startsWith('http')) return;
        
        // Supabase stocke les fichiers dans le format: [URL]/storage/v1/object/public/[BUCKET_NAME]/[PATH_IN_BUCKET]
        // Nous devons extraire seulement le [PATH_IN_BUCKET] pour la fonction `.remove()`.
        const parts = filePath.split('/');
        // Le chemin devrait commencer après le nom du bucket (qui est STORAGE_BUCKET_NAME)
        const bucketIndex = parts.indexOf(STORAGE_BUCKET_NAME);
        if (bucketIndex === -1 || bucketIndex === parts.length - 1) {
            console.error('Chemin Supabase Storage invalide pour la suppression:', filePath);
            return;
        }

        const pathInBucket = parts.slice(bucketIndex + 1).join('/');

        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET_NAME)
            .remove([pathInBucket]);

        if (error) {
            // Log l'erreur mais ne pas la thrower pour ne pas bloquer le processus principal de suppression de boutique/image
            console.error('Erreur Supabase Suppression:', error);
            return;
        }
        console.log(`Fichier Supabase supprimé: ${pathInBucket}`);

    } catch (e) {
        console.error("Erreur de nettoyage Supabase Storage:", e);
    }
}


export const createNewShop = async (req, res) => {
    // Les variables req.uploadedFileUrl et req.uploadedFilePath sont attachées par `uploadToSupabase`
    const { userRef, shopname, activity, openingHour, closeHour, country, city, remainingactivationtime} = req.body;
    const date = new Date().toISOString().split('T')[0];
    const now = Date.now();
    const year = new Date();
    const ref = `SHOP-${year.getFullYear()}-${now}`; 
    
    // L'URL publique est attachée par le middleware `uploadToSupabase`
    const imageUrl = req.uploadedFileUrl || null; 
    // Le chemin interne au bucket est aussi attaché (pour le nettoyage)
    const filePathForCleanup = req.uploadedFileUrl || null; // On utilise l'URL pour la suppression

    try {
        // La logique d'upload est maintenant gérée par le middleware `uploadToSupabase`
        if (imageUrl) {
            console.log(`URL de l'image Supabase: ${imageUrl}`);
        }

        const result = await shop.newShop(
            ref, 
            userRef, 
            shopname, 
            activity, 
            openingHour, 
            closeHour, 
            country, 
            city, 
            remainingactivationtime,
            imageUrl, // Sauvegarde de l'URL Supabase dans la DB
            date
        );
        
        console.log('Nouvelle boutique créée avec succès:', result);
        res.status(201).json({ message: 'Nouvelle boutique créée avec succès', shop: result[0] });
    }
    catch (error) {
        console.error('Erreur lors de la création de la boutique:', error);
        // Tenter de nettoyer le fichier Supabase si l'upload a réussi mais l'insertion DB a échoué
        if (filePathForCleanup) { 
            await deleteFileByPath(filePathForCleanup);
        }
        res.status(500).json({ error: 'Une erreur est survenue lors de la création de la boutique.' });
    }
}

export const deleteShop = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Récupérer l'URL de l'image avant suppression de la DB
        const shopData = await shop.getShopFromId(id);
        const imageUrl = shopData[0]?.image; 
        
        // 2. Supprimer l'entrée de la DB
        const result = await shop.deleteShop(id);
        
        // 3. Supprimer le fichier de Supabase Storage
        if (imageUrl && imageUrl.startsWith('http')) {
            await deleteFileByPath(imageUrl); // NOUVEAU : Utilise la fonction de suppression Supabase
        }

        res.json({ message: 'Boutique supprimée avec succès', result });
    } catch (error) {
        console.error('Erreur lors de la suppression de la boutique:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la boutique.' });
    }
}

export const updateShopImage = async (req, res) => {
    const { id } = req.params;
    // NOUVEAU : Récupération de l'URL publique depuis le middleware `uploadToSupabase`
    const newImageUrl = req.uploadedFileUrl; 
    const filePathForCleanup = req.uploadedFileUrl; 

    // Vérifier si un nouveau fichier a été uploadé
    if (!newImageUrl) {
        return res.status(400).json({ error: 'Aucun nouveau fichier image fourni ou upload échoué.' });
    }
    
    try {
        // 1. Récupérer l'ancienne URL de l'image
        const shopData = await shop.getShopFromId(id);
        if (shopData.length === 0) {
            // Si la boutique n'est pas trouvée, supprimez l'image qui vient d'être uploadée
            await deleteFileByPath(filePathForCleanup);
            return res.status(404).json({ error: 'Boutique non trouvée.' });
        }
        
        const oldImageUrl = shopData[0].image;
        
        // 2. Mise à jour de la DB avec la nouvelle URL
        const result = await shop.updateShopImage(id, newImageUrl);
        
        // 3. Suppression de l'ancienne image de Supabase Storage
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
            await deleteFileByPath(oldImageUrl); 
        }

        res.json({ message: 'Image de la boutique mise à jour avec succès', shop: result[0] });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'image de la boutique:', error);
        // Tenter de nettoyer le fichier Supabase si l'upload a réussi mais la DB a échoué
        if (filePathForCleanup) {
            await deleteFileByPath(filePathForCleanup);
        }
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'image de la boutique.' });
    }
}

// Les autres fonctions de contrôleur restent inchangées car elles ne gèrent pas d'upload/suppression
export const allShops = async (req, res) => {
    try {
        const result = await shop.getAllShops();
        console.log("shops: ", result)
        res.json(result);
    }
    catch(error){
        console.error('Erreur lors de la récupération de toutes les boutiques', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la récupération de toutes les boutiques'});
    }
}

export const getShopByUserRef = async (req, res) => {
    const { userRef } = req.params;
    try {
        const result = await shop.getShopByUserRef(userRef);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Boutique non trouvée pour cette référence utilisateur.' });
        }
        res.json(result[0]);
    }
    catch(error){
        console.error('Erreur lors de la récupération de la boutique par référence utilisateur', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la récupération de la boutique par référence utilisateur'});
    }
}

export const getShopFromId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await shop.getShopFromId(id);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Boutique non trouvée.' });
        }
        res.json(result[0]);
    }
    catch(error){
        console.error('Erreur lors de la récupération de la boutique par ID', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la récupération de la boutique par ID'});
    }
}

export const updateShop = async (req, res) => {
    const { id, name, activity, conuntry, city, image } = req.params;
    try {
        const result = await shop.updateShop(id, name, activity, conuntry, city, image);
        res.json({message:'Mise à jour de la boutique réussie', shop: result[0] });
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de la boutique', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de la boutique'});
    }
}

export const updateShopName = async (req, res) => {
    const { id, newName } = req.params;
    try {
        const result = await shop.updateShopName(id, newName);
        res.json({message:'Mise à jour du nom de la boutique réussie', shop: result[0] });
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du nom de la boutique', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour du nom de la boutique'});
    }
}

export const updateShopActivity = async (req, res) => {
    const { id, newActivity } = req.params;
    try {
        const result = await shop.updateShopActivity(id, newActivity);
        res.json({message:'Mise à jour de l\'activité de la boutique réussie', shop: result[0] });
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'activité de la boutique', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de l\'activité de la boutique'});
    }
}

export const updateShopOpeningHour = async (req, res) => {
    const { id, newOpeningHour } = req.params;
    try {
        const result = await shop.updateShopOpeningHour(id, newOpeningHour);
        res.json({message:'Mise à jour de l\'heure d\'ouverture réussie', shop: result[0] });
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'heure d\'ouverture', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de l\'heure d\'ouverture'});
    }
}

export const updateShopCloseHour = async (req, res) => {
    const { id, newCloseHour } = req.params;
    try {
        const result = await shop.updateShopCloseHour(id, newCloseHour);
        res.json({message:'Mise à jour de l\'heure de fermeture réussie', shop: result[0] });
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'heure de fermeture', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de l\'heure de fermeture'});
    }
}

export const updateShopCash = async (req, res) => {
    const { id } = req.params;
    const {newCash} = req.body;
    try {
        const result = await shop.updateCash(id, newCash);
        res.json({message:'Mise à jour du statut de paiement par cash réussie', shop: result[0] });
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du statut de paiement par cash', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour du statut de paiement par cash'});
    }
}

export const updateShopRemainingActivationTime = async (req, res) => {
    const { id } = req.params;
    const { plan } = req.body;
    try {
        const result = await shop.updateRemainingActivationTime(id, plan);
        res.json({message:'Mise à jour du temps d\'activation restant de la boutique réussie', shop: result[0] });

        console.log(result[0]);
    }
    catch(error){
        console.error('Erreur lors de la mise à jour du temps d\'activation restant de la boutique', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour du temps d\'activation restant de la boutique'});
    }
}

// Contrôleur pour gérer la décrémentation des jours restants
export const updateSubscriptionState = async (req, res) => {
    const shopRef = req.params.shopRef; 
    console.log("Mise à jour du temps d'activation restant", shopRef);
    const { remainingActivationTime, last_update_time } = req.body; 
    
    try {
        const result = await shop.updateSubscriptionState(shopRef, remainingActivationTime, last_update_time);
        
        if (result.length === 0) {
             return res.status(404).json({ error: 'Boutique non trouvée ou non mise à jour.' });
        }
        
        res.json({ message: 'État de l\'abonnement mis à jour avec succès', shop: result[0] });
    }
    catch(error){
        console.error('Erreur lors de la mise à jour de l\'état de l\'abonnement', error);
        res.status(500).json({error: 'Une erreur est survenue lors de la mise à jour de l\'état de l\'abonnement'});
    }
}