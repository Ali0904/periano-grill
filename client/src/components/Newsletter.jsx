import styled from "styled-components";
import { useState } from "react";

const Wrap = styled.section`
  background: ${({ theme }) => theme.charcoal};
  color: #fff;
  text-align: center;
  padding: 44px 20px;
  h2 { margin: 0 0 8px; }
  p { margin: 0 0 18px; opacity: 0.85; }
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  input {
    padding: 14px 18px;
    border-radius: 30px;
    border: none;
    width: min(360px, 80vw);
    font-size: 15px;
  }
  button {
    background: ${({ theme }) => theme.orange};
    color: #fff;
    border: none;
    padding: 14px 28px;
    border-radius: 30px;
    font-weight: 800;
    cursor: pointer;
    font-size: 15px;
  }
`;

const Msg = styled.p`
  margin: 14px 0 0;
  min-height: 20px;
  font-weight: 600;
  color: ${({ ok }) => (ok ? "#6fe39a" : "#ff9b8a")};
`;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [ok, setOk] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setOk(false);
      setMsg("Please enter a valid email address.");
      return;
    }
    setOk(true);
    setMsg("Thanks for signing up. Keep an eye on your inbox!");
    setEmail("");
  };

  return (
    <Wrap>
      <h2>Become a Periano Grill Fan</h2>
      <p>Sign up to get notified of exclusive offers, competitions, new launches and more!</p>
      <Form onSubmit={submit}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </Form>
      {msg && <Msg ok={ok}>{msg}</Msg>}
    </Wrap>
  );
}
