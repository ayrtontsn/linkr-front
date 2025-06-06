import styled from "styled-components"
import { BACKEND } from "./mock"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Oval } from "react-loader-spinner"
import TokenContext from "../contexts/TokenContext"

export default function postFeed(){
    const {token, setToken} = useContext(TokenContext)
    const userName = "ayrton"
    const [allPosts, setAllPosts] = useState("")

    const auth = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() =>{
            const requisition = axios.get(`${BACKEND}/allposts`, auth)
                                    .then(response => {setAllPosts(response.data)})
                                    .catch(e => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Erro no carregamento dos posts",
                                            text: "Um erro aconteceu. Atualize a página ou tente novamente em alguns minutos.",
                                            confirmButtonText: "OK",
                                            confirmButtonColor: "#1877f2",
                                        })
                                    })
            
        }, [])

    if(!allPosts){
        console.log("teste")
        return(
            <Loading>
                {(<Oval
                    visible={true}
                    height="100"
                    width="100"
                    color="#52B6FF"
                    secondaryColor="#FFFFFF"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />)}
            </Loading>
        )
    }

    async function like(postId) {
        const requisition = axios.put(`${BACKEND}/likepost`, {postId},auth)
                                .then(response => {setAllPosts(response.data)})
    }
    
    return (
        <>
            <NoItens $noitens={allPosts.length}>
                <p>Tudo limpor por aqui, nenhuma postagem no momento...</p>
            </NoItens>
        {allPosts.map(post => 
            <Post key={post.id}>
                <User>
                    <Img src={post.userImage ||null}></Img>
                    {post.userName}
                </User>
                <Content>
                    <Likes>
                        <ion-icon name="heart" onClick={like}></ion-icon>
                        <p>{post.likes.length} likes</p>
                    </Likes>
                    <Box>
                        <Title><h1>{post.description}</h1></Title>
                        <MetaData href={post.url} target="_blank">
                            <Title >
                                <h2>{post.dataTitle}</h2>
                                <h3>{post.dataDescription}</h3>
                                <p>{post.url}</p>
                            </Title>
                            <ImgMetaData src={post.dataImage || null}></ImgMetaData>
                        </MetaData>
                    </Box>
                </Content>
            </Post>
        )

        }
        </>
    )
}


const Post = styled.div`
    display:flex;
    width: 90%;
    max-width: 660px;
    border-radius: 10px;
    background-color: #171717;
    flex-wrap: wrap;
    justify-content: center;
    padding:10px;
    margin: 10px ;
    font-weight: 300;
    font-size: 20px;
`

const User = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    color: #FFFFFF;
`

const Img = styled.img`
    border-radius: 100%;
    width:50px;
    height: 50px;
    background-color: #f10909;
    margin-right:10px;
`

const MetaData = styled.a`
    display: flex;
    border: 1px solid #4C4C4C;
    border-radius: 10px;

    text-decoration: none;

`

const Content = styled.div`
    display: flex;
    flex-direction: row;
    align-items: end;

    @media (max-width: 680px) {
        flex-direction: column-reverse;
        align-items: start;
    }
`

const Title = styled.div`

    display: block;
    margin: 12px;


    h1{
        font-weight: 300;
        font-size: 16px;
        color: #B7B7B7;
        margin: 0 -12px ;
        
    }

    h2{
        font-weight: 400;
        font-size: 16px;
        color: #CECECE;
        padding-bottom: 10px;
    }

    h3{
        font-weight: 300;
        font-size: 11px;
        color: #9B9595;
        height: 60px;
        margin-bottom: 12px;

        overflow-y: hidden;
    }

    p{
        font-weight: 300;
        font-size: 11px;
        font-style: italic;
        color: #9B9595;
    }
`

const ImgMetaData = styled.img`
    border-radius: 10px;
    width:153px;
    height: 153px;
`

const Box = styled.div`
    display: block;
`

const Loading = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 100px;
`

const NoItens = styled.div`
    display: ${props => (props.$noitens ? "none" : "flex")};
    font-size: 16px;
    font-weight: 400;
    text-align: left;
    color: #FFFFFF;

    margin: 50px;
`

const Likes = styled.div`
    flex-direction: column;
    ion-icon{
        font-size: 18px;
        color: #FFFFFF;
        padding: 0 16px;     
    }

    p{
        color: #FFFFFF;
        size: 12px;
    }

    @media (max-width: 680px) {
        display: flex;
        flex-direction: row;
        align-items: start;
    }
`