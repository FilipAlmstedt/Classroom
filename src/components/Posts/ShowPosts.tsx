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
    const postsPerPage = 3;
    const pagesVisited = pageNumber*postsPerPage;
    const pageCount = Math.ceil(posts.length/postsPerPage);
    
    const getPosts = async () => {
        const first = query(collection(db, "post"), orderBy("date", "desc"));
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
                    doc.data().completedPost, 
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
                { post?.completedPost ? <div className="app-div status-div"><div className="checkmark-icon"></div><h4 className="post-status app-h4">Solved</h4></div> : <h4 className="post-status-ongoing app-h4">Ongoing problem...</h4>}
                <Link className="post-title-header" to={`/edit-post/${post.id}`}><h3 className="post-title-header app-h3">{post.title}</h3></Link>
                <p className="date-text app-p">Created: {new Intl.DateTimeFormat('en-UK', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(post.date)} by: <b className="owner-text">{post.owner}</b></p>

                <div className="show-category-and-members-div">
                    <div className="show-category-div">
                        <div className="category-icons category-icon-html"></div>
                        <div className="category-icons category-icon-css"></div>
                    </div>
                    <div className="collaborator-info">
                        <p className="member-info app-p"><b>Collaborators: {post.members.length}</b></p>
                    </div>
                </div>

                <hr className="app-hr"/>
            </div>

        );   

    })
 
    const changePage = (event: any) => { 
        setPageNumber(event.selected)
    }

    useEffect(() => {
        getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            {!loading ?
            <main className="show-posts-container">
                
                <div className="page-header">
                    <h1 className="app-h1">Top Recent Problems</h1>
                </div>

                <div className="show-all-posts-container">
                    {displayPosts}
                </div>
                

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
            </main>
            : 
            <main className="base-wrapper">
                <h1 className="app-h1">Loading...</h1>
            </main>
            }
        </>
    );
}