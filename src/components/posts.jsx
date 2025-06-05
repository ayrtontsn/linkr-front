import styled from "styled-components"
import { BACKEND, TOKEN_USER } from "./mock"
import axios from "axios"
import { useState } from "react"

export default function postFeed(){

    const [allPosts, setAllPosts] = useState([])

    const auth = {
        headers: {
            Authorization: `Bearer ${TOKEN_USER}`
        }
    }

    async function getAllPosts() {
        try {
            const allPosts = await axios.get(`${BACKEND}/allposts`, auth)
            setAllPosts(allPosts.data)
            
        } catch (e) {
            alert(e.response.data.message)
        }
    }
    getAllPosts()
    return (
        <>
        
        {allPosts.map(post => 
            <Post key={post.id}>
                <User>
                    <Img src={post.dataImage ||null}></Img>
                    {post.userId}
                </User>
                <Content>
                    <ion-icon name="heart"></ion-icon>
                    <Box>
                        <Title><h1>{post.description}</h1></Title>
                        <MetaData>
                            <Title>
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

const MetaData = styled.div`
    display: flex;
    border: 1px solid #4C4C4C;
    border-radius: 5px;

`

const Content = styled.div`
    display: flex;
    align-items: end;
    ion-icon{
        width: 20px;
        color: #FFFFFF;        
    }
`

const Title = styled.div`
    h1{
        font-weight: 300;
        font-size: 16px;
        color: #B7B7B7;
    }

    h2{
        font-weight: 400;
        font-size: 16px;
        color: #CECECE;
    }

    h3{
        font-weight: 300;
        font-size: 11px;
        color: #9B9595;
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
    margin-right:10px;
`

const Box = styled.div`
    display: block;
`