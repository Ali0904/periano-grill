import { createContext, useContext, useState, useMemo, useEffect } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "periano-grill-cart";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt storage */
  }
  return [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product === product._id);
      if (found) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { product: product._id, name: product.name, price: product.price, quantity: 1 }
      ];
    });
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i.product !== id));

  const changeQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) =>
        i.product === id ? { ...i, quantity: Math.max(1, qty) } : i
      )
    );

  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );
  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, add, remove, changeQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
