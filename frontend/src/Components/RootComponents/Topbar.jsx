import { useState } from "react";
import UserComponent from "../../Authentication/user";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleCloseMenu = () => {
    setIsOpen(false);
  };
  const backHome = () => {
    navigate("/home")
  }
  return (
    <section className="topbar">
      <div className="topbar-div ">
        <div className="logo-img" onClick={backHome}>
            <img
              src="frontend\src\assets\images\logo_2.png"
              alt="logo"
            />
        </div>
        
        <div className="topbar-profile">
          <UserComponent />
          <div className="hamburger-menu">
            {!isOpen ? (
              <button onClick={toggleMenu}>
                <img
                  src="frontend\src\assets\icons\hamburger-menu.svg"
                  width="40px"
                  height="40px"
                />
              </button>
            ) : (
              <button onClick={handleCloseMenu}>
                <img
                  src="frontend\src\assets\icons\cross.svg"
                  width="40px"
                  height="40px"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Topbar;
