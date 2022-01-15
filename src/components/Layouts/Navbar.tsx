import { Link, useNavigate } from "react-router-dom";

import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";


export const Navbar = () => {
    
    const navigate = useNavigate();
    const [checkUserLoggedIn, setCheckUserLoggedIn] = useState<boolean>();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                console.log("User detected", user.email); 
                setCheckUserLoggedIn(true);
            } else {
                console.log("User is not detected");
                setCheckUserLoggedIn(false);
            }
        });
    }, []);

    const logout = async () => {
        localStorage.setItem("loggedInUser", "");
        await signOut(auth);
        navigate("/");
    };
    
    return (
        <>
            <header className="app-header">
                <Link to="/">
                    <div className="logo-container">
                        <div className="logo"></div>
                        <h2 className="header-title"> 
                            Classroom 
                        </h2>
                    </div>
                </Link>
                <nav className="app-navbar">
                    <ul className="app-ul">
                        {checkUserLoggedIn ? <p className="app-p">Current User: {auth.currentUser?.email}</p>: null}
                        <li className="app-li"><Link to="/show-posts">Show Posts</Link></li>
                        {checkUserLoggedIn ? <li className="app-li"><Link to="/create-new-post">Create new Post</Link></li>: null}
                        {checkUserLoggedIn ? <div className="app-div" onClick={logout}><li className="app-li"><Link to="">Log out</Link></li></div>: <li className="app-li"><Link to="/login">Log in</Link></li>}
                    </ul>
                </nav>
            </header>
        </>
    );
}