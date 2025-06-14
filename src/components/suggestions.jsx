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
                <User 
                key={userSug.id} onClick={() => navigateToUserProfile(userSug.id)} $isFollower={userSug.follower}>
                    <UserSuggest>
                        <ImageSuggest src={userSug.image}></ImageSuggest>
                        <p>{userSug.username}</p>
                    </UserSuggest>
                    <h4 > Segue Você </h4>
                </User>
            )}
        </Suggestion>
    )

}

const Suggestion = styled.div`
    display: block;
    color: #FFFFFF;
    border-radius: 20px;
`

const User = styled.div`
    display: flex;
    height: 50px;
    background-color: #333333;
    margin: 10px;
    padding-right: 10px;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    cursor: pointer;

    p{
        font-size: 19px;
        font-weight: 400;
        font-family: "Lato", sans-serif;
    }

    h4{
        display: ${props => (props.$isFollower?"flex":"none")};
        font-size: 12px;
        font-weight: 300;
        font-family: "Lato", sans-serif;
    }
`
const UserSuggest = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
`
const Title = styled.div`
    justify-items: center;
    h1{
        font-family: "Oswald", sans-serif;
        font-weight: 400;
        font-size: 27px;
    }
    padding:10px;
    margin: 0 10px;
    border-bottom: 1px solid #484848;
`

const ImageSuggest = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin: 10px;
`