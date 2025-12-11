import * as cartController from "../controllers/cart.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router()

cartRouter.post('/new-cart', isAuthenticated, cartController.addCart)
cartRouter.get('/all-carts', isAuthenticated, cartController.allCarts)
cartRouter.get('/get-shop-carts/:shopId', isAuthenticated, cartController.getShopCarts)
cartRouter.get('/cart/:id', isAuthenticated, cartController.getCartFromId)
cartRouter.delete('/delete-cart/:id', isAuthenticated, cartController.deleteCart)

export default cartRouter;