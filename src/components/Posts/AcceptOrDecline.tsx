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

    // Messages that appears when the user presses the buttons eithe accept or decline
    const [acceptHelp, setAcceptHelp] = useState("");
    const [declineHelp, setDeclineHelp] = useState("");

    const logout = async () => {
        await signOut(auth);
    }

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

    const accept = () => {
        // let incomingMember: string = post?.pendingCollaborators[post?.pendingCollaborators.length-1] || "";
     
        // post?.members.push(incomingMember);
        // post?.pendingCollaborators.splice(0,post?.pendingCollaborators.length);
        // setPost(post);

        setAcceptHelp("You have approved help from the account: " +post?.pendingCollaborators[post.pendingCollaborators.length-1] + " This account has now access to edit your code.")
        updateDoc();
    }

    const decline = () => {
        setDeclineHelp("You have declined help from the account: "+post?.pendingCollaborators[post.pendingCollaborators.length-1])
    }

    useEffect(() => {
        logout();
        collectDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    console.log(post);
    
    return (

        <>
            <h1>{post?.pendingCollaborators}</h1>

            {/*The only reason to use a form here was to use EMailJS and I needed to send data to the mail in this form*/}
            <form onSubmit={sendEmail}>
                <input type="text" name="new-member-email" defaultValue={""} hidden/>
                <input type="text" name="post-title" defaultValue={""} hidden/>
                <input type="text" name="link" defaultValue={""} hidden/>
                
                <div>
                    <p className="success-msg">{acceptHelp}</p>
                    <button type="submit" onClick={accept}>Want to help? Send invite request!</button>
                    <button onClick={decline}>Decline</button>
                    <p className="error-msg">{declineHelp}</p>
                </div>
            </form>
            
        </>
    );
}