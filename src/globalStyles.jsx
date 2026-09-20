import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    * {
        margin: 0;
        padding: 0;
    }

    body {
        font-family: ${({ theme }) => theme.typography.family};
        font-size: ${({ theme }) => theme.typography.size.md};
        line-height: ${({ theme }) => theme.typography.lineHeight.normal};
        color: ${({ theme }) => theme.colors.text};
        background: ${({ theme }) => theme.colors.background};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    button,
    input {
        font: inherit;
        color: inherit;
    }

    /* Visible focus for keyboard users, suppressed for mouse clicks. */
    :focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.accent};
        outline-offset: 2px;
    }
`;

export default GlobalStyle;
