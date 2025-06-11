import styled from "styled-components";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TokenContext from "../contexts/TokenContext";
import axios from "axios";
import { BACKEND } from "../components/mock";
import { Oval } from "react-loader-spinner";
import FollowersModal from "../components/FollowersModal";

export default function UserPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from URL
  const { token, setToken } = useContext(TokenContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followsLoggedUser, setFollowsLoggedUser] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const menuRef = useRef(null);

  const auth = {
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setActiveMenu(false);
    navigate("/");
  };

  // Toggle menu
  const handleMenuToggle = () => {
    setActiveMenu(!activeMenu);
  };

  // Close menu when clicking menu item
  const handleMenuItemClick = () => {
    setActiveMenu(false);
  };

  // Navigate to own profile
  const handleMyProfile = () => {
    navigate(`/user/${token.id}`);
    handleMenuItemClick();
  };

  // Navigate to feed
  const handleFeed = () => {
    navigate("/feed");
    handleMenuItemClick();
  };

  // Toggle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`${BACKEND}/follow/${id}`, auth);
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        await axios.post(`${BACKEND}/follow/${id}`, {}, auth);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      alert("Não foi possível alterar o status de seguir. Tente novamente.");
    }
  };

  // Open followers modal
  const handleShowFollowers = async () => {
    try {
      const response = await axios.get(`${BACKEND}/followers/${id}`, auth);
      setFollowersData(response.data);
      setShowFollowersModal(true);
    } catch (error) {
      console.error("Error fetching followers:", error);
      alert("Não foi possível carregar os seguidores. Tente novamente.");
    }
  };

  // Open following modal
  const handleShowFollowing = async () => {
    try {
      const response = await axios.get(`${BACKEND}/following/${id}`, auth);
      setFollowingData(response.data);
      setShowFollowingModal(true);
    } catch (error) {
      console.error("Error fetching following:", error);
      alert("Não foi possível carregar os usuários seguidos. Tente novamente.");
    }
  };

  // Close modals
  const handleCloseModal = () => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
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

  // Check authentication
  useEffect(() => {
    if (!token || !token.token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Fetch user data and posts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get user profile data
        const userResponse = await axios.get(`${BACKEND}/user/${id}`, auth);
        setUserData(userResponse.data);

        // Check if following
        const followResponse = await axios.get(
          `${BACKEND}/follow/status/${id}`,
          auth
        );
        console.log(followResponse.data);
        setIsFollowing(followResponse.data.isFollowing);
        setFollowsLoggedUser(followResponse.data.isFollower);

        // Get followers and following counts
        setFollowersCount(userResponse.data.followersCount || 0);
        setFollowingCount(userResponse.data.followingCount || 0);

        // Get user posts
        const postsResponse = await axios.get(
          `${BACKEND}/posts/user/${id}`,
          auth
        );
        setUserPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Erro ao carregar dados do usuário. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (id && token && token.token) {
      fetchUserData();
    }
  }, [id, token]);

  // Loading state
  if (loading) {
    return (
      <Back>
        <Header>
          <h1>Linkr</h1>
          <MenuContainer ref={menuRef}>
            <Menu onClick={handleMenuToggle}>
              <Img src={token?.image || null} alt="Profile" />
              <ion-icon name="menu"></ion-icon>
            </Menu>
            <AbaMenu $active={activeMenu}>
              <BotaoMenu onClick={handleFeed}>Feed</BotaoMenu>
              <BotaoMenu onClick={handleMyProfile}>Meu Perfil</BotaoMenu>
              <BotaoMenu onClick={handleLogout}>Sair</BotaoMenu>
            </AbaMenu>
          </MenuContainer>
        </Header>
        <Loading>
          <Oval
            visible={true}
            height="100"
            width="100"
            color="#52B6FF"
            secondaryColor="#FFFFFF"
            ariaLabel="oval-loading"
          />
        </Loading>
      </Back>
    );
  }

  return (
    <Back>
      <Header>
        <h1>Linkr</h1>
        {/* Mobile follow button */}
        {id !== token.id.toString() && (
          <FollowButtonMobile
            onClick={handleFollowToggle}
            $isFollowing={isFollowing}
          >
            <ion-icon
              name={isFollowing ? "person-remove" : "person-add"}
            ></ion-icon>
          </FollowButtonMobile>
        )}
        {id === token.id.toString() && (
          <NewPostButtonMobile>
            <ion-icon name="create"></ion-icon>
          </NewPostButtonMobile>
        )}
        <SearchButtonMobile>
          <ion-icon name="search"></ion-icon>
        </SearchButtonMobile>
        <MenuContainer ref={menuRef}>
          <Menu onClick={handleMenuToggle}>
            <Img src={token?.image || null} alt="Profile" />
            <ion-icon name="menu"></ion-icon>
          </Menu>
          <AbaMenu $active={activeMenu}>
            <BotaoMenu onClick={handleFeed}>Feed</BotaoMenu>
            <BotaoMenu onClick={handleMyProfile}>Meu Perfil</BotaoMenu>
            <BotaoMenu onClick={handleLogout}>Sair</BotaoMenu>
          </AbaMenu>
        </MenuContainer>
      </Header>
      <UserContainer>
        <PostsContainer>
          {userPosts && userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Post key={post.id}>
                <User>
                  <UserImg
                    src={userData?.image || null}
                    alt={userData?.username}
                  />
                  <Username>{userData?.username}</Username>
                  {token.id === post.userId && (
                    <UpdateDeleteIcons>
                      <ion-icon
                        name="create"
                        onClick={() => handleEditClick(post)}
                      ></ion-icon>
                      <ion-icon
                        name="trash"
                        onClick={() => handleDeleteClick(post.id)}
                      ></ion-icon>
                    </UpdateDeleteIcons>
                  )}
                </User>
                <Content>
                  <Likes>
                    <ion-icon name="heart-outline"></ion-icon>
                    <p>{post.likes?.length || 0} likes</p>
                  </Likes>
                  <Box>
                    <Description>{post.description}</Description>
                    <MetaData href={post.url} target="_blank">
                      <MetaContent>
                        <MetaTitle>{post.dataTitle}</MetaTitle>
                        <MetaDescription>
                          {post.dataDescription}
                        </MetaDescription>
                        <MetaUrl>{post.url}</MetaUrl>
                      </MetaContent>
                      <MetaImage
                        src={post.dataImage || null}
                        alt="Link preview"
                      />
                    </MetaData>
                  </Box>
                </Content>
              </Post>
            ))
          ) : (
            <NoPostsMessage>
              Este perfil ainda não fez nenhuma publicação
            </NoPostsMessage>
          )}
        </PostsContainer>
        <ProfileContainer>
          <ProfileImage
            src={userData?.image || null}
            alt={userData?.username}
          />
          <ProfileName>{userData?.username}</ProfileName>
          <StatsSection>
            {id !== token.id.toString() && (
              <FollowButtonContainer
                onClick={handleFollowToggle}
                $isFollowing={isFollowing}
                $followsMe={followsLoggedUser}
              >
                <FollowContent>
                  <span>{isFollowing ? "Parar de seguir" : "Seguir"}</span>
                  <ion-icon
                    name={
                      isFollowing
                        ? "person-remove-outline"
                        : "person-add-outline"
                    }
                  ></ion-icon>
                </FollowContent>
                {followsLoggedUser && !isFollowing && (
                  <StatsFollowButtonText>Segue você</StatsFollowButtonText>
                )}
              </FollowButtonContainer>
            )}
            <FollowStats onClick={handleShowFollowers}>
              <StatCount>{followersCount}</StatCount>
              <StatLabel>Seguidores</StatLabel>
            </FollowStats>
            <FollowStats onClick={handleShowFollowing}>
              <StatCount>{followingCount}</StatCount>
              <StatLabel>Seguindo</StatLabel>
            </FollowStats>
          </StatsSection>

          <UserInfoSection>
            <InfoItem>
              <InfoLabel>Sobre mim:</InfoLabel>
              <InfoValue>{userData?.bio || "Sem informações"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Idade:</InfoLabel>
              <InfoValue>{userData?.age || "Não informada"} anos</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Usuário desde:</InfoLabel>
              <InfoValue>
                {userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString("pt-BR")
                  : "Não informada"}
              </InfoValue>
            </InfoItem>
          </UserInfoSection>
        </ProfileContainer>
      </UserContainer>

      {/* Followers Modal */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={handleCloseModal}
        title="Seguidores de "
        users={followersData}
        username={userData?.username || "Usuário"}
      />

      {/* Following Modal */}
      <FollowersModal
        isOpen={showFollowingModal}
        onClose={handleCloseModal}
        title="Seguidos por "
        users={followingData}
        username={userData?.username || "Usuário"}
      />
    </Back>
  );
}

