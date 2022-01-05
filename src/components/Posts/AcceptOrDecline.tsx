import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { Post } from "../../Models/Post";

export const AcceptOrDecline = () => {

    const {id} = useParams(); 
    const [post, setPost] = useState<Post>();

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
            title: post?.title

        }).then(() => {
            console.log("Updated post");
        })
    }

    const accept = () => {
        let incomingMember: string = auth.currentUser?.email?.toString() || "";
     
        post?.members.push(incomingMember);
        setPost(post);

        console.log(post?.members);
        updateDoc();
    }

    useEffect(() => {
        collectDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (

        <>
            <h1>Accept or decline invite</h1>

            <button onClick={accept}>Accept</button>
            <button>Decline</button>
        </>
    );
}