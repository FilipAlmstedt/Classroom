import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";

export const ForgotPassword = () => {


    const [email, setEmail] = useState("");

    const [errorUserNotFound, setErrorUserNotFound] = useState("");
    const [success, setSucces] = useState("");
 
    const sendEmail = async () => {
        await sendPasswordResetEmail(auth, email, {url: 'http://localhost:3000/login'}).then(() => {
            // ? IF the user had any potential error messages before, it will only display the success message
            setErrorUserNotFound("");

            setSucces("A email has been send to you. Please check your inbox!")

        }).catch((err) => {
            
        console.log(err.code);
        
        if(err.code === "auth/user-not-found") {
            setErrorUserNotFound("This email address doesn't exist! Try another email!")
        }
        if(err.code === "auth/missing-email") {
            setErrorUserNotFound("Empty! Please Type in an email address!")
        }
            
        });
    }

    return (
        <>
            <main className="forgot-password-container">
                
                <div className="icon-and-h1">
                    <div className="question-mark-icon"></div>
                    <h1 className="app-h1 forgot-h1">Forgot Your Password?</h1>
                </div>

                <div className="input-container">

                    <p className="input-container-p">Please type in your email so we can reset your email.</p>

                    <label className="app-label forgot-label" htmlFor="reset-password">Email:</label>
                    <input
                        id="reset-password"
                        className="app-input"
                        type="text"
                        placeholder="Your email address..."
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <p className="success-msg">{success}</p>
                    <p className="error-msg">{errorUserNotFound}</p>
                </div>

                <button className="reset-password-btn" onClick={sendEmail}>Reset Password</button>
                <Link className="app-link go-back" to="/login">Go Back!</Link>
            </main>
        </>
    );
}