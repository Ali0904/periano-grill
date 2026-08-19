import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaTiktok, FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = styled.footer`
  background: #111;
  color: #cfcfcf;
  padding: 40px 20px 24px;
  margin-top: 40px;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  text-align: center;
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 18px;
  a:hover { color: #fff; }
`;

const Social = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 18px;
  a {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
  }
  a:hover { background: ${({ theme }) => theme.redDark}; }
`;

const Badges = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 18px;
  a {
    background: #fff;
    color: #111;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
  }
`;

const Copy = styled.p`
  font-size: 13px;
  color: #888;
  margin: 0;
`;

export default function FooterBar() {
  return (
    <Footer>
      <Inner>
        <Links>
          <a href="https://merch.pepes.co.uk/" target="_blank" rel="noopener">
            NEW! Periano Grill Merch
          </a>
          <Link to="/our-food">Customer Enquiries</Link>
          <Link to="/franchising">Franchising</Link>
          <Link to="/our-app">Jobs</Link>
          <Link to="/our-food">Nutrition and Allergens</Link>
          <Link to="/">What's New</Link>
          <Link to="/">eGift Card</Link>
        </Links>
        <Social>
          <a href="https://www.tiktok.com/@pepespiripiri" target="_blank" rel="noopener" aria-label="TikTok">
            <FaTiktok />
          </a>
          <a href="https://www.facebook.com/pepespiripiri" target="_blank" rel="noopener" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/pepespiripiri/" target="_blank" rel="noopener" aria-label="Instagram">
            <FaInstagram />
          </a>
        </Social>
        <Badges>
          <a href="https://apps.apple.com/gb/app/pepes/id6444842080" target="_blank" rel="noopener">
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.threespos.sales.apps.loyalty.pepe"
            target="_blank"
            rel="noopener"
          >
            Google Play
          </a>
        </Badges>
        <Copy>
          Privacy Policy &amp; Terms and Conditions &copy; Copyright Periano Grill
        </Copy>
      </Inner>
    </Footer>
  );
}
