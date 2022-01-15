import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";  
import { Post } from '../../Models/Post';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';


export const ShowPosts = () => {

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);


    // Custom Pagination with pages
    const [pageNumber, setPageNumber] = useState(0);
    const postsPerPage = 5;
    const pagesVisited = pageNumber*postsPerPage;
    const pageCount = Math.ceil(posts.length/postsPerPage);
    
    
    const getPosts = async () => {
        const first = query(collection(db, "post"), orderBy("date"));
        setLoading(true);
        const data = await getDocs(first); 
        storeData(data);
        setLoading(false);
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
                    doc.data().pendingCollaborators
                );

                collectData.push(collectedPost);    
        })      
        setPosts(collectData);
     }

    const displayPosts = posts.slice(pagesVisited, pagesVisited + postsPerPage)
    .map((post) => {
        return(
            <div className="post-div" key={post.id}>
                <Link to={`/edit-post/${post.id}`}><h2 className="app-h2">{post.title}</h2></Link>
                <h3 className="app-h3">{new Intl.DateTimeFormat('en-UK', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(post.date)}</h3>
                <p className="app-p">Created by: {post.owner}</p>
            </div>
        );     
    })
 
    const changePage = (event: any) => {
        const newOffset = (event.selected * postsPerPage) % posts.length;
        setPageNumber(newOffset)
    }

    useEffect(() => {
        getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            {!loading ?<div className="landing-page-container">
                <h1 className="app-h1">Look at the problems people have:</h1>
                <h1 className="app-h1">Posts:</h1>
                {displayPosts}
                

                <ReactPaginate 
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={"pagination-btns"}
                    previousLinkClassName={"previous-btn"}
                    nextClassName={"next-btn"}
                    disabledClassName={"pagniation-disabled"}
                    activeClassName={"pagination-active"}
                />
            </div>: <div className="base-wrapper"><h1 className="app-h1">Loading...</h1></div>}
        </>
    );
}