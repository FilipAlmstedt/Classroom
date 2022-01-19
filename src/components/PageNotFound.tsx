import { Link } from "react-router-dom";

export const PageNotFound = () => {

    return (

        <>
            <div className="base-wrapper">
                <h1 className="app-h1">OOPS! We can't find what you looking for!</h1>
                <Link to="/"><h2 className="app-h2">Go back to home page!</h2></Link>
            </div>
        </>
    );
}