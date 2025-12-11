/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET // || '13Aout1994'; 

export const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Sépare "Bearer" du jeton
    
    // 2. Vérifier l'existence du jeton
    if (token == null) {
        // 401 Unauthorized : Jeton manquant
        return res.status(401).json({ message: 'Accès refusé. Jeton d\'authentification manquant.' });
    }

    // 3. Vérifier et décoder le jeton
    jwt.verify(token, secret, (err, user) => {
        // 'user' ici est le payload décodé (ex: { id: 1, email: 'user@example.com' })

        if (err) {
            // 💡 AJOUT : Log l'erreur réelle pour le débogage
            console.error("Erreur de vérification JWT :", err.name, err.message);

            let status = 403;
            let message = 'Accès refusé. Jeton non valide ou secret incorrect.';

            if (err.name === 'TokenExpiredError') {
                status = 401; // Souvent préférable d'utiliser 401 pour l'expiration pour forcer la reconnexion
                message = 'Accès refusé. Le jeton a expiré.';
            }

            // 401 Unauthorized ou 403 Forbidden
            return res.status(status).json({ message });
        }

        // 4. Attacher les informations de l'utilisateur à l'objet 'req'
        // Ceci permet aux contrôleurs suivants d'accéder à req.user
        req.user = user; 

        // 5. Passer à la fonction de contrôleur suivante
        next(); 
    });
};
