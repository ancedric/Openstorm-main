/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import api from '../../axiosConfig';
import AuthContext from './AuthContext';
import PropTypes from 'prop-types';

// Constante pour 24 heures en millisecondes
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Composant de chargement simple pour l'attente
const LoadingScreen = () => (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        fontSize: '1.5rem',
        color: '#4f46e5' 
    }}>
        Chargement de la session...
    </div>
);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [shop, setShop] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // showShopSetup commence à false, il sera mis à jour par fetchShop
    const [showShopSetup, setShowShopSetup] = useState(false); 
    // Nouveau: Indique que la vérification initiale (auth + shop) est terminée
    const [isAppReady, setIsAppReady] = useState(false); 


    /**
     * @description Met à jour le temps d'activation restant et l'heure de la dernière mise à jour côté serveur.
     */
    const updateSubscriptionState = useCallback(async (shopRef, newRemainingDays) => {
        console.log("DEBUG: Mise à jour:", shopRef, newRemainingDays)
        try {
            console.log("DEBUG: Vérification de l'état d'activation de la boutique")
            const response = await api.put(`/shops/update-subscription-state/${shopRef}`, {
                remainingActivationTime: newRemainingDays, 
                last_update_time: new Date().toISOString() 
            });

            if (response.data && response.data.shop) {
                // Mettre à jour l'état local avec la nouvelle boutique renvoyée par le serveur
                setShop(response.data.shop);
                return response.data.shop;
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'état de l'abonnement:", error);
            // Si l'erreur est critique (ex: 404), vous pourriez vouloir déconnecter l'utilisateur
        }
        return null;
    }, []);

    /**
     * @description Vérifie l'expiration de l'abonnement et le décrémente si nécessaire.
     */
    const checkAndDecrementSubscription = useCallback(async (currentShop) => {
        if (!currentShop || currentShop.remainingactivationtime === undefined) return;

        const { remainingactivationtime, last_update_time, ref } = currentShop;

        // Si c'est un nouvel utilisateur ou si le temps restant est > 0, on continue
        if (remainingactivationtime === null || remainingactivationtime > 0) {
            
            // 1. Calculer la différence de temps depuis la dernière mise à jour
            const lastUpdate = last_update_time ? new Date(last_update_time).getTime() : Date.now();
            const now = Date.now();
            const timeDiff = now - lastUpdate;
            const daysPassed = Math.floor(timeDiff / DAY_IN_MS);

            // Si au moins un jour s'est écoulé
            if (daysPassed >= 1) {
                const newRemainingDays = Math.max(0, remainingactivationtime - daysPassed);
                
                // Mettre à jour l'état côté serveur
                return await updateSubscriptionState(ref, newRemainingDays);
            }
        }
        return currentShop;

    }, [updateSubscriptionState]);

    /**
     * @description Récupère les informations de la boutique de l'utilisateur.
     * C'est ici qu'on gère le setShop et le setShowShopSetup.
     */
    const fetchShop = useCallback(async (userRef, shouldSetAppReady = true) => {
        try {
            const response = await api.get(`/shops/get-user-shop/${userRef}`);
            const shopData = response.data;

            if (shopData) {
                // Boutique trouvée
                const currentShop = shopData;
                
                // Vérifier et décrémenter l'abonnement immédiatement
                const updatedShop = await checkAndDecrementSubscription(currentShop);

                setShop(updatedShop || currentShop);
                setShowShopSetup(false);
            } else {
                // Aucune boutique trouvée: Afficher le formulaire de configuration
                console.log("DEBUG: Aucune boutique trouvée. Affichage du ShopSetupForm.");
                setShop(null); // S'assurer que shop est null
                setShowShopSetup(true);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la boutique:", error);
            // En cas d'erreur API, on suppose qu'il n'y a pas de boutique et on affiche le setup
            setShop(null);
            setShowShopSetup(true);
        } finally {
            if (shouldSetAppReady) {
                // C'est la ligne CRUCIALE: Elle indique que la vérification initiale est terminée
                setIsAppReady(true); 
            }
        }
    }, [checkAndDecrementSubscription]);

    const signIn = useCallback(async (email, password) => {
        try {
            // 1. Appel API pour la connexion
            const response = await api.post('/user/login', { email, password });

            // 2. Récupérer le token et les données utilisateur
            const { token, user: userData } = response.data; 

            if (token && userData) {
                // Stocker le token dans localStorage et mettre à jour l'instance axios
                localStorage.setItem('authToken', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Mettre à jour les états user et profile DIRECTEMENT
                setUser(userData);
                setProfile(userData); // Remplacement de fetchProfile
                setIsAuthenticated(true);
                
                // Charger la boutique associée
                await fetchShop(userData.ref);

                return { success: true };
            }
            return { success: false, message: "Informations d'authentification incomplètes." };

        } catch (error) {
            console.error("Erreur lors de la connexion:", error.response?.data?.message || error.message);
            // Nettoyage en cas d'échec
            localStorage.removeItem('authToken');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setProfile(null);
            setIsAuthenticated(false);
            setShop(null);
            return { success: false, message: error.response?.data?.message || "Erreur de connexion inconnue." };
        }
    }, [fetchShop]);

    const signOut = useCallback(() => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setProfile(null);
        setShop(null);
        setIsAuthenticated(false);
        setShowShopSetup(false);
        setIsAppReady(true); // L'application est prête dans l'état déconnecté
    }, []);

    const checkAuthStatus = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                // Utiliser une route pour valider le token et obtenir les données utilisateur
                const response = await api.get('/user/me'); // Assumons que cette route existe
                const userData = response.data.user;

                if (userData) {
                    setUser(userData);
                    setProfile(userData);
                    setIsAuthenticated(true);
                    await fetchShop(userData.ref);
                } else {
                    throw new Error("Données utilisateur invalides.");
                }
            } catch (error) {
                console.error("Échec de la vérification initiale du token:", error);
                signOut(); 
            }
        }
    }, [signOut, fetchShop]);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);
    // Hook d'initialisation au montage du composant pour la persistance de la session
    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Si un jeton existe, on le met pour les requêtes futures
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                try {
                    // Tenter de valider le jeton et de récupérer les infos de l'utilisateur
                    const response = await api.get('/user/verify-token');
                    const { user: userData } = response.data;
                    
                    setUser(userData);
                    setIsAuthenticated(true);
                    
                    // Récupérer le profil et la boutique (cette fonction gère aussi isAppReady)
                    const userRef = userData.ref;
                    if (userRef) {
                        await fetchShop(userRef);
                    } else {
                        setIsAppReady(true);
                    }
                    
                } catch (error) {
                    console.error("Échec de la vérification du jeton ou du chargement initial:", error);
                    // Jeton invalide ou expiré: déconnexion
                    signOut();
                }
            } else {
                // Pas de jeton: déconnecté et prêt à rendre l'UI
                setIsAppReady(true); 
            }
        };

        checkSession();
    }, [signOut, fetchShop]); 
    
    // Intervalle pour les sessions très longues: vérification toutes les 24h
    useEffect(() => {
        if (isAuthenticated && shop && shop.remainingactivationtime > 0) {
            // Utiliser l'objet shop le plus récent dans le callback
            const intervalId = setInterval(() => {
                checkAndDecrementSubscription(shop);
            }, DAY_IN_MS); 

            return () => clearInterval(intervalId);
        }
    }, [isAuthenticated, shop, checkAndDecrementSubscription]);


    const completeShopSetup = (newShopData) => {
        setShop(newShopData);
        setShowShopSetup(false);
        // Lancer la vérification immédiatement après la configuration initiale
        checkAndDecrementSubscription(newShopData);
    };

    const value = { 
        user, 
        profile, 
        shop, 
        isAuthenticated, 
        showShopSetup, 
        // Renommé isSubscriptionCheckDone en isAppReady pour plus de clarté
        isAppReady, 
        signIn, 
        signOut, 
        fetchShop,
        completeShopSetup 
    };

    // Afficher un écran de chargement tant que l'état initial n'est pas déterminé
    if (!isAppReady) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};
export default AuthProvider;