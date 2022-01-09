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

      <div className="">
        <h1> Register a new user! </h1>
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
        <input
          type="password"
          placeholder="Repeat the password..."
          onChange={(event) => {
            setConfirmPassword(event.target.value);
          }}
        />
        <p className="error-msg">{passwordError}</p>

        <button onClick={registerNewAccount}> Create User</button>
        <Link to="/login">Go Back</Link>
      </div>

    );
}