// Styled Components
const Back = styled.div`
  position: fixed;
  display: block;
  justify-items: center;
  background-color: #333333;
  width: 100vw;
  height: 100%;
  left: 0;
  overflow-y: auto;
  padding-bottom: 80px;
`;

const Header = styled.div`
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

const Loading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 72px);
`;

const UserContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 900px;
  margin-top: 48px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 100%;
    max-width: 100%;
    margin-top: 0px;
  }
`;

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 240px;
  border-radius: 15px;
  color: #ffffff;
  padding-bottom: 10px;
  background-color: #171717;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 0;
    background-color: #333333;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 212px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  object-fit: cover;
`;

const ProfileName = styled.h2`
  font-family: "oswald", sans-serif;
  font-size: 36px;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
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

const StatsSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 199px;
  gap: 5px;

  @media (max-width: 768px) {
    max-width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 30px;
  }
`;

const FollowButtonContainer = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.$followsMe ? "space-between" : "center"};
  align-items: center;
  width: 100%;
  min-height: 42px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
  background-color: ${(props) => (props.$isFollowing ? "#949494" : "#1877F2")};
  color: ${(props) => (props.$isFollowing ? "#0B0B0B" : "#ffffff")};
  cursor: pointer;

  @media (min-width: 769px) {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const FollowContent = styled.div`
  span {
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-size: 17px;
    margin-right: 10px;
  }
  ion-icon {
    --ionicon-stroke-width: 46px;
    font-size: 18px;
  }
`;

const StatsFollowButtonText = styled.span`
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-weight: 100;
  font-size: 12px;
  line-height: 120%;
  letter-spacing: -7%;
`;

const FollowStats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  background-color: #333333;
  min-height: 25px;
  border-radius: 5px;
  cursor: pointer;
`;

const StatCount = styled.span`
  margin-right: 5px;
`;

const StatLabel = styled.span``;

const UserInfoSection = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  @media (max-width: 768px) {
    width: 100%;
    padding-left: 10px;
  }
`;

const InfoItem = styled.div`
  font-family: "Lato", sans-serif;
  margin-top: 10px;
`;

const InfoLabel = styled.span`
  font-weight: 400;
  font-size: 16px;
  margin-right: 5px;
`;

const InfoValue = styled.span`
  font-weight: 300;
  font-size: 16px;
  color: #cecece;
`;

const PostsContainer = styled.div`
  width: 100%;
  max-width: 630px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Post = styled.div`
  width: 100%;
  border-radius: 16px;
  background-color: #171717;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;

  @media (max-width: 768px) {
    border-radius: 0;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;

  @media (max-width: 768px) {
    position: static;
  }
`;

const UpdateDeleteIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  position: absolute;
  right: 20px;
  bottom: 233px;

  ion-icon {
    font-size: 25px;
    color: #ffffff;
    cursor: pointer;
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  @media (max-width: 768px) {
    position: static;
  }
`;

const UserImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #333333;
  position: absolute;
  z-index: 1;
  bottom: 220px;
  @media (max-width: 768px) {
    position: static;
    border: none;
    margin-right: 15px;
  }
`;

const Username = styled.span`
  color: #ffffff;
  position: absolute;
  z-index: 0;
  bottom: 229px;
  left: 30px;
  font-family: "Lato", sans-serif;
  font-size: 19px;
  font-weight: 400;
  background-color: #333333;
  padding-left: 50px;
  padding-right: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 15px;
  @media (max-width: 768px) {
    position: absolute;
    bottom: 295px;
    left: 85px;
    border-radius: 0;
    padding: 0;
    background-color: transparent;
    font-size: 16px;
  }
`;

const Content = styled.div`
  margin-top: 55px;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    margin-top: 0;
    align-items: flex-start;
  }
`;

const Likes = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-right: 20px;

  ion-icon {
    font-size: 20px;
    color: #ffffff;
    margin-bottom: 5px;
    cursor: pointer;
  }

  p {
    color: #ffffff;
    font-family: "Lato", sans-serif;
    font-size: 11px;
  }

  @media (max-width: 768px) {
    flex-direction: row;

    ion-icon {
      margin-right: 5px;
      margin-bottom: 0;
    }
  }
`;

const Box = styled.div`
  flex: 1;
`;

const Description = styled.p`
  color: #b7b7b7;
  font-family: "Lato", sans-serif;
  font-size: 17px;
  margin-bottom: 15px;
`;

const MetaData = styled.a`
  display: flex;
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  overflow: hidden;
  text-decoration: none;
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const MetaContent = styled.div`
  flex: 1;
  padding: 15px;
`;

const MetaTitle = styled.h3`
  color: #cecece;
  font-family: "Lato", sans-serif;
  font-size: 16px;
  margin: 0 0 10px 0;
`;

const MetaDescription = styled.p`
  color: #9b9595;
  font-family: "Lato", sans-serif;
  font-size: 11px;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaUrl = styled.p`
  color: #9b9595;
  font-family: "Lato", sans-serif;
  font-size: 11px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaImage = styled.img`
  width: 153px;
  height: 153px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const NoPostsMessage = styled.p`
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 20px;
  text-align: center;
  margin-top: 50px;
`;
