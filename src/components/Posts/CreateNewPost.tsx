import CodeEditor from '@uiw/react-textarea-code-editor';
import { useState } from 'react';
import { ShowPostedCode } from '../ShowPostedCode';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export const CreateNewPost = () => {

    const postsCollectionRef = collection(db, "post");

    const [desc, setDesc] = useState("");
    const [title, setTitle] = useState("");
    const [htmlCode, setHtmlCode] = useState(
        `<!--Insert your HTML code here-->`
    );
    const [cssCode, setCssCode] = useState(
        `/*Insert your CSS code here*/`
    ); 
    
    const navigate = useNavigate();

    const createNewPost = async () => {
        
        await addDoc(postsCollectionRef, {desc: desc , title: title, comments: [], css: cssCode, html: htmlCode, projectOwner: auth.currentUser?.email, members: [], date: Date.now(), pendingCollaborators: []}).catch((err) => {
            console.log(err);
        });
        
        navigate("/");
    }

    return (
        <>  
            <div className="create-new-post-container">
                <h1>Create a new Post here!</h1>
                
                    <div className="title-input">
                        <label htmlFor="title">Title:</label>
                        <input id="title" 
                            placeholder="Name the title of your problem" 
                            type="text" 
                            onChange={(evn) => setTitle(evn.target.value)}
                        />
                    </div>

                    <div className="desc-and-code-container">
                        <textarea className="textarea-desc" onChange={(evn) => setDesc(evn.target.value)} placeholder="Type in what the problem is..." id=""></textarea>

                        <div className="coding-input-container">
                            <CodeEditor 
                                className="code-editor"
                                value={htmlCode}
                                language="html"
                                onChange={(evn) => setHtmlCode(evn.target.value)}
                                padding={15}
                                style={{
                                    fontSize: 12,
                                    backgroundColor: "#f5f5f5",
                                    overflow: "scroll",
                                    height: 300,
                                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                }}
                                
                            />

                            <CodeEditor
                                className="code-editor"
                                value={cssCode}
                                language="sass"
                                onChange={(evn) => setCssCode(evn.target.value)}
                                padding={15}
                                style={{
                                    fontSize: 12,
                                    overflow: "scroll",
                                    height: 300,
                                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                }}
                            />
                        </div>
                    </div>
                    <button onClick={createNewPost}>Post!</button>

                <div className="result-frame"><ShowPostedCode htmlCode={htmlCode} cssCode={cssCode}/></div>
                
            </div>
        </>
    );
}