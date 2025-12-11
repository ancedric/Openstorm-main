//import SignIn from "../Authentication/SignIn";
import { Link } from 'react-router-dom'


const Header = () => {
  return (
    <div className='headerStyle' >
      <div>
        <div className="logo-img">
            <img
              src="frontend\src\assets\images\logo_1.png"
              alt="logo"
            />
        </div>
      </div>
      <div className="btn-ctn"> 
        <button className="auth-lp1"><Link to="/auth " className='linkStyle'> Log In </Link> </button>
        <button className="auth-lp2"> <Link to="/plan" className='linkStyle'> Sign Up </Link></button>
      </div>
    </div>
  );
}

export default Header