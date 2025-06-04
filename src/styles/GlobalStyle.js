import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  body {
    background-color: #333333;
    font-family: 'Lato', sans-serif;
  }
`;

export default GlobalStyle;