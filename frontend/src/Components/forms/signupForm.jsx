import { useState } from 'react';
import{ baseURL } from '../../axiosConfig'
import validation from '../../Authentication/validation';
import Toast from '../toast';
import axios from 'axios'
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

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [errors, setErrors] = useState({});
  const [hidePassword, setHidePassword] = useState(true)
  const [ isSuccess, setIsSuccess ] = useState(false)
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const handleInput = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validation(formData);
    setErrors(validationErrors);

      if (validationErrors.email === '' && validationErrors.password === '' && validationErrors.termsAndConditions === ''){
      setIsSubmitting(true)

      await axios.post(`${baseURL}/user/register`, formData)
        .then(res => {
          console.log(res);
          setToast({ message: "Inscription réussie !", type: 'success', visible: true });
          setIsSuccess(true)
          setTimeout(() => {
            setToast({ ...toast, visible: false });
          }, 3000);
        })
        .catch(err => {
          console.error(err);
          setToast({ message: 'Échec de l\'inscription. Veuillez réessayer.', type: 'error', visible: true });
          setIsSubmitting(false)
        });
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <div className='form-ctn'>
      {isSuccess === false ? (<form onSubmit={handleSubmit}>
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