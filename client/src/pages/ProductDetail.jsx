import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaFire, FaPlus, FaMinus, FaUtensils, FaCheck } from "react-icons/fa";
import api from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
`;

const Back = styled(Link)`
  color: ${({ theme }) => theme.redDark};
  font-weight: 700;
  display: inline-block;
  margin-bottom: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  @media (max-width: 820px) { grid-template-columns: 1fr; }
`;

const Hero = styled.img`
  width: 100%;
  height: 380px;
  object-fit: cover;
  border-radius: 16px;
  background: ${({ theme }) => theme.cream};
`;

const Title = styled.h1`
  font-size: 32px;
  margin: 0 0 8px;
`;

const Desc = styled.p`
  color: ${({ theme }) => theme.muted};
  font-size: 16px;
`;

const Spice = styled.div`
  color: ${({ theme }) => theme.orange};
  margin: 10px 0;
  font-size: 18px;
`;

const Price = styled.div`
  font-size: 26px;
  font-weight: 800;
  margin: 12px 0;
`;

const Section = styled.div`
  margin: 20px 0;
  h3 { font-size: 18px; margin: 0 0 10px; display: flex; align-items: center; gap: 8px; }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chip = styled.button`
  border: 2px solid ${({ theme }) => theme.line};
  background: #fff;
  color: ${({ theme }) => theme.charcoal};
  padding: 9px 14px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.12s;
  &:hover { transform: translateY(-1px); }
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
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  h4 { margin: 0 0 4px; font-size: 16px; display: flex; align-items: center; gap: 8px; }
  p { margin: 0; color: ${({ theme }) => theme.muted}; font-size: 14px; }
  .price { font-weight: 800; font-size: 18px; white-space: nowrap; }
  .tick {
    width: 24px; height: 24px; border-radius: 50%;
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
  margin: 16px 0;
  button {
    width: 36px; height: 36px; border-radius: 50%;
    border: none; background: ${({ theme }) => theme.red}; color: ${({ theme }) => theme.onPrimary};
    font-weight: 800; cursor: pointer; font-size: 18px;
  }
  span { font-weight: 800; font-size: 18px; min-width: 24px; text-align: center; }
`;

const AddBtn = styled.button`
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.redDark}; }
`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [addons, setAddons] = useState([]);
  const [sides, setSides] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [meal, setMeal] = useState(false);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setNotFound(false);
    api.get(`/products/${id}`).then((r) => active && setProduct(r.data)).catch(() => active && setNotFound(true));
    api.get("/products?category=addon").then((r) => active && setAddons(r.data)).catch(() => {});
    api.get("/products?category=sides").then((r) => active && setSides(r.data)).catch(() => {});
    api.get("/products?category=drinks").then((r) => active && setDrinks(r.data)).catch(() => {});
    return () => { active = false; };
  }, [id]);

  if (notFound) return <Wrap><Back to="/menu">← Back to menu</Back><p>Product not found.</p></Wrap>;
  if (!product) return <Wrap><p style={{ color: "#6b6b6b" }}>Loading…</p></Wrap>;

  const toggleAddon = (aid) =>
    setSelected((prev) => (prev.includes(aid) ? prev.filter((x) => x !== aid) : [...prev, aid]));

  const mealDip = addons[0];
  const mealSide = sides.find((s) => /fries/i.test(s.name)) || sides[0];
  const mealDrink = drinks[0];
  const mealItems = mealDip && mealSide && mealDrink ? [mealDip, mealSide, mealDrink] : [];
  const mealPrice = mealItems.reduce((s, i) => s + i.price, 0);

  const handleAdd = () => {
    add(product, qty);
    selected.forEach((aid) => {
      const a = addons.find((x) => x._id === aid);
      if (a) add(a, 1);
    });
    if (meal) mealItems.forEach((i) => add(i, 1));
    navigate("/cart");
  };

  return (
    <Wrap>
      <Back to="/menu">← Back to menu</Back>
      <Grid>
        <Hero src={product.image} alt={product.name} />
        <div>
          <Title>{product.name}</Title>
          <Desc>{product.description}</Desc>
          <Spice>
            {Array.from({ length: product.spiceLevel || 0 }).map((_, i) => (
              <FaFire key={i} />
            ))}
            {product.spiceLevel === 0 && <span style={{ color: "#999" }}>Mild</span>}
          </Spice>
          <Price>£{product.price.toFixed(2)}</Price>

          <Section>
            <h3>Add a dip</h3>
            <Chips>
              {addons.length === 0 && <span style={{ color: "#6b6b6b" }}>No dips available.</span>}
              {addons.map((a) => (
                <Chip
                  key={a._id}
                  className={selected.includes(a._id) ? "active" : ""}
                  onClick={() => toggleAddon(a._id)}
                >
                  {selected.includes(a._id) && <FaCheck />}
                  {a.name} · £{a.price.toFixed(2)}
                </Chip>
              ))}
            </Chips>
          </Section>

          {mealItems.length > 0 && (
            <Section>
              <h3><FaUtensils /> Make it a meal deal</h3>
              <MealDeal className={meal ? "on" : ""} onClick={() => setMeal((m) => !m)} type="button">
                <div>
                  <h4>{product.name} + dip + side + drink</h4>
                  <p>
                    {meal
                      ? "Added to your deal — great value!"
                      : `Add a dip, ${mealSide.name} and a ${mealDrink.name}`}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="price">£{(product.price + mealPrice).toFixed(2)}</span>
                  <span className="tick">{meal && <FaCheck />}</span>
                </div>
              </MealDeal>
            </Section>
          )}

          <Qty>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
              <FaMinus />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
              <FaPlus />
            </button>
          </Qty>

          <AddBtn onClick={handleAdd}>Add to cart</AddBtn>
        </div>
      </Grid>
    </Wrap>
  );
}
