import { useState } from 'react';
import useAuth from '../../../Authentication/Context/useAuth';
import supabase from '../../../supabase.config';
import '../shopSetupForm/style.css'
import PropTypes from 'prop-types';
import UpdatePlan from '../../updatePlan'

const RenewalForm = () => {
    const { user, shop } = useAuth();
    const [isSent, setIsSent] = useState(false);
    const [file, setFile] = useState(null)

    const handleImageUpload = (event) => {
      setFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        console.log('user plan: ', user.plan)
        
        e.preventDefault()
        const formData = new FormData();
        formData.append("shopRef", shop.ref);
        formData.append("userPlan", user.plan);
        formData.append("capture", file);

        console.log('data: ', formData)
        try {
            /*const res = await api.post(`/renewals/new-renewal`, formData,{
            headers: { }
          })*/
            //On enregistre le fichier
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `renewals/${shop.ref}/${fileName}`;

            // 2. Uploader l'image dans le bucket Supabase
            // eslint-disable-next-line no-unused-vars
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(import.meta.env.VITE_STORAGE_BUCKET_NAME)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 3. Récupérer l'URL publique de l'image (optionnel, selon votre besoin)
            const { data: urlData } = supabase.storage
                .from(import.meta.env.VITE_STORAGE_BUCKET_NAME)
                .getPublicUrl(filePath);

            const captureUrl = urlData.publicUrl;

            // 4. Insérer les données dans la table 'renewals'
            const { data: insertData, error: insertError } = await supabase
                .from('renewals')
                .insert([
                    {
                        shopref: shop.ref,
                        userplan: user.plan,
                        capture: captureUrl
                    }
                ])
                .select();

            if (insertError) throw insertError;
            const res = insertData
          if(res){
            console.log('ajout réussi:', res)
          }
          else{
            console.log('Echec du renouvellement de la boutique')
          }
        } catch (error) {
            console.error('Erreur lors de l\'envoie du renouvellement du plan:', error.response?.data || error.message);
        } finally {
            setIsSent(true);
        }
    };

    if (!user) return null;

    return (
        <div className="shop-form-ctn">
            <div className="form-header">
                <h2 className="message">Sorry! Your shop access plan has expired!</h2>
                <p className="">
                    {'Renew your plan'}
                </p>
            </div>
            <div className="form-body">
                {!isSent ? (<form onSubmit={handleSubmit}>
                    {
                         user.plan === 'free' ? 
                        (<UpdatePlan/>)
                        : (
                        <> <div className="help">
                                <h3>How to proceed?</h3>
                                <p>1. Faites votre paiement par Orange Money ou Mobile Money aux développeurs (655583365/652653438) au Cameroun</p>
                                <p>2. Joignez la capture au formulaire ci-dessous</p>
                                <p>{'3. Cliquez sur le bouton "Request for Renewal"'}</p>
                                <p>4. Patientez! Votre boutique sera rapidement réactivée</p>
                            </div>
                            
                            <div className="left">
                                <label htmlFor="capture">{'Joignez la capture d\'écran de votre paiement (Orange Money/Mobile Money)'}</label>
                                <input 
                                    type="file" 
                                    name="capture"
                                    onChange={handleImageUpload}
                                />
                                <input
                                    type="submit"
                                    className="submit-btn"
                                    value='Request For renewal'
                                />
                            </div>
                            <div className="right">
                                {file && (
                                    <div className="file-preview">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        height={220}
                                        width={220}
                                        alt="uploaded-file"
                                    />
                                    </div>
                                )}
                            </div></>   
                        )
                    }
                    
                    
                </form>) 
                : (
                    <>
                        <h3>THANK YOU FOR RENEWAL</h3>
                        <p>Your shop will be reactivated shortly. Please wait</p>
                    </>
                )    
            }
            </div>
        </div>
    );
};
RenewalForm.propTypes = {
    close: PropTypes.func.isRequired
}
export default RenewalForm;
