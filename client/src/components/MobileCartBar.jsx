import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaShoppingBasket } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";

const Bar = styled.div`
  display: none;
  @media (max-width: 720px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1500;
    background: ${({ theme }) => theme.charcoal};
    color: #fff;
    padding: 12px 18px;
    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.25);
  }
  .info { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 14px; }
  a {
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    padding: 10px 18px;
    border-radius: 30px;
    font-weight: 800;
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
  }
`;

export default function MobileCartBar() {
  const { count, total } = useCart();
  if (count === 0) return null;
  return (
    <Bar>
      <span className="info">
        <FaShoppingBasket /> {count} item{count > 1 ? "s" : ""}
      </span>
      <Link to="/cart">View Cart · £{total.toFixed(2)}</Link>
    </Bar>
  );
}
