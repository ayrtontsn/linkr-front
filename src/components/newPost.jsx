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
    const {token, userProfile} = useContext(TokenContext)

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
                    userImage: userProfile.image,
                    userName: userProfile.username,
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
        }
    }

    return(
        <NewPost onSubmit={createPost} $active = {activeNewPost}>
            <Img src={userProfile.image || null}></Img>
            <NewPostForm>
                O que você tem pra compartilhar hoje?
                <FormDiv>
                    <Enter 
                        placeholder="  http://..."
                        required
                        type="url"
                        onChange={e => setUrl(e.target.value)}
                        value={url}
                        $size="30px"
                        />
                    <Enter
                        placeholder="  Um artigo incrível sobre #javascript"
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                        $size="66px"
                        />
                    <Button
                        type="submit"
                        $disabled={buttonPublicar==="Publicar" && url?false:true}
                    >{buttonPublicar}</Button>
                </FormDiv>
            </NewPostForm>
        </NewPost>
    )
}

const NewPost = styled.form`
    display:flex;
    width: 100%;
    max-width: 660px;
    border-radius: 10px;
    background-color: #FFFFFF;
    flex-wrap: wrap;
    justify-content: center;
    padding:10px 10px 0 10px;
    font-weight: 300;
    font-size: 20px;
    margin-bottom: 20px;

    z-index: 2;

    @media (max-width: 768px) {
        display: ${props => (props.$active ? "flex" : "none")};
        max-width: 95%;
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translate(-50%, 0);

        padding: 0;
        padding-bottom: 25px;
        border-radius: 15px;
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
    display: block;
    flex-wrap: wrap;
    padding: 10px;
    color: #707070;

    @media (max-width: 768px){
        width: 100%;
    }
`
const FormDiv = styled.div`
    display:flex;
    flex-wrap: wrap;
    justify-content: end; 
`

const Enter = styled.input`
    width: 100%;
    height: ${props => (props.$size)};
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
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        display: flex;
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        border-top-right-radius: 0px;
        border-top-left-radius: 0px;
    }
`
