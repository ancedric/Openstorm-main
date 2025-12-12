import {supabase} from '../config/supabase.service.js'; // Importation du client Supabase
import bcrypt from 'bcryptjs';

const TABLE_NAME = 'users';

// --- LOGIQUE DE CRÉATION DE TABLE RETIRÉE ---
// La création de la table est gérée par Supabase.
// export const createUsersTable = async () => { ... }


export const newUser = async (ref, firstName, lastName, email, password, phone, role, plan, date) => {
    console.log("datas: ", ref, firstName, lastName, email, password, phone, role, plan, date)
    // Hasher le mot de passe avant de le stocker
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([
                { ref, firstname: firstName, lastname: lastName, email, password: hashedPassword, phone, role, plan, createdat: date }
            ])
            .select(); // On utilise .select() pour retourner les données insérées

        if (error) throw error;
        return data;

    } catch (error) {
        console.error("Erreur Supabase lors de l'insertion d'un nouvel utilisateur:", error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*'); 

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
};

export const findUserByRef = async (ref) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('ref', ref)
            .limit(1);

        if (error) throw error;
        return data; // Tableau contenant l'utilisateur ou vide
    } catch (error) {
        console.error("Erreur Supabase lors de la recherche par réf:", error);
        throw error;
    }
};

export const getUserByEmail = async (email) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('email', email)
            .limit(1);

        if (error) throw error;
        return data; // Tableau contenant l'utilisateur ou vide
    } catch (error) {
        console.error("Erreur Supabase lors de la recherche par email:", error);
        throw error;
    }
};

export const getUserFromId = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .limit(1);

        if (error) throw error;
        return data; // Tableau contenant l'utilisateur ou vide
    } catch (error) {
        console.error("Erreur Supabase lors de la recherche par ID:", error);
        throw error;
    }
};

export const deleteUserById = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id)
            .select(); // Retourne l'enregistrement supprimé

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la suppression par ID:", error);
        throw error;
    }
};

export const updateUserById = async (id, firstName, lastName, email, phone) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ firstName, lastName, email, phone })
            .eq('ref', id) // J'assume ici que 'id' est en fait le 'ref' comme dans l'ancienne requête
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la mise à jour de l'utilisateur:", error);
        throw error;
    }
};

export const updatePassword = async (id, newPassword) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ password: hashedPassword })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la mise à jour du mot de passe:", error);
        throw error;
    }
};

export const updateRole = async (id, newRole) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ role: newRole })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la mise à jour du rôle:", error);
        throw error;
    }
};

export const updateEmail = async (id, newEmail) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ email: newEmail })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la mise à jour de l'email:", error);
        throw error;
    }
};

export const updatePhone = async (id, newPhone) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ phone: newPhone })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la mise à jour du téléphone:", error);
        throw error;
    }
};

export const updateName = async (id, newFirstName, newLastName) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ firstName: newFirstName, lastName: newLastName })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la mise à jour du nom:", error);
        throw error;
    }
};

export const updatePlan = async (id, newPlan) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ plan: newPlan })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la mise à jour du plan:", error);
        throw error;
    }
};