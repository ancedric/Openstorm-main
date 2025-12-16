import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eggqkuynhsnsyoahmlic.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZ3FrdXluaHNuc3lvYWhtbGljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI2MzQyMiwiZXhwIjoyMDgwODM5NDIyfQ.a9qn923pM-RJ-nq8h_vzhqMRxl1igJA5btqNoiBq2pM';

// Nom du bucket de stockage
export const STORAGE_BUCKET_NAME = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'openstorm_bucket';

if (!supabaseUrl || !supabaseKey) {
    console.error("ATTENTION: Les variables d'environnement VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY ne sont pas définies.");
}

// Initialisation du client Supabase public (mode Anon Key)
const supabase = createClient(supabaseUrl, supabaseKey);

// Exporter le client pour usage direct
export default supabase;