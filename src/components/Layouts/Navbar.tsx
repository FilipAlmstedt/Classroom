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
        navigate("/")
    };
    
    return (
        <>
            <header>
                <Link to="/"><h2>Classroom</h2></Link>
                <nav>
                    <ul>
                    {checkUserLoggedIn ? <div onClick={logout}><li>Log out</li></div>: <Link to="/login"><li>Log in</li></Link>}
                    {checkUserLoggedIn ? <li><Link to="/create-new-post">Create new Post</Link></li>: null}
                    {checkUserLoggedIn ? <p>Welcome {auth.currentUser?.email}</p>: null}
                    </ul>
                </nav>
            </header>
        </>
    );
}