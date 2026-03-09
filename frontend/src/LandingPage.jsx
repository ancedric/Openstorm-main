import Footer from './Components/Footer'
import Header from './Components/Header/Header'
import Loader from './Components/Loader'
import Hero from './assets/images/hero-bg.png'
import Image1 from './assets/images/capture-1.png'
import Image2 from './assets/images/capture-2.png'
import Image3 from './assets/images/capture-3.png'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from './Authentication/Context/useAuth'
import { useEffect, useState } from 'react'
import ShopSetupForm from './Components/forms/shopSetupForm/ShopForm';
import './landingPage.css'

function LandingPage() {
  const { userRef } = useParams();
  const { fetchUserStores, isAppReady, shop, setShop, stores, user } = useAuth();
  const [showStoreList, setShowStoreList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Gestion dynamique du bouton principal
  const handleGetStarted = () => {
    if (!user) {
      navigate('/getcorevia.netlify.app'); // Redirige vers l'application principale si non connecté
    } else if (stores.length === 0) {
      setIsModalOpen(true); // Ouvre l'overlay si aucun magasin
    } else {
      setShowStoreList(!showStoreList); // Affiche le dropdown si plusieurs magasins
    }
  };

  const closeStoreModal = () => setIsModalOpen(false);

  const selectStore = (storeref) => {
    setShowStoreList(false);
    console.log('store list:', stores);
    setShop(stores.find(s => s.ref === storeref));
    navigate('/dashboard');
  }
  useEffect(() => {
    if (userRef) {
      fetchUserStores(userRef);
    }
  }, [userRef, fetchUserStores]);

  useEffect(() => {
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // On peut arrêter d'observer une fois l'animation jouée
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealCallback, {
    threshold: 0.1 // L'élément doit être visible à 10% pour déclencher
  });

  // On cible toutes les sections que l'on veut animer
  const targets = document.querySelectorAll('.reveal, .reveal-left');
  targets.forEach(target => observer.observe(target));

  return () => observer.disconnect();
}, []);

  if (!isAppReady) return <Loader />;

  return (
    <div className="landing-page">
      <Header />
      
      {shop && (
        <div className="welcome-banner">
          {'Bienvenue dans l\'espace stock de'} <strong>{shop.name}</strong>
        </div>
      )}

      <div className="hero">
        <div className="title">
          <h3 className="title1 reveal"> { user.firstname.toUpperCase() } </h3>
          <h3 className="title2 reveal">WELCOME IN THE STORE MANAGEMENT MODULE</h3>
          <h3 className="title3 reveal">Good to see you again !!</h3>
          <div className="footer-hero">
            <div className="illus-style">
              <div>
                <p>Create and manage your stores and your shops directly on a dedicated platform.</p> 
                <p>{'We made it especially for your business which don\'t need the complexity of the organization of a huge company, and just want to manage their stores, sells, stocks and orders.'}</p>
              </div>
            </div>

            <div className="cta-container">
              <button className="cta" onClick={handleGetStarted}>
                {stores.length > 0 ? 'Select your store' : 'Get Started'}
              </button>
              
              {showStoreList && (
                <div className="store-dropdown">
                  {stores.map(s => (
                    <button key={s.ref} className="store-item" onClick={() => selectStore(s.ref)}>
                      {s.store_name}
                    </button>
                  ))}
                  {/* Option pour toujours pouvoir créer un nouveau magasin */}
                  <div className="dropdown-divider"></div>
                  <button className="add-store" onClick={() => { setIsModalOpen(true); setShowStoreList(false); }}>
                    + New Store
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="illustration-style">
          <div className="deco"></div>
          <div className="deco-2"></div>
          <div className="hero-style">
            <img src={Hero} alt='hero'/>
          </div>
        </div>
      </div>

      {/* OVERLAY DE CRÉATION DE MAGASIN */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeStoreModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeStoreModal}>&times;</button>
            <ShopSetupForm close={closeStoreModal} />
          </div>
        </div>
      )}

      {/* --- RESTE DES SECTIONS (sub-msg, features, extra, testimonies, engagement) --- */}
      <div className="sub-msg">
        <p>We provide a range of special tools to enhance your shop productivity, and keep your shop growing, including inventory management, and monthly revenue recording.</p>
      </div>
      
      {/* ... (Je garde tes sections features, extra, etc., telles quelles) ... */}
      <div className="features">
        {/* ... Contenu features ... */}
        <div className="features-parts">
          <div className="head reveal">
            <h3>{'See What\'s Inside'}</h3>
            <p>Openstorm provides advanced features that make it possible to get all the benefits of your convenience in managing a business.</p>
          </div>
          <div className="body">
            <div className="feature-card reveal"><h3>Sales analysis</h3><p>Analyse your weekly sales...</p></div>
            <div className="feature-card reveal"><h3>Stock Management</h3><p>Follow your warehouse stocks...</p></div>
            <div className="feature-card reveal"><h3>Order Management</h3><p>Track and manage your orders...</p></div>
            <div className="feature-card reveal"><h3>Multi-store Support</h3><p>Manage multiple stores...</p></div>
          </div>
        </div>
        <div className="features-parts">
            <div className="img c2"><img src={Image1} alt="" /></div>
            <div className="img c1"><img src={Image3} alt="" /></div>
            <div className="img c3"><img src={Image2} alt="" /></div>
        </div>
      </div>

      <div className="engagement-ctn">
        <div className="engagement">
          <div className="call"><h2>Dive Into the experience today!</h2></div>
          <div className="btn">
            {/* Si l'utilisateur est là, on déclenche l'overlay, sinon vers login */}
            <button className="cta" onClick={handleGetStarted}>
                {user ? 'Open a new shop' : 'Get a Free Trial'}
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default LandingPage