import * as product from '../models/products.js';
import { deleteSupabaseFileByUrl, deleteSupabaseFileByPath } from '../services/supabaseStorageService.js';

// Ancienne fonction utilitaire supprimée car l'upload est maintenant géré par le middleware
// const handleImageUpload = ...

/**
 * Crée un nouveau produit.
 * Utilise req.uploadedFileUrl fourni par le middleware uploadToSupabase.
 */
export const createNewProduct = async (req, res) => {
    // req.uploadedFileUrl contient l'URL publique du fichier après l'upload Supabase.
    // req.uploadedFilePath contient le chemin complet (ex: 'products/name-timestamp.jpg').
    const imageUrl = req.uploadedFileUrl || null;
    const uploadedFilePath = req.uploadedFilePath || null;
    
    // Le ref du produit est utilisé comme identifiant unique
    const { ref, shopref, name, category, summary, description, supplier, price } = req.body;
    const date = new Date().toISOString().split('T')[0];
    console.log("shop ref: ", )
    
    // Vérification de l'image (maintenue pour l'upload initial)
    if (!imageUrl) {
        return res.status(400).json({ error: 'Aucun fichier image fourni (l\'image du produit est obligatoire).' });
    }

    try {
        // Le stock et la réduction devraient probablement être fournis dans req.body,
        // mais nous utilisons les valeurs par défaut basées sur l'ancien code.
        const result = await product.newProduct(
            ref, 
            shopref, 
            name, 
            category, 
            summary, 
            description, 
            supplier, 
            price, 
            0, // reduction (valeur par défaut)
            0, // stock (valeur par défaut)
            'active', // status (valeur par défaut)
            imageUrl, // URL Supabase
            date
        );
        
        // ATTENTION: Nous n'avons pas stocké uploadedFilePath dans la DB.
        // Si vous voulez le supprimer plus tard, vous devrez l'extraire de l'URL comme dans deleteSupabaseFileByUrl.
        // Je le retire ici, car il n'est pas utilisé dans le modèle newProduct.

        res.status(201).json({ message: 'Nouveau produit créé avec succès', product: result[0] });
    }
    catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        // Nettoyer l'image si l'upload a réussi mais l'insertion DB a échoué.
        if (imageUrl) {
            console.log('Tentative de suppression de l\'image suite à l\'échec DB.');
            // Utilisez deleteSupabaseFileByPath si vous avez stocké le chemin, sinon ByUrl.
            // Le middleware a le chemin, mais nous ne l'avons pas ici. Nous utiliserons l'URL.
            await deleteSupabaseFileByUrl(imageUrl);
        }
        res.status(500).json({ error: 'Une erreur est survenue lors de la création du produit' });
    }
}

/**
 * Récupère tous les produits.
 */
export const allProducts = async (req, res) => {
    try {
        const products = await product.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les produits:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des produits' });
    }
}

/**
 * Récupère les produits d'une boutique par sa référence.
 */
