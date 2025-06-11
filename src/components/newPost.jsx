import axios from "axios";
import { useContext, useState } from "react"
import styled from "styled-components"
import { BACKEND } from "./mock";
import TokenContext from "../contexts/TokenContext";
import Swal from "sweetalert2";

export default function newPost(activeNewPost, onNewPost){
    const [url, setUrl] = useState("")
    const [description, setDescription] = useState("")
    const [buttonPublicar, setbuttonPublicar] = useState("Publicar")
    const {token} = useContext(TokenContext)

    const auth = {
        headers: {
            Authorization: `Bearer ${token.token}`
        }
    }

    async function createPost(e) {
        e.preventDefault();
        setbuttonPublicar("Carregando...")

        try {
             const response = await axios.post(`${BACKEND}/newpost`,{
                url,
                description
            }, auth)

            if (onNewPost && response.data) {
                // Complete the post data with user information
                const completePost = {
                    ...response.data,
                    userImage: token.image,
                    userName: token.username,
                    userId: token.id,
                    likes: response.data.likes || []
                };
                
                onNewPost(completePost);
            }

            setUrl("")
            setDescription("")
            setbuttonPublicar("Publicar")
        } catch (e) {
            
            Swal.fire({
                icon: "error",
                title: "Erro no link",
                text: "Houve um erro ao publicar seu link.",
                confirmButtonText: "OK",
                confirmButtonColor: "#1877f2",
            });
            setbuttonPublicar("Publicar")
            // console.log(e)
        }
    }

    return(
        <NewPost onSubmit={createPost} $active = {activeNewPost}>
            <Img src={token.image || null}></Img>
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
                <Button
                    type="submit"
                    $disabled={buttonPublicar==="Publicar" && url?false:true}
                >{buttonPublicar}</Button>
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

    z-index: 2;

    @media (max-width: 768px) {
        display: ${props => (props.$active ? "flex" : "none")};
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translate(-50%, 0);
    }
`

const Img = styled.img`
    border-radius: 100%;
    width:50px;
    height: 50px;

    @media (max-width: 768px) {
        display: none;
    }
`
const NewPostForm = styled.div`
    width: calc(100% - 70px);
    height:150px;
    display: block;
    padding: 10px 10px 0 10px;
    color: #707070;

    @media (max-width: 768px){
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
    opacity:${props => (props.$disabled?0.3:1)};
`
