import styled from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenContext from "../contexts/TokenContext";
import { IoMenu, IoCreateOutline, IoSearch, IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import { FiEdit, FiSearch } from "react-icons/fi";
import {DebounceInput} from 'react-debounce-input';
import { BACKEND } from "./mock";
import axios from "axios";
import Swal from "sweetalert2";

export default function Header({ 
  showFollowButton = false, 
  isFollowing = false, 
  onFollowToggle = null,
  showNewPostButton = false,
  onNewPostToggle = null,
  showSearchButton = false 
}) {
  const navigate = useNavigate();
  const { token, setToken, userProfile, setUserProfile} = useContext(TokenContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [allUsers, setAllUsers] = useState("")
  const [resultSearchUsers, setResultSearchUsers] = useState([])
  const menuRef = useRef(null);

  const auth = {
    headers: {
      Authorization: `Bearer ${token.token}`
    }
  }

  useEffect(() =>{
            const route = BACKEND+"/linkers"
            const requisition = axios.get(route, auth)
                                    .then(response => {setAllUsers(response.data)
                                    })
                                    
                                    .catch(e => {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Erro no carregamento da página",
                                            text: "Um erro aconteceu. Atualize a página ou tente novamente em alguns minutos.",
                                            confirmButtonText: "OK",
                                            confirmButtonColor: "#1877f2",
                                        })
                                    })
        }, [])
  
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchText(value);
    let userFilter = []
    if(value){
      userFilter = allUsers.filter((user) =>{
        return user.username.toLowerCase().includes(value.toLowerCase());
      })
    }

    setResultSearchUsers(userFilter)
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserProfile(null);
    setActiveMenu(false);
    navigate("/");
  };

  const handleMenuToggle = () => {
    setActiveMenu(!activeMenu);
  };

  const handleMyProfile = () => {
    navigate("/user/my-profile");
    setActiveMenu(false);
  };

  const onSearchToggle = () => {
    setShowSearchBar(!showSearchBar)
    if(!activeMenu){
      setSearchText("")
    }
  }

  // Click outside menu handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(false);
      }
    }

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  const navigateToUserPage = (userId) => {
    setShowSearchBar(!showSearchBar)
    setSearchText("")
    navigate(`/user/${userId}`)
  }

  return (
    <HeaderContainer>
      <h1 onClick={() => navigate("/feed")} style={{ cursor: "pointer" }}>
        Linkr
      </h1>
      <SearchContainer $active={showSearchBar}>
        <SearchBar>
          <DebounceInput
            minLength={3}
            debounceTimeout={300}
            type="text"
            placeholder="Procurar linkrs"
            value={searchText}
            onChange={handleSearch}
            className="searchInput">
          </DebounceInput>
          <UsersSearch>
            {resultSearchUsers.map(user => (
              <EachUserSearch key={user.id} style={{ cursor: 'pointer' }} onClick={() => navigateToUserPage(user.id)}>
                    <ImgSearch src={user.image}></ImgSearch>
                    <NameSearch>
                        {user.username}
                    </NameSearch>
              </EachUserSearch>
            ))}
          </UsersSearch>
        </SearchBar>
        <FiSearch className="search-icon"></FiSearch>
        <CloseSearch onClick={onSearchToggle}> X </CloseSearch>

      </SearchContainer>
      
      
      {showFollowButton && (
        <FollowButtonMobile
          onClick={onFollowToggle}
          $isFollowing={isFollowing}
        >
          {isFollowing ? <IoPersonRemove /> : <IoPersonAdd />}
        </FollowButtonMobile>
      )}
      
      {showNewPostButton && (
        <NewPostButtonMobile onClick={onNewPostToggle}>
          <FiEdit />
        </NewPostButtonMobile>
      )}
      
      {showSearchButton && (
        <SearchButtonMobile>
          <IoSearch onClick={onSearchToggle}/>
        </SearchButtonMobile>
      )}
      
      
      <MenuContainer ref={menuRef}>
        <Menu onClick={handleMenuToggle}>
          <Img src={userProfile?.image || token?.image || null} alt="Profile" />
          <IoMenu className="io-menu"/>
        </Menu>
        <AbaMenu $active={activeMenu}>
          <BotaoMenu onClick={handleMyProfile}>Meu Perfil</BotaoMenu>
          <BotaoMenu onClick={handleLogout}>Sair</BotaoMenu>
        </AbaMenu>
      </MenuContainer>
    </HeaderContainer>
  );
}

