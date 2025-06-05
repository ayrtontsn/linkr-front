import styled from "styled-components";

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 13px;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 65px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid ${({ hasError }) => hasError ? '#ff4757' : 'rgba(0, 0, 0, 0.1)'};
  padding: 0 17px;
  font-family: "Oswald", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 27px;
  line-height: 40px;
  color: #151515;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => hasError ? '#ff4757' : '#1877f2'};
    box-shadow: 0 0 0 3px ${({ hasError }) => 
      hasError ? 'rgba(255, 71, 87, 0.2)' : 'rgba(24, 119, 242, 0.2)'};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: #9f9f9f;
    opacity: 1;
  }

  @media (max-width: 768px) {
    font-size: 22px;
    height: 55px;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 12px;
  color: #ff4757;
  margin-top: 5px;
  margin-left: 5px;
  font-family: "Lato", sans-serif;
  font-weight: 700;
`;
