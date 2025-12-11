import multer from 'multer';
// NOUVEAU: Importez supabaseAdmin et le nom du bucket depuis le fichier de configuration ADMIN
import { supabase, STORAGE_BUCKET_NAME } from './supabase.service.js'; 
import path from 'path';
import dotenv from 'dotenv'

dotenv.config()

// 1. Configuration de Multer pour stocker temporairement le fichier en mémoire (Buffer)
const uploadMemory = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/**
 * Middleware pour uploader un fichier vers Supabase Storage.
 * ATTENTION: Ce middleware doit être utilisé APRÈS `uploadMemory.single('image')`
 * car il dépend de `req.file` qui contient le buffer du fichier.
 * @param {string} folderPath - Le chemin du dossier dans le bucket (ex: 'shops' ou 'products').
 */
export const uploadToSupabase = (folderPath) => async (req, res, next) => {
    if (!req.file) {
        // Pas de fichier, continuez (utile si le champ est optionnel)
        return next();
    }

    const file = req.file;
    
    try {
        // 1. Nettoyer le nom du fichier et générer un chemin unique
        const baseName = path.parse(file.originalname).name.replace(/\\s/g, '_');
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now();
        
        // Chemin final dans Supabase Storage (ex: 'shops/baseName-1678888888.jpg')
        const filePath = `${folderPath}/${baseName}-${uniqueSuffix}${extension}`;
        
        // 2. Upload du fichier vers Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from(process.env.STORAGE_BUCKET_NAME)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (uploadError) {
            console.error('Erreur Supabase Upload:', uploadError);
            return res.status(500).json({ error: "Erreur lors de l'upload du fichier vers Supabase Storage." });
        }

        // 3. Obtenir l'URL publique après l'upload
        // Le client Admin peut utiliser getPublicUrl même si RLS est activé, 
        // mais assurez-vous que les politiques RLS permettent la lecture publique si nécessaire pour le client.
        const { data: publicUrlData } = supabase.storage
            .from(process.env.STORAGE_BUCKET_NAME)
            .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
            throw new Error('Impossible d\'obtenir l\'URL publique après l\'upload.');
        }

        // 4. Attacher l'URL publique au corps de la requête pour les contrôleurs suivants
        req.uploadedFileUrl = publicUrlData.publicUrl;
        req.uploadedFilePath = filePath; // Chemin dans le bucket pour référence future (suppression, mise à jour)
        
        console.log(`Fichier uploadé vers Supabase: ${req.uploadedFileUrl}`);
        next();

    } catch (error) {
        console.error('Erreur critique dans uploadToSupabase:', error);
        // Si l'erreur se produit avant l'upload (ex: Multer), il n'y a pas de fichier à nettoyer.
        res.status(500).json({ error: 'Erreur serveur lors du traitement du fichier.' });
    }
};

// Exportez l'instance Multer en mémoire pour l'utiliser dans les routes AVANT le middleware d'upload
export default uploadMemory;