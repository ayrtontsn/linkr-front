import styled from "styled-components";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TokenContext from "../contexts/TokenContext";
import axios from "axios";
import { BACKEND } from "../components/mock";
import FollowersModal from "../components/FollowersModal";
import EditPostModal from "../components/EditPostModal";
import DeletePostModal from "../components/DeletePostModal";
import Header from "../components/Header";
import postFeed from "../components/posts";
import Swal from "sweetalert2";
import { IoPersonAddOutline, IoPersonRemoveOutline } from "react-icons/io5";

export default function UserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(TokenContext);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostData, setEditingPostData] = useState(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [allPosts, setAllPosts] = useState(null);

  const auth = {
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
  };

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

  const handleSavePost = (updatedPostData) => {
    setUserPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === updatedPostData.id
          ? {
              ...post,
              description: updatedPostData.description,
              url: updatedPostData.url,
            }
          : post
      )
    );
  };

  const handleDeletePost = (postId) => {
    setUserPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    );
  };

  const handleCloseModal = () => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
    setIsModalOpen(false);
    setIsModalDeleteOpen(false);
    setEditingPostData(null);
    setDeletingPostId(null);
  };

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
        const userResponse = await axios.get(`${BACKEND}/user/${id}`, auth);
        setUserData(userResponse.data);

        // Check if following
        const followResponse = await axios.get(
          `${BACKEND}/follow/status/${id}`,
          auth
        );
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
        Swal.fire({
          icon: "error",
          title: "Erro no carregamento dos posts",
          text: "Um erro aconteceu. Atualize a página ou tente novamente em alguns minutos.",
          confirmButtonText: "OK",
          confirmButtonColor: "#1877f2",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id && token && token.token) {
      fetchUserData();
    }
  }, [id, token]);

  return (
    <Back>
      <Header 
        showFollowButton={id !== token.id.toString()}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
        showNewPostButton={id === token.id.toString()}
        showSearchButton={true}
      />
      <UserContainer>
        <PostsContainer>
          {postFeed({allPosts, setAllPosts, routeGetPosts: `/posts/user/${id}`})}
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
                  {isFollowing ? <IoPersonRemoveOutline className="person-icon" /> : <IoPersonAddOutline className="person-icon" />}
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

      <FollowersModal
        isOpen={showFollowersModal}
        onClose={handleCloseModal}
        title="Seguidores de "
        users={followersData}
        username={userData?.username || "Usuário"}
      />

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
  gap: 5px;

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
  .person-icon {
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