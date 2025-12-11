import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Importation de dotenv
import userRouter from './routes/user.routes.js';
import shopRouter from './routes/shop.routes.js';
import productRouter from './routes/product.routes.js';
import orderRouter from './routes/order.routes.js';
import cartRouter from './routes/cart.routes.js';
import salesRouter from './routes/sales.routes.js';
import renewalsRouter from './routes/renewal.routes.js';

// Charger les variables d'environnement depuis .env
dotenv.config();

const app = express();

// Configuration de CORS pour permettre les requêtes depuis les clients frontend
const corsOptions = {
    // eslint-disable-next-line no-undef
    origin: [process.env.VITE_FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware pour parser le JSON des requêtes

// eslint-disable-next-line no-undef
const port = process.env.VITE_PORT || 8082; // Utilisation de VITE_PORT comme défini dans .env

// Middleware de log pour le débogage
app.use((req, res, next) => {
    console.log(`Requête reçue: ${req.method} ${req.url}`);
    // console.log('Corps de la requête (req.body):', req.body); // Décommenter si nécessaire
    next();
});

// Utiliser les routes et le dossier statique pour les fichiers locaux (si vous décidez de ne pas utiliser Supabase Storage)
// Si vous utilisez Supabase Storage pour toutes les images, cette ligne pourrait être supprimée ou ignorée.
app.use('/media', express.static('uploads'));

// Définition des routes
app.use('/user', userRouter);
app.use('/shops', shopRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/carts', cartRouter);
app.use('/sales', salesRouter);
app.use('/renewals', renewalsRouter);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Connected to the server on localhost:${port}`);
    // eslint-disable-next-line no-undef
    console.log(`Frontend URL autorisé: ${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}`);
});