import styled from "styled-components";
import newPost from "../components/newPost";
import { useContext, useEffect, useState, useRef } from "react";
import posts from "../components/posts";
import { useNavigate } from "react-router-dom";
import TokenContext from "../contexts/TokenContext";
import suggestionsUsers from "../components/suggestions";
import postFeed from "../components/posts";

export default function FeedPage(){
    const navigate = useNavigate();
    const {token, setToken } = useContext(TokenContext);
    const [activeMenu, setActiveMenu] = useState(false)
    const [activeNewPost, setActiveNewPost] = useState(false)
    const menuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setActiveMenu(false);
        navigate("/");
    };

    const handleMenuToggle = () => {
        setActiveMenu(!activeMenu);
    };

    const handleMenuItemClick = () => {
        setActiveMenu(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(false);
            }
        }

        if (activeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenu]);

    useEffect(() => {
        if(!token){
            navigate("/")
        }
    },[])

    return(
        <Back>
            <Header>
                <h1>Linkr</h1>
                <NewPost onClick={() => setActiveNewPost(!activeNewPost)}>
                    <ion-icon name="create"></ion-icon>
                </NewPost>
                <MenuContainer ref={menuRef}>
                    <Menu onClick={handleMenuToggle}>
                        <Img></Img>
                        <ion-icon name="menu"></ion-icon>
                    </Menu>
                    <AbaMenu $active = {activeMenu}>
                        <BotaoMenu onClick={handleMenuItemClick}>Meu Perfil</BotaoMenu>
                        <BotaoMenu onClick={handleLogout}>Sair</BotaoMenu>
                    </AbaMenu>
                </MenuContainer>
            </Header>
            <Title><h2>Feed</h2></Title>
            <Feed>
                <Post>
                    {newPost(activeNewPost)}
                    {postFeed()}
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
    width: 100%;
    height: 100%;
    
`

const Post = styled.div`
    display: block;
    justify-items: center;
    overflow-y: scroll;
    height: calc(98% - 125px);
    width: 100%;
`

const Suggestions = styled.div`
    display: block;
    height: fit-content;
    width: 328px;
    background-color: #151515;
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
`
const Header = styled.div`
    display: flex;
    width: 100%;
    height: 72px;
    align-items: center;
    justify-content: space-between;
    padding: 0 2% 0 2% ;
    background-color: #151515;

    z-index: 2;

    h1 {
        font-family: "Passion One", sans-serif;
        color: #FFFFFF;
        font-size: 49px;
        font-weight: 700;
        line-height: 100%;
        letter-spacing: 5%;
        word-spacing: 5%;

    }

    @media (max-width: 768px) {
        position: fixed;
        bottom: 0;
        left: 0;
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

const MenuContainer = styled.div`
    position: relative;
`

const Menu = styled.div`
    display: flex;
    align-items:center;
    justify-content: center;
    width: 97px;
    height: 80%;
    font-size: 50px;
    color: #FFFFFF;
    background-color: #333333;
    border-radius: 10px;
    padding: 3px;
    cursor: pointer;
`

const Img = styled.div`
    border-radius: 10px;
    width:53px;
    height: 53px;
    background-color: #f10909;

    @media (max-width: 768px) {
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

const AbaMenu = styled.div`
    display: ${props => (props.$active ? "block" : "none")};
    width: 100px;
    position: fixed;
    right: 5px;

    @media (max-width: 768px) {
        bottom: 80px;
    }
    
    @media (min-width: 769px) {
        top: 80px;
    }

`

const BotaoMenu = styled.button`
        background-color: #000000;
        color: #FFFFFF;
        width: 100%;
        height: 40px;
        margin-top: 5px;
        border: 0;
        border-radius: 5px;
        cursor: pointer;
`