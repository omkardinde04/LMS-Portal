import '../Login/css/LoginNavbar.css'
import { useNavigate } from "react-router-dom";

function LoginNavbar() {
    const navigate = useNavigate();
    return(
        
       <>

            <div className="navbar">
                <h1 onClick={() => navigate("/")}>Learnify</h1>
                <ul className="nav-link">
                    
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">About</a></li>
                </ul>
                <div className="btn">
                    <button className="go-back-to-home-btn" onClick={() => navigate("/")}>Back to Home</button>
                </div>
                
            </div>
        </>
        
    );
}

export default LoginNavbar;