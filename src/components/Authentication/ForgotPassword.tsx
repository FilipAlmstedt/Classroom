import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
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
            setErrorUserNotFound("Empty! Please Type in an email")
        }
            
        });
    }

    return (
        <>
            <h1>Forgot Password</h1>

            <input
                type="text"
                placeholder="Type in your email so we can reset the password"
                onChange={(event) => {
                    setEmail(event.target.value);
                }}
            />
            <p className="success-msg">{success}</p>
            <p className="error-msg">{errorUserNotFound}</p>
            

            <button onClick={sendEmail}>Reset Password</button>
        </>
    );
}