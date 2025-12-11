import * as productController from "../controllers/product.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";
// Importe l'instance Multer pour la mémoire (par défaut) et le middleware d'upload Supabase (nommé)
import uploadMemory, { uploadToSupabase } from "../config/multer.config.js";

const productRouter = express.Router()

// NOTE: uploadMemory est utilisé ici car il est l'export par défaut de multer.config.js
// uploadToSupabase('products') est le middleware qui gère l'upload réel vers Supabase Storage.

// Création: Stockage en mémoire -> Upload Supabase -> Authentification -> Contrôleur
productRouter.post(
    '/new-product',
    uploadMemory.single('image'), 
    uploadToSupabase('products'), // UPLOAD VERS SUPABASE STORAGE
    isAuthenticated, 
    productController.createNewProduct
);

productRouter.get('/all-products', isAuthenticated, productController.allProducts)
productRouter.get('/get-shop-products/:shopRef', isAuthenticated, productController.getProductsByShopRef)
productRouter.get('/product/:id', isAuthenticated, productController.getProductFromId)
productRouter.delete('/delete-product/:id', isAuthenticated, productController.deleteProduct)

// Mise à jour: Stockage en mémoire -> Upload Supabase -> Authentification -> Contrôleur
productRouter.put(
    '/update-product/:id',
    uploadMemory.single('image'), 
    uploadToSupabase('products'), // UPLOAD VERS SUPABASE STORAGE
    isAuthenticated, 
    productController.updateProduct
);

productRouter.put('/update-price/:id', isAuthenticated, productController.updateProductPrice)
productRouter.put('/update-stock/:id', isAuthenticated, productController.updateProductStock)
productRouter.put('/upgrade-stock/:id', isAuthenticated, productController.addProductStock)

export default productRouter;