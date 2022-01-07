import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { Post } from "../../Models/Post";
import emailjs from '@emailjs/browser';
import { signOut } from "firebase/auth";
import config from "../../config/config";

export const AcceptOrDecline = () => {

    const {id} = useParams(); 
    const [post, setPost] = useState<Post>();

    // Messages that appears when the user presses the buttons either accept or decline
    const [acceptHelp, setAcceptHelp] = useState("");
    const [declineHelp, setDeclineHelp] = useState("");
    
    const sendEmailAccept = (e: any) => {
        e.preventDefault();
    
        emailjs.sendForm(config.emailJSConfig.serviceId || "", config.emailJSConfig.templateIdInviteAccepted || "", e.target, config.emailJSConfig.userId)
          .then(() => {
                let incomingMember: string = post?.pendingCollaborators[post?.pendingCollaborators.length-1] || "";
        
                post?.members.push(incomingMember);
                setPost(post);

                setAcceptHelp("You have approved help from the account: " + post?.pendingCollaborators[post.pendingCollaborators.length-1] + " This account has now access to edit your code. You can now please close this window!")
                post?.pendingCollaborators.splice(0,post?.pendingCollaborators.length);
                updateDoc();
                
          }, (error) => {
              console.log(error.text);              
          });
    };

    const sendEmailDecline = (e: any) => {
        e.preventDefault();
    
        emailjs.sendForm(config.emailJSConfig.serviceId || "", config.emailJSConfig.templateIdInviteDeclined || "", e.target, config.emailJSConfig.userId)
          .then(() => {
                setDeclineHelp("You have declined help from the account: " + post?.pendingCollaborators[post.pendingCollaborators.length-1] + " You can now please close this window!");
                setPost(post);
                post?.pendingCollaborators.splice(0,post?.pendingCollaborators.length);
                updateDoc();
          }, (error) => {
              console.log(error.text);              
          });
    };

    const collectDoc = async () => {
        const docRef = doc(db, "post", id || "");
        const docSnap = await getDoc(docRef);  

        let collectedPost = new Post(
            docSnap.id, 
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

        setPost(collectedPost);
        
    }

    const updateDoc = async () => { 
        const docRef = doc(db, "post", id || "");
        await setDoc(docRef, {
            html: post?.html,
            css: post?.css,
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

    useEffect(() => {
        //logout();
        collectDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    
    return (

        <>
            <h1>{post?.pendingCollaborators[post.pendingCollaborators.length-1]}</h1>
                <div className="accept-or-decline-btns">     
                    {/*The only reason to use a form here was to use EMailJS and I needed to send data to the mail in this form*/}
                    <form onSubmit={sendEmailAccept}>
                        <input type="text" name="collaborator" defaultValue={post?.pendingCollaborators[post.pendingCollaborators.length-1]} hidden/>
                        <input type="text" name="post-title" defaultValue={post?.title} hidden/>
                        <input type="text" name="owner" defaultValue={post?.owner} hidden/>
                        
                        <div>
                            <p className="success-msg">{acceptHelp}</p>
                            <button type="submit">Accept request</button>
                        </div>
                    </form>

                    <form onSubmit={sendEmailDecline}>
                        <input type="text" name="collaborator" defaultValue={post?.pendingCollaborators[post.pendingCollaborators.length-1]} hidden/>
                        <input type="text" name="post-title" defaultValue={post?.title} hidden/>
                        <input type="text" name="owner" defaultValue={post?.owner} hidden/>
                        
                        <div>
                            <button type="submit" >Decline</button>
                            <p className="error-msg">{declineHelp}</p>
                        </div>
                    </form>
                </div>
        </>
    );
}