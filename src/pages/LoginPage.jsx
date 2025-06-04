import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import TokenContext from "../contexts/TokenContext";
import {
  validateLoginForm,
  validateEmail,
  validatePassword,
} from "../utils/validators.js";
import {
  InputContainer,
  Input,
  ErrorMessage,
} from "../components/FormComponents.js";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(TokenContext);
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

  function sendLogin(event) {
    event.preventDefault();

    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    const URLSignIn = "http://localhost:5000/";

    axios
      .post(URLSignIn, validation.formattedData)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setToken(res.data);
        localStorage.setItem("token", res.data);
        navigate("/feed");
      })
      .catch((err) => {
        setLoading(false);

        if (err.response?.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Email não encontrado",
            text: "Este email não está cadastrado. Verifique o email ou crie uma conta.",
            confirmButtonText: "OK",
            confirmButtonColor: "#1877f2",
          });
        } else if (err.response?.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Senha incorreta",
            text: "A senha informada está incorreta. Tente novamente.",
            confirmButtonText: "OK",
            confirmButtonColor: "#1877f2",
          });
        } else {
          const errorMessage =
            err.response?.data || "Erro ao fazer login. Tente novamente.";
          Swal.fire({
            icon: "error",
            title: "Erro no login",
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
        <FormContainer onSubmit={sendLogin} noValidate>
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

          <Button type="submit" disabled={loading}>
            {!loading ? (
              "Entrar"
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
        <Link to="/sign-up">
          <SignUpOption>Primeira vez? Crie uma conta!</SignUpOption>
        </Link>
      </RightSection>
    </PageContainer>
  );
}

export const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
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
    height: 48vh;
    min-height: unset;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 20px 0 20px;
    div {
      max-width: 100%;
    }
  }
`;

export const Title = styled.h1`
  font-family: "Passion One", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 106px;
  line-height: 100%;
  letter-spacing: 5px;
  color: #ffffff;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 76px;
    line-height: 100%;
    margin-bottom: 70px;
  }
`;

export const Subtitle = styled.h2`
  font-family: "Oswald", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-size: 40px;
  line-height: 100%;
  letter-spacing: 0px;
  color: #ffffff;
  margin-bottom: 13px;

  @media (max-width: 768px) {
    font-size: 23px;
    line-height: 100%;
  }
`;

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
    height: 52vh;
    justify-content: flex-start;
    padding: 92px 24px;
    flex-grow: 1;
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 429px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const Button = styled.button`
  width: 100%;
  height: 65px;
  background: #1877f2;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Oswald", sans-serif;
  font-weight: 700;
  font-size: 27px;
  line-height: 40px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #166fe5;
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }

  @media (max-width: 768px) {
    height: 55px;
    font-size: 22px;
    line-height: 33px;
  }
`;

export const SignUpOption = styled.p`
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 100%;
  text-decoration-line: underline;
  color: #ffffff;
  margin-top: 14px;
  cursor: pointer;

  &:hover {
    color: #d1d1d1;
  }

  @media (max-width: 768px) {
    font-size: 17px;
    line-height: 20px;
  }
`;
