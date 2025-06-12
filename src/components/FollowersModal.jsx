import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

export default function FollowersModal({
  isOpen,
  onClose,
  title,
  users,
  username,
}) {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {title}
            {username?.split(" ")[0]}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <IoClose />
          </CloseButton>
        </ModalHeader>
        <UsersList>
          {users && users.length > 0 ? (
            users.map((user) => (
              <UserItem key={user.id} onClick={() => handleUserClick(user.id)}>
                <UserImage src={user.image || null} alt={user.username} />
                <UserName>{user.username}</UserName>
                {user.isFollowing}
              </UserItem>
            ))
          ) : (
            <NoUsersMessage>Nenhum usuário encontrado</NoUsersMessage>
          )}
        </UsersList>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(25px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  @media (max-width: 768px) {
    background-color: transparent;
    backdrop-filter: none;
  }
`;

const ModalContent = styled.div`
  background-color: #333333;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 70vh;
  box-shadow: 0 0 20px 0 rgba(24, 119, 242, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 97%;
    height: 100%;
    max-height: 538px;
    border-radius: 0;
    box-shadow: none;
    background-color: #151515;
    border-top-right-radius: 40px;
    border-top-left-radius: 40px;
    position: fixed;
    bottom: 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
`;

const ModalTitle = styled.h2`
  color: #ffffff;
  font-family: "passion one", sans-serif;
  font-size: 26px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0%;
  margin: 0;
  text-align: center;
`;

const CloseButton = styled.button`
  background: #ff000082;
  border: none;
  color: #ffffff;
  width: 43px;
  height: 43px;
  border-radius: 15px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  @media (min-width: 769px) {
    display: none;
  }
`;

const UsersList = styled.div`
  overflow-y: auto;
  padding-left: 60px;
  padding-right: 60px;
  flex: 1;

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  &:hover {
    background-color: #404040;
  }

  @media (max-width: 768px) {
    background-color: #333333;
    margin-bottom: 12px;
    padding: 10px 10px;
  }
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
`;

const UserName = styled.span`
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 19px;
`;

const FollowingStatus = styled.span`
  color: #c5c5c5;
  font-family: "Lato", sans-serif;
  font-size: 19px;
  margin-left: 10px;
`;

const NoUsersMessage = styled.p`
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 16px;
  text-align: center;
  padding: 20px 0;
`;
