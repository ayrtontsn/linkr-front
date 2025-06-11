import { useContext, useEffect, useState } from "react";
import TokenContext from "../contexts/TokenContext";
import axios from "axios";
import { BACKEND } from "./mock";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function suggestionsUsers(){
    const {token, setToken} = useContext(TokenContext);
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([])
    const auth = {
        headers: {
            Authorization: `Bearer ${token.token}`
        }
    }

    useEffect( () => {
        const suggestionsReq = async () => {
            try {
                const response = await axios.get(`${BACKEND}/suggestions`,auth)
                setSuggestions(Array.isArray(response.data) ? response.data : [])
            } catch (e){
                setSuggestions([])
            }
        }
        suggestionsReq()
        },[token?.token])
    
    const navigateToUserProfile = (userId) => {
        navigate(`/user/${userId}`);
    };

    return(
        
        <Suggestion>
            <Title>
                <h1>Suguestões para seguir</h1>
            </Title>
            
            {suggestions.map (userSug => 
                <User key={userSug.id} onClick={() => navigateToUserProfile(userSug.id)}>
                    <ImageSuggest src={userSug.image}></ImageSuggest>
                    <p>{userSug.username}</p>
                </User>
            )}
        </Suggestion>
    )

}

const Suggestion = styled.div`
    display: block;
    color: #FFFFFF;
`

const User = styled.div`
    display: flex;
    height: 50px;
    background-color: #333333;
    margin: 10px;
    align-items: center;
    border-radius: 10px;

    p{
        font-size: 19px;
        font-weight: 400;
        font-family: "Lato", sans-serif;
    }
`

const Title = styled.div`
    justify-items: center;
    h1{
        font-family: "Oswald", sans-serif;
        font-weight: 400;
        font-size: 27px;
    }
`

const ImageSuggest = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin: 10px;
`