// Styled Components
const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 72px;
  align-items: center;
  justify-content: space-between;
  padding: 0 1% 0 1%;
  background-color: #151515;
  z-index: 2;

  h1 {
    font-family: "Passion One", sans-serif;
    color: #ffffff;
    font-size: 49px;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 5%;
    word-spacing: 5%;
    @media (max-width: 768px) {
      font-size: 28px;
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    bottom: 11px;
    left: 11px;
    padding-left: 25px;
    padding-right: 25px;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: #151515;
    width: 95%;
    height: 60px;
    border-radius: 15px;
    box-shadow: 0 0 10px 0 rgba(72, 72, 72, 1);
  }
`;

const MenuContainer = styled.div`
  position: relative;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 97px;
  height: 80%;
  font-size: 50px;
  color: #ffffff;
  background-color: #333333;
  border-radius: 10px;
  padding: 3px;
  cursor: pointer;
  .io-menu {
    @media (max-width: 768px) {
      display: none;
    }
  }
  @media (max-width: 768px) {
    padding: 0;
    border-radius: 50px;
    object-fit: cover;
    width: 45px;
    height: 45px;
  }
`;

const Img = styled.img`
  border-radius: 10px;
  width: 53px;
  height: 53px;
  object-fit: cover;

  @media (max-width: 768px) {
    padding: 0;
    border-radius: 50px;
    object-fit: cover;
    width: 50px;
    height: 50px;
    border: 3px solid #333333;
  }
`;

const AbaMenu = styled.div`
  display: ${(props) => (props.$active ? "block" : "none")};
  width: 115px;
  position: fixed;
  right: 8px;
  padding-right: 1.6%;

  @media (max-width: 768px) {
    bottom: 80px;
  }

  @media (min-width: 769px) {
    top: 80px;
  }
`;

const BotaoMenu = styled.button`
  background-color: #000000;
  color: #ffffff;
  width: 100%;
  height: 40px;
  margin-top: 5px;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
`;

const FollowButtonMobile = styled.button`
  display: none;
  background-color: ${(props) => (props.$isFollowing ? "#949494" : "#1877F2")};
  color: ${(props) => (props.$isFollowing ? "#151515" : "#ffffff")};
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const NewPostButtonMobile = styled.button`
  display: none;
  background-color: #151515;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const SearchButtonMobile = styled.button`
  display: none;
  background-color: #151515;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  width: 563px;
  height: 45px;
  border-radius: 8px;
  position: relative;
  .search-icon{
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 21px;
    color: #c6c6c6;
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    display: ${(props) => (props.$active ? "flex" : "none")};
    width: 100vw;
    height: 72px;
    position: fixed;
    align-items: center;
    top: 0;
    left: 0;
    background-color: #333333;
  }
`

const SearchBar = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  .searchInput{
    background-color: #FFFFFF;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 0;
    align-items: center;
    padding: 10px 40px 10px 12px; 
    font-family: "Lato", sans-serif;
    font-size : 19px;
  }

  @media (max-width: 768px) {
    display: block;
    width: 80%;
    height: 43px;
    background-color: #FFFFFF;
    border-radius: 15px;
    margin: 0 10px;
  }
  `

const UsersSearch = styled.ul`
  background-color: rgba(213, 213, 213, 0.5);
  max-height: 187px;
  width: 90%;
  border-radius: 0 0 10px 10px;
  overflow-y: auto;

  z-index: 5;
  @media (max-width: 768px) {
    width: calc(100vw - 20px);
    margin-top: 14px;
  }
`
const CloseSearch = styled.div`
  background-color: #FF0000;
  display: flex;
  color: #FFFFFF;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  height: 43px;
  width: 100px;
  font-weight: 700;
  margin-right: 10px;
  
  @media (min-width: 768px) {
    display: none;
  }
`

const EachUserSearch = styled.li`
  background-color: rgba(51, 51, 51, 0.82);
  height: 47px;
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  align-items: center;
  width: fit-content;
  border-radius: 10px;
  padding: 0 10px;

  @media (max-width: 768px) {
    width: calc(100% - 20px);
  }
`

const ImgSearch = styled.img`
  border-radius: 100%;
  width: 39px;
  height: 39px;
  object-fit: cover;
  margin-right: 10px;
`

const NameSearch = styled.p`
  color: #FFFFFF;
  font-size: 19px;
  font-weight: 400;
  font-family: "Lato", sans-serif;
`