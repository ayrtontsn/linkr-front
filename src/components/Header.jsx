import styled from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TokenContext from "../contexts/TokenContext";

export default function Header({ 
  showFollowButton = false, 
  isFollowing = false, 
  onFollowToggle = null,
  showNewPostButton = false,
  onNewPostToggle = null,
  showSearchButton = false 
}) {
  const navigate = useNavigate();
  const { token, setToken, userProfile } = useContext(TokenContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
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

  return (
    <HeaderContainer>
      <h1 onClick={() => navigate("/feed")} style={{ cursor: "pointer" }}>
        Linkr
      </h1>
      
      {showFollowButton && (
        <FollowButtonMobile
          onClick={onFollowToggle}
          $isFollowing={isFollowing}
        >
          <ion-icon
            name={isFollowing ? "person-remove" : "person-add"}
          ></ion-icon>
        </FollowButtonMobile>
      )}
      
      {showNewPostButton && (
        <NewPostButtonMobile onClick={onNewPostToggle}>
          <ion-icon name="create"></ion-icon>
        </NewPostButtonMobile>
      )}
      
      {showSearchButton && (
        <SearchButtonMobile>
          <ion-icon name="search"></ion-icon>
        </SearchButtonMobile>
      )}
      
      <MenuContainer ref={menuRef}>
        <Menu onClick={handleMenuToggle}>
          <Img src={userProfile?.image || token?.image || null} alt="Profile" />
          <ion-icon name="menu"></ion-icon>
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
  ion-icon {
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
