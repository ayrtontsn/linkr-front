import { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import TokenContext from "../contexts/TokenContext"
import Swal from "sweetalert2"
import { BACKEND } from "./mock"
import axios from "axios"
import { useRef } from "react"

export default function EditProfile(){

    const {token, userProfile, setUserProfile} = useContext(TokenContext)

    const [profile, setProfile] = useState({
        name: "",
        image: "",
        bio: "",
        age: "",
    })

    const [name, setName] = useState(profile.name)
    const [age, setAge] = useState(profile.age)
    const [image, setImage] = useState(profile.image)
    const [bio, setBio] = useState(profile.bio)

    const [isLoading, setIsLoading] = useState(false);

    const auth = {
        headers: {
            Authorization: `Bearer ${token.token}`
        }
    }

    useEffect(() =>{
            const requisition = axios.get(`${BACKEND}/myprofile`, auth)
                                .then(response => {setProfile({
                                    name: response.data.username,
                                    image: response.data.image,
                                    bio: response.data.bio,
                                    age: response.data.age,
                                })})
                                .catch(e => {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Erro no carregamento do seu perfil",
                                        text: "Um erro aconteceu. Atualize a página ou tente novamente em alguns minutos.",
                                        confirmButtonText: "OK",
                                        confirmButtonColor: "#989ba0",
                                    })
                                })
                        
    }, [])

    useEffect(() => {
        if (profile.name) {
            setName(profile.name);
            setAge(profile.age);
            setImage(profile.image);
            setBio(profile.bio);
        }
    }, [profile]);

    const [editeSaveButton, setEditeSaveButton] = useState("Editar")
    const [editeSaveButtonIonIcon, setEditeSaveButtonIonIcon] = useState("create")
    const [cancelButton, setCancelButton] = useState(false)
    const nameRef = useRef(null)

    async function editFormProfile(){
        if(!cancelButton){
            setCancelButton(true)
            setEditeSaveButton("Salvar")
            setEditeSaveButtonIonIcon("checkmark")

            setTimeout(() => {
                nameRef.current?.focus();
            }, 0);
        } else {
            setIsLoading(true)
            setEditeSaveButton("Salvando..")
            setEditeSaveButtonIonIcon("reload")
            try{
                const response = await axios.put(`${BACKEND}/myprofile`, {username: name, age, bio, image},auth)
                console.log(response)
                setProfile({
                                name: response.data.username,
                                image: response.data.image,
                                bio: response.data.bio,
                                age: response.data.age,
                            })
                setUserProfile({
                                username: response.data.username,
                                image: response.data.image,
                })
                Swal.fire({
                    icon: "success",
                    title: "Perfil atualizado com sucesso!",
                    text: "Suas informações foram salvas.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#1877f2",
                });
            } catch(error){
                    Swal.fire({
                        icon: "error",
                        title: "Erro na atualização do seu perfil",
                        text: error.message,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#989ba0",
                    })
                    cancelEdit()
                }finally {
            
                cancelEdit()
                setIsLoading(false)
            }
        }
    }

    function cancelEdit(){
        setCancelButton(false)
        setEditeSaveButton("Editar")
        setEditeSaveButtonIonIcon("create")
        setName(profile.name)
        setAge(profile.age)
        setImage(profile.image)
        setBio(profile.bio)
    }

    return (
        <>
            <Comands>
                <EditButton
                $cancel={cancelButton}
                $colorCancel = {true}
                onClick={cancelEdit}
                > Cancelar </EditButton>
                <EditButton $cancel={true} onClick={editFormProfile}> {editeSaveButton}</EditButton>
            </Comands>
            <Box>
                <MainProfile >
                    <ImgProfile src = {userProfile.image}></ImgProfile>
                    <ComandsSmall>
                        <EditButton
                            $cancel={cancelButton}
                            $colorCancel = {true}
                            onClick={cancelEdit}
                        ><ion-icon name="close-circle"></ion-icon></EditButton>
                        <EditButton $cancel={true} onClick={editFormProfile}> <ion-icon name={editeSaveButtonIonIcon}></ion-icon></EditButton>
                    </ComandsSmall>
                    <p>{userProfile.username}</p>
                </MainProfile>
                <EditFormProfile>
                    <Forms>
                        <label htmlFor="nome"> Nome: </label>
                        <Enter 
                            placeholder="  Digite seu nome"
                            required
                            type="text"
                            onChange={e => setName(e.target.value)}
                            value={name}
                            $short={true}
                            disabled={!cancelButton || isLoading}
                            ref={nameRef}                       
                        />
                        <label htmlFor="age"> Idade: </label>
                        <Enter 
                            placeholder="  Digite sua Idade"
                            type="number"
                            onChange={e => setAge(e.target.value)}
                            value={age}
                            $short={true}
                            disabled={!cancelButton || isLoading} 
                        />
                        <label htmlFor="image"> Imagem: </label>
                        <Enter 
                            placeholder="  Url de imagem"
                            required
                            type="text"
                            onChange={e => setImage(e.target.value)}
                            value={image}
                            $short={true}
                            disabled={!cancelButton || isLoading} 
                        />
                        <label htmlFor="bio"> Sobre mim: </label>
                        <Enter 
                            placeholder="  Uma breve descrição sobre você.."
                            type="text"
                            onChange={e => setBio(e.target.value)}
                            value={bio}
                            $short={false}
                            disabled={!cancelButton || isLoading} 
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

    @media (max-width: 768px) {
        display: none;
    }
`

const ComandsSmall = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: flex;
        position: absolute;
        top: 85vw;
        right: 10%;
    }
`

const EditButton = styled.button`
    width: 129px;
    height: 39px;
    border: 1px solid #1877f2;
    padding: 3px;
    background-color:${props => (props.$colorCancel?"#333333":"#1877f2")};
    border-radius: 10px;
    font-size: 24px;
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    color: #FFFFFF;
    margin-left: 11px;

    display: ${props => (props.$cancel? "block" : "none")};

    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        color: ${props => (props.$colorCancel?"#FF0000":"#FFFFFF")};
    }
    
`

const Box = styled.div`
    width: 100%;
    background-color: #171717;
    display: flex;

    @media (max-width: 768px) {
        flex-direction: column;
        background-color: #333333;
    }
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
        @media (max-width: 768px) {
            margin-top: 20px;
            margin-bottom: 50px;
        }
    }

    @media (max-width: 768px) {
        width: 100%;
        position: relative;
    }
`

const ImgProfile = styled.img`
    width: 100%;
    border-radius: 15px 0 0 0;
    @media (max-width: 768px) {
        border-radius: 0;
    }
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
        @media (max-width: 768px) {
            width: 90%;
            justify-content: center;
        }
    }

    @media (max-width: 768px) {

        display: flex;
        flex-direction: column;
        margin: 0;
    }
`

const Enter = styled.textarea`
    width: calc(100% - 70px);
    height: ${props => (props.$short?"60px":"120px")};
    border-radius: 5px;
    border: 0;
    background-color: #EFEFEF;
    margin-top: 10px;
    overflow-wrap: break-word;
    font-size: 15px;
    font-weight: 300;
    text-align: left;
    align-content: center;

    @media (max-width: 768px) {
        width: 95%;
        margin: 5px 0;
        height: ${props => (props.$short?"45x":"80px")};
    }
`