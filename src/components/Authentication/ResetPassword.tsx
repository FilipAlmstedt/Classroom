import { confirmPasswordReset } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate, Link, useLocation } from 'react-router-dom'
// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const ResetPassword = () => {
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [passwordNotMatched, setPasswordNotMatched] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [expiredTime, setExpiredTime] = useState(false);

    const query = useQuery();
    const navigate = useNavigate();

    const resetPassword = async () => {

        if(newPassword === confirmNewPassword) {
            await confirmPasswordReset(auth, query.get('oobCode') || "", newPassword).then(() => {
                navigate("/login");
            }).catch((err) => {
                setPasswordNotMatched("");
                console.log(err);
                
                if(err.code === "auth/weak-password") {
                    setErrorMessage("Weak password! Try again! At least 6 characters!");
                }
                if(err.code === "auth/expired-action-code") {
                    setExpiredTime(true);
                }
            });
        } else {
            setErrorMessage("");
            setPasswordNotMatched("Password do not match try again!");
        }
        
        
    }

    return (
        <>
            <div className="reset-password-container">
                
                
                <div className="inputs-container">

                    <div className="unlocked-icon"></div>
                    <h1 className="app-h1 reset-h1">Reset Password</h1>
                    

                    <div className="password-input">
                        <label className="app-label reset-label" htmlFor="password">Password:</label>
                        <input
                            id="password"
                            className="app-input"
                            type="password"
                            value={newPassword}
                            placeholder="Type in your new password"
                            onChange={(event) => {
                                setNewPassword(event.target.value);
                            }}
                        />
                    </div>
                        
                    <div className="repeat-password-input">
                        <label className="app-label reset-label" htmlFor="repeat-password">Repeat Password:</label>
                        <input
                            id="repeat-password"
                            className="app-input"
                            type="password"
                            value={confirmNewPassword}
                            placeholder="Confirm your new passoword"
                            onChange={(event) => {
                                setConfirmNewPassword(event.target.value);
                            }}
                        />
                    <p className="error-msg">{errorMessage}</p>
                    <p className="error-msg">{passwordNotMatched}</p>
                    {expiredTime ? <p className="error-msg">Time has expired! <Link to="/forgot">Go back</Link></p>: null}
                    </div>



                    <button className="reset-password-btn" onClick={resetPassword}>Reset Password</button>
                </div>


            </div>
        </>
    );
}