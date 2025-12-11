import * as salesController from "../controllers/sales.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const salesRouter = express.Router()

// Création d'une nouvelle entrée de vente (utilise la date du jour par défaut)
salesRouter.post('/new-sale', isAuthenticated, salesController.createDailySales)

// Récupération de toutes les ventes
salesRouter.get('/all-sales', isAuthenticated, salesController.getAllDailySales)

// Récupération des ventes pour une boutique spécifique
salesRouter.get('/get-shop-sales/:shopId', isAuthenticated, salesController.getSalesByShopId)

// Mise à jour des ventes journalières (par shopId et date du jour - ou date fournie)
salesRouter.put('/update-daily-sale/:shopId', isAuthenticated, salesController.updateDailySales)

// Suppression d'une entrée de vente par son ID (Nouvelle route)
salesRouter.delete('/delete-sale/:id', isAuthenticated, salesController.deleteDailySale)

// Récupération d'une entrée de vente par son ID (Nouvelle route)
salesRouter.get('/sale/:id', isAuthenticated, salesController.getDailySaleById)

// Récupération d'une entrée de vente par sa date (Nouvelle route)
salesRouter.get('/sale-by-date/:date', isAuthenticated, salesController.getDailySaleByDate)


export default salesRouter;