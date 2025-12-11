import useAuth from './Context/useAuth'
import { baseURL } from "../axiosConfig";
import defaultAvatar from '../assets/images/Default-avatar.png'
import { Link } from 'react-router-dom';

const UserComponent = () => {
  const { profile } = useAuth()
  return (
    <div className="profile">
        <div className='profile-data'>
          {profile.role === 'admin' ? (<Link to="/admin" className='admin-link'>Admin</Link>) : ''}
          <img
            src={profile.photo ? `${baseURL}/media/${profile.photo}` : defaultAvatar}
            alt={`${profile.firstname} ${profile.lastname}`}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          <div className="data">
            <h4>
              {profile.firstname} {profile.lastname}
            </h4>
          </div>
        </div>
    </div>
  );
};

export default UserComponent;
