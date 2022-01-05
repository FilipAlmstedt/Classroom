import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, startAfter, limit, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";  
import { Post } from '../Models/Post';
import { Link } from 'react-router-dom';

export const LandingPage = () => {

    const [posts, setPosts] = useState<Post[]>([]);

    const first = query(collection(db, "post"), orderBy("date"), limit(3));
    

    const getPosts = async () => {

        const data = await getDocs(first); 
        storeData(data);

    }

    const getMoreDocs = async () => {
  
        const previousData = await getDocs(first); 
        const lastVisible = previousData.docs[previousData.docs.length-1];
        const next = query(collection(db, "post"),
        orderBy("date"),
        startAfter(lastVisible),
        limit(3));

        const data = await getDocs(next);
        storeData(data);
        
    }

     const storeData = (data: QuerySnapshot<DocumentData>) => {
        const collectData: Post[] = [];

        data.forEach(
            (doc) => {
           
            let collectedPost = new Post(
                doc.id, 
                doc.data().title,
                doc.data().desc,
                doc.data().comments, 
                doc.data().html,
                doc.data().css,
                doc.data().projectOwner,
                doc.data().members,
                doc.data().date,
            );
            collectData.push(collectedPost);
            
        })      
        setPosts(collectData);
     }

    useEffect(() => {
        getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <div className="landing-page-container">
                <h1>This is the LANDING PAGE</h1>
                <h1>Posts:</h1>
                {posts.map((post) => {
                    return(
                        <div key={post.id}>
                            <Link to={`/edit-post/${post.id}`}><h2>{post.title}</h2></Link>
                            <h3>{new Intl.DateTimeFormat('en-UK', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(post.date)}</h3>
                        </div>
                    );     
                })}
                <button onClick={getMoreDocs}>Load more!</button>
            </div>
        </>
    );
}