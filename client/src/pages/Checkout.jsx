import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Wrap = styled.div`
  max-width: 560px;
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 32px; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;
  label { font-weight: 700; font-size: 14px; }
  input, select {
    padding: 12px 14px;
    border: 2px solid ${({ theme }) => theme.line};
    border-radius: 10px;
    font-size: 15px;
    outline: none;
    &:focus { border-color: ${({ theme }) => theme.red}; }
  }
  button {
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    border: none;
    padding: 14px;
    border-radius: 30px;
    font-weight: 800;
    font-size: 16px;
    cursor: pointer;
  }
  button:disabled { opacity: 0.6; }
`;

const Total = styled.div`
  text-align: right;
  font-size: 20px;
  font-weight: 800;
  margin-top: 8px;
`;

const Msg = styled.p`
  text-align: center;
  font-weight: 700;
  color: ${({ ok }) => (ok ? "#1a8a3c" : "#e2231a")};
`;

const Note = styled.p`
  color: ${({ theme }) => theme.muted};
  text-align: center;
`;

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryType, setDeliveryType] = useState("delivery");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <Wrap>
        <h1>Checkout</h1>
        <Note>
          Please <a href="/login" style={{ color: "#e2231a", fontWeight: 700 }}>log in</a> to place
          an order.
        </Note>
      </Wrap>
    );
  }

  if (success) {
    return (
      <Wrap>
        <h1>Order Placed!</h1>
        <Msg ok>
          Thank you — your order is being prepared. You'll see it in "My Orders".
        </Msg>
        <Note>
          <a href="/orders" style={{ color: "#e2231a", fontWeight: 700 }}>
            View my orders →
          </a>
        </Note>
      </Wrap>
    );
  }

  if (items.length === 0) {
    return (
      <Wrap>
        <h1>Checkout</h1>
        <Note>Your cart is empty. <a href="/menu" style={{ color: "#e2231a", fontWeight: 700 }}>Order now</a>.</Note>
      </Wrap>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/orders", {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        deliveryType,
        address,
        phone
      });
      clear();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Could not place order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrap>
      <h1>Checkout</h1>
      <Form onSubmit={submit}>
        <label>Order type</label>
        <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
          <option value="delivery">Delivery</option>
          <option value="pickup">Collection</option>
        </select>

        {deliveryType === "delivery" && (
          <>
            <label>Delivery address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, postcode"
              required
            />
          </>
        )}

        <label>Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+44 ..."
          required
        />

        <Total>Total: £{total.toFixed(2)}</Total>
        <button type="submit" disabled={busy}>
          {busy ? "Placing order…" : "Place Order"}
        </button>
        {error && <Msg>{error}</Msg>}
      </Form>
    </Wrap>
  );
}
