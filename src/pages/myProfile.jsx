import styled from "styled-components";
import newPost from "../components/newPost";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenContext from "../contexts/TokenContext";
import postFeed from "../components/posts";
import EditProfile from "../components/EditProfile";
import Header from "../components/Header";

export default function MyProfilePage(){
    const navigate = useNavigate();
    const { token } = useContext(TokenContext);
    const [activeNewPost, setActiveNewPost] = useState(false)
    const [allPosts, setAllPosts] = useState(null);

    const handleNewPost = (newPost) => {
        setAllPosts(currentPosts => [newPost, ...(currentPosts || [])]);
    };

    const handleNewPostToggle = () => {
        setActiveNewPost(!activeNewPost);
    };

    useEffect(() => {
        if(!token.token){
            navigate("/")
        }
    },[])

    return(
        <Back>
            <Header 
                showNewPostButton={true}
                onNewPostToggle={handleNewPostToggle}
                showSearchButton={true}
            />
            <ProfileEdit>
                {EditProfile()}
            </ProfileEdit>
            <Title><h2>Meus Posts</h2></Title>
            <Post>
                <NewPost>
                    {newPost(activeNewPost, handleNewPost)}
                </NewPost>
                {postFeed({allPosts, setAllPosts, routeGetPosts: `/posts/user/${token.id}`})}
            </Post>


        </Back>
    )

}

const ProfileEdit = styled.div`
    display: block;
    width: 100%;
    max-width: 1019px;
    justify-items: end;
    align-content: end;
    padding: 70px 0 0 0;

    @media (max-width: 768px) {
        padding: 0;
    }
`

const Post = styled.div`
    width: 100%;
  max-width: 630px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Back = styled.div`
    position: fixed;
    display: block;
    justify-items: center;
    background-color: #333333;
    width: 100vw;
    height: 100%;
    left: 0;
    overflow-y:  scroll;

    @media (max-width: 768px) {
        height: calc(100% - 65px);
    }
`

const NewPost = styled.div`
    display: flex;
    align-items:center;
    justify-content: center;
    font-size: 50px;
    color: #FFFFFF;

    @media (min-width: 769px) {
        display: none;
    }
`

const Title = styled.div`
    
    display: contents;
    width: 100vw;

    h2{
        color: #FFFFFF;
        font-family: "Passion One", sans-serif;
        font-size: 43px;
        font-weight: 700px;
        margin: 30px;
    }
`
