import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

export const CreateNewAccount = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [comfirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const registerNewAccount = async () => {

        if(password === comfirmPassword) {
          await createUserWithEmailAndPassword(auth, email, password).then(() => {navigate("/login")}).catch((err) => {
            if(err.code === "auth/email-already-in-use") {
              setEmailError("Account already exists! Please use another email!");
              navigate("/register");       
            }
            if(err.code === "auth/invalid-email") {
              setEmailError("Invalid email! Please try again!");
              navigate("/register");       
            }
            if(err.code === "auth/weak-password") {
              setPasswordError("Weak Password! Password should be at least 6 characters!");
              navigate("/register");       
            }
          });
        } else {
          setPasswordError("Passwords must match! Please try again!");
        }
    }

    return (

      <div className="create-new-user-container">

        <div className="new-user-image-container">
          <div className="new-user-info-text">
            <h1 className="app-h1">Create new Account</h1>
          </div>
        </div>

        <div className="inputs-container">
          <h1 className="create-user-h1">Register a new user!</h1>
          
          <div className="input-email">
            <label className="app-label new-user-label" htmlFor="email">Email:</label>
            <input
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
            <label className="app-label new-user-label" htmlFor="password">Password:</label>
            <input
              id="password"
              className="app-input"
              type="password"
              placeholder="Password..."
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>

          <div className="input-repeat-password">  
            <label className="app-label new-user-label" htmlFor="repeat-password">Repeat password:</label>
            <input
              id="repeat-password"
              className="app-input"
              type="password"
              placeholder="Repeat the password..."
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
            />
            <p className="error-msg">{passwordError}</p>
          </div>

          <div className="register-btn-container">
            <button className="register-user-btn" onClick={registerNewAccount}>Create User</button>
          </div>
        

          <Link className="app-link go-back" to="/login">Go Back</Link>
        </div>
      </div>

    );
}