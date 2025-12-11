import { Link } from 'react-router-dom';
import Header from '../../Header';
import Footer from '../../Footer';
import './style.css';

const Pricing = () => {
  
  return (
      <>
      <Header />
        <div className='pricing'>
          <div className='pricing-header'>
            <h3>Pricing</h3>
          </div>
          <div className="prices">
            <div className='price'>
              <div className='top'>
                <h4>Free</h4>
                <p>Try our application 1 week for free</p>
              </div>
              <div className='middle'>
                <p>Take a short experience with our applicatiion for free and test the efficiency.</p>
                <p className='cost'>Free</p>
              </div>
              <div className='bottom'>
                <Link to="/auth/free" className='plan-btn'>Subscribe</Link>
              </div>
            </div>
            <div className='price'>
              <div className='top'>
                <h4>Monthly</h4>
                <p>Follow your business evolution each Month</p>
              </div>
              <div className='middle'>
                <p>Subscribe for a month and manage your business easily.</p>
                <p className='cost'>5000 XAF</p>
              </div>
              <div className='bottom'>
                <Link to="/auth/month" className='plan-btn'>Subscribe</Link>
              </div>
            </div>
            <div className='price suggestion'>
              <div className='top'>
                <h4>Biannual</h4>
                <p>Use the app for a mid annual exercice</p>
              </div>
              <div className='middle'>
                <p>Check the health of your business each half year</p>
                <p className='cost'>12 000 XAF</p>
              </div>
              <div className='bottom'>
                <Link to="/auth/biannual" className='plan-btn'>Subscribe</Link>
              </div>
            </div>
            <div className='price'>
              <div className='top'>
                <h4>Annual</h4>
                <p>Total freedom for a whole year</p>
              </div>
              <div className='middle'>
                <p>Enjoy the platform for a whole year without interruption, and follow your business progression simply and efficiently.</p>
                <p className='cost'>20 000 XAF</p>
              </div>
              <div className='bottom'>
                <Link to="/auth/annual" className='plan-btn'>Subscribe</Link>
              </div>
            </div>
            <div className='price'>
              <div className='top'>
                <h4>Enterprise</h4>
                <p>The app is in your hands</p>
              </div>
              <div className='middle'>
                <p>Download the desktop application and receive a life License to use it as you want.</p>
                <p className='cost'>180 000 XAF</p>
              </div>
              <div className='bottom'>
                <Link to="/auth/annual" className='plan-btn'>Download</Link>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
    </>
  )
}

export default Pricing