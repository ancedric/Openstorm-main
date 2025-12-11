import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Authentication/Context/useAuth'
import validation from '../../Authentication/validation';
import Toast from '../toast';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [hidePassword, setHidePassword] = useState(true)
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleInput = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

 const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validation(formData);
    setErrors(validationErrors);

    if (validationErrors.email === '' && validationErrors.password === ''){
        setIsSubmitting(true);
        try {
            signIn(formData.email, formData.password); 
            
            setToast({ message: 'Bienvenue!', type: 'success', visible: true });
            
            setTimeout(() => {
                setToast({ ...toast, visible: false });
                navigate('/home');
            }, 3000);

        } catch (error) {
            // Gérer les erreurs renvoyées par signIn
            console.error("Échec de la connexion", error);
            setToast({ message: 'Email ou mot de passe incorrect', type: 'error', visible: true });
            setIsSubmitting(false); // Réinitialiser le bouton
        }
    } else {
        // La logique de validation locale reste la même
        setToast({ message: 'Veuillez vérifier vos champs.', type: 'error', visible: true });
        setTimeout(() => {
            setToast({ ...toast, visible: false });
        }, 3000);
    }
};

  return (
        <div className='form-ctn'>
          <form onSubmit={handleSubmit}>
            <div className='auth-form-group'>
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                name='email' 
                className="form-control"
                value={formData.email}
                onChange={handleInput}
              />
              {errors.email && <div className='danger'>{errors.email}<br/></div>}
                                      
              <label htmlFor="password">Password</label>
              <input 
                type={`${hidePassword ? 'password' : 'text'}`}
                name='password' 
                className="form-control"
                value={formData.password}
                onChange={handleInput}
              />
              {errors.password && <div className='danger'>{errors.password}<br/></div>}
              <span className="pwd-display" onClick={() => setHidePassword(!hidePassword)}>{!hidePassword ? 'Hide password' : 'Show password'}</span>
              <div className="form-buttons">
              <input type="submit" className='auth-btn' value={`${isSubmitting ? 'Loading...' : 'Log In'}`} />
              </div>
              {errors.server && <div className='danger'>{errors.server}</div>}
            </div>
          </form>
          {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, visible: false })} />}
        </div>
  );
}

export default Login;
