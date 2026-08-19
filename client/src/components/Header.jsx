import styled from "styled-components";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaFire } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Header = styled.header`
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 12px 20px;
  @media (max-width: 600px) {
    padding: 10px 14px;
    gap: 12px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  img {
    height: 46px;
    width: auto;
    display: block;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 18px;
  align-items: center;
  margin-left: auto;
  font-weight: 600;
  ${({ open, theme }) =>
    open
      ? `display:flex; flex-direction:column; position:absolute; top:64px; left:0; right:0; background:${theme.red}; padding:16px 20px;`
      : ""}
  @media (max-width: 880px) {
    display: ${({ open }) => (open ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.red};
    padding: 16px 20px;
  }
`;

const NavLinkStyled = styled(NavLink)`
  color: ${({ theme }) => theme.onPrimary};
  padding: 6px 4px;
  border-bottom: 2px solid transparent;
  &.active { border-color: ${({ theme }) => theme.onPrimary}; }
`;

const OrderBtn = styled(Link)`
  background: ${({ theme }) => theme.charcoal};
  color: #fff;
  padding: 8px 16px;
  border-radius: 24px;
  font-weight: 800;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: ${({ ml }) => ml || "0"};
`;

const IconBtn = styled(Link)`
  color: ${({ theme }) => theme.onPrimary};
  display: flex;
  align-items: center;
  position: relative;
  font-size: 20px;
`;

const Count = styled.span`
  position: absolute;
  top: -8px;
  right: -10px;
  background: ${({ theme }) => theme.orange};
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  border-radius: 10px;
  padding: 0 5px;
`;

const Toggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.onPrimary};
  font-size: 24px;
  cursor: pointer;
  @media (max-width: 880px) {
    display: block;
  }
`;

export default function HeaderBar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Header>
      <Inner>
        <Logo to="/">
          <img src="/main_logo.png" alt="Periano Grill" />
        </Logo>

        <Nav open={open}>
          <NavLinkStyled to="/menu" onClick={() => setOpen(false)}>
            Menu
          </NavLinkStyled>
          <NavLinkStyled to="/our-food" onClick={() => setOpen(false)}>
            Our Food
          </NavLinkStyled>
          <NavLinkStyled to="/stores" onClick={() => setOpen(false)}>
            Our Stores
          </NavLinkStyled>
          <NavLinkStyled to="/our-app" onClick={() => setOpen(false)}>
            Our App
          </NavLinkStyled>
          <NavLinkStyled to="/franchising" onClick={() => setOpen(false)}>
            Franchising
          </NavLinkStyled>
          <OrderBtn to="/menu" onClick={() => setOpen(false)}>
            Order Now
          </OrderBtn>
        </Nav>

        <Right ml="auto">
          <IconBtn to="/cart" aria-label="Cart">
            <FaShoppingCart />
            {count > 0 && <Count>{count}</Count>}
          </IconBtn>
          {user ? (
            <IconBtn to="/orders" aria-label="My orders">
              <FaUser />
            </IconBtn>
          ) : (
            <IconBtn to="/login" aria-label="Login">
              <FaUser />
            </IconBtn>
          )}
          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              style={{
                background: "transparent",
                border: `1px solid ${"#1c1c1c"}`,
                color: "#1c1c1c",
                borderRadius: 20,
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              Log out
            </button>
          )}
          <Toggle onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <FaTimes /> : <FaBars />}
          </Toggle>
        </Right>
      </Inner>
    </Header>
  );
}
