import styled from "styled-components";
import { BACKEND } from "./mock";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import TokenContext from "../contexts/TokenContext";
import Swal from "sweetalert2";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import { useNavigate } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
import { FiTrash, FiEdit2 } from "react-icons/fi";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

export default function postFeed(allPosts, setAllPosts, routeGetPosts){
    const {token, userProfile} = useContext(TokenContext)
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
            const route = BACKEND+routeGetPosts
            const requisition = axios.get(route, auth)
                                    .then(response => {setAllPosts(response.data)
                                    })
                                    
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
                    : [...post.likes, { nome: userProfile.username, id: token.id }]                
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
        if (userId === token.id) {
            navigate("/user/my-profile");
        } else {
            navigate(`/user/${userId}`);
        }
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
                        src={post.userImage} 
                        onClick={() => navigateToUserProfile(post.userId)}
                        style={{ cursor: 'pointer' }}
                    />
                    <Username 
                        onClick={() => navigateToUserProfile(post.userId)}
                    >
                        {post.userName || userProfile.username}
                    </Username>
                    {token.id === post.userId && (
                    <UpdateDeleteIcons>
                        <FiEdit2 className="user-icon" onClick={() => handleEditClick(post)}/>
                        <FiTrash className="user-icon" onClick={() => handleDeleteClick(post.id)}/>
                    </UpdateDeleteIcons>
                  )}
                </User>
                <Content>
                    <Likes 
                    $likeCollor = {post.likes.some((like) => like.id === token.id)}
                    >
                        {post.likes.some((like) => like.id === token.id) ? (
                            <IoHeartSharp
                            className="heart-icon"
                            style={{ color: "#FF0000" , cursor: 'pointer'}}
                            onClick={() => handleLike(post.id)}
                            />
                        ) : (
                            <IoHeartOutline
                            className="heart-icon"
                            style = {{ cursor: 'pointer' }}
                            onClick={() => handleLike(post.id)}
                            />
                        )}
                        <p                     
                        data-tooltip-content = {getLikeMessage(post.likes)}
                        data-tooltip-id = "tooltip-likes"
                        style = {{ cursor: 'pointer' }}>{post.likes.length} likes</p>
                        <h4> · {getLikeMessage(post.likes)}</h4>
                        <Tooltip id="tooltip-likes" className="custom-tooltip"/>
                    </Likes>
                    <Box>
                        <Description>{post.description}</Description>
                        <MetaData href={post.url} target="_blank">
                        <MetaContent>
                            <MetaTitle>{post.dataTitle}</MetaTitle>
                            <MetaDescription>
                            {post.dataDescription}
                            </MetaDescription>
                            <MetaUrl>{post.url}</MetaUrl>
                        </MetaContent>
                        <MetaImage
                            src={post.dataImage || null}
                            alt="Link preview"
                        />
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
    width: 100%;
    border-radius: 16px;
    background-color: #171717;
    padding: 20px;
    margin-bottom: 20px;
    position: relative;

    @media (max-width: 768px) {
        border-radius: 0;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
`

const User = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;

  @media (max-width: 768px) {
    position: static;
  }
`

const UpdateDeleteIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  position: absolute;
  right: 20px;
  bottom: 233px;
  .user-icon {
    font-size: 25px;
    color: #ffffff;
    cursor: pointer;
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  @media (max-width: 768px) {
    position: static;
  }
`;

const Username = styled.span`
    color: #ffffff;
    position: absolute;
    z-index: 0;
    bottom: 229px;
    left: 30px;
    font-family: "Lato", sans-serif;
    font-size: 19px;
    font-weight: 400;
    background-color: #333333;
    padding-left: 50px;
    padding-right: 8px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-radius: 15px;
    @media (max-width: 768px) {
        position: absolute;
        bottom: 306px;
        left: 85px;
        border-radius: 0;
        padding: 0;
        background-color: transparent;
        font-size: 16px;
    }
`

const Img = styled.img`
    width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #333333;
  position: absolute;
  z-index: 1;
  bottom: 220px;
  @media (max-width: 768px) {
    position: static;
    border: none;
    margin-right: 15px;
    width: 40px;
    height: 40px;
  }
`

const MetaData = styled.a`
  display: flex;
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  overflow: hidden;
  text-decoration: none;
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const MetaContent = styled.div`
  flex: 1;
  padding: 15px;
`;

const MetaTitle = styled.h3`
  color: #cecece;
  font-family: "Lato", sans-serif;
  font-size: 16px;
  margin: 0 0 10px 0;
`;

const MetaDescription = styled.p`
  color: #9b9595;
  font-family: "Lato", sans-serif;
  font-size: 11px;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaUrl = styled.p`
  color: #9b9595;
  font-family: "Lato", sans-serif;
  font-size: 11px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaImage = styled.img`
  width: 153px;
  height: 153px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const Content = styled.div`
    margin-top: 55px;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    margin-top: 0;
    align-items: flex-start;
  }
`

const Description = styled.p`
  color: #b7b7b7;
  font-family: "Lato", sans-serif;
  font-size: 17px;
  margin-bottom: 15px;
`;

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
  flex: 1;
`;

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
    .heart-icon {
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