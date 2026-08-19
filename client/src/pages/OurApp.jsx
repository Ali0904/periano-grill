import styled from "styled-components";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 36px; }
  p { max-width: 760px; color: ${({ theme }) => theme.muted}; font-size: 17px; }
`;

const Badges = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  a {
    background: ${({ theme }) => theme.charcoal};
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 700;
  }
`;

export default function OurApp() {
  return (
    <Wrap>
      <h1>Our App</h1>
      <p>
        Order Periano Grill in a tap, collect loyalty points on every purchase and unlock exclusive
        app-only offers. Download the Periano Grill app today and join the flavour fan club.
      </p>
      <Badges>
        <a href="https://apps.apple.com/gb/app/pepes/id6444842080" target="_blank" rel="noopener">
          Download on the App Store
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.threespos.sales.apps.loyalty.pepe"
          target="_blank"
          rel="noopener"
        >
          Get it on Google Play
        </a>
      </Badges>
    </Wrap>
  );
}
