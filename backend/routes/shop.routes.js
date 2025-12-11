import * as shop from '../controllers/shop.controller.js'
import express from 'express'
// NOUVEAU: Import de uploadToSupabase
import upload, { uploadToSupabase } from '../config/multer.config.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const shopRouter = express.Router()

// 1. Route de création de boutique : Ajout du middleware uploadToSupabase('shops')
shopRouter.post(
    '/new-shop', 
    upload.single('image'), 
    isAuthenticated, 
    uploadToSupabase('shops'), // Upload vers le dossier 'shops' dans le bucket Supabase
    shop.createNewShop
)

// ... autres routes inchangées ...

// 2. Route de mise à jour d'image : Ajout du middleware uploadToSupabase('shops')
// Suppression de ':newImage' qui est géré par req.file / req.body
shopRouter.put(
    '/update-image/:id', 
    upload.single('image'), 
    isAuthenticated, 
    uploadToSupabase('shops'), // Upload vers le dossier 'shops' dans le bucket Supabase
    shop.updateShopImage
)

shopRouter.get('/all-shops', isAuthenticated, shop.allShops)
shopRouter.get('/get-user-shop/:userRef', isAuthenticated, shop.getShopByUserRef)
shopRouter.get('/shop/:id', shop.getShopFromId)
shopRouter.delete('/delete-shop/:id', isAuthenticated, shop.deleteShop)
// ATTENTION: La route suivante semble avoir trop de paramètres dans l'URL, 
// les données complexes devraient être dans le body (PUT /update-shop/:id)
shopRouter.put('/update-shop/:id/:name/:activity/:conuntry/:city/:image', isAuthenticated, shop.updateShop)
shopRouter.put('/update-name/:id/:newName', isAuthenticated, shop.updateShopName)
shopRouter.put('/update-activity/:id/:newActivity', isAuthenticated, shop.updateShopActivity)
shopRouter.put('/update-opening-hour/:id/:newOpeningHour', isAuthenticated, shop.updateShopOpeningHour)
shopRouter.put('/update-close-hour/:id/:newCloseHour', isAuthenticated, shop.updateShopCloseHour)
shopRouter.put('/update-cash/:id', isAuthenticated, shop.updateShopCash)
shopRouter.put('/update-remaining-activation-time/:id', isAuthenticated, shop.updateShopRemainingActivationTime)
shopRouter.put('/update-subscription-state/:shopRef', isAuthenticated, shop.updateSubscriptionState)

export default shopRouter;