import { useState } from 'react';
import supabase from '../../supabase.config'
import validation from '../../Authentication/validation';
import Toast from '../toast';
import bcrypt from 'bcryptjs'
import PropTypes from 'prop-types';

function Signup({plan}) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    plan: plan,
    termsAndConditions: false,
  });
  const [file, setFile] = useState(null);

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [errors, setErrors] = useState({});
  const [hidePassword, setHidePassword] = useState(true)
  const [ isSuccess, setIsSuccess ] = useState(false)
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const handleImageUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInput = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validation(formData);
    setErrors(validationErrors);
    const TABLE_NAME = 'users'
      if (validationErrors.email === '' && validationErrors.password === '' && validationErrors.termsAndConditions === ''){
        setIsSubmitting(true)

        const datas = new FormData();
        datas.append("firstname", formData.firstname);
        datas.append("lastname", formData.lastname);
        datas.append("email", formData.email);
        datas.append("password", formData.password);
        datas.append("phone", formData.phone);
        datas.append("role", formData.role);
        datas.append("plan", formData.plan);
        datas.append("image", file);

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(datas.password, salt);
        
        const date = new Date().toISOString().split('T')[0];
        const now = Date.now();
        const year = new Date().getFullYear();
        const ref = `USER-${year}-${now}`;
      //await axios.post(`${baseURL}/user/register`, formData)
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

          const { data } = await supabase
            .from(TABLE_NAME)
            .insert([
                { ref, firstname: datas.firstname, lastname: datas.lastname, email:datas.email, password: hashedPassword, phone:datas.phone, role:datas.role, plan:datas.plan, createdat: date, photo: imageUrl }
            ])
            if(data){
              console.log(data);
              setToast({ message: "Inscription réussie !", type: 'success', visible: true });
              setIsSuccess(true)
              setTimeout(() => {
                setToast({ ...toast, visible: false });
              }, 3000);
            }
        }catch(err ){
          console.error(err);
          setToast({ message: 'Échec de l\'inscription. Veuillez réessayer.', type: 'error', visible: true });
          setIsSubmitting(false)
        }
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <div className='form-ctn'>
      {isSuccess === false ? (<form onSubmit={handleSubmit}>
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
        <div className='auth-form-group'>
          <label htmlFor="firstname">firstname</label>
          <input 
            type="text"
            name='firstname' 
            className="form-control"
            value={formData.firstname}
            onChange={handleInput}
          />
          {errors.firstname && <div className='danger'>{errors.firstname}<br/></div>}

          <label htmlFor="flastname">lastname</label>
          <input 
            type="text"
            name='lastname' 
            className="form-control"
            value={formData.lastname}
            onChange={handleInput}
          />
          {errors.lastname && <div className='danger'>{errors.lastname}<br/></div>}
            
          <label htmlFor="email">email</label>
            <input 
              type="email"
              name='email' 
              className="form-control"
              value={formData.email}
              onChange={handleInput}
            />
            {errors.email && <div className='danger'>{errors.email}<br/></div>}
                                  
            <label htmlFor="password">Create Password</label>
            <input 
              type={`${hidePassword ? 'password' : 'text'}`}
              name='password' 
              className="form-control"
              value={formData.password}
              onChange={handleInput}
            />
            {errors.password && <div className='danger'>{errors.password}<br/></div>}
            <span className="pwd-display" onClick={() => setHidePassword(!hidePassword)}>{!hidePassword ? 'Hide password' : 'Show password'}</span>
        
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="phone"
              name='phone' 
              className="form-control"
              value={formData.phone}
              onChange={handleInput}
            />
            {errors.phone && <div className='danger'>{errors.phone}<br/></div>}
            <div className="form-grp">
              <input 
                type='checkbox' 
                name='termsAndConditions' 
                onChange={handleInput}
              />
                              
              <label htmlFor='termsAndConditions'>I read and accept terms and conditions</label><br/>
                {errors.termsAndConditions && <><div className='danger'>{errors.termsAndConditions}
            </div><br /></>}
            <div className="form-buttons">
              <input type="submit" className='auth-btn' value={`${isSubmitting ? 'Loading...' : 'Sign Up'}`} />
            </div>
            {errors.server && <div className='danger'>{errors.server}</div>}
          </div>
        </div>
      </form>)
      : 
      (<div className="confirmation">
        <h3>Inscription réussie</h3>
        <p>Cliquez sur Login pour vous connecter!</p>
      </div>)
      }
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} />}
    </div>
  );
}
Signup.propTypes = {
  plan: PropTypes.string.isRequired,
}
export default Signup;