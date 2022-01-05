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
    
    const sendEmail = (e: any) => {
        e.preventDefault();
    
        emailjs.sendForm(config.emailJSConfig.serviceId || "", config.emailJSConfig.templateId || "", e.target, config.emailJSConfig.userId)
          .then((result) => {
              console.log(result.text);
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
            title: post?.title

        }).then(() => {
            console.log("Updated post");
        })
    }

    return (

        <>
            <h1>{post?.title}</h1>

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
            <div>
                <button onClick={updateCode}>Update</button>
            </div>

            <div className="result-frame"><ShowPostedCode htmlCode={newHtml} cssCode={newCss}/></div>

            {/*The only reason to use a form here was to use EMailJS and I needed to send data to the mail in this form*/}
            <form onSubmit={sendEmail}>
                <input type="text" name="new-member-email" defaultValue={post?.owner || ""} hidden/>
                <input type="text" name="post-title" defaultValue={post?.title} hidden/>
                <input type="text" name="link" defaultValue={getURL} hidden/>
                <button type="submit">Want to help? Send invite request!</button>
            </form>
        </>

    );
}