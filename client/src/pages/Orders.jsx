import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 34px; }
`;

const Card = styled.div`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 14px;
  .top { display: flex; justify-content: space-between; font-weight: 800; }
  .items { color: ${({ theme }) => theme.muted}; font-size: 14px; margin: 8px 0; }
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
  .step {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #aaa;
    font-weight: 700;
  }
  .step.done { color: ${({ theme }) => theme.redDark}; }
  .step.active { color: ${({ theme }) => theme.red}; }
  .dot {
    width: 14px; height: 14px; border-radius: 50%;
    background: #ddd; border: 2px solid #ccc;
  }
  .step.done .dot, .step.active .dot { background: ${({ theme }) => theme.red}; border-color: ${({ theme }) => theme.red}; }
  .bar { flex: 1; height: 3px; background: #eee; min-width: 16px; }
`;

const STEPS = ["pending", "preparing", "ready", "completed"];
const LABELS = { pending: "Order placed", preparing: "Preparing", ready: "Ready", completed: "Completed" };
const TERMINAL = ["completed", "cancelled"];

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const timer = useRef(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const load = () =>
      api
        .get("/orders/me")
        .then((r) => setOrders(r.data))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));

    load();
    timer.current = setInterval(() => {
      setOrders((prev) => {
        const active = prev.some((o) => !TERMINAL.includes(o.status));
        if (!active) return prev;
        load();
        return prev;
      });
    }, 8000);

    return () => clearInterval(timer.current);
  }, [user]);

  if (!user) {
    return (
      <Wrap>
        <h1>My Orders</h1>
        <p style={{ color: "#6b6b6b" }}>
          Please <a href="/login" style={{ color: "#C99700", fontWeight: 700 }}>log in</a> to view
          your orders.
        </p>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <h1>My Orders</h1>
      {loading ? (
        <p style={{ color: "#6b6b6b" }}>Loading…</p>
      ) : orders.length === 0 ? (
        <p style={{ color: "#6b6b6b" }}>
          No orders yet. <a href="/menu" style={{ color: "#C99700", fontWeight: 700 }}>Place your first order →</a>
        </p>
      ) : (
        orders.map((o) => {
          const idx = STEPS.indexOf(o.status);
          return (
            <Card key={o._id}>
              <div className="top">
                <span>Order #{o._id.slice(-6).toUpperCase()}</span>
                <span>£{o.total.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 13, color: "#999" }}>
                {new Date(o.createdAt).toLocaleString()}
              </div>
              <div className="items">
                {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
              </div>
              {o.status === "cancelled" ? (
                <p style={{ color: "#e2231a", fontWeight: 700, margin: 0 }}>Cancelled</p>
              ) : (
                <Stepper>
                  {STEPS.map((s, i) => (
                    <span key={s} style={{ display: "contents" }}>
                      <span className={`step ${i < idx ? "done" : i === idx ? "active" : ""}`}>
                        <span className="dot" />
                        {LABELS[s]}
                      </span>
                      {i < STEPS.length - 1 && <span className="bar" />}
                    </span>
                  ))}
                </Stepper>
              )}
            </Card>
          );
        })
      )}
    </Wrap>
  );
}
