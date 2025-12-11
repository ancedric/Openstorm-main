import { useState } from 'react';
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from '../../../axiosConfig'
import './style.css'

function ProfileForm() {
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const userRef = useParams()
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const handleInput = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
      setIsSubmitting(true)

      await axios.post(`${baseURL}/user/update-user/${userRef}`, formData)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.error(err);
          setIsSubmitting(false)
        });
  };

  return (
    <div className='profile-form-ctn'>
      <form onSubmit={handleSubmit}>
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