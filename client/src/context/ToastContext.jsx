import { createContext, useContext, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { FaCheck } from "react-icons/fa";

const ToastCtx = createContext(null);

const pop = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  pointer-events: none;
`;

const Toast = styled.div`
  background: ${({ theme }) => theme.charcoal};
  color: #fff;
  padding: 12px 18px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  animation: ${pop} 0.25s ease both;
  svg { color: ${({ theme }) => theme.red}; }
`;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((msg) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <Container aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id}>
            <FaCheck /> {t.msg}
          </Toast>
        ))}
      </Container>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
