import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../../Models/Post";
import { doc, DocumentData, DocumentSnapshot, getDoc, setDoc  } from "firebase/firestore";
import { auth, db } from '../../firebase';
import { ShowPostedCode } from "../ShowPostedCode";

import emailjs from '@emailjs/browser';
import config  from '../../config/config';
import AceEditor from "react-ace";

// ? Imported these to not get error messages in web browser console
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/webpack-resolver";

// ! Imported these for choosing mode and themes for code-editors
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";

// Collect id - booking reference from URL
type Params = {
    id: string;
}
export const EditPost = () => {

    let { id } = useParams<Params>();
    const getURL = "http://localhost:3000/edit-post/"+id;
    const getAcceptOrDeclineURL = "http://localhost:3000/accept-or-decline/"+id;
    
    
    const [post, setPost] = useState<Post>();
    const [newHtml, setNewHtml] = useState("");
    const [newCss, setNewCss] = useState("");
    const [allowedToEdit, setAllowedToEdit] = useState(false);
    const [memberAllowedToEdit, setMemberAllowedToEdit] = useState(false);

    const [successMsg, setSuccessMsg] = useState("");
    const [collaboratorEditMsg, setCollaboratorEditMsg] = useState("");
    const [successfulUpdateMsg, setSuccessfulUpdateMsg] = useState("");
    const [error, setError] = useState("");
 
    const sendEditRequestMail = (e: any) => {  
        e.preventDefault();
    
        if(post) {    
            if(post.pendingCollaborators.length !== 0) {
                // eslint-disable-next-line array-callback-return
                post.pendingCollaborators.map((collaborator) => {
                    if(auth.currentUser?.email === collaborator) {    
                        setSuccessMsg("");
                        setError("You have already send a request to edit!");
                    } else {
                        emailjs.sendForm(config.emailJSConfig.serviceId || "", config.emailJSConfig.templateIdEditRequest || "", e.target, config.emailJSConfig.userId)
                        .then(() => {
                            setSuccessMsg("An email has been send to the project owner. You will get an email if the owner has accepted your request. Keep an eye your inbox!");
                            // Push into the user in the collaborators array that is wating for the owners response.
                            let newCollaborator: string = auth.currentUser?.email?.toString() || "";
                            post?.pendingCollaborators.push(newCollaborator);
                
                            setPost(post);
                            updateCode();
                        }, (error) => {
                            console.log(error.text);              
                        });
                    }
                })
            } else {
                emailjs.sendForm(config.emailJSConfig.serviceId || "", config.emailJSConfig.templateIdEditRequest || "", e.target, config.emailJSConfig.userId)
                .then(() => {
                    setSuccessMsg("An email has been send to the project owner. You will get an email if the owner has accepted your request. Keep an eye your inbox!");
                    // Push into the user in the collaborators array that is wating for the owners response.
                    let newCollaborator: string = auth.currentUser?.email?.toString() || "";
                    post?.pendingCollaborators.push(newCollaborator);

                    setPost(post);
                    updateCode();

                }, (error) => {
                    console.log(error.text);              
                });
            }
        }
    };

    const sendCollaboratorEditMail = (e: any) => {
        e.preventDefault();
        if(post?.owner !== auth.currentUser?.email) {
            if(post) {
                if(post.members.length !== 0) {
                    // eslint-disable-next-line array-callback-return
                    post.members.map((member) => {
                        if(member === auth.currentUser?.email) {
                            emailjs.sendForm(config.emailJSConfig.serviceId || "", config.emailJSConfig.templateIdCollaboratorEdits || "", e.target, config.emailJSConfig.userId)
                            .then(() => {
                                setCollaboratorEditMsg("An email has been send to the project owner notifying that you made a change!");
                                updateCode();
                            }, (error) => {
                                console.log(error.text);              
                            });
                        }
                    })
                }
            }
        }
        else {
            updateCode();
        }
    }

    const collectDoc = async () => {
        const docRef = doc(db, "post", id || "");
        const docSnap = await getDoc(docRef);  

        const collectedPost = new Post(
            docSnap.id.toString(), 
            docSnap.data()?.title,
            docSnap.data()?.desc,
            docSnap.data()?.comments, 
            docSnap.data()?.html,
            docSnap.data()?.css,
            docSnap.data()?.projectOwner,
            docSnap.data()?.members,
            docSnap.data()?.date,
            docSnap.data()?.pendingCollaborators
        ); 

        setNewHtml(collectedPost.html);
        setNewCss(collectedPost.css);
        
        checkIfEdit(docSnap.data()?.projectOwner, collectedPost);
    }

    const checkIfEdit = (owner: DocumentSnapshot<DocumentData>, post: Post) => {
   
        // ? The reason I put this there was because otherwise the post became undefined everytime I Reloaded the page
        setPost(post);
        
        if(owner.toString() === auth.currentUser?.email?.toString()) {
            console.log("You are the project owner Allowed to edit");
            setAllowedToEdit(true);
        } else {
            if(post.members.length !== 0) {
                post.members.map((member) => {
                    if(member === auth.currentUser?.email?.toString()) {
                        console.log("This member is allowed to edit");
                        setMemberAllowedToEdit(true); 
                    }
                    return member;
                })
            } else {
                console.log("Not allowed to edit");
                setAllowedToEdit(false);
            }
            
        }
        
    }

    useEffect(() => {
        collectDoc();        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Functions to store code in states
    const updateCssCode = (newCssCode: string) =>  {
        setNewCss(newCssCode);
    }
    const updateHtmlCode = (newHtmlCode: string) =>  {
        setNewHtml(newHtmlCode);
    }

    const updateCode = async () => {
   
            const docRef = doc(db, "post", id || "");
            await setDoc(docRef, {
                html: newHtml,
                css: newCss,
                comments: post?.comments,
                date: post?.date,
                desc: post?.description,
                members: post?.members,
                projectOwner: post?.owner,
                title: post?.title,
                pendingCollaborators: post?.pendingCollaborators

            }).then(() => {
                console.log("Successful update!");
                setSuccessfulUpdateMsg("Successful update!");
            })

    }

    return (

        <>
            <div className="edit-post-container">
                <h1 className="app-h1">{post?.title}</h1>
                <p className="app-p">Created: {new Intl.DateTimeFormat('en-UK', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(post?.date)} by {post?.owner}</p>

                {allowedToEdit ? <p className="info-msg app-p">You are the owner of this post!</p>: null}
                {memberAllowedToEdit ? <p className="info-msg app-p">You are a collaborator of this post!</p>: null}
                
                {/*The only reason to use a form here was to use EMailJS and I needed to send data to the mail in this form*/}
                <form onSubmit={sendEditRequestMail}>
                    <input className="app-input" type="text" name="new-member-email" defaultValue={auth?.currentUser?.email || ""} hidden/>
                    <input className="app-input" type="text" name="post-title" defaultValue={post?.title} hidden/>
                    <input className="app-input" type="text" name="link" defaultValue={getAcceptOrDeclineURL} hidden/>
                    <input className="app-input" type="text" name="owner" defaultValue={post?.owner} hidden/>
        
                    {
                    (auth.currentUser && allowedToEdit && !memberAllowedToEdit) || (auth.currentUser && !allowedToEdit && memberAllowedToEdit) || !auth.currentUser?             
                    null
                    : 
                    <div className="app-div">
                        <p className="info-msg app-p">If you want to help, send a request to edit code and see if the owner wants help!</p>
                        <button type="submit">Want to help? Send invite request!</button>
                    </div>
                    }
                </form>
        
                <p className="error-msg">{error}</p>
                <p className="success-msg">{successMsg}</p>

                <div className="desc-and-code-container">
                    <div className="desc">
                        <p className="app-p">{post?.description}</p>
                    </div>

                    
                    {(allowedToEdit || memberAllowedToEdit) ? 
                    <div className="code-editor">
                        <label className="app-label" htmlFor="html"><h2 className="app-h2">HTML:</h2></label>
                        <AceEditor
                            mode={"html"}
                            theme="dracula"
                            value={newHtml}
                            onChange={updateHtmlCode}
                            name="html"
                            width='100%'
                            height='300px'
                            className="ace-editor"     
                            fontSize={"15px"}    
                        />
                    </div>
                    : 
                    <div className="code-editor">
                        <label className="app-label" htmlFor="html"><h2 className="app-h2">HTML:</h2></label>
                        <AceEditor 
                            mode={"html"}
                            theme="dracula"
                            value={newHtml}
                            onChange={updateHtmlCode}
                            name="html"
                            width='100%'
                            height='300px'
                            className="ace-editor-edit-disabled ace-editor"   
                            readOnly
                            fontSize={"15px"}
                        />
                    </div>}

                    {(allowedToEdit || memberAllowedToEdit) ?
                    <div className="code-editor"> 
                        <label className="app-label" htmlFor="css"><h2 className="app-h2">CSS:</h2></label>
                        <AceEditor 
                            mode={"css"}
                            theme="dracula"
                            value={newCss}
                            onChange={updateCssCode}
                            name="css"
                            width='100%'
                            height='300px'
                            className="ace-editor"   
                            fontSize={"15px"}
                        />
                    </div>
                    : 
                    <div className="code-editor"> 
                        <label className="app-label" htmlFor="css"><h2 className="app-h2">CSS:</h2></label>
                        <AceEditor 
                            mode={"css"}
                            theme="dracula"
                            value={newCss}
                            onChange={updateCssCode}
                            name="css"
                            width='100%'
                            height='300px'
                            className="ace-editor-edit-disabled ace-editor"   
                            readOnly
                            fontSize={"15px"}
                        />
                    </div>}
                </div>

                <div className="update-btn-container">

                    {/* 
                    This form is for sending an email with the info that a collaborator/member 
                    has updated/changed the code  
                    */}
                    <form onSubmit={sendCollaboratorEditMail}>

                        <input className="app-input" type="text" name="collaborator" defaultValue={auth.currentUser?.email?.toString()} hidden/>
                        <input className="app-input" type="text" name="post-title" defaultValue={post?.title} hidden/>
                        <input className="app-input" type="text" name="owner" defaultValue={post?.owner} hidden/>
                        <input className="app-input" type="text" name="link" defaultValue={getURL} hidden/>

                        {allowedToEdit || memberAllowedToEdit
                        ? 
                        <div className="app-div">
                            <button className="update-btn" type="submit">Update</button>
                            <p className="success-msg app-p">{successfulUpdateMsg}</p>
                            <p className="success-msg app-p">{collaboratorEditMsg}</p>
                        </div> 
                        : 
                        <div className="app-div">
                            <button className="update-btn" disabled>Update</button>
                        </div>}
                    </form>
                </div>   



                <div className="result-frame-container">
                    <div className="result-frame">
                        <ShowPostedCode htmlCode={newHtml} cssCode={newCss}/>
                    </div>
                </div>
            </div>
            
        </>

    );
}