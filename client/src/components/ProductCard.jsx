import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaFire, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";

const Card = styled.div`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 14px;
  padding: 18px;
  background: #fff;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s, transform 0.1s;
  &:hover {
    border-color: ${({ theme }) => theme.orange};
    transform: translateY(-2px);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 12px;
  background: ${({ theme }) => theme.cream};
`;

const Name = styled.h3`
  font-size: 17px;
  margin: 0 0 6px;
`;

const Desc = styled.p`
  color: ${({ theme }) => theme.muted};
  font-size: 14px;
  margin: 0 0 12px;
  flex: 1;
`;

const Spice = styled.div`
  color: ${({ theme }) => theme.orange};
  margin-bottom: 10px;
  font-size: 14px;
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.span`
  font-weight: 800;
  font-size: 18px;
`;

const Add = styled.button`
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  border: none;
  border-radius: 24px;
  padding: 9px 16px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover { background: ${({ theme }) => theme.redDark}; }
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.cream};
  border-radius: 24px;
  padding: 4px 6px;
  button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  span { font-weight: 800; min-width: 18px; text-align: center; }
`;

export default function ProductCard({ product }) {
  const { items, add, changeQty, remove } = useCart();
  const navigate = useNavigate();
  const inCart = items.find((i) => i.product === product._id);
  const qty = inCart ? inCart.quantity : 0;

  const goDetail = () => navigate(`/menu/${product._id}`);

  return (
    <Card onClick={goDetail} role="link" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") goDetail(); }}>
      {product.image && <Img src={product.image} alt={product.name} loading="lazy" />}
      <Name>{product.name}</Name>
      <Desc>{product.description}</Desc>
      <Spice>
        {Array.from({ length: product.spiceLevel || 0 }).map((_, i) => (
          <FaFire key={i} />
        ))}
        {product.spiceLevel === 0 && <span style={{ color: "#999" }}>Mild</span>}
      </Spice>
      <Bottom>
        <Price>£{product.price.toFixed(2)}</Price>
        {qty > 0 ? (
          <Stepper onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => (qty <= 1 ? remove(product._id) : changeQty(product._id, qty - 1))}
              aria-label={`Decrease ${product.name}`}
            >
              <FaMinus />
            </button>
            <span>{qty}</span>
            <button onClick={() => changeQty(product._id, qty + 1)} aria-label={`Increase ${product.name}`}>
              <FaPlus />
            </button>
          </Stepper>
        ) : (
          <Add
            onClick={(e) => { e.stopPropagation(); add(product); }}
            aria-label={`Add ${product.name}`}
          >
            <FaPlus /> Add
          </Add>
        )}
      </Bottom>
    </Card>
  );
}
