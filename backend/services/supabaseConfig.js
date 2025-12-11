import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Assurez-vous d'avoir ces variables définies dans votre fichier .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Utilisez la clé anonyme pour les requêtes côté client/serveur non privilégiées
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Utilisez celle-ci pour les opérations admin côté serveur uniquement

if (!supabaseUrl || !supabaseKey || !serviceRoleKey) {
    console.error("Erreur: Les variables d'environnement SUPABASE_URL, SUPABASE_ANON_KEY et/ou SUPABASE_SERVICE_ROLE_KEY ne sont pas définies.");
    // Il est critique d'avoir ces clés, l'application ne devrait pas démarrer sans
    // process.exit(1); 
}

// Client Supabase général (pour les requêtes non-admin)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Client Supabase avec Service Role Key (pour les opérations privilégiées côté serveur, 
// comme l'upload sécurisé de fichiers ou la manipulation de données sensibles, en contournant RLS)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * Le nom du bucket de Supabase Storage pour les images de produits et de boutiques.
 * Assurez-vous que ce bucket existe dans votre projet Supabase.
 */
export const STORAGE_BUCKET_NAME = 'app_images';

console.log('Client Supabase initialisé.');