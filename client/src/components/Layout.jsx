import styled from "styled-components";
import HeaderBar from "./Header.jsx";
import FooterBar from "./Footer.jsx";
import MobileCartBar from "./MobileCartBar.jsx";

const Main = styled.main`
  min-height: 60vh;
`;

export default function Layout({ children }) {
  return (
    <>
      <HeaderBar />
      <Main>{children}</Main>
      <FooterBar />
      <MobileCartBar />
    </>
  );
}
