import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaTimes, FaPlus, FaMinus, FaFire, FaUtensils, FaCheck } from "react-icons/fa";
import api from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";
import { handleImgError } from "../utils/image.js";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 18px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const Close = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  cursor: pointer;
  font-size: 16px;
  z-index: 2;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  min-height: 240px;
  object-fit: cover;
  border-radius: 18px 0 0 18px;
  background: ${({ theme }) => theme.cream};
  @media (max-width: 640px) { border-radius: 18px 18px 0 0; }
`;

const Body = styled.div`
  padding: 22px;
  h2 { margin: 0 0 6px; font-size: 24px; }
  .desc { color: ${({ theme }) => theme.muted}; font-size: 14px; margin: 0 0 10px; }
  .meta { color: ${({ theme }) => theme.orange}; margin: 6px 0; font-size: 16px; }
  .alli { color: ${({ theme }) => theme.muted}; font-size: 13px; margin: 8px 0; }
  .price { font-size: 22px; font-weight: 800; margin: 10px 0; }
`;

const Section = styled.div`
  margin: 14px 0;
  h4 { font-size: 14px; margin: 0 0 8px; display: flex; align-items: center; gap: 6px; }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  border: 2px solid ${({ theme }) => theme.line};
  background: #fff;
  color: ${({ theme }) => theme.charcoal};
  padding: 7px 12px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  &.active {
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    border-color: ${({ theme }) => theme.red};
  }
`;

const MealDeal = styled.button`
  width: 100%;
  text-align: left;
  border: 2px solid ${({ theme }) => theme.line};
  background: ${({ on, theme }) => (on ? theme.cream : "#fff")};
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  h4 { margin: 0 0 2px; font-size: 14px; display: flex; align-items: center; gap: 6px; }
  p { margin: 0; color: ${({ theme }) => theme.muted}; font-size: 12px; }
  .price { font-weight: 800; font-size: 15px; white-space: nowrap; }
  .tick {
    width: 22px; height: 22px; border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.line};
    display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0;
  }
  &.on .tick { background: ${({ theme }) => theme.red}; border-color: ${({ theme }) => theme.red}; }
`;

const Qty = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0;
  button {
    width: 34px; height: 34px; border-radius: 50%;
    border: none; background: ${({ theme }) => theme.red}; color: ${({ theme }) => theme.onPrimary};
    font-weight: 800; cursor: pointer; font-size: 16px;
  }
  span { font-weight: 800; font-size: 17px; min-width: 22px; text-align: center; }
`;

const AddBtn = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  border: none;
  padding: 13px;
  border-radius: 30px;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.redDark}; }
`;

export default function ProductModal({ product, onClose }) {
  const navigate = useNavigate();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState([]);
  const [meal, setMeal] = useState(false);
  const [addons, setAddons] = useState([]);
  const [sides, setSides] = useState([]);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let active = true;
    api.get("/products?category=addon").then((r) => active && setAddons(r.data)).catch(() => {});
    api.get("/products?category=sides").then((r) => active && setSides(r.data)).catch(() => {});
    api.get("/products?category=drinks").then((r) => active && setDrinks(r.data)).catch(() => {});
    return () => { active = false; };
  }, []);

  const toggle = (id) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const mealDip = addons[0];
  const mealSide = sides.find((s) => /fries/i.test(s.name)) || sides[0];
  const mealDrink = drinks[0];
  const mealItems = mealDip && mealSide && mealDrink ? [mealDip, mealSide, mealDrink] : [];
  const mealPrice = mealItems.reduce((s, i) => s + i.price, 0);

  const handleAdd = () => {
    add(product, qty);
    selected.forEach((id) => {
      const a = addons.find((x) => x._id === id);
      if (a) add(a, 1);
    });
    if (meal) mealItems.forEach((i) => add(i, 1));
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Close onClick={onClose} aria-label="Close">
          <FaTimes />
        </Close>
        <Img src={product.image} alt={product.name} onError={handleImgError} />
        <Body>
          {product.featured && (
            <span style={{ background: "#1a8a3c", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              Popular
            </span>
          )}
          <h2>{product.name}</h2>
          <p className="desc">{product.description}</p>
          <div className="meta">
            {Array.from({ length: product.spiceLevel || 0 }).map((_, i) => (
              <FaFire key={i} />
            ))}
            {product.spiceLevel === 0 && <span style={{ color: "#999", fontSize: 13 }}>Mild</span>}
            {product.rating ? `  ${product.rating}★` : ""}
          </div>
          <div className="alli">
            {product.allergens && product.allergens.length
              ? `Allergens: ${product.allergens.join(", ")}`
              : "No major allergens listed."}
          </div>
          <div className="price">£{product.price.toFixed(2)}</div>

          {addons.length > 0 && (
            <Section>
              <h4>Add a dip</h4>
              <Chips>
                {addons.map((a) => (
                  <Chip
                    key={a._id}
                    className={selected.includes(a._id) ? "active" : ""}
                    onClick={() => toggle(a._id)}
                  >
                    {selected.includes(a._id) && <FaCheck />}
                    {a.name} · £{a.price.toFixed(2)}
                  </Chip>
                ))}
              </Chips>
            </Section>
          )}

          {mealItems.length > 0 && (
            <Section>
              <MealDeal className={meal ? "on" : ""} onClick={() => setMeal((m) => !m)} type="button">
                <div>
                  <h4><FaUtensils /> Make it a meal deal</h4>
                  <p>
                    {meal
                      ? "Added to your deal — great value!"
                      : `Add a dip, ${mealSide.name} and a ${mealDrink.name}`}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="price">£{(product.price + mealPrice).toFixed(2)}</span>
                  <span className="tick">{meal && <FaCheck />}</span>
                </div>
              </MealDeal>
            </Section>
          )}

          <Qty>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
              <FaMinus />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">
              <FaPlus />
            </button>
          </Qty>

          <AddBtn onClick={handleAdd}>Add to cart</AddBtn>
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <Link to={`/menu/${product._id}`} onClick={onClose} style={{ color: "#C99700", fontWeight: 700, fontSize: 14 }}>
              View full details →
            </Link>
          </div>
        </Body>
      </Modal>
    </Overlay>
  );
}
