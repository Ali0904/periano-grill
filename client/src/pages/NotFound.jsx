import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrap = styled.div`
  max-width: 600px;
  margin: 80px auto;
  text-align: center;
  padding: 0 20px;
  h1 { font-size: 60px; color: ${({ theme }) => theme.redDark}; }
  a { color: ${({ theme }) => theme.red}; font-weight: 700; }
`;

export default function NotFound() {
  return (
    <Wrap>
      <h1>404</h1>
      <p>This page has flown the coop.</p>
      <Link to="/">← Back to home</Link>
    </Wrap>
  );
}
