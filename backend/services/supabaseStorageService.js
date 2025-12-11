import { supabase, STORAGE_BUCKET_NAME } from '../config/supabase.service.js'; // Assurez-vous que supabase.config.js exporte STORAGE_BUCKET_NAME et supabaseAdmin

/**
 * Supprime un fichier de Supabase Storage en utilisant son URL publique.
 * @param {string} fileUrl - L'URL publique du fichier à supprimer.
 * @returns {Promise<boolean>} Vrai si la suppression a réussi ou si le fichier n'existait pas (ou n'était pas une URL Supabase).
 */
export const deleteSupabaseFileByUrl = async (fileUrl) => {
    if (!fileUrl || typeof fileUrl !== 'string') {
        return true;
    }

    // 1. Déterminer si c'est une URL Supabase
    const bucketSegment = `storage/v1/object/public/${STORAGE_BUCKET_NAME}/`;
    const startIndex = fileUrl.indexOf(bucketSegment);

    if (startIndex === -1) {
        console.log("L'URL n'est pas une URL Supabase Storage ou ne correspond pas au bucket actuel. Suppression ignorée.");
        return true; // Ce n'est pas une erreur de ne pas supprimer
    }

    // 2. Extraire le chemin du fichier (tout ce qui suit le nom du bucket)
    const filePath = fileUrl.substring(startIndex + bucketSegment.length);

    if (!filePath) {
        console.error("Chemin du fichier non trouvé dans l'URL:", fileUrl);
        return false;
    }

    try {
        // 3. Appeler l'API de suppression (utiliser le client admin pour les suppressions)
        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET_NAME)
            .remove([filePath]);

        if (error && error.statusCode !== '404') { // Ignore l'erreur 404 (fichier non trouvé)
            console.error("Erreur Supabase Storage lors de la suppression du fichier:", error);
            return false;
        }

        console.log(`Fichier Supabase Storage supprimé: ${filePath}`);
        return true;
    } catch (error) {
        console.error("Erreur critique lors de la suppression Supabase Storage:", error);
        return false;
    }
};

/**
 * Supprime un fichier de Supabase Storage en utilisant son chemin direct.
 * Cette fonction est utile si le chemin a été sauvegardé dans la DB par le middleware d'upload.
 * @param {string} filePath - Le chemin du fichier dans le bucket (ex: 'products/ref-123.jpg').
 * @returns {Promise<boolean>} Vrai si la suppression a réussi.
 */
export const deleteSupabaseFileByPath = async (filePath) => {
    if (!filePath || typeof filePath !== 'string') {
        return true;
    }

    try {
        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET_NAME)
            .remove([filePath]);

        if (error && error.statusCode !== '404') {
            console.error("Erreur Supabase Storage lors de la suppression du fichier par chemin:", error);
            return false;
        }

        console.log(`Fichier Supabase Storage supprimé par chemin: ${filePath}`);
        return true;
    } catch (error) {
        console.error("Erreur critique lors de la suppression Supabase Storage par chemin:", error);
        return false;
    }
};