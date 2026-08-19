import { createGlobalStyle } from "styled-components";
import { theme } from "./theme.js";

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: ${theme.charcoal};
    background: #fff;
    line-height: 1.5;
  }
  a { color: inherit; text-decoration: none; }
  h1, h2, h3, h4 { margin: 0 0 0.5em; line-height: 1.15; }
  button { font-family: inherit; }
  img { max-width: 100%; display: block; }

  /* Accessibility: visible keyboard focus */
  *:focus-visible {
    outline: 3px solid ${theme.redDark};
    outline-offset: 2px;
  }

  /* Respect users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }

  .container { max-width: ${theme.maxWidth}; margin: 0 auto; padding: 0 20px; }
`;
