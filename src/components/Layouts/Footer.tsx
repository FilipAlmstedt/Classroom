import { Link } from "react-router-dom";

export const Footer = () => {
    
    return (
        <>
            <footer>
                <div>
                    <div><h1>Classroom</h1></div>
                    <div>
                        <Link to="https://github.com/FilipAlmstedt/Classroom"><h1>Link to Github</h1></Link>
                    </div>
                </div>
            </footer>
        </>
    );
}