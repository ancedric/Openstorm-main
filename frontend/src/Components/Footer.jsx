import { Link } from "react-router-dom";
import logo from '../assets/images/logo_2.png'

function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="footer">
      <div className="top">
        <div className="left">
          <div className="left-top">
            <img src={logo} alt="" />
          </div>
          <div className="left-mid">
            {'Our professional software made to simplify your business operations. Our solution helps you to increase efficiency and improve customer\'s service. experience seamless management with our complete dashboard.'}
          </div>
          <div className="left-bottom">
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
        </div>
        <div className="right">
          <div className="list">
            <h3>Product</h3>
            <ul>
              <Link to="/" className="links">Features</Link>
              <Link to="/plan" className="links">Pricing</Link>
            </ul>
          </div>
          <div className="list">
            <h3>Company</h3>
            <ul>
              <Link to="/" className="links">About Us</Link>
              <Link to="/" className="links">Contact Us</Link>
            </ul>
          </div>
          <div className="list">
            <h3>Support</h3>
            <ul>
              <Link to="/" className="links">Help Center</Link>
              <Link to="/" className="links">Repport a Bug</Link>
            </ul>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="copyrights">
          Copyrights openstorm {year}, All rights reserved.
        </div>
        <div className="legals">
          <Link>Terms of Use</Link>
          <Link>Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer