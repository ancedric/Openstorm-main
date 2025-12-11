import ProfileForm from '../Components/forms/profile/ProfileForm'
import Topbar from '../Components/RootComponents/Topbar'

const SetProfile = () => {
    
  return (
    <><Topbar />
    <div className='auth-form'>
      <h1>
        Profile settings
      </h1>
      <div className='auth-ctn'>
        <ProfileForm />
      </div>
    </div></>
  )
}

export default SetProfile