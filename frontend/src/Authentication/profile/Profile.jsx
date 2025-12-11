import './style.css'
import { Link } from 'react-router-dom'
import useAuth from '../Context/useAuth'
import defaultAvatar from '../../assets/images/Default-avatar.png'
import Topbar from '../../Components/RootComponents/Topbar'

const Profile = () => {
  const { profile } = useAuth()
  console.log('profil utilisateur:', profile)

  return (
      <><Topbar />
    <div className="profile-ctn">
      <h3>User Profile</h3>
      <div className="profile">
        <div className="profile-img">
          <img src={profile.photo? profile.photo : defaultAvatar} />
        </div>
        <div className="user-data">
          <p> First name : {profile.firstname} {profile.lastname} </p>
          <p> Last name : {profile.lastname} </p>
          <p> Email : {profile.email} </p>
          <p> Phone number : {profile.phone} </p>
          <p>User plan : {profile.plan} </p>
          <div className='edition'>
            <Link to={`/edit-profile/${profile.ref}`} className='link'>Edit user data</Link>
          </div>
        </div>
        
      </div>
    </div></>
  )
}

export default Profile