import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
    
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const login = async () => {
        await signInWithEmailAndPassword(auth, email, password).then(() => {navigate("/");}).catch((err) => {
            
            if(err.code === "auth/invalid-email") {
                setEmailError("Invalid email! Please try again!");     
                navigate("/login");       
            }
            if(err.code === "auth/user-disabled" || err.code === "auth/user-not-found") {
                setEmailError("User doesn't exists! Please try again!");     
                navigate("/login");       
            }
            if(err.code === "auth/wrong-password") {
                setPasswordError("Invalid password! Please try again!");
                navigate("/login");
            }
        });
    }

    return (

        <>  

                <main className="login-container">
                
                    <div className="login-info-img">
                        <div className="login-info-img-text">
                            <h1 className="app-h1 login-h1">Classroom</h1>
                        </div>
                        <div className="login-info-img-text">
                            <h3 className="app-h3">Here to help you!</h3>
                        </div>
                    </div>

                    <div className="login-inputs-wrapper">
                        <h1 className="app-h1 login-h1">Sign in here!</h1>

                        <div className="login-inputs">
                            <div className="input-email">
                                <label data-testid="email-label" className="app-label login-label" htmlFor="email">Email:</label>
                                <input
                                    data-testid="email"
                                    id="email"
                                    className="app-input"
                                    type="text"
                                    placeholder="Email..."
                                    onChange={(event) => {
                                    setEmail(event.target.value);
                                    }}
                                />
                                <p className="error-msg">{emailError}</p>
                            </div>

                            <div className="input-password">
                                <label data-testid="password-label" className="app-label login-label" htmlFor="password">Password:</label>
                                <input
                                    data-testid="password"
                                    id="password"
                                    className="app-input"
                                    type="password"
                                    placeholder="Password..."
                                    onChange={(event) => {
                                    setPassword(event.target.value);
                                    }}
                                />
                                <p className="error-msg">{passwordError}</p>
                                <Link className="forgot-password-link app-link" to="/forgot">Forgot your password?</Link>
                            </div>
                        
                            <button data-testid="loginBtn" className="login-btn" onClick={login}>Log in!</button>
                                    
                            <Link className="app-link register-link" to="/register">Haven't got an account? Register here!</Link>
                        </div>
                    </div>
                    
                </main>
       
        </>
    );
}