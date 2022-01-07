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
    const [successMessage, setSuccessMessage] = useState("");

    const sendEmail = (e: any) => {
        e.preventDefault();
    
        emailjs.sendForm(config.emailJSConfig.serviceId || "", config.emailJSConfig.templateId || "", e.target, config.emailJSConfig.userId)
          .then((result) => {
              
            setSuccessMessage("An email has been send to the project owner. You will get an email if the owner has accepted your request. Keep an eye your inbox!");
            setTimeout(() => {
                console.log(result.text);
            }, 20000) 
          }, (error) => {
              console.log(error.text);              
          });
    };

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
            console.log("Allowed to edit");
            setAllowedToEdit(true);
        } else {
            console.log("Not allowed to edit!");
            setAllowedToEdit(false);
        }

        post.members.map((member) => {
            if(member === auth.currentUser?.email?.toString()) {
                console.log("This member is allowed to edit");
                setAllowedToEdit(true); 
            }
            return member;
        })
        
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
            console.log("Updated post");
        })
    }
    
    const sendRequest = async () => {
        let newcollaborator: string = auth.currentUser?.email?.toString() || "";
        post?.pendingCollaborators.push(newcollaborator);

        setPost(post);
        updateCode();
    }


    return (

        <>
            <h1>{post?.title}</h1>

            {allowedToEdit ? <p className="info-msg">You are the owner of this post!</p>: <p className="info-msg">If you want to help, send a request to edit code and see if the owner wants help!</p>}

            {/*The only reason to use a form here was to use EMailJS and I needed to send data to the mail in this form*/}
            <form onSubmit={sendEmail}>
                <input type="text" name="new-member-email" defaultValue={auth?.currentUser?.email || ""} hidden/>
                <input type="text" name="post-title" defaultValue={post?.title} hidden/>
                <input type="text" name="link" defaultValue={getURL} hidden/>
                <input type="text" name="owner" defaultValue={post?.owner} hidden/>
                
                
                {!allowedToEdit && auth.currentUser ? <button type="submit" onClick={sendRequest}>Want to help? Send invite request!</button> : !allowedToEdit && !auth.currentUser ? <button disabled type="submit" onClick={sendRequest}>Want to help? Send invite request!</button> : null}
            </form>
            <p className="success-msg">{successMessage}</p>

            <div className="coding-input-container">
                {allowedToEdit ? <CodeEditor 
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

                {allowedToEdit ? <CodeEditor
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
            {allowedToEdit 
            ? 
            <div>
                <button onClick={updateCode}>Update</button>
            </div> 
            : 
            <div>
                <button disabled onClick={updateCode}>Update</button>
            </div>}

            <div className="result-frame"><ShowPostedCode htmlCode={newHtml} cssCode={newCss}/></div>

            
        </>

    );
}