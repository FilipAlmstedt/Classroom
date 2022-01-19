export const Footer = () => {
    
    return (
        <>
            <footer>
                <div className="app-div footer-container">
                    <div className="app-div footer-nav"> 
                        <div className="github-icon"></div>
                        <a className="app-link github-link" href="https://www.github.com/FilipAlmstedt/Classroom"><p className="app-p github-link-p">Link to the Github repo of this website</p></a>
                    </div>
                    <div className="app-div footer-info">
                        <h1 className="app-h1">Classroom</h1>
                        <p className="app-p motto">Learn together, it's more fun!</p>
                        <p className="app-p">Website created by: <strong>Filip Almstedt</strong></p>
                        <p className="app-p">&copy; 2022 Classroom</p>
                    </div>
                </div>
            </footer>
        </>
    );
}