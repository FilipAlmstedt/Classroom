export const LandingPage = () => {

    return (
        <>
            <main className="landing-page-container">
                <div className="hero-img">
                    <div className="hero-img-text">
                        <h1 className="hero-h1 app-h1">WELCOME TO CLASSROOM</h1>
                        <h3 className="app-h3">Learn together, it's more fun!</h3>
                        <a className="learn-more-link" href="#about-info-container"><button className="hero-btn">LEARN MORE</button></a>
                    </div>
                </div>
                
                <div id="about-info-container" className="about-info-container">
                
                   

                    <div className="about-website-info">
                        <h1 className="app-h1 about-website-info-h1">A new website for student to test your small projects</h1>
                        
                        <div className="landing-hr-line">
                            <hr className="hr-line"/>
                        </div>
                        
                        <div className="info-about-functions-container">

                            <div className="info-div-functions">
                                <div className="info-text">
                                    <h3 className="app-h3">"ALONE WE ARE SMART, TOGETHER WE ARE BRILLIANT."</h3>
                                    <p className="app-p info-text-p"> 
                                        I choose to create this website because I wanted to create a platform for people
                                        who wants to collaborate to solve more simple html och css. I always wanted to create a project that 
                                        gives students like to have their own platform where they could share problems 
                                        they have and help each other solve them.
                                    </p>
                                </div>
                                <div className="info-div-img"></div>
                            </div>

                            <div className="info-div-functions">
                                <div className="info-text">
                                    <h3 className="app-h3">Post a problem!</h3>
                                    <p className="app-p info-text-p"> 
                                        To use this website, <strong className="orange">YOU NEED AN ACCOUNT</strong> properly use the website. Just post what the problem
                                        is about, and when hopefully someone will see the post and help you solve your problem.
                                    </p>
                                </div>
                                <div className="info-div-img"></div>
                            </div>

                            <div className="info-div-functions">
                                <div className="info-text">
                                    <h3 className="app-h3">Do you want to help? Perfect!</h3>   
                                    <p className="app-p info-text-p"> 
                                        You, as the "owner" of the post will receive an email from a user that want s to help you, 
                                        and you can either accept or decline the request. If you accept that user will have the ability 
                                        to edit your code, everytime a collaborator edits your code, you will receive an email that changes 
                                        has been made.
                                    </p>
                                </div>
                                <div className="info-div-img"></div>
                            </div>

                            <div className="info-div-functions">
                                <div className="info-text">
                                    <h3 className="app-h3">Learn! Learn! Learn!</h3>
                                    <p className="app-p info-text-p"> 
                                        Hopefully you can learn of each other by helping each other out. This site is still under
                                        development and hopefully I will find the time to make it better in the future! Enjoy! 
                                    </p>
                                </div>
                                <div className="info-div-img"></div>
                            </div>

                        </div>
                        
                            
                        <div className="landing-hr-line">
                            <hr className="hr-line"/>
                        </div>
                            

                    </div>


                    <h2 className="app-h2 framework-h2">Frameworks and languages to use:</h2>
                    
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
                
            </main>
        </>
    );
}