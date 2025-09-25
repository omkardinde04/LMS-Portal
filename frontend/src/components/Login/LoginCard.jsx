import '../Login/css/LoginCard.css'
function LoginCard(){
    return(

        <>  
            <div className="login-page">
                <div className="oval-bg">
                    <div className="login-card">
                        <h1 className="login-title">Learnify</h1>
                        <p className="login-subtitle">
                            Welcome back, please login to your account.
                        </p>

                        <form>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="you@example.com" />
                        </div>

                        <div className="form-group">
                            <label>Password </label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <div className="forget-and-checkbox">
                            <div className="checkbox">
                                <input type="checkbox" id="myCheckbox" name="options" value="remeberme"></input>
                                <label for="myCheckbox">Remember me</label>
                            </div>
                            <div className="forget-password">
                                <a href="/" className="forgot-link">Forgot Password?</a>
                            </div>
                        </div>
                        

                        <button type="submit" className="loginBtn">Sign In</button>
                    </form>
                    <p className="signup-text">
                        Don't have an account? <a href="/">Create an account</a>
                    </p>
                    </div>
                </div>
            </div>
        </>
    );
}


export default LoginCard;