/* eslint-disable no-undef */
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg; 

dotenv.config();

// Déterminer si nous sommes en environnement de production
// Utiliser 'development' par défaut si NODE_ENV n'est pas défini
const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL
// Configuration de l'objet SSL
const sslConfig = isProduction ? {
    // Si en production, active l'SSL et accepte les certificats auto-signés
    // (souvent nécessaire pour des services comme Heroku ou certains VPS)
    rejectUnauthorized: false 
} : false; // 💡 DÉSACTIVER SSL en développement local

// Configuration du pool de connexions PostgreSQL
const pool = new Pool({
    connectionString: connectionString
});

// Tester la connexion (optionnel mais recommandé)
pool.on('connect', () => {
    console.log('Connexion réussie à PostgreSQL.');
});
pool.on('error', (err) => {
    console.error('Erreur inattendue sur le pool de connexions PostgreSQL:', err.message, err.stack);
});

pool.connect()
    .then(client => {
        console.log('Connecté à PostgreSQL avec succès !');
        client.release(); // Relâche le client pour qu'il retourne au pool
    })
    .catch(err => {
        console.error('Erreur de connexion à PostgreSQL :', err.message);
        // Il est souvent judicieux de quitter l'application si la connexion DB échoue au démarrage
        process.exit(1);
    });


/**
 * @param {string} text Le texte de la requête SQL (avec des $1, $2, etc. pour les paramètres).
 * @param {Array<any>} [params] Les paramètres de la requête.
 * @returns {Promise<any>} Le résultat de la requête.
 */
export const query = (text, params) => {
    return pool.query(text, params)
        .then(res => res.rows)
        .catch(err => {
            console.error('Erreur d\'exécution de la requête:', err.message, text, params);
            throw err; 
        });
};
