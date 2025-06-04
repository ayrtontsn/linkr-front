import axios from "axios";
import { useState } from "react"
import styled from "styled-components"
import { BACKEND, TOKEN_USER } from "./mock";

export default function newPost(activeNewPost){
    const [url, setUrl] = useState("")
    const [description, setDescription] = useState("")

    const auth = {
        headers: {
            Authorization: `Bearer ${TOKEN_USER}`
        }
    }

    function createPost(e) {
        e.preventDefault();

        const requisition = axios.post(BACKEND,{
            url,
            description
        }, auth)
        .then((response) => {
            setUrl(()=>""),
            setDescription(()=>"")
        })
        .catch((e) => {
            alert(e.response.data.message)
        })
    }

    return(
        <NewPost onSubmit={createPost} $active = {activeNewPost}>
            <Img></Img>
            <NewPostForm>
                O que você tem pra compartilhar hoje?
                <Enter 
                    placeholder="  http://..."
                    required
                    type="url"
                    onChange={e => setUrl(e.target.value)}
                    value={url}
                    />
                <Enter
                    placeholder="  Um artigo incrível sobre #javascript"
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                    />
                <Button $url={url.length} type="submit">Publicar</Button>
            </NewPostForm>
        </NewPost>
    )
}

const NewPost = styled.form`
    display:flex;
    width: 90%;
    max-width: 660px;
    border-radius: 10px;
    background-color: #FFFFFF;
    flex-wrap: wrap;
    justify-content: center;
    padding:10px 10px 0 10px;
    font-weight: 300;
    font-size: 20px;

    @media (max-width: 680px) {
        display: ${props => (props.$active ? "flex" : "none")};
        position: fixed;
        bottom: 80px;
        left: 2.5%;
    }
`

const Img = styled.div`
    border-radius: 100%;
    width:50px;
    height: 50px;
    background-color: #f10909;

    @media (max-width: 680px) {
        display: none;
    }
`
const NewPostForm = styled.div`
    width: calc(100% - 70px);
    height:150px;
    display: block;
    padding: 10px 10px 0 10px;
    color: #707070;

    @media (max-width: 680px){
        width: 100vw;
    }
`

const Enter = styled.input`
    width: 100%;
    height: 30px;
    border-radius: 5px;
    border: 0;
    background-color: #EFEFEF;
    margin-top: 5px;

    font-size: 15px;
    font-weight: 300;
    text-align: left;
`

const Button = styled.button`
    height: 31px;
    width: 115px;
    background-color: #1877F2;
    color: #FFFFFF;
    border-radius: 5px;
    border: 0;
    margin-top: 5px;
    opacity:${props => (props.$url?1:0.3)};
`
