import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaFire, FaPlus, FaMinus } from "react-icons/fa";
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

const Addons = styled.div`
  margin: 18px 0;
  h3 { font-size: 18px; }
  label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    cursor: pointer;
  }
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
  const [selected, setSelected] = useState([]);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setNotFound(false);
    api
      .get(`/products/${id}`)
      .then((r) => active && setProduct(r.data))
      .catch(() => active && setNotFound(true));
    api
      .get("/products?category=addon")
      .then((r) => active && setAddons(r.data))
      .catch(() => {});
    return () => { active = false; };
  }, [id]);

  if (notFound) return <Wrap><Back to="/menu">← Back to menu</Back><p>Product not found.</p></Wrap>;
  if (!product) return <Wrap><p style={{ color: "#6b6b6b" }}>Loading…</p></Wrap>;

  const toggleAddon = (aid) =>
    setSelected((prev) => (prev.includes(aid) ? prev.filter((x) => x !== aid) : [...prev, aid]));

  const handleAdd = () => {
    add(product, qty);
    selected.forEach((aid) => {
      const a = addons.find((x) => x._id === aid);
      if (a) add(a, 1);
    });
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

          <Addons>
            <h3>Add-ons</h3>
            {addons.length === 0 && <p style={{ color: "#6b6b6b" }}>No add-ons available.</p>}
            {addons.map((a) => (
              <label key={a._id}>
                <input
                  type="checkbox"
                  checked={selected.includes(a._id)}
                  onChange={() => toggleAddon(a._id)}
                />
                {a.name} — £{a.price.toFixed(2)}
              </label>
            ))}
          </Addons>

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
