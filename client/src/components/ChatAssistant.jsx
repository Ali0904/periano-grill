import styled, { keyframes } from "styled-components";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import api from "../api/client.js";

const Wrapper = styled.div`
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Hint = styled.div`
  background: ${({ theme }) => theme.charcoal};
  color: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  max-width: 250px;
  line-height: 1.4;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
  animation: ${fadeIn} 0.45s ease both;
`;

const Label = styled.div`
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  font-weight: 800;
  font-size: 12px;
  padding: 7px 13px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  gap: 6px;
  animation: ${fadeIn} 0.5s ease both;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    right: 22px;
    bottom: -6px;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid ${({ theme }) => theme.red};
  }
`;

const FAB = styled.button`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: ${({ theme }) => theme.redDark}; }
`;

const Panel = styled.div`
  width: 340px;
  max-width: calc(100vw - 32px);
  height: 440px;
  max-height: calc(100vh - 110px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.line};
`;

const Head = styled.div`
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 800;
  button { background: none; border: none; color: inherit; font-size: 18px; cursor: pointer; }
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Bubble = styled.div`
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  align-self: ${({ mine }) => (mine ? "flex-end" : "flex-start")};
  background: ${({ mine, theme }) => (mine ? theme.red : theme.cream)};
  color: ${({ mine, theme }) => (mine ? theme.onPrimary : theme.charcoal)};
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  a {
    font-size: 12px;
    background: ${({ theme }) => theme.cream};
    border: 1px solid ${({ theme }) => theme.line};
    color: ${({ theme }) => theme.redDark};
    padding: 5px 9px;
    border-radius: 14px;
    font-weight: 700;
    text-decoration: none;
  }
`;

const InputRow = styled.form`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.line};
  input {
    flex: 1;
    border: none;
    padding: 12px;
    outline: none;
    font-size: 14px;
  }
  button {
    border: none;
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    padding: 0 16px;
    cursor: pointer;
    font-size: 16px;
  }
`;

const SUGGESTIONS = [
  "What's your most popular item?",
  "Any vegan options?",
  "How do Meal Deals work?",
  "Where's your store?"
];

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      mine: false,
      text: "Hi! I'm the Periano Grill assistant. Ask me about our menu, meal deals, dietary options, prices, delivery — or where to find us at 141A St John's Rd, Corstorphine, Edinburgh."
    }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setShowHint(true);
      const t = setTimeout(() => setShowHint(false), 7000);
      return () => clearTimeout(t);
    }
    setShowHint(false);
  }, [open]);

  const send = async (text) => {
    const question = (text || input).trim();
    if (!question || busy) return;
    setInput("");
    setMessages((m) => [...m, { mine: true, text: question }]);
    setBusy(true);
    try {
      const { data } = await api.post("/ai/ask", { question });
      setMessages((m) => [
        ...m,
        { mine: false, text: data.answer, products: data.products || [] }
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { mine: false, text: "Sorry, I couldn't reach the assistant right now. Please try again." }
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrapper>
      {open && showHint && (
        <Hint>
          👋 Hey! I'm your Periano Grill assistant. Ask me anything about the menu, or tap a
          suggestion below to get started.
        </Hint>
      )}
      {!open && (
        <Label>
          <FaRobot /> AI Assistant — tap to chat
        </Label>
      )}
      {open && (
        <Panel>
          <Head>
            <span>Periano Grill Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">
              <FaTimes />
            </button>
          </Head>
          <Body ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: m.mine ? "flex-end" : "flex-start" }}>
                <Bubble mine={m.mine}>{m.text}</Bubble>
                {m.products && m.products.length > 0 && (
                  <Chips>
                    {m.products.map((p) => (
                      <Link key={p.id} to={`/menu/${p.id}`} onClick={() => setOpen(false)}>
                        {p.name} · £{p.price.toFixed(2)}
                      </Link>
                    ))}
                  </Chips>
                )}
              </div>
            ))}
            {messages.length <= 1 && (
              <Chips>
                {SUGGESTIONS.map((s) => (
                  <a key={s} href="#" onClick={(e) => { e.preventDefault(); send(s); }}>
                    {s}
                  </a>
                ))}
              </Chips>
            )}
          </Body>
          <InputRow
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              aria-label="Message the assistant"
            />
            <button type="submit" disabled={busy} aria-label="Send">
              <FaPaperPlane />
            </button>
          </InputRow>
        </Panel>
      )}
      <FAB onClick={() => setOpen((o) => !o)} aria-label="Open assistant">
        <FaRobot />
      </FAB>
    </Wrapper>
  );
}
