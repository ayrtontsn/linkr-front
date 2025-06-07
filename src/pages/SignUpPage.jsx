import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  SignUpOption,
  Title,
  Subtitle,
  PageContainer,
  FormContainer,
} from "./LoginPage";
import { useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import {
  validateSignUpForm,
  validateEmail,
  validatePassword,
  validateUsername,
  validateImageUrl,
} from "../utils/validators.js";
import {
  InputContainer,
  Input,
  ErrorMessage,
} from "../components/FormComponents.js";
import Swal from "sweetalert2";
import { BACKEND } from "../components/mock.js";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    image: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate individual fields on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let validation;

    switch (name) {
      case "email":
        validation = validateEmail(value);
        break;
      case "password":
        validation = validatePassword(value);
        break;
      case "username":
        validation = validateUsername(value);
        break;
      case "image":
        validation = validateImageUrl(value);
        break;
      default:
        return;
    }

    if (!validation.isValid) {
      setErrors({
        ...errors,
        [name]: validation.error,
      });
    }
  };

  function createAccount(event) {
    event.preventDefault();

    const validation = validateSignUpForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    const URLSignUp = `${BACKEND}/sign-up`;

    axios
      .post(URLSignUp, validation.formattedData)
      .then((res) => {
        setLoading(false);

        Swal.fire({
          icon: "success",
          title: "Conta criada com sucesso!",
          text: "Agora você pode fazer login.",
          confirmButtonText: "OK",
          confirmButtonColor: "#1877f2",
          timer: 2000,
          timerProgressBar: true,
        });

        navigate("/");
      })
      .catch((err) => {
        setLoading(false);

        if (err.response?.status === 409) {
          Swal.fire({
            icon: "error",
            title: "Email já cadastrado",
            text: "Este email já está cadastrado. Tente fazer login ou use outro email.",
            confirmButtonText: "OK",
            confirmButtonColor: "#1877f2",
          });
        } else {
          const errorMessage =
            err.response?.data || "Erro ao criar conta. Tente novamente.";
          Swal.fire({
            icon: "error",
            title: "Erro no cadastro",
            text: errorMessage,
            confirmButtonText: "OK",
            confirmButtonColor: "#1877f2",
          });
        }
      });
  }

  return (
    <PageContainer>
      <LeftSection>
        <div>
          <Title>Linkr</Title>
          <Subtitle>Compartilhe e descubra</Subtitle>
          <Subtitle>os melhores links da internet!</Subtitle>
        </div>
      </LeftSection>
      <RightSection>
        <FormContainer onSubmit={createAccount} noValidate>
          <InputContainer>
            <Input
              type="email"
              name="email"
              placeholder="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              hasError={!!errors.email}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Input
              type="password"
              name="password"
              placeholder="senha"
              required
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              hasError={!!errors.password}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Input
              type="text"
              name="username"
              placeholder="username"
              required
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              hasError={!!errors.username}
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          </InputContainer>

          <InputContainer>
            <Input
              type="url"
              name="image"
              placeholder="imagem do perfil (url)"
              required
              value={formData.image}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              hasError={!!errors.image}
            />
            {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
          </InputContainer>

          <Button type="submit" disabled={loading}>
            {!loading ? (
              "Cadastrar"
            ) : (
              <Oval
                height="30"
                width="30"
                color="#FFFFFF"
                secondaryColor="#FFFFFF"
              />
            )}
          </Button>
        </FormContainer>
        <Link to="/">
          <SignUpOption>Voltar para login!</SignUpOption>
        </Link>
      </RightSection>
    </PageContainer>
  );
}

// Styled components
const RightSection = styled.div`
  background: #333333;
  width: 37%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    height: 62vh;
    justify-content: flex-start;
    padding: 33px 22px;
    flex-grow: 1;
  }
`;

const LeftSection = styled.div`
  background: #151515;
  width: 63%;
  display: flex;
  align-items: center;
  padding: 20px;
  padding-left: 144px;

  @media (max-width: 768px) {
    width: 100%;
    height: 38vh;
    min-height: unset;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 10px 20px 0 20px;
    div {
      max-width: 100%;
    }
  }
`;
