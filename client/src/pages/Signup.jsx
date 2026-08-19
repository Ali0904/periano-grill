import styled from "styled-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Wrap = styled.div`
  max-width: 420px;
  margin: 50px auto;
  padding: 0 20px;
  h1 { font-size: 32px; text-align: center; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
  input {
    padding: 14px 16px;
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
  button:disabled { opacity: 0.6; cursor: default; }
`;

const Err = styled.p`
  color: #e2231a;
  text-align: center;
  font-weight: 600;
`;

const Alt = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.muted};
  a { color: ${({ theme }) => theme.redDark}; font-weight: 700; }
`;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrap>
      <h1>Sign Up</h1>
      <Form onSubmit={submit}>
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={busy}>
          {busy ? "Creating…" : "Create Account"}
        </button>
      </Form>
      {error && <Err>{error}</Err>}
      <Alt>
        Already have an account? <Link to="/login">Log in</Link>
      </Alt>
    </Wrap>
  );
}
