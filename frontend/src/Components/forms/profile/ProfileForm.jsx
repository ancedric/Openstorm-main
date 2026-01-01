import { useState } from 'react';
import { useParams } from 'react-router-dom'
import supabase from '../../../supabase.config'
import './style.css'

function ProfileForm() {
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const [file, setFile] = useState(null);
  const userRef = useParams()
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const handleImageUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInput = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
      setIsSubmitting(true)

      const datas = new FormData();
        datas.append("ref", userRef);
        datas.append("fistname", formData.firstname);
        datas.append("lastname", formData.lastname);
        datas.append("naemailme", formData.email);
        datas.append("phone", formData.phone);
        datas.append("image", file);
    try{
      const fileExt = datas.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `users/${fileName}`;

      // eslint-disable-next-line no-unused-vars
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(import.meta.env.VITE_STORAGE_BUCKET_NAME)
        .upload(filePath, datas.image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(import.meta.env.VITE_STORAGE_BUCKET_NAME)
          .getPublicUrl(filePath);

        const imageUrl = urlData.publicUrl;
      //await axios.post(`${baseURL}/user/update-user/${userRef}`, formData)
       const {data, error } = await supabase
       .from('users')
       .update([{
          firstname: datas.firstname,
          lastname: datas.lastname,
          email: datas.email,
          phone: datas.password,
          photo: imageUrl
      }])
      .select()
      if(error){
        console.error("Errur lors de lamise à jour de l'utilisateur")
        return
      }
      console.log('Utilsateur ', data.firstname, data.lastname, 'modifié avec succès!')
    }catch(err) {
      console.error(err);
      setIsSubmitting(false)
    }
  };

  return (
    <div className='profile-form-ctn'>
      <form onSubmit={handleSubmit}>
        <div className="form-group dash">
                  <label htmlFor="image">Add Profile Photo</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleImageUpload}
                  />
                  {file && (
                    <div className="file-preview">
                      <img
                        src={URL.createObjectURL(file)}
                        height={100}
                        width={110}
                        alt="uploaded-file"
                      />
                    </div>
                  )}
                </div>
        <div className='profile-form-group'>
          <label htmlFor="firstname">Update first name</label>
          <input
            type="text"
            name='firstname'
            className="form-control"
            value={formData.firstname}
            onChange={handleInput} />
        </div>
        <div className="profile-form-group">
          <label htmlFor="lastname">Update last name</label>
          <input
            type="text"
            name='lastname'
            className="form-control"
            value={formData.lastname}
            onChange={handleInput} />
        </div>
        <div className="profile-form-group">
          <label htmlFor="email">Update email</label>
          <input
            type="email"
            name='email'
            className="form-control"
            value={formData.email}
            onChange={handleInput} />
        </div>
        <div className="profile-form-group">
          <label htmlFor="phone">Update Phone Number</label>
          <input
            type="phone"
            name='phone'
            className="form-control"
            value={formData.phone}
            onChange={handleInput} />
        </div>
        <div className="form-buttons">
          <input type="submit" className='auth-btn' value={`${isSubmitting ? 'Loading...' : 'Update'}`} />
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;