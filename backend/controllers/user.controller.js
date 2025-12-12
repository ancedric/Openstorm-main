/* eslint-disable no-undef */
import * as user from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

//const SECRET_KEY = process.env.TOKEN_SECRET || 'votre_cle_secrete_par_defaut';

// -----------------------------------------------------------
// LECTURE (READ)
// -----------------------------------------------------------

/**
 * @description Récupère les informations de l'utilisateur connecté via le token.
 */
export const getMe = async (req, res) => {
    const userRef = req.user.ref; // Assumons que le 'ref' a été inclus dans le token
    
    if (!userRef) {
        return res.status(403).json({ message: 'Informations d\'utilisateur non trouvées dans le jeton.' });
    }

    try {
        const userResult = await user.findUserByRef(userRef); 

        if (userResult.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé en base de données.' });
        }

        const foundUser = userResult[0];

        // Sécurité: Ne pas renvoyer le hash du mot de passe
        delete foundUser.password; 
        res.status(200).json({ user: foundUser });

    } catch (error) {
        console.error('Erreur lors de la récupération de /user/me:', error);
        res.status(500).json({ message: 'Erreur serveur interne.' });
    }
};

/**
 * @description Connexion de l'utilisateur.
 */
export const login = async (req, res) => {
    const { email, password } = req.body; 

    try {
        const users = await user.getUserByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Identifiants invalides (Email incorrect).' });
        }

        const foundUser = users[0];
        
        // Comparer le mot de passe fourni avec le hash stocké
        const isPasswordValid = bcrypt.compareSync(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides (Mot de passe incorrect).' });
        }

        // Créer un jeton JWT
        const token = jwt.sign(
            { id: foundUser.id, ref: foundUser.ref, email: foundUser.email, role: foundUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Sécurité: Nettoyer l'objet utilisateur avant de l'envoyer
        delete foundUser.password;

        res.status(200).json({ 
            message: 'Connexion réussie', 
            token: token,
            user: foundUser 
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la connexion.' });
    }
}

/**
 * @description Récupère tous les utilisateurs.
 */
export const allUsers = async (req, res) => {
    try {
        const users = await user.getAllUsers();
        // Optionnel: nettoyer les mots de passe avant d'envoyer
        const safeUsers = users.map(u => {
            delete u.password;
            return u;
        });
        res.json({ users: safeUsers });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
    }
}

/**
 * @description Récupère un utilisateur par ID interne.
 */
export const getUserFromId = async (req, res) => {
    const id = req.params.id;
    try {
        const userResult = await user.getUserFromId(id);
        if (userResult.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        delete userResult[0].password;
        res.json({ user: userResult[0] });
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'utilisateur.' });
    }
}

// -----------------------------------------------------------
// CRÉATION (CREATE) et SUPPRESSION (DELETE)
// -----------------------------------------------------------

/**
 * @description Inscription d'un nouvel utilisateur.
 */
export const signup = async (req, res) => {
    const { firstname, lastname, email, password, phone, role, plan } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const now = Date.now();
    const year = new Date().getFullYear();
    const ref = `USER-${year}-${now}`;

    console.log("controller data: ", ref, firstname, lastname, email, password, phone, role, plan, date)

    try {
        const existingUsers = await user.getUserByEmail(email);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
        }

        const result = await user.newUser(ref, firstname, lastname, email, password, phone, role || 'user', plan, date);
        const newUserCreated = result[0];
        delete newUserCreated.password; // Nettoyer avant d'envoyer

        res.status(201).json({ 
            message: 'Utilisateur créé avec succès', 
            user: newUserCreated 
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la création du compte.' });
    }
}

/**
 * @description Supprime un utilisateur.
 */
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await user.deleteUserById(id);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès.' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'utilisateur.' });
    }
}

// -----------------------------------------------------------
// MISE À JOUR (UPDATE)
// -----------------------------------------------------------

/**
 * @description Mise à jour générique de l'utilisateur (nom, email, téléphone).
 */
export const updateUserGeneric = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, email, phone } = req.body;
    
    // Vérification basique des champs requis pour cette mise à jour
    if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ error: 'Tous les champs (firstName, lastName, email, phone) sont requis pour cette mise à jour.' });
    }
    
    try {
        const result = await user.updateUserById(id, firstName, lastName, email, phone);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé ou aucune modification effectuée.' });
        }
        delete result[0].password;
        res.json({ message: 'Utilisateur mis à jour avec succès.', user: result[0] });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.' });
    }
}

/**
 * @description Met à jour le mot de passe d'un utilisateur.
 */
export const updateUserPassword = async (req, res) => {
    const id = req.params.id;
    const { newPassword } = req.body;
    
    if (!newPassword) {
        return res.status(400).json({ error: 'Le nouveau mot de passe est requis.' });
    }

    try {
        // Hacher le nouveau mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        const result = await user.updatePassword(id, hashedPassword);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé ou aucune modification effectuée.' });
        }
        delete result[0].password;
        res.json({ message: 'Mot de passe mis à jour avec succès.', user: result[0] });
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du mot de passe.' });
    }
}

/**
 * @description Met à jour le rôle d'un utilisateur.
 */
export const updateUserRole = async (req, res) => {
    const id = req.params.id;
    const { newRole } = req.body;
        try {
            const result = await user.updateRole(id, newRole);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé ou aucune modification effectuée.' });
            }
            delete result[0].password;
            res.json({ message: 'Rôle mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du rôle:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du rôle' });
        }
}

/**
 * @description Met à jour l'email d'un utilisateur.
 */
export const updateUserEmail = async (req, res) => {
    const id = req.params.id;
    const { newEmail } = req.body;
        try {
            const result = await user.updateEmail(id, newEmail);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé ou aucune modification effectuée.' });
            }
            delete result[0].password;
            res.json({ message: 'Email mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour de l\'email:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de l\'email' });
        }
}

/**
 * @description Met à jour le téléphone d'un utilisateur.
 */
export const updateUserPhone = async (req, res) => {
    const id = req.params.id;
    const { newPhone } = req.body;
        try {
            const result = await user.updatePhone(id, newPhone);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé ou aucune modification effectuée.' });
            }
            delete result[0].password;
            res.json({ message: 'Téléphone mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du téléphone:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du téléphone' });
        }
}

/**
 * @description Met à jour le prénom et le nom d'un utilisateur.
 */
export const updateUserName = async (req, res) => {
    const id = req.params.id;
    const { newFirstName, newLastName } = req.body;
        try {
            const result = await user.updateName(id, newFirstName, newLastName);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé ou aucune modification effectuée.' });
            }
            delete result[0].password;
            res.json({ message: 'Nom mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du nom:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du nom' });
        }
}

/**
 * @description Met à jour le plan d'abonnement d'un utilisateur.
 */
export const updateUserPlan = async (req, res) => {
    const id = req.params.id;
    const { newPlan } = req.body;
        try {
            const result = await user.updatePlan(id, newPlan);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé ou aucune modification effectuée.' });
            }
            delete result[0].password;
            res.json({ message: 'Plan mis à jour avec succès.', user: result[0] });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du plan:', error);
            res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du plan' });
        }
}