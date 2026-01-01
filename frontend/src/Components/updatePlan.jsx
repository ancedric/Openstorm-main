import { useState } from 'react';
import useAuth from '../Authentication/Context/useAuth';
import supabase from '../supabase.config';
import './forms/shopSetupForm/style.css'

const UpdatePlan = () => {
    const { user, shop } = useAuth();
    const [isSent, setIsSent] = useState(false);
    const [file, setFile] = useState(null)
    const [newPlan, setNewPlan ] = useState(null)

    const handleImageUpload = (event) => {
      setFile(event.target.files[0]);
    };
    const handlePlanChange = (e) =>{
        setNewPlan(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return console.error("Aucun fichier sélectionné");

        try {
            //On met d'abord à jour le plan de l'utilisateur
            // eslint-disable-next-line no-unused-vars
            const {data, error } = await supabase
                .from('users')
                .update({plan: newPlan})
                .eq({ref: user.ref})
                .select()

                if(error) throw error
 
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
                        userplan: newPlan,
                        capture: captureUrl
                    }
                ])
                .select();

            if (insertError) throw insertError;

            console.log('Renouvellement enregistré avec succès:', insertData);
            
        } catch (error) {
            console.error('Erreur lors du processus Supabase:', error.message);
        } finally {
            setIsSent(true);
        }
    };

    if (!user) return null;

  return (
    <div>
        <p>Vous ne pouvez pas renouveler le plan gratuit!</p>
        <h3>Choisissez un plan</h3>

        <div className="form-body">
                {!isSent ? (
                    <form onSubmit={handleSubmit}>
                        <div className="help">
                            <h3>How to proceed?</h3>
                            <p>1. Choisissez un nouveau plan</p>
                            <p>2. Faites votre paiement par Orange Money ou Mobile Money aux développeurs (655583365/652653438) au Cameroun</p>
                            <p>3. Joignez la capture au formulaire ci-dessous</p>
                            <p>{'4. Cliquez sur le bouton "Request for Renewal"'}</p>
                            <p>5. Patientez! Votre boutique sera rapidement réactivée</p>
                        </div>
                        
                        <div className="left">
                            <label htmlFor="plan">{'Chioisissez un nouveau plan)'}</label>
                            <select 
                                name="plan"
                                onChange={handlePlanChange}
                            >
                                <option value="month">Month - 5 000 FCFA/mois</option>
                                <option value="biannual">Biannual - 25 000 FCFA/6 mois</option>
                                <option value="annual">Annual - 45 000 FCFA/an</option>
                            </select>
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
                        </div>
                    </form>
                ) : (
                    <>
                        <h3>THANK YOU FOR RENEWAL</h3>
                        <p>Your shop will be reactivated shortly. Please wait</p>
                    </>
                )    
            }
        </div>
    </div>
  )
}

export default UpdatePlan