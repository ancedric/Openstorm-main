import * as renewalController from "../controllers/renewal.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";
// Importez le middleware Multer en mémoire et le middleware d'upload vers Supabase
import uploadMemory, { uploadToSupabase } from "../config/multer.config.js";

const renewalRouter = express.Router()

// Route pour soumettre une nouvelle demande de renouvellement
// 1. Lit le fichier en mémoire (uploadMemory.single('capture')).
// 2. Upload la 'capture' vers Supabase Storage dans le dossier 'renewals' (uploadToSupabase('renewals')).
// 3. Vérifie l'authentification.
// 4. Traite l'enregistrement DB avec l'URL de l'image.
renewalRouter.post(
    '/new-renewal', 
    uploadMemory.single('capture'), 
    uploadToSupabase('renewals'), 
    isAuthenticated, 
    renewalController.addRenewal
);

// Route pour récupérer toutes les demandes de renouvellement (Admin)
renewalRouter.get('/all-renewals', isAuthenticated, renewalController.allRenewals);

// Route pour approuver une demande de renouvellement (Admin)
// Prend l'ID de la demande en paramètre.
renewalRouter.put('/approve-renewal/:id', isAuthenticated, renewalController.approveRenewal);

export default renewalRouter;