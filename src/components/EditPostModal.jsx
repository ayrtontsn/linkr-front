import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import TokenContext from "../contexts/TokenContext";
import { BACKEND } from "./mock";
import Swal from "sweetalert2";

export default function EditPostModal({ isOpen, onClose, postData, onSave }) {
  const [editedLink, setEditedLink] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const descriptionInputRef = useRef(null);
  const linkInputRef = useRef(null);
  const { token } = useContext(TokenContext);

  useEffect(() => {
    if (postData) {
      setEditedLink(postData.url || "");
      setEditedDescription(postData.description || "");
    }
  }, [postData]);

  // Effect to focus the link input when the modal opens
  useEffect(() => {
    if (isOpen && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [isOpen]);

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

  const handleSave = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const body = {
      description: editedDescription,
      url: editedLink,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const API_URL = `${BACKEND}/updatepost/${postData.id}`;

    try {
      await axios.put(API_URL, body, config);

      await onSave({
        ...postData,
        description: editedDescription,
        url: editedLink,
      });

      handleClose();
    } catch (error) {
      console.error("Error saving post:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Não foi possível salvar as alterações. Tente novamente.";

      Swal.fire({
        icon: "error",
        title: "Erro ao salvar",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "#1877f2",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press in the description field to trigger save
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        handleSave(event);
      }
    }
  };

  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  return (
    <Overlay onClick={handleClose}>
      {" "}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {" "}
        <MobileCloseButton
          onClick={handleClose}
          disabled={isLoading}
          data-test="cancel"
        >
          Fechar
        </MobileCloseButton>
        <Label>Link do post:</Label>
        <LinkInput
          ref={linkInputRef}
          type="url"
          value={editedLink}
          onChange={(e) => setEditedLink(e.target.value)}
          disabled={isLoading}
          placeholder="http://..."
          data-test="link"
        />
        <Label>Descrição do post:</Label>
        <DescriptionTextarea
          ref={descriptionInputRef}
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Edite a descrição..."
          data-test="description"
        />
        <DesktopButtonContainer>
          <CloseButton
            onClick={handleClose}
            disabled={isLoading}
            data-test="cancel"
          >
            {" "}
            Fechar
          </CloseButton>
          <SaveButton
            onClick={handleSave}
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
              "Atualizar"
            )}
          </SaveButton>
        </DesktopButtonContainer>
        <MobileSaveButton
          onClick={handleSave}
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
            "Atualizar"
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
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: #ffffff;
  margin-bottom: -5px;
  margin-top: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const InputBase = styled.input`
  width: 100%;
  border-radius: 10px;
  padding: 10px 15px;
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 18px;
  background: #d9d9d9;
  color: #363636;
  border: none;

  &::placeholder {
    color: #9f9f9f;
  }

  &:disabled {
    background-color: #f2f2f2;
    color: #afafaf;
    cursor: default;
  }

  &:focus {
    outline: none;
    border-color: #1877f2;
    box-shadow: 0 0 0 2px #1877f2;
  }

  @media (max-width: 768px) {
    background: #d9d9d9;
    font-size: 14px;
    padding: 8px 12px;
  }
`;

const LinkInput = styled(InputBase).attrs({ type: "url" })``;

const DescriptionTextarea = styled(InputBase).attrs({ as: "textarea" })`
  min-height: 100px;
  resize: vertical;

  @media (max-width: 768px) {
    min-height: 120px;
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

// Mobile-specific buttons (positioned absolutely)
const MobileCloseButton = styled.button`
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #1877f2;
  font-family: "Lato", sans-serif;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  padding: 5px;

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
