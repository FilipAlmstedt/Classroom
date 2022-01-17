export const LandingPage = () => {

    return (
        <>
            <div className="landing-page-container">
                <div className="hero-img">
                    <div className="hero-img-text">
                        <h1 className="hero-h1 app-h1">WELCOME TO CLASSROOM</h1>
                        <h3 className="app-h3">Learn together, it's more fun!</h3>
                        <a className="learn-more-link" href="#about-info-container"><button className="hero-btn">LEARN MORE</button></a>
                    </div>
                </div>
                
                <div id="about-info-container" className="about-info-container">
                
                    <div className="about-website-info">
                        <h1 className="app-h1">A new website for student to test your small projects</h1>
                        <div className="">

                        </div>
                    </div>

                    <h2 className="app-h2">Frameworks and languages to use:</h2>
                    
                    <div className="show-frameworks-div">
                        <div className="html-div">
                            <div className="html-image"></div>
                            <h2 className="app-h2">HTML</h2>
                        </div>
                        <div className="css-div">
                            <div className="css-image"></div>
                            <h2 className="app-h2">CSS</h2>
                        </div>

                        <div className="js-div">
                            <div className="js-image"></div>
                            <h2 className="app-h2">JAVASCRIPT</h2>
                            <h4 className="app-h2">COMING SOON...</h4>
                        </div>
                        <div className="sass-div">
                            <div className="sass-image"></div>
                            <h2 className="app-h2">SASS</h2>
                            <h4 className="app-h2">COMING SOON...</h4>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
}