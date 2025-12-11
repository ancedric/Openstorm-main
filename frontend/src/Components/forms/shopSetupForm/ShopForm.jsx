import { useState } from 'react';
import useAuth from '../../../Authentication/Context/useAuth';
import api from '../../../axiosConfig';
import {shopValidation} from '../../../Authentication/validation';
import './style.css'
import FileUploader from '../../FileUploader';
import PropTypes from 'prop-types';
import Toast from '../../toast';

const ShopSetupForm = ({close}) => {
    const { user, completeShopSetup, fetchShop } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const [error, setError] = useState({})
    const [shopImage, setShopImage] = useState(null);
    const [activation, setActivation] = useState(0);
    const [formData, setFormData] = useState({
        userRef: user.ref,
        shopname: '',
        activity: '',
        openingHour: '',
        closeHour:'',
        country: '',
        city: '',
        remainingactivationtime: activation,
        image: ''
    })

    if(user.plan === 'annual'){
        setActivation(360)
    }else if(user.plan === 'monthly'){
        setActivation(30)
    }else if(user.plan === 'biannual'){
        setActivation(180)
    }else{
        setActivation(7)
    }
    const handleFileChange = (file) => {
        setShopImage(file);
    };
    const handleChange = (event) => {
        setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = shopValidation(formData);
        setError(validationErrors);
        // VÉRIFIER LES ERREURS DE VALIDATION AVANT DE CONTINUER
        if (Object.keys(validationErrors).shopname==="" && Object.keys(validationErrors).activity==="") {
            setToast({message: "Veuillez corriger les erreurs du formulaire.", type: "error", visible: true});
            return;
        }

        setLoading(true);

        try {
            // 1. CRÉER UN NOUVEL OBJET FORM DATA
            const dataToSend = new FormData();
            
            // 2. AJOUTER TOUTES LES DONNÉES DE L'ÉTAT React
            Object.keys(formData).forEach(key => {
                // On ignore l'ancienne clé 'image' de l'état, car elle est gérée séparément
                if (key !== 'image') { 
                    dataToSend.append(key, formData[key]);
                }
            });

            // 3. AJOUTER LE FICHIER À PARTIR DE 'shopImage'
            if (shopImage) {
                dataToSend.append('image', shopImage); // Le deuxième argument est l'objet File
            } else {
                // Gérer le cas où l'image est requise mais manquante
                // dataToSend.append('image', null); // ou une autre valeur par défaut si nécessaire
            }

            const newShop = await api.post(`/shops/new-shop`, dataToSend, {
                headers: { 
                }
            });

            if (newShop) {
                completeShopSetup(newShop.data);
                fetchShop(user.ref)
                close();
                setToast({message:"Boutique créée avec succès!", type:"success", visible: true});
            }
        } catch (error) {
            console.error('Erreur lors de la création de la boutique:', error.response?.data || error.message);
            setToast({message:"Échec de la création de la boutique. Veuillez réessayer.", type:"error", visible: true}); 
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="shop-form-ctn">
            <div className="form-header">
                <h2 className="message">Welcome {user.firstname}!! Set up your shop !</h2>
                <p className="">
                    {'It seems like it\'s your first connexion. Let\'s set up your shop before continuing.'}
                </p>
            </div>
            <div className="form-body">
                <form onSubmit={handleSubmit}>
                    <div className="left">
                        <h3>Shop identity</h3>
                        <label htmlFor="shopname" className="">Shop name</label>
                        <input
                            type="text"
                            name="shopname"
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                        {error.shopName && <div className='danger'>{error.name}<br/></div>}
                        <label htmlFor="activity" className="">Activity sector</label>
                        <select
                            name="activity"
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            **<option value="" disabled selected>Select an activity sector</option>**
                            <option value="shopping">shopping</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Library">Library</option>
                            <option value="Interior design">Interior design</option>
                            <option value="Flower & nature">Flower & nature</option>
                            <option value="Services">Services</option>
                            <option value="Hair style">Hair style</option>
                            <option value="Cosmetics & esthetics">Cosmetics & esthetics</option>
                            <option value="Computers & It">Computers & It</option>
                            <option value="Mobile phones & accesories">Mobile phones & accesories</option>
                            <option value="cars & motors">cars & motors</option>
                            <option value="antiquitiest">antiquities</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Japan">Jewels</option>
                            <option value="Fast food">Fast food</option>
                            <option value="Real estate">Real estate</option>
                            <option value="Building & construction material">Building & construction material</option>
                            <option value="QaWood industrytar">Wood industry</option>
                            <option value="Health & medical care">Health & medical care</option>
                            <option value="Food & fruits">Food & fruits</option>
                            <option value="Meet & fish">Meet & fish</option>
                            <option value="Sport accessories">Sport accessories</option>
                        </select>
                        {error.activity && <div className='danger'>{error.activity}<br/></div>}
                        <label htmlFor="country" className="">Country</label>
                        <select
                            name="country"
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            **<option value="" disabled selected>Select your country</option>**
                            <option value="Algeria">Algeria</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="China">China</option>
                            <option value="Egypt">Egypt</option>
                            <option value="France">France</option>
                            <option value="Germany">Germany</option>
                            <option value="Ivory Coast">Ivory Coast</option>
                            <option value="Italy">Italy</option>
                            <option value="Japan">Japan</option>
                            <option value="Korea">Korea</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="South Africa">South Africa</option>
                            <option value="AUnited Kingdom">AUnited Kingdom</option>
                            <option value="United States">United States</option>
                        </select>
                        {error.country && <div className='danger'>{error.country}<br/></div>}
                        <label htmlFor="city" className="">City</label>
                        <input
                            type="text"
                            name="city"
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                        {error.city && <div className='danger'>{error.city}<br/></div>}
                    </div>
                    <div className="middle">
                        <h3>Opening interval</h3>
                        <label htmlFor="openingHour" className="">opening hour</label>
                        <input
                            type="time"
                            name="openingHour"
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                        {error.openingHour && <div className='danger'>{error.openingHour}<br/></div>}
                        <label htmlFor="closeHour" className="">Close hour</label>
                        <input
                            type="time"
                            name="closeHour"
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                        {error.closeHour && <div className='danger'>{error.closeHour}<br/></div>}
                    </div>
                    <div className="right">
                        <h3>Shop brand</h3>
                        <FileUploader onFileChange={handleFileChange} />
                        <input
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                            value={loading ? 'Processing...' : 'Create my shop'}
                        />
                    </div>
                </form>
                {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
            </div>
        </div>
    );
};
ShopSetupForm.propTypes = {
    close: PropTypes.func.isRequired
}
export default ShopSetupForm;
