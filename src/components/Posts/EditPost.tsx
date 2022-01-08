import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../../Models/Post";
import { doc, DocumentData, DocumentSnapshot, getDoc, setDoc  } from "firebase/firestore";
import { auth, db } from '../../firebase';
import { ShowPostedCode } from "../ShowPostedCode";
import CodeEditor from '@uiw/react-textarea-code-editor';
import emailjs from '@emailjs/browser';
import config  from '../../config/config';

// Collect id - booking reference from URL
type Params = {
    id: string;
}
export const EditPost = () => {

    let { id } = useParams<Params>();
    const getURL = "http://localhost:3000/accept-or-decline/"+id;
    
    
    const [post, setPost] = useState<Post>();
    const [newHtml, setNewhtml] = useState("");
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

        setNewhtml(collectedPost.html);
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
                console.log("Successfull update!");
                setSuccessfulUpdateMsg("Successfull update!");
            })

    }

    return (

        <>
            <h1>{post?.title}</h1>

            {allowedToEdit ? <p className="info-msg">You are the owner of this post!</p>: null}
            {memberAllowedToEdit ? <p className="info-msg">You are a collaborator of this post!</p>: null}
            
            {/*The only reason to use a form here was to use EMailJS and I needed to send data to the mail in this form*/}
            <form onSubmit={sendEditRequestMail}>
                <input type="text" name="new-member-email" defaultValue={auth?.currentUser?.email || ""} hidden/>
                <input type="text" name="post-title" defaultValue={post?.title} hidden/>
                <input type="text" name="link" defaultValue={getURL} hidden/>
                <input type="text" name="owner" defaultValue={post?.owner} hidden/>
     
                {
                (auth.currentUser && allowedToEdit && !memberAllowedToEdit) || (auth.currentUser && !allowedToEdit && memberAllowedToEdit)?             
                null
                : 
                <div>
                    <p className="info-msg">If you want to help, send a request to edit code and see if the owner wants help!</p>
                    <button type="submit">Want to help? Send invite request!</button>
                </div>
                }

            </form>
            <p className="error-msg">{error}</p>
            <p className="success-msg">{successMsg}</p>

            <div className="desc">
                <p>Created: {new Intl.DateTimeFormat('en-UK', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(post?.date)} by {post?.owner}</p>
                <p>{post?.description}</p>
            </div>

            <div className="coding-input-container">
                {(allowedToEdit || memberAllowedToEdit) ? <CodeEditor 
                    className="code-editor"
                    value={newHtml}
                    language="html"
                    onChange={(evn) => setNewhtml(evn.target.value)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        overflow: "scroll",
                        // height: 300,
                        border: "1px solid black",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace'
                    }}
                /> : <CodeEditor disabled
                className="code-editor"
                value={newHtml}
                language="html"
                onChange={(evn) => setNewhtml(evn.target.value)}
                padding={15}
                style={{
                    fontSize: 12,
                    backgroundColor: "#f5f5f5",
                    overflow: "scroll",
                    // height: 300,
                    border: "1px solid black",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    opacity: 0.3
                }} 
                />}

                {(allowedToEdit || memberAllowedToEdit) ? <CodeEditor
                    className="code-editor"
                    value={newCss}
                    language="sass"
                    onChange={(evn) => setNewCss(evn.target.value)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        overflow: "scroll",
                        // height: 300,
                        border: "1px solid black",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                /> : 
                    <CodeEditor disabled
                    className="code-editor"
                    value={newCss}
                    language="sass"
                    onChange={(evn) => setNewCss(evn.target.value)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        overflow: "scroll",
                        // height: 300,
                        border: "1px solid black",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        opacity: 0.3
                    }}
                />}
            </div>

            {/* 
            This form is for sending an email with the info that a collaborator/member 
            has updated/changed the code  
            */}
            <form onSubmit={sendCollaboratorEditMail}>

                <input type="text" name="collaborator" defaultValue={auth.currentUser?.email?.toString()} hidden/>
                <input type="text" name="post-title" defaultValue={post?.title} hidden/>
                <input type="text" name="owner" defaultValue={post?.owner} hidden/>
                <input type="text" name="link" defaultValue={getURL} hidden/>

                {allowedToEdit || memberAllowedToEdit
                ? 
                <div>
                    <button type="submit">Update</button>
                    <p className="success-msg">{successfulUpdateMsg}</p>
                    <p className="success-msg">{collaboratorEditMsg}</p>
                </div> 
                : 
                <div>
                    <button disabled>Update</button>
                </div>}
            </form>
                
            <div className="result-frame"><ShowPostedCode htmlCode={newHtml} cssCode={newCss}/></div>

            
        </>

    );
}