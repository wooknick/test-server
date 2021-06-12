import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyle = createGlobalStyle`
    ${reset}
    *{
        box-sizing: border-box;
    }
    html, body{
        font-size: 16px;
        width: 100%;
        height: 100%;
    }
    a{
        color: inherit;
        text-decoration: none;
    }
    input, button{
        &:focus, &:active{
            outline:none
        }
    }
`;

export default GlobalStyle;
