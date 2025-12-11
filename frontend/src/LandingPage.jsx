import Footer from './Components/Footer'
import Header from './Components/Header'
import SlideElement from './Components/SlideElement'
import Hero from './assets/images/hero-bg.png'
import Image1 from './assets/images/capture-1.png'
import Image2 from './assets/images/capture-2.png'
import Image3 from './assets/images/capture-3.png'
import Image4 from './assets/image4.jpg'
//import Image5 from './assets/image5.jpg'
import { Link } from 'react-router-dom'

function LandingPage() {
  
  return (
    <div className="landing-page">
    <Header />
      <div className="hero">
        <div className="title">
          <SlideElement slideData = {{typeIn: 'slide-right', typeOut: 'slide-right', content: 'SIMPLY!!',}}  classStyle="title1" />
          <SlideElement slideData={{ typeIn: 'slide-left', typeOut: 'slide-left', content: 'YOUR SHOP' }} classStyle="title2" />
          <SlideElement slideData ={ {typeIn: 'slide-right', typeOut: 'slide-right', content: 'IN THE CLOUD!'}} classStyle="title3" />
          <div className="footer-hero">
            <div className="illus-style">
              <div>
                Create and manage your store and
                your shop directcly on a dedicated cloud plateform.
                We made it especially for your business.
              </div>
            </div>
            <button className="cta"><Link to="/auth" className='linkStyle'>Get Started</Link></button>
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
      <div className="sub-msg">
        <p>We provide a range of special tools to enhance your shop productivity, and keep your shop growing, including inventory mangement, and monthly revenue recording.</p>
      </div>
      <div className="features">
        <div className="features-parts">
          <div className="head">
            <h3>{'See What\'s Inside'}</h3>
            <p>Openstorm provides advanced deatures that make it possible to get all the benefits of your convenience in managing a business.</p>
          </div>
          <div className="body">
            <div className="feature-card">
              <h3>Sales analysis</h3>
              <p>Openstorm analyses the weekly sales of your business, to make you keep update.</p>
            </div>
            <div className="feature-card">
              <h3>Stock Management</h3>
              <p>Openstorm helps you to follow the stock in your warehouse helping you to notice the low stok, and helping to register new stock.</p>
            </div>
            <div className="feature-card">
              <h3>Cash Registration</h3>
              <p>Openstrom provide an intuitive platform for cash registration with real-time updates.</p>
            </div>
            <div className="feature-card">
              <h3>Orders Report</h3>
              <p>Openstorm let you know the different orders made in your shop.</p>
            </div>
          </div>
        </div>
        <div className="features-parts">
          <div className="img c2">
            <img src={Image1} alt="" />
          </div>
          <div className="img c1">
            <img src={Image3} alt="" />
          </div>
          <div className="img c3">
            <img src={Image2} alt="" />
          </div>
        </div>
      </div>
      <div className="extra">
        <div className="illustration">
          <img src={Image4} alt="" />
        </div>
        <div className="extra-infos">
          <div className='title'>Online and remote data control</div>
          <div className='desc'>{'Follow your shop progression from everywhere. Wether you\'re present or far away for your holidays, keep i touch with the progression of your activity.'}</div>
          <div className='btn'>
            <Link to="/plan" className ="cta-btn"> Start today</Link>
          </div>
        </div>
      </div>
      <div className="testimonies">
        <div className="head">
          <h3>Custommers experience and feedback</h3>
        </div>
        <div className="ctn">
          <div className="testimony">
            <div className="top">
              <h4>{'Custommer\'s name'}</h4>
              <p>City</p>
            </div>
            <div className="bottom">
              <p className="content"> contenu du commentaire...</p>
            </div>
          </div>
          <div className="testimony">
            <div className="top">
              <h4>{'Custommer\'s name'}</h4>
              <p>City</p>
            </div>
            <div className="bottom">
              <p className="content"> contenu du commentaire...</p>
            </div>
          </div>
          <div className="testimony">
            <div className="top">
              <h4>{'Custommer\'s name'}</h4>
              <p>City</p>
            </div>
            <div className="bottom">
              <p className="content"> contenu du commentaire...</p>
            </div>
          </div>
        </div>
      </div>
      <div className="engagement-ctn">
        <div className="engagement">
          <div className="call">
            <h2>Dive Into the experience today!</h2>
          </div>
          <div className="btn">
            <Link to="/plan" className="cta">Get a Free Trial </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default LandingPage