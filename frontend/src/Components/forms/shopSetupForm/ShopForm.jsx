import { useState, useEffect } from 'react';
import useAuth from '../../../Authentication/Context/useAuth';
import supabase from '../../../supabase.config';
import { shopValidation } from '../../../Authentication/validation';
import FileUploader from '../../FileUploader';
import './style.css'

const ShopSetupForm = () => {
    const { user, profile, setShop, fetchUserStores } = useAuth();
    const [loading, setLoading] = useState(false);
    const [shopImage, setShopImage] = useState(null);
    const [linkToCompany, setLinkToCompany] = useState(false);

    const [formData, setFormData] = useState({
        ref: '',
        userRef: user?.userref || '',
        shopname: '',
        activity: '',
        openingHour: '',
        closeHour: '',
        country: '',
        city: '',
        remainingactivationtime: 7,
        image: ''
    });

    // INITIALISATION UNIQUE (Au montage du composant)
    useEffect(() => {
        if (user) {
            // 1. Calcul de l'activation selon le plan
            let activationDays = 7;
            if (user.plan === 'annual') activationDays = 360;
            else if (user.plan === 'monthly') activationDays = 30;
            else if (user.plan === 'biannual') activationDays = 180;

            // 2. Génération de la REF unique
            const now = Date.now();
            const year = new Date().getFullYear();
            const generatedRef = `SHOP-${year}-${now}`;

            setFormData(prev => ({
                ...prev,
                ref: generatedRef,
                userRef: user.ref,
                remainingactivationtime: activationDays
            }));
        }
    }, [user]);

    const handleFileChange = (file) => setShopImage(file);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        const validationErrors = shopValidation(formData);
        console.log('Validation Errors:', validationErrors);
        if (validationErrors.activity !== "" || validationErrors.city !== "" || validationErrors.country !== "" || validationErrors.shopname !== "" || validationErrors.openingHour !== "" || validationErrors.closeHour !== "") {
            console.log('Validator keys:', Object.keys(validationErrors).length)
            return;
        }

        setLoading(true);
        console.log('Données soumises:', formData, 'Image:', shopImage, 'Liaison entreprise:', linkToCompany);
        try {
            let imageUrl = '';

            // 1. UPLOAD DE L'IMAGE (Si présente)
            if (shopImage) {
                const fileExt = shopImage.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `shops/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('stores_logo')
                    .upload(filePath, shopImage);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('stores_logo')
                    .getPublicUrl(filePath);
                
                imageUrl = urlData.publicUrl;
            }

            // 2. INSERTION DANS LA TABLE SHOPS
            const { data, error: insertError } = await supabase
                .from('inventory_stores')
                .insert([
                    {
                        ref: formData.ref,
                        owner_ref: user.userref,
                        store_name: formData.shopname,
                        activity: formData.activity,
                        opening_hour: formData.openingHour,
                        close_hour: formData.closeHour,
                        country: formData.country,
                        city: formData.city,
                        remainingactivationtime: formData.remainingactivationtime,
                        imageUrl: imageUrl,
                        // LIAISON OPTIONNELLE À L'ENTREPRISE
                        companyref: (linkToCompany && profile) ? profile.companyref : null
                    }
                ])
                .select();

            if (insertError) throw insertError;

            if (data) {
                await setShop(data[0]);
                await fetchUserStores(user.userref);
                setTimeout(() => close(), 1500); // Ferme après un court délai
            }
        } catch (err) {
            console.error('Erreur:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shop-form-ctn">
            <div className="form-header">
                <h2>Configuration de votre boutique</h2>
                <p>Donnez une identité à votre nouveau point de vente.</p>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
                <div className="form-grid">
                    <div className="left">
                        <label>Nom de la boutique</label>
                        <input type="text" name="shopname" onChange={handleChange} required />
                        
                        <label>{'Secteur d\'activité'}</label>
                        <select name="activity" onChange={handleChange} required>
                            <option value="">Choisir...</option>
                            <option value="shopping">Shopping / Mode</option>
                            <option value="Restaurant">Restaurant / Café</option>
                            <option value="Electronics">Électronique</option>
                            <option value="Food & fruits">Alimentation</option>
                        </select>

                        {/* OPTION DE LIAISON À L'ENTREPRISE */}
                        {profile && (
                            <div className="company-link-card">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked={linkToCompany} 
                                        onChange={(e) => setLinkToCompany(e.target.checked)} 
                                    />
                                    {'Lier à l\'entreprise '}<strong>{profile.companyname}</strong>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="right">
                        <label>Pays</label>
                        <select
                            name="country"
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="" disabled selected>Choisir votre pays</option>
                            <option value="Algeria">Algeria</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="France">France</option>
                            <option value="Ivory Coast">Ivory Coast</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Senegal">Senegal</option>
                            <option value="United States">United States</option>
                        </select>
                        <label>Ville</label>
                        <input type="text" name="city" onChange={handleChange} required />
                        
                        <div className="hours-row">
                            <div>
                                <label>Ouverture</label>
                                <input type="time" name="openingHour" onChange={handleChange} />
                            </div>
                            <div>
                                <label>Fermeture</label>
                                <input type="time" name="closeHour" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="brand-upload">
                            <label>Logo / Image de la boutique</label>
                            <FileUploader onFileChange={handleFileChange} />
                        </div>
                    </div>
                </div>  

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Création en cours...' : 'Créer ma boutique'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShopSetupForm;