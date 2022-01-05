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
            if(err.code === "auth/Invalid-email" || "auth/user-disabled" || "auth/user-not-found") {
                setEmailError("Invalid email! Please try again!");     
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
            <div className="login-container">
                <h1>This is the login page!</h1>

                <input
                    type="text"
                    placeholder="Email..."
                    onChange={(event) => {
                    setEmail(event.target.value);
                    }}
                />
                <p className="error-msg">{emailError}</p>

                <input
                    type="password"
                    placeholder="Password..."
                    onChange={(event) => {
                    setPassword(event.target.value);
                    }}
                />
                <p className="error-msg">{passwordError}</p>

                <button onClick={login}> Login</button>

                <Link to="/register">Haven't got an account? Register here!</Link>
                <Link to="/forgot">Forgot your password?</Link>
            </div>
        </>
    );
}