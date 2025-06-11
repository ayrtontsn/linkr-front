import styled from "styled-components"
import { BACKEND } from "./mock"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import TokenContext from "../contexts/TokenContext"
import Swal from "sweetalert2"
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import { useNavigate } from "react-router-dom";
import { Tooltip } from 'react-tooltip'

export default function postFeed(allPosts, setAllPosts){
    const {token} = useContext(TokenContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPostData, setEditingPostData] = useState(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState(null);
    const navigate = useNavigate();

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

    const handleLike = async (postId) => {

        await axios.put(`${BACKEND}/likepost`, {postId},auth)
        
        const updatedLikePosts  = allPosts.map(post => {
            if (post.id === postId) {
            const userAlreadyLiked = post.likes.some((like) => like.id === token.id);
                return {
                ...post,
                likes: userAlreadyLiked
                    ? post.likes.filter(user => user.id !== token.id) 
                    : [...post.likes, { nome: token.username, id: token.id }]                
                };
            }
            return post;
        });
        setAllPosts(updatedLikePosts);
    };
    
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

    const navigateToUserProfile = (userId) => {
        navigate(`/user/${userId}`);
    };

    function getLikeMessage(likes) {
        const totalLikes = likes.length;

        if (totalLikes === 0) return "";

        const userLiked = likes.some((like) => like.id === token.id);
        const otherLikes = likes.filter((like) => like.id !== token.id);

        if (totalLikes === 1 && userLiked) {
            return "Você curtiu";
        }

        if (userLiked) {
            return `Você${otherLikes.length === 1 ? "e"+otherLikes[0].name  :", "+otherLikes[0].name+" outras "+(otherLikes.length-1)} pessoas curtiram`;
        }

        if (totalLikes === 1) {
            return `${likes[0].name} curtiu`;
        }

        return `${likes[0].name} e ${totalLikes - 1} ${totalLikes - 1 === 1 ? "outra pessoa" : "outras pessoas"} curtiram`;
        };

    return (
        <>
            <NoItens $noitens={allPosts.length}>
                <p>Tudo limpor por aqui, nenhuma postagem no momento...</p>
            </NoItens>
        {allPosts.map(post => 
            <Post key={post.id}>
                <User>
                    <Img 
                        src={post.userImage ||null} 
                        onClick={() => navigateToUserProfile(post.userId)}
                        style={{ cursor: 'pointer' }}
                    />
                    <Username 
                        onClick={() => navigateToUserProfile(post.userId)}
                        data-test="username"
                    >
                        {post.userName}
                    </Username>
                    {token.id === post.userId && (
                        <>
                            <span class="material-symbols-outlined" onClick={() => handleEditClick(post)}>edit</span>
                            <ion-icon name="trash" onClick={() => handleDeleteClick(post.id)}></ion-icon>
                        </>
                    )}
                </User>
                <Content>
                    <Likes 
                    $likeCollor = {post.likes.some((like) => like.id === token.id)}
                    data-tooltip-content = {getLikeMessage(post.likes)}
                    data-tooltip-id = "tooltip-likes"
                    style = {{ cursor: 'pointer' }}
                    >
                        <ion-icon name="heart" onClick={() => handleLike(post.id)}></ion-icon>
                        <p>{post.likes.length} likes</p>
                        <h4> · {getLikeMessage(post.likes)}</h4>
                        <Tooltip id="tooltip-likes" className="custom-tooltip"/>
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

const Username = styled.span`
    color: #FFFFFF;
    font-family: "Lato", sans-serif;
    font-size: 19px;
    cursor: pointer;
    
    &:hover {
        text-decoration: underline;
    }
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
    justify-items: center;
    align-content: end;
    margin: 0;
    width: 10%;
    color: ${props => (props.$likeCollor ? "#FF0000" : "#FFFFFF")};
    ion-icon{
        font-size: 18px;
    }

    p{
        color: #FFFFFF;
        font-size: 11px;
        font-family: "Lato", sans-serif;
        font-weight: 400;
    }

    h4{
        color: #FFFFFF;
        font-size: 11px;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        @media (min-width: 768px) {
            display: none;
        }
    }
    .custom-tooltip {
        @media (max-width: 768px) {
            display: none;   
        }
    }

    @media (max-width: 768px) {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        margin: 10px 0;
    }
`