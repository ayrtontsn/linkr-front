import { useContext, useState } from "react"
import styled from "styled-components"
import TokenContext from "../contexts/TokenContext"

export default function EditProfile(){

    const {token} = useContext(TokenContext)
    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [image, setImage] = useState("")
    const [about, setAbou] = useState("")

    return (
        <>
            <Comands>
                <EditButton> Cancelar</EditButton>
                <EditButton> Salvar</EditButton>
            </Comands>
            <Box>
                <MainProfile>
                    <ImgProfile src = {token.image}></ImgProfile>
                    <p>{token.username}</p>
                </MainProfile>
                <EditFormProfile>
                    <Forms>
                        <label htmlFor="nome"> Nome </label>
                        <Enter 
                            placeholder="  Digite seu nome"
                            required
                            type="text"
                            onChange={e => setName(e.target.value)}
                            value={name}
                            $size={"60px"}                            
                        />
                        <label htmlFor="age"> Idade </label>
                        <Enter 
                            placeholder="  Digite sua Idade"
                            type="number"
                            onChange={e => setAge(e.target.value)}
                            value={age}
                            $size={"60px"} 
                        />
                        <label htmlFor="image"> Imagem </label>
                        <Enter 
                            placeholder="  Url de imagem"
                            required
                            type="text"
                            onChange={e => setImage(e.target.value)}
                            value={image}
                            $size={"60px"} 
                        />
                        <label htmlFor="about"> Sobre </label>
                        <Enter 
                            placeholder="  Uma breve descrição sobre você.."
                            type="text"
                            onChange={e => setAbou(e.target.value)}
                            value={about}
                            $size={"120px"}
                        />
                    </Forms>
                </EditFormProfile>
            </Box>
        </>
    )
}


const Comands = styled.div`
    max-width: 100%;
    display: flex;
    color: #FFFFFF;
    padding-bottom: 11px;
`

const EditButton = styled.button`
    width: 129px;
    height: 39px;
    border: 1px solid #1877f2;
    padding: 3px;
    background-color: #1877f2;
    border-radius: 10px;
    font-size: 24px;
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    color: #FFFFFF;
    margin-left: 11px;
    
`

const Box = styled.div`
    width: 100%;
    background-color: #171717;
    display: flex;
    border-radius: 15px;
`

const MainProfile = styled.div`
    width: 20%;
    display: flex;
    flex-wrap: wrap;
    color: #FFFFFF;
    justify-content: center;
    align-items: start;

    p{
        font-size: 36px;
        font-family: "Oswald", sans-serif;
        font-weight: 700;
    }


`

const ImgProfile = styled.img`
    width: 100%;
    border-radius: 15px 0 0 0;
`
const EditFormProfile = styled.div`
    width: 80%;
    padding: 0 25px ;
    display: contents;
    justify-content: end;
`

const Forms = styled.form`
    display: flex;
    flex-wrap: wrap;
    justify-items: end;
    align-content: space-around;
    margin: 15px;

    label{
        width: 70px;
        color: #FFFFFF;
        align-content: center;
    }
`

const Enter = styled.textarea`
    width: calc(100% - 70px);
    height: ${props => props.$size};
    border-radius: 5px;
    border: 0;
    background-color: #EFEFEF;
    margin-top: 10px;
    overflow-wrap: break-word;
    font-size: 15px;
    font-weight: 300;
    text-align: left;
    align-content: center;
`