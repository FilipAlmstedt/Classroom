import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

export const CreateNewAccount = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const registerNewAccount = async () => {
      
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
            console.log("Test");
            navigate("/register");       
          }
        });
    }

    return (

        <div>
        <h3> Register User </h3>
        <input
          type="text"
          placeholder="Email..."
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <p className="errorMsg">{emailError}</p>

        <input
          type="password"
          placeholder="Password..."
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <p className="errorMsg">{passwordError}</p>

        <button onClick={registerNewAccount}> Create User</button>
      </div>

    );
}