/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from 'react';
import supabase from '../../supabase.config';
import AuthContext from './authContext';
import PropTypes from 'prop-types';

const LoadingScreen = () => (
    <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        height: '100vh', fontSize: '1.2rem', color: '#4f46e5', fontFamily: 'sans-serif' 
    }}>
        Synchronisation avec le serveur...
    </div>
);

const getUrlUserRef = () => {
    const pathSegments = window.location.pathname.split('/');
    // On prend le premier segment s'il n'est pas 'auth' ou vide
    return (pathSegments[1] && pathSegments[1] !== 'auth') ? pathSegments[1] : null;
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [shop, setShop] = useState(null); 
    const [stores, setStores] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);

    /**
     * Récupère les magasins associés à un utilisateur donné et vérifie s'il possède une entreprise (via la table employe).,
     * en utilisant 'userref' comme pivot.
     */
    const fetchUserStores = useCallback(async (userRef) => {
        if (!userRef) return;
        try {
            const { data: storesData } = await supabase
                .from('inventory_stores')
                .select('*')
                .eq('owner_ref', userRef);
            
            setStores(storesData || []);

            const {data:userData} = await supabase
                .from('user')
                .select('*')
                .eq('userref', userRef)
                .single();

            if (userData) {
                setUser(userData);
            }

            const { data: employeData } = await supabase
                .from('employe')
                .select('*, company:companyref(*)') // On récupère TOUT l'employé + la company
                .eq('userref', userRef)
                .single();

            if (employeData) {
                setProfile(employeData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Erreur sync:", error);
        } finally {
            setIsAppReady(true);
        }
    }, []);

    const checkAuthStatus = useCallback(async () => {
        const urlUserRef = getUrlUserRef();
        const storedData = localStorage.getItem('user');
        
        if (storedData) {
            try {
                const session = JSON.parse(storedData);
                if (!urlUserRef || session.user.id === urlUserRef) {
                    setUser(session.user);
                    setProfile(session.employe);
                    setStores(session.stores || []);
                    setIsAuthenticated(true);
                    setIsAppReady(true);
                    return;
                }
            } catch (e) {
                console.error("Erreur session locale", e);
            }
        }

        if (urlUserRef) {
            await fetchUserStores(urlUserRef);
        } else {
            setIsAppReady(true);
        }
    }, [fetchUserStores]);

    // INITIALISATION : Une seule fois au montage
    useEffect(() => {
        checkAuthStatus();
    }, [])

    // Écouter les changements de localStorage (au cas où l'utilisateur se déconnecte de l'ERP)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'user' && !e.newValue) {
                signOut();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const signOut = useCallback(() => {
        // On ne vide pas forcément tout le localStorage pour ne pas déconnecter l'ERP,
        // on réinitialise juste l'état local du module.
        setUser(null);
        setProfile(null);
        setShop(null);
        setIsAuthenticated(false);
        setIsAppReady(true);
    }, []);

    const value = { 
        user, 
        profile, 
        shop, 
        setShop,
        stores,
        isAuthenticated, 
        isAppReady, 
        signOut, 
        fetchUserStores,
        setProfile
    };

    if (isAppReady=== false) {
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