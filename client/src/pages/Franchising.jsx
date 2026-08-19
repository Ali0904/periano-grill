import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 36px; }
  p { max-width: 760px; color: ${({ theme }) => theme.muted}; font-size: 17px; }
`;

const Cta = styled(Link)`
  display: inline-block;
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  padding: 14px 30px;
  border-radius: 30px;
  font-weight: 800;
  margin-top: 20px;
`;

export default function Franchising() {
  return (
    <Wrap>
      <h1>Franchising</h1>
      <p>
        Love Periano Grill? So do our franchisees. With over 250 stores across the UK and growing
        internationally, there's never been a better time to bring the home of flame-grilled Piri
        Piri chicken to your community.
      </p>
      <p>
        We work closely with our franchise partners to provide bespoke training, marketing and
        operations support — everything you need to run a successful Periano Grill store.
      </p>
      <Cta to="/signup">Register your interest</Cta>
    </Wrap>
  );
}
