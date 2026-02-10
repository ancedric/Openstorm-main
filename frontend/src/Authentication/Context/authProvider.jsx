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
        Synchronisation avec OpenTask...
    </div>
);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [shop, setShop] = useState(null); 
    const [stores, setStores] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);

    /**
     * Récupère les infos de l'entreprise via la table 'employe'
     * en utilisant 'userref' comme pivot.
     */
    const fetchCompanyInfo = useCallback(async (userRef) => {
        if (!userRef) {
            setShop(null);
            setIsAppReady(true);
            return;
        }

        try {
            // Jointure : on cherche l'employé et on récupère les infos de sa company
            const { data: employeData, error } = await supabase
                .from('employe')
                .select(`
                    companyref,
                    company:companyref(*) 
                `)
                .eq('userref', userRef)
                .single();
            if (error) throw error

            if (employeData && employeData.company) {
                // Mapping pour que le reste de ton app React ne change pas
                // On transforme l'objet 'company' en objet 'shop'
                const companyAsShop = {
                    ...employeData.company,
                    ref: employeData.companyref, // On injecte la ref pour tes requêtes stock
                    name: employeData.company.companyname // Ajuste selon le nom réel dans ta table company
                };
                
                setShop(companyAsShop);
                console.log("Module Stock : Entreprise chargée", companyAsShop.name);
            } else {
                console.warn("Aucune entreprise trouvée pour cet utilisateur.");
                setShop(null);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'entreprise:", error);
        } finally {
            setIsAppReady(true);
        }
    }, []);

    /**
     * Vérifie si une session existe dans le localStorage (déposée par l'ERP Vue)
     */
    const checkAuthStatus = useCallback(async () => {
        const storedData = localStorage.getItem('user');
        
        if (storedData) {
            try {
                const session = JSON.parse(storedData); // session contient { user, employe, company }
                
                // 1. On remplit l'utilisateur
                setUser(session.user);
                setProfile(session.employe);
                setStores(session.stores || []);
                
                setIsAuthenticated(true);
                

                // 2. On remplit l'entreprise (Shop) directement depuis la session Vue
                if (session.company) {
                    setShop({
                        ...session.company,
                        ref: session.company.companyref,
                        name: session.company.companyname
                    });
                } else if (session.employe) {
                    // Si la company n'est pas dans l'objet principal mais la ref est dans l'employé
                    // On pourrait faire un fetch ici, mais normalement ton ERP Vue 
                    // a déjà tout chargé lors de l'authentification.
                    console.log("Company non présente, passage par l'employé...");
                }

                setIsAppReady(true);
                
            } catch (e) {
                console.error("Erreur de lecture de la session Vue:", e);
                setIsAppReady(true);
            }
        } else {
            setIsAppReady(true);
        }
    }, []);

    // Initialisation au montage
    useEffect(() => {
        checkAuthStatus();
        console.log("user from context:", user)
        console.log('profile from context:', profile)
    }, [checkAuthStatus]);

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
        stores,
        isAuthenticated, 
        isAppReady, 
        signOut, 
        fetch: fetchCompanyInfo // Alias pour éviter de casser tes imports ailleurs
    };

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