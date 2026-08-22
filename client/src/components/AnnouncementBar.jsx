import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaTimes, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Bar = styled.div`
  background: ${({ theme }) => theme.charcoal};
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  a { color: ${({ theme }) => theme.red}; display: inline-flex; align-items: center; gap: 5px; }
  a:hover { text-decoration: underline; }
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 9px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
`;

const Close = styled.button`
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  opacity: 0.8;
  &:hover { opacity: 1; }
`;

const WRAP = styled.div`
  position: relative;
  overflow: hidden;
  @media (max-width: 600px) { ${Inner} { padding-right: 40px; } }
`;

const MESSAGES = [
  <>🔥 Summer deal — free Piri Piri Dip with every 2+ person combo. <Link to="/menu">Order now <FaArrowRight /></Link></>,
  <>🚚 Free delivery on orders over £20 across Edinburgh. <Link to="/menu">See menu <FaArrowRight /></Link></>,
  <>👨‍👩‍👧 Kids eat free every Tuesday — one free kids meal per adult main.</>,
  <>⭐ Join Periano Rewards & collect stamps for a free meal. <Link to="/our-app">Sign up <FaArrowRight /></Link></>
];

export default function AnnouncementBar() {
  const [hidden, setHidden] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  if (hidden) return null;
  return (
    <WRAP>
      <Bar>
        <Inner>{MESSAGES[i]}</Inner>
        <Close onClick={() => setHidden(true)} aria-label="Dismiss announcement"><FaTimes /></Close>
      </Bar>
    </WRAP>
  );
}
