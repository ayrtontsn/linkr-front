import styled from "styled-components"
import { POSTS } from "./mock"

export default function postFeed(){

    return(
        <>
        {POSTS.map(async post => 
            <Post key={post.id}>
                <User>
                    <Img>{post.image}</Img>
                    {post.username}
                </User>
                {post.description}
                <Url>{await dataUrl(post.url)}</Url>
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
    margin: 20px;
    font-weight: 300;
    font-size: 20px;
`

const User = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    color: #FFFFFF;
`

const Img = styled.div`
    border-radius: 100%;
    width:50px;
    height: 50px;
    background-color: #f10909;
    margin-right:10px;
`

const Url = styled.div`
`