import styled from "styled-components";
import newPost from "../components/newPost";
import { useState } from "react";

export default function FeedPage(){
    //const navigate = useNavigate();
    //const {user, setUser} = useContext(userContext)
    //const {token, useToken} = useContext(tokenContext)
    const [activeMenu, setActiveMenu] = useState(false)
    const [activeNewPost, setActiveNewPost] = useState(false)

    return(
        <Back>
            <Header>
                <h1>Linkr</h1>
                <NewPost onClick={() => setActiveNewPost(!activeNewPost)}>
                    <ion-icon name="create"></ion-icon>
                </NewPost>
                <Menu onClick={() => setActiveMenu(!activeMenu)}>
                    <Img></Img>
                    <ion-icon name="menu"></ion-icon>
                </Menu>
                <AbaMenu $active = {activeMenu}>
                    <BotaoMenu >Meu Perfil</BotaoMenu>
                    <BotaoMenu>Sair</BotaoMenu>
                </AbaMenu>

            </Header>
            <Title><h2>Feed</h2></Title>
            {newPost(activeNewPost)}
        </Back>
    )

}

const Back = styled.div`
    position: fixed;
    display: block;
    justify-items: center;
    background-color: #333333;
    width: 100vw;
    height: 100vh;
    left: 0;
`
const Header = styled.div`
    display: flex;
    width: 98%;
    height: 72px;
    align-items: center;
    justify-content: space-between;
    padding: 0 1% 0 1% ;
    background-color: #151515;

    z-index: 2;

    h1 {
        color: #FFFFFF;
        font-size: 49px;
        font-weight: 700;
        line-height: 100%;
        letter-spacing: 5%;

    }

    @media (max-width: 680px) {
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

    @media (min-width: 681px) {
        display: none;
    }
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
`

const Img = styled.div`
    border-radius: 10px;
    width:53px;
    height: 53px;
    background-color: #f10909;

    @media (max-width: 680px) {
        display: none;
    }
`

const Title = styled.div`
    
    display: contents;
    width: 100vw;

    h2{
        color: #FFFFFF;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
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

    @media (max-width: 680px) {
        bottom: 80px;
    }
    
    @media (min-width: 681px) {
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
`