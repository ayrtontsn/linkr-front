import styled from "styled-components";
import newPost from "../components/newPost";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenContext from "../contexts/TokenContext";
import suggestionsUsers from "../components/suggestions";
import postFeed from "../components/posts";
import Header from "../components/Header";

export default function FeedPage(){
    const navigate = useNavigate();
    const {token } = useContext(TokenContext);
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
            <Title><h2>Feed</h2></Title>
            <Feed>
                <Post>
                    {newPost(activeNewPost, handleNewPost)}
                    {postFeed(allPosts, setAllPosts, "/allposts")}
                </Post>
                <Suggestions>
                    {suggestionsUsers()}
                </Suggestions>
            </Feed>

        </Back>
    )

}
const Feed = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    max-width: 990px;
    margin-top: 30px;
    @media (max-width: 1023px) {
        justify-content: center;
    }
`

const Post = styled.div`
    width: 100%;
  max-width: 630px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Suggestions = styled.div`
    display: block;
    height: fit-content;
    width: 328px;
    background-color: #151515;
    border-radius: 15px;
    @media (max-width: 1024px) {
        display: none;
    }
`

const Back = styled.div`
  position: fixed;
  display: block;
  justify-items: center;
  background-color: #333333;
  width: 100vw;
  height: 100%;
  left: 0;
  overflow-y: auto;
  padding-bottom: 80px;
`;

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
        margin: 10px;
    }
`