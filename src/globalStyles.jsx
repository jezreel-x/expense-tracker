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
        /* Makes browser-drawn UI — scrollbars, radio dots, number spinners —
           follow the theme instead of staying light on a dark page. */
        color-scheme: ${({ theme }) => theme.mode};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        transition: background-color 200ms ease, color 200ms ease;
    }

    @media (prefers-reduced-motion: reduce) {
        body {
            transition: none;
        }
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
