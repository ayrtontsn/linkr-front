import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../contexts/userContext";
import tokenContext from "../contexts/tokenContext";
import styled from "styled-components";

export default function FeedPage(){
    //const navigate = useNavigate();
    //const {user, setUser} = useContext(userContext)
    //const {token, useToken} = useContext(tokenContext)

    return(
        <Back>
            <Header>
                <h1>Linkr</h1>
                <Menu></Menu>
            </Header>
        </Back>
    )

}

const Back = styled.div`
    display: block;
    position: fixed;
    background-color: #333333;
    width: 100vw;
    height: 100vh;
    left: 0;
`
const Header = styled.div`
    display: flex;
    position: fixed;
    left: 0;
    top: 0;
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
`

const Menu = styled.div`
    display: block;
    background-color: #1014d6;
    width: 97px;
    height: 80%;
`