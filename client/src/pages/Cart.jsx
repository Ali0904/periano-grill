import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/client.js";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 34px; }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 12px;
  .name { font-weight: 700; flex: 1; min-width: 140px; }
`;

const Qty = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.line};
    background: #fff;
    cursor: pointer;
    font-weight: 800;
  }
`;

const Summary = styled.div`
  text-align: right;
  margin-top: 18px;
  h3 { font-size: 22px; }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 14px;
  a, button {
    padding: 14px 28px;
    border-radius: 30px;
    font-weight: 800;
    border: none;
    cursor: pointer;
  }
  @media (max-width: 560px) {
    a, button { flex: 1; text-align: center; }
  }
  .primary { background: ${({ theme }) => theme.red}; color: ${({ theme }) => theme.onPrimary}; }
  .ghost { background: #fff; color: ${({ theme }) => theme.redDark}; border: 2px solid ${({ theme }) => theme.redDark}; }
`;

const Empty = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.muted};
  padding: 60px 0;
  a { color: ${({ theme }) => theme.red}; font-weight: 700; }
`;

const Suggest = styled.section`
  margin-top: 28px;
  h2 { font-size: 20px; margin-bottom: 12px; }
`;

const SuggestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
`;

const SuggestCard = styled.div`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  .nm { font-weight: 700; font-size: 14px; }
  .pr { color: ${({ theme }) => theme.muted}; font-size: 13px; }
  button {
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    border: none;
    border-radius: 20px;
    padding: 8px;
    font-weight: 800;
    cursor: pointer;
  }
`;

export default function Cart() {
  const { items, remove, changeQty, total, count, add } = useCart();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    api.get("/products").then((r) => {
      const cartIds = new Set(items.map((i) => i.product));
      const recs = r.data.filter(
        (p) => (p.category === "dips" || p.category === "addon") && !cartIds.has(p._id)
      );
      setSuggestions(recs.slice(0, 4));
    }).catch(() => {});
  }, [items]);

  if (count === 0) {
    return (
      <Wrap>
        <h1>Your Cart</h1>
        <Empty>
          <p>Your cart is empty.</p>
          <Link to="/menu">Browse the menu →</Link>
        </Empty>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <h1>Your Cart ({count})</h1>
      {items.map((i) => (
        <Row key={i.product}>
          <span className="name">{i.name}</span>
          <Qty>
            <button onClick={() => changeQty(i.product, i.quantity - 1)}>−</button>
            <span>{i.quantity}</span>
            <button onClick={() => changeQty(i.product, i.quantity + 1)}>+</button>
          </Qty>
          <span>£{(i.price * i.quantity).toFixed(2)}</span>
          <button
            onClick={() => remove(i.product)}
            style={{ background: "none", border: "none", color: "#e2231a", cursor: "pointer", fontWeight: 800 }}
          >
            Remove
          </button>
        </Row>
      ))}

      {suggestions.length > 0 && (
        <Suggest>
          <h2>🌶️ Pairs well with your order</h2>
          <SuggestGrid>
            {suggestions.map((p) => (
              <SuggestCard key={p._id}>
                <span className="nm">{p.name}</span>
                <span className="pr">£{p.price.toFixed(2)}</span>
                <button onClick={() => add(p)}>Add +</button>
              </SuggestCard>
            ))}
          </SuggestGrid>
        </Suggest>
      )}

      <Summary>
        <h3>Total: £{total.toFixed(2)}</h3>
        <Actions>
          <Link to="/menu" className="ghost">
            Keep Shopping
          </Link>
          <Link to="/checkout" className="primary">
            Checkout
          </Link>
        </Actions>
      </Summary>
    </Wrap>
  );
}
