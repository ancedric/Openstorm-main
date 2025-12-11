import {supabase} from '../config/supabase.service.js';

const TABLE_NAME = 'shops';

// --- Création de table gérée par Supabase directement ---
// export const createShopsTable = ...

/**
 * Crée une nouvelle boutique.
 */
export const newShop = async (ref, userRef, name, activity, openingHour, closeHour, country, city, remainingactivationtime, image, date) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([
                { 
                    ref, userref: userRef, name, activity, openinghour: openingHour, closehour: closeHour, country, city, remainingactivationtime, image, createdat: date 
                }
            ])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la création de la boutique:", error);
        throw error;
    }
}

export const getAllShops = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la récupération des boutiques:", error);
        throw error;
    }
}

export const getShopByUserRef = async (userRef) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('userref', userRef); // Attention à la casse de la colonne dans Supabase (userRef vs userref)

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la récupération de la boutique par UserRef:", error);
        throw error;
    }
}

export const getShopFromId = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .limit(1);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la récupération de la boutique par ID:", error);
        throw error;
    }
}

export const deleteShop = async (id) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la suppression de la boutique:", error);
        throw error;
    }
}

export const updateShop = async (id, name, activity, country, city, image) => {
    try {
        // Construction dynamique de l'objet de mise à jour pour éviter d'écraser l'image avec null si elle n'est pas fournie
        const updateData = { name, activity, country, city };
        if (image) updateData.image = image;

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase lors de la mise à jour globale de la boutique:", error);
        throw error;
    }
}

export const updateName = async (id, newName) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ name: newName })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateName:", error);
        throw error;
    }
}

export const updateActivity = async (id, newActivity) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ activity: newActivity })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateActivity:", error);
        throw error;
    }
}

export const updateImage = async (id, newImage) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ image: newImage })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateImage:", error);
        throw error;
    }
}

export const updateOpeningHour = async (id, newOpeningHour) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ openingHour: newOpeningHour })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateOpeningHour:", error);
        throw error;
    }
}

export const updateCloseHour = async (id, newCloseHour) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ closeHour: newCloseHour })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateCloseHour:", error);
        throw error;
    }
}

export const updateCash = async (id, newCash) => {
    console.log('shop datas: ', id, newCash)
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ cash: newCash })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateCash:", error);
        throw error;
    }
}

export const updateRemainingActivationTime = async (id, plan) => {
    try {        
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ remainingactivationtime: plan }) 
            .eq('ref', id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateRemainingActivationTime:", error);
        throw error;
    }
}

export const updateSubscriptionState = async (shopRef, newRemainingDays, lastUpdateTime) => {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ 
                remainingactivationtime: newRemainingDays,
                last_update_time: lastUpdateTime
            })
            .eq('ref', shopRef)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur Supabase updateSubscriptionState:", error);
        throw error;
    }
}