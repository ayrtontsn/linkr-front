import styled from "styled-components"
import { BACKEND } from "./mock"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import TokenContext from "../contexts/TokenContext"
import Swal from "sweetalert2"
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";

export default function postFeed(allPosts, setAllPosts){
    const {token} = useContext(TokenContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPostData, setEditingPostData] = useState(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState(null);

    const auth = {
        headers: {
            Authorization: `Bearer ${token.token}`
        }
    }

    useEffect(() =>{
            if (!allPosts) {
            const requisition = axios.get(`${BACKEND}/allposts`, auth)
                                    .then(response => {setAllPosts(response.data)})
                                    .catch(e => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Erro no carregamento dos posts",
                                            text: "Um erro aconteceu. Atualize a página ou tente novamente em alguns minutos.",
                                            confirmButtonText: "OK",
                                            confirmButtonColor: "#1877f2",
                                        })
                                    })
                                }
        }, [allPosts, setAllPosts])

    if(!allPosts){
        return(
            <Loading>
                {(<Oval
                    visible={true}
                    height="100"
                    width="100"
                    color="#52B6FF"
                    secondaryColor="#FFFFFF"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />)}
            </Loading>
        )
    }

    async function like(postId) {
        console.log(auth)
        console.log(postId)
        const requisition = axios.put(`${BACKEND}/likepost`, postId,auth)
                                .then(response => {setAllPosts(response.data)})
    }
    
    const handleEditClick = (post) => {
        setEditingPostData(post);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (postId) => {
        setDeletingPostId(postId);
        setIsModalDeleteOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalDeleteOpen(false);
        setEditingPostData(null);
        setDeletingPostId(null);
    };

    const handleSavePost = (updatedPostData) => {
        setAllPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === updatedPostData.id ? { ...post, description: updatedPostData.description, url: updatedPostData.url } : post
            )
        );
    };

    const handleDeletePost = (postId) => {
        setAllPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    };

    return (
        <>
            <NoItens $noitens={allPosts.length}>
                <p>Tudo limpor por aqui, nenhuma postagem no momento...</p>
            </NoItens>
        {allPosts.map(post => 
            <Post key={post.id}>
                <User>
                    <UserInfo>
                        <Img src={post.userImage ||null}></Img>
                        {post.userName}
                    </UserInfo>

                    {token.id === post.userId && (
                    <UserInfo>
                        <ion-icon name="create" onClick={() => handleEditClick(post)}></ion-icon>
                        <ion-icon name="trash" onClick={() => handleDeleteClick(post.id)}></ion-icon>
                    </UserInfo>
                    )}
                </User>
                <Content>
                    <Likes>
                        <ion-icon name="heart" onClick={() => like(post.id)}></ion-icon>
                        <p>{post.likes.length} likes</p>
                    </Likes>
                    <Box>
                        <Title><h1>{post.description}</h1></Title>
                        <MetaData href={post.url} target="_blank">
                            <Title >
                                <h2>{post.dataTitle}</h2>
                                <h3>{post.dataDescription}</h3>
                                <p>{post.url}</p>
                            </Title>
                            <ImgMetaData src={post.dataImage || null}></ImgMetaData>
                        </MetaData>
                    </Box>
                </Content>
            </Post>
        )

        }
        <EditPostModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        postData={editingPostData}
                        onSave={handleSavePost}
                    />
        <DeletePostModal
                        isOpen={isModalDeleteOpen}
                        onClose={handleCloseModal}
                        postId={deletingPostId}
                        onDelete={handleDeletePost}
                        />
        </>
    )
}


const Post = styled.div`
    width: 90%;
    max-width: 660px;
    border-radius: 10px;
    background-color: #171717;
    flex-wrap: wrap;
    justify-content: center;
    padding:10px;
    margin: 20px ;
    font-weight: 300;
    font-size: 20px;

    @media (max-width: 768px) {
        width: 100%;
        border-radius: 0;
    }
`

const User = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    color: #FFFFFF;
`

const UserInfo = styled.div`
    align-items: center;
    display: flex;
`

const Img = styled.img`
    border-radius: 100%;
    width:50px;
    height: 50px;
    background-color: #f10909;
    margin-right:10px;
`

const MetaData = styled.a`
    display: inline-flex;
    border: 1px solid #4C4C4C;
    border-radius: 10px;
    width: 100%;
    justify-content: space-between;
    text-decoration: none;
`

const Content = styled.div`
    display: flex;
    flex-direction: row;
    box-sizing: content-box;
    align-items: end;
    width: 100%;
    height: 100%;

    @media (max-width: 768px) {
        flex-direction: column-reverse;
        align-items: start;
    }
`

const Title = styled.div`

    display: block;
    flex-wrap: wrap;
    align-content: space-around;
    margin: 12px 0 12px 12px;
    width: calc( 100% - 168px);


    h1{
        font-weight: 300;
        font-size: 16px;
        color: #B7B7B7;
        margin: 0 -12px ;
        width: calc( 100% + 158px);
        
    }

    h2{
        font-weight: 400;
        font-size: 16px;
        color: #CECECE;
        padding-bottom: 5px;

        @media (max-width: 768px) {
            font-size: 12px;
        }

    }

    h3{
        font-weight: 300;
        font-size: 11px;
        color: #9B9595;
        height: 60px;
        margin-bottom: 5px;
        box-sizing: border-box;
        overflow: hidden;

        @media (max-width: 768px) {
            max-height: 24px;
            width: calc( 100% - 100px);
        }
    }

    p{  
        display: flex;
        width: 100%;
        height: 12px;
        font-weight: 300;
        font-size: 11px;
        font-style: italic;
        color: #9B9595;
        box-sizing: border-box;
        overflow: hidden;
    }

    @media (max-width: 768px) {
        max-height: 100px;
    }
`

const ImgMetaData = styled.img`
    border-radius: 10px;
    width:153px;
    height: 153px;

    @media (max-width: 768px) {
        width:100px;
        height: 100px;
    }
`

const Box = styled.div`
    display: block;
    width: 100%;

    @media (min-width: 769px) {
        width: 90%;
    }
`

const Loading = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 100px;
`

const NoItens = styled.div`
    display: ${props => (props.$noitens ? "none" : "flex")};
    font-size: 16px;
    font-weight: 400;
    text-align: left;
    color: #FFFFFF;

    margin: 50px;
`

const Likes = styled.div`
    flex-direction: column;
    width: 10%;
    ion-icon{
        font-size: 36px;
        color: #FFFFFF;
        padding: 0 16px;     
    }

    p{
        color: #FFFFFF;
        size: 11px;
        font-family: "Lato", sans-serif;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    }
`