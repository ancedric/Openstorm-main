import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Assurez-vous d'avoir SUPABASE_SERVICE_ROLE_KEY dans votre fichier .env
const supabaseUrl = process.env.SUPABASE_URL;
// Clé Service Role pour les opérations backend sensibles (nécessaire pour l'upload et la suppression)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

// Nom de votre bucket de stockage (à définir dans votre .env)
export const STORAGE_BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET; 

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("ATTENTION: Les variables d'environnement SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ne sont pas définies.");
    // Quitter l'application si la connexion DB Admin est essentielle
    process.exit(1); 
}

// Initialisation du client Supabase avec la clé Service Role (mode Admin)
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false, // Important pour un environnement Node.js (backend)
    }
});

// Exportez la configuration pour être utilisée par d'autres services
// Note: Le client "non-admin" (avec SUPABASE_ANON_KEY) devrait être exporté depuis `supabase.service.js`