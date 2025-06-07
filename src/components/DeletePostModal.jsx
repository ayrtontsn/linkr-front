import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import TokenContext from "../contexts/TokenContext";
import { BACKEND } from "./mock";
import Swal from "sweetalert2";

export default function DeletePostModal({ isOpen, onClose, postId, onDelete }) {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(TokenContext);

  // Effect to handle Escape key press for closing the modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, isLoading]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const API_URL = `${BACKEND}/deletepost/${postId}`;

    try {
      await axios.delete(API_URL, config);

      await onDelete(postId);

      handleClose();
    } catch (error) {
      console.error("Error deleting post:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Não foi possível deletar o post. Tente novamente.";

      Swal.fire({
        icon: "error",
        title: "Erro ao deletar post",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "#1877f2",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={handleClose}>
      {" "}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {" "}
        <Label>Você tem certeza que gostaria de remover a postagem?</Label>
        <DesktopButtonContainer>
          <CloseButton
            onClick={handleClose}
            disabled={isLoading}
            data-test="cancel"
          >
            {" "}
            Cancelar
          </CloseButton>
          <SaveButton
            onClick={handleDelete}
            disabled={isLoading}
            data-test="save-btn"
          >
            {" "}
            {isLoading ? (
              <Oval
                height={20}
                width={20}
                color="#FFFFFF"
                secondaryColor="#FFFFFF"
                strokeWidth={3}
                strokeWidthSecondary={3}
              />
            ) : (
              "Confirmar"
            )}
          </SaveButton>
        </DesktopButtonContainer>
        <MobileCloseButton
          onClick={handleClose}
          disabled={isLoading}
          data-test="cancel"
        >
          Cancelar
        </MobileCloseButton>
        <MobileSaveButton
          onClick={handleDelete}
          disabled={isLoading}
          data-test="save-btn"
        >
          {isLoading ? (
            <Oval
              height={20}
              width={20}
              color="#FFFFFF"
              secondaryColor="#FFFFFF"
              strokeWidth={3}
            />
          ) : (
            "Confirmar"
          )}
        </MobileSaveButton>
      </ModalContainer>
    </Overlay>
  );
}

// Styled Components

const Overlay = styled.div`
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
  padding: 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    backdrop-filter: none;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0);
    align-items: flex-end;
  }
`;

const ModalContainer = styled.div`
  background-color: #333333;
  padding: 20px 40px;
  border-radius: 15px;
  box-shadow: 0 0 20px 0 rgba(24, 119, 242, 0.5);
  width: 90%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;

  @media (max-width: 768px) {
    background-color: #ffffff;
    max-width: 95%;
    padding: 45px 15px 70px 15px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    gap: 10px;
    margin-bottom: 80px;
  }
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: 30px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #ffffff;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    color: #151515;
    font-size: 20px;
  }
`;

const BaseButton = styled.button`
  padding: 8px 20px;
  border-radius: 5px;
  border: none;
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

// Desktop-specific container and buttons
const DesktopButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CloseButton = styled(BaseButton)`
  background-color: #ffffff;
  color: #1877f2;

  &:hover:not(:disabled) {
    background-color: #eaeaea;
  }
`;

const SaveButton = styled(BaseButton)`
  background-color: #1877f2;
  color: #ffffff;
  min-width: 112px;

  &:hover:not(:disabled) {
    background-color: #166fe5;
  }
`;

const MobileCloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #1877f2;
  font-family: "Lato", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 100%;
  text-decoration: underline;

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileSaveButton = styled(SaveButton)`
  display: none;
  position: absolute;
  min-width: auto;
  height: 45px;
  font-size: 16px;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
  }
`;
