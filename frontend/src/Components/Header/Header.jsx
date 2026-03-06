import { Link } from "react-router-dom";
import logo1 from "../../assets/images/corevia-logo-1.png"
import './style.css'

const Header = () => {
  return (
      <div className='headerStyle' >
          <div className="logo-img">
              <img
                src={logo1}
                alt="logo"
              />
          </div>
          <div className="feats">
              <Link to="/plan" className="link">Tarifs</Link>
              <Link to="/contact" className="link">Contact</Link>
          </div>
      </div>
  );
}

export default Header