import styled from "styled-components";
import HeaderBar from "./Header.jsx";
import FooterBar from "./Footer.jsx";

const Main = styled.main`
  min-height: 60vh;
`;

export default function Layout({ children }) {
  return (
    <>
      <HeaderBar />
      <Main>{children}</Main>
      <FooterBar />
    </>
  );
}