export const getProductsByShopRef = async (req, res) => {
    const shopRef = req.params.shopRef;
    try {
        const products = await product.getProductsByShopRef(shopRef);
        res.status(200).json(products);
    } catch (error) {
        console.error(`Erreur lors de la récupération des produits de la boutique ${shopRef}:`, error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des produits de la boutique' });
    }
}

/**
 * Récupère un produit par son ID.
 */
export const getProductFromId = async (req, res) => {
    const id = req.params.id;
    try {
        const productData = await product.getProductById(id);
        if (!productData) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(productData);
    } catch (error) {
        console.error(`Erreur lors de la récupération du produit ${id}:`, error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du produit' });
    }
}

/**
 * Supprime un produit et son image associée dans Supabase Storage.
 */
export const deleteProduct = async (req, res) => {
    const id = req.params.id;

    try {
        // 1. Récupérer le produit pour obtenir l'URL de l'image
        const productData = await product.getProductById(id);
        if (!productData) {
            // Le produit n'existe pas ou a déjà été supprimé (ok)
            return res.status(404).json({ message: 'Produit non trouvé ou déjà supprimé.' });
        }

        const imageUrl = productData.image;

        // 2. Supprimer l'enregistrement de la base de données
        await product.deleteProductById(id);

        // 3. Supprimer l'image de Supabase Storage
        if (imageUrl) {
            const deleteSuccess = await deleteSupabaseFileByUrl(imageUrl);
            if (!deleteSuccess) {
                console.warn(`Avertissement: Impossible de supprimer l'image Supabase pour le produit ID ${id}. DB OK.`);
                // On peut continuer, la suppression DB est la priorité
            }
        }
        
        res.status(200).json({ message: 'Produit et image supprimés avec succès' });
    } catch (error) {
        console.error(`Erreur lors de la suppression du produit ${id}:`, error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du produit' });
    }
}

/**
 * Met à jour un produit, y compris son image.
 * Utilise req.uploadedFileUrl et req.uploadedFilePath.
 */
export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, category, summary, description, supplier, price, reduction } = req.body;
    
    // req.uploadedFileUrl et req.uploadedFilePath sont définis par le middleware SI un fichier a été uploadé.
    const newImageUrl = req.uploadedFileUrl || null;

    try {
        // 1. Récupérer l'ancienne URL de l'image (et le ref si nécessaire, bien que l'ID suffise ici)
        const oldProductData = await product.getProductById(id);
        if (!oldProductData) {
            return res.status(404).json({ message: 'Produit non trouvé pour la mise à jour.' });
        }
        const oldImageUrl = oldProductData.image;

        let imageUrlToSave = oldImageUrl;
        
        // 2. Si une nouvelle image a été uploadée (newImageUrl est présent)
        if (newImageUrl) {
            imageUrlToSave = newImageUrl;
            
            // 3. Supprimer l'ancienne image du storage si elle existe
            if (oldImageUrl) {
                const deleteSuccess = await deleteSupabaseFileByUrl(oldImageUrl);
                if (!deleteSuccess) {
                    console.warn(`Avertissement: Échec de la suppression de l'ancienne image Supabase pour produit ${id}.`);
                }
            }
        }

        // 4. Mettre à jour la base de données
        const result = await product.updateProductById(
            id, 
            name, 
            category, 
            summary, 
            description, 
            supplier, 
            price, 
            reduction, 
            imageUrlToSave // Nouvelle URL ou ancienne URL conservée
        );

        res.status(200).json({ message: 'Mise à jour du produit réussie', product: result[0] });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit', error);
        // Si la mise à jour DB échoue après un nouvel upload, tenter de supprimer la nouvelle image
        if (newImageUrl) {
            await deleteSupabaseFileByUrl(newImageUrl);
        }
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du produit' });
    }
}

/**
 * Met à jour le prix du produit.
 */
export const updateProductPrice = async (req, res) => {
    const { newPrice } = req.body;
    const { id } = req.params;

    try {
        // Validation simple: s'assurer que newPrice est fourni
        if (typeof newPrice === 'undefined') {
            return res.status(400).json({ error: 'Le nouveau prix est requis.' });
        }

        const result = await product.updatePrice(id, newPrice);
        res.status(200).json({ message: 'Mise à jour du prix réussie', product: result[0] });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du prix du produit', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du prix du produit' });
    }
}

/**
 * Met à jour le stock du produit (diminution).
 */
export const updateProductStock = async (req, res) => {
    const { quantity } = req.body;
    const { id } = req.params;

    try {
        const currentStock = await product.getStock(id);
        const newStock = currentStock - quantity;

        if (newStock < 0) {
            return res.status(400).json({ error: 'Stock insuffisant pour cette opération.' });
        }

        const result = await product.updateStock(id, newStock);
        res.status(200).json({ message: 'Mise à jour du stock (diminution) réussie', product: result[0] });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du stock (diminution)', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la mis à jour du stock' });
    }
}

/**
 * Met à jour le stock du produit (augmentation).
 */
export const addProductStock = async (req, res) => {
    const { quantity } = req.body;
    const { id } = req.params;

    console.log("Augmentaion du stock: ", id, quantity)

    try {
        const currentStock = await product.getStock(id);
        const newStock = currentStock + quantity;
        
        const result = await product.updateStock(id, newStock);
        res.status(201).json({ message: 'Mise à jour du stock (augmentation) réussie', product: result[0] });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du stock (augmentation)', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du stock' });
    }
}