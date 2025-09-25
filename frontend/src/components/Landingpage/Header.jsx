import '../Landingpage/css/Header.css';
import HeroImage from '../Landingpage/assets/HeroImage.png'
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    
    <header className="header-section">
      <div className="landing-navbar">
        <div className="logo">Learnify</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#contact">ContactUs</a>
          <a href="#about">About</a>
        </nav>
        <button className="login-btn" onClick={()=>navigate('/login')}>Login</button>
      </div>
     
      <div className="hero-main-area"> 
        <div className="hero-text">
          <h1>Let's Learn Smarter and Build the Future Together</h1>
          <p>A modern learning platform designed to simplify education, offering personalized and engaging courses, structured, accessible, and innovative learning experiences.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/login")}>Get Started</button>
            <button className="btn-secondary">Explore</button>
          </div>
        </div>
        
        <div className="hero-image-background"></div> 
        <div className="hero-image-container">
          <img src= {HeroImage} alt="Smiling student" />
        </div>
      </div>
    </header>
  );
};

export default Header;