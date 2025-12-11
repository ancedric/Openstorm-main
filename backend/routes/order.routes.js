import * as orderController from "../controllers/order.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router()

orderRouter.post('/new-order', isAuthenticated, orderController.createNewOrder)
orderRouter.get('/all-orders', isAuthenticated, orderController.allOrders)
// Utilise cartId, bien que le nom de la fonction suggère ShopRef, nous restons cohérents avec le modèle:
orderRouter.get('/get-shop-orders/:cartId', isAuthenticated, orderController.getOrdersByShopRef) 
orderRouter.get('/order/:id', isAuthenticated, orderController.getOrderFromId)
orderRouter.get('/get-product-order/:id', isAuthenticated, orderController.getOrderFromProductId)
orderRouter.delete('/delete-order/:id', isAuthenticated, orderController.deleteOrder)

export default orderRouter;