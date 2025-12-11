//import SignIn from "../Authentication/SignIn";
import { Link } from 'react-router-dom'
import logo1 from "../../assets/images/logo_1.png"


const Header = () => {
  return (
    <div className='headerStyle' >
      <div>
        <div className="logo-img">
            <img
              src={logo1}
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