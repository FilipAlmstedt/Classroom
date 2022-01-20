import AceEditor from "react-ace";
import { useState } from 'react';
import { ShowPostedCode } from '../ShowPostedCode';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

// ? Imported these to not get error messages in web browser console
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/webpack-resolver";

// ! Imported these for choosing mode and themes for code-editors
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";




export const CreateNewPost = () => {
    const navigate = useNavigate();

    const postsCollectionRef = collection(db, "post");

    const [desc, setDesc] = useState("");
    const [title, setTitle] = useState("");
    const [htmlCode, setHtmlCode] = useState(
        "<!--Insert your HTML code here-->\n<h1>The results will appear here! Please use classes/id:s for these projects or they will impact the ENTIRE site!!!</h1>"
    );
    const [cssCode, setCssCode] = useState(
        `/*Insert your CSS code here*/`
    );
    const [errorEmptyTitle, setErrorEmptyTitle] = useState("");
    const [errorEmptyDesc, setErrorEmptyDesc] = useState("");
  
    // Functions to store code in states
    const updateCssCode = (newCode: string) =>  {
        setCssCode(newCode);
    }
    const updateHtmlCode = (newCode: string) =>  {
        setHtmlCode(newCode);
    }

    const checkIfInputsAreEmpty = () =>  {
        if(!title) {
            setErrorEmptyTitle("Please fill in a title!");
        } 
        if(!desc) {
            setErrorEmptyDesc("Please fill in a description of your problem!")
        } else {
            createNewPost();
        }
    }

    // Create new post with stored states
    const createNewPost = async () => {

        await addDoc(postsCollectionRef, {desc: desc , title: title, completedPost: false, css: cssCode, html: htmlCode, projectOwner: auth.currentUser?.email, members: [], date: Date.now(), pendingCollaborators: []}).catch((err) => {
            console.log(err);
        });
        
        navigate("/show-posts");
    }
    
    return (
        <>  
            <main className="app-div create-new-post-container">
                <h1 className="app-h1 create-post-page-h1">Create a new Post here!</h1>
                
                <div className="title-input">
                    <label className="app-label" htmlFor="title">Title:</label>
                    <input className="app-input" id="title" 
                        placeholder="Name the title of your problem" 
                        type="text" 
                        onChange={(evn) => setTitle(evn.target.value)}
                    />
                    <p className="error-msg">{errorEmptyTitle}</p>
                </div>

                <div className="desc-and-code-container">
                    <div className="textarea-desc">
                        <label className="app-label" htmlFor="desc"><h2>Describe your problem:</h2></label>
                        <textarea className="app-textarea" name="desc" onChange={(evn) => setDesc(evn.target.value)} placeholder="Type in what the problem is..." id=""></textarea>
                        <p className="error-msg">{errorEmptyDesc}</p>
                    </div>

                        <div className="code-editor">
                            <div className="label-and-icon">
                                <div className="html-icon"></div>
                                <label className="app-label" htmlFor="css"><h2 className="app-h2">HTML:</h2></label>
                            </div>

                            <AceEditor
                                mode={"html"}
                                theme="dracula"
                                value={htmlCode}
                                onChange={updateHtmlCode}
                                name="html"
                                width='100%'
                                height='300px'
                                className="ace-editor" 
                                fontSize={"15px"}        
                            />
                        </div>

                        <div className="code-editor">
                            <div className="label-and-icon">
                                <div className="css-icon"></div>
                                <label className="app-label" htmlFor="css"><h2 className="app-h2">CSS:</h2></label>
                            </div>

                            <AceEditor
                                mode={"css"}
                                theme="dracula"
                                value={cssCode}
                                onChange={updateCssCode}
                                name="css"
                                width='100%'
                                height='300px'
                                className="ace-editor"
                                fontSize={"15px"}   
                            />
                        </div>
                    
                </div>

               
                <button className="create-new-post-btn" onClick={checkIfInputsAreEmpty}>Create Post!</button>
              

            </main>
            <main className="result-frame-container">
                    <div className="result-frame">
                        <ShowPostedCode htmlCode={htmlCode} cssCode={cssCode}/>
                    </div>
            </main>
        </>
    );
}