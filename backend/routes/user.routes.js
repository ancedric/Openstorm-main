import * as userController from "../controllers/user.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const userRouter = express.Router()

// Authentification et lecture de base
userRouter.post('/register', userController.signup)
userRouter.post('/login', userController.login)
userRouter.get('/me', isAuthenticated, userController.getMe) // Nouvelle route pour l'utilisateur connecté

// Routes Administratives (nécessitent isAuthenticated + une vérification de rôle si nécessaire)
userRouter.get('/all-users', isAuthenticated, userController.allUsers)
userRouter.get('/user/:id', isAuthenticated, userController.getUserFromId)
userRouter.delete('/delete-user/:id', isAuthenticated, userController.deleteUser)

// Routes de Mise à Jour (PUT)
userRouter.put('/update-user/:id', isAuthenticated, userController.updateUserGeneric) // Mise à jour complète (nom, email, tel, etc.)
userRouter.put('/update-password/:id', isAuthenticated, userController.updateUserPassword) // Mise à jour du mot de passe
userRouter.put('/update-role/:id', isAuthenticated, userController.updateUserRole)     // Mise à jour du rôle
userRouter.put('/update-email/:id', isAuthenticated, userController.updateUserEmail)   // Mise à jour de l'email
userRouter.put('/update-phone/:id', isAuthenticated, userController.updateUserPhone)   // Mise à jour du téléphone
userRouter.put('/update-name/:id', isAuthenticated, userController.updateUserName)     // Mise à jour du nom/prénom
userRouter.put('/update-plan/:id', isAuthenticated, userController.updateUserPlan)     // Mise à jour du plan

// L'ancienne route '/update-user/:id' est remplacée par '/update-generic/:id' pour clarté.
// Vous pouvez supprimer l'ancienne route si elle n'est plus utilisée.
// userRouter.put('/update-user/:id', isAuthenticated, userController.updateUser) 

export default userRouter;