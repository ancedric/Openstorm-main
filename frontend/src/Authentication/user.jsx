import useAuth from './Context/useAuth'
import defaultAvatar from '../assets/images/Default-avatar.png'
import './user.css'

const UserComponent = () => {
  const { profile } = useAuth()
  const { user } = useAuth()

  return (
    <div className="openstorm-scope">
      <div className="profile">
        <div className='profile-data'>
          {/*rofile.privilege === 'admin' ? (<Link to="/admin" className='admin-link'>Admin</Link>) : ''*/}
          <img
            src={user.profilephotourl || defaultAvatar}
            alt={`${user.firstname} ${user.lastname}`}
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          <div className="data">
            <p>
              {user.firstname} {user.lastname}
            </p>
            <span>{profile.position}</span>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default UserComponent;
