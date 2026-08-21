import styled from "styled-components";
import { useEffect, useState, useMemo } from "react";
import api from "../api/client.js";
import ProductCard from "../components/ProductCard.jsx";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 34px; }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 18px 0 24px;
`;

const Search = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 30px;
  font-size: 15px;
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.red}; }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 30px;
  font-size: 15px;
  outline: none;
  background: #fff;
`;

const Chip = styled.button`
  border: 2px solid ${({ theme }) => theme.line};
  background: #fff;
  color: ${({ theme }) => theme.charcoal};
  padding: 9px 16px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  &.active {
    background: ${({ theme }) => theme.orange};
    color: #fff;
    border-color: ${({ theme }) => theme.orange};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
`;

const Loading = styled.p`
  color: ${({ theme }) => theme.muted};
`;

const Skeleton = styled.div`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 14px;
  padding: 18px;
  .ph {
    background: linear-gradient(90deg, #eee, #f6f6f6, #eee);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .img { height: 160px; margin-bottom: 12px; }
  .ln { height: 14px; margin-bottom: 8px; }
  .s { width: 60%; }
  .price { height: 20px; width: 40%; margin-top: 6px; }
`;

const CatNav = styled.div`
  position: sticky;
  top: 64px;
  z-index: 999;
  background: #fff;
  border-bottom: 1px solid ${({ theme }) => theme.line};
  margin: 16px 0 18px;
  padding: 12px 0;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const CatBtn = styled.button`
  border: 2px solid ${({ theme }) => theme.line};
  background: #fff;
  color: ${({ theme }) => theme.charcoal};
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  transition: transform 0.12s;
  &:hover { transform: translateY(-1px); }
  &.active {
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    border-color: ${({ theme }) => theme.red};
  }
`;

const DIETARY = ["halal", "vegetarian", "vegan", "gluten-free"];

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "pizzas", label: "Pizzas" },
  { value: "burgers", label: "Burgers" },
  { value: "wraps", label: "Wraps" },
  { value: "grill-specialties", label: "Grill" },
  { value: "sides", label: "Sides" },
  { value: "kids-meals", label: "Kids" },
  { value: "dips", label: "Dips" },
  { value: "desserts", label: "Desserts" },
  { value: "drinks", label: "Drinks" }
];

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState([]);
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setLoading(true);
    api
      .get("/products")
      .then((r) => setProducts(r.data.filter((p) => p.category !== "addon")))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleDiet = (d) =>
    setDiet((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const visible = useMemo(() => {
    let list = products;
    if (cat !== "all") {
      list = list.filter((p) => p.category === cat);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (diet.length) {
      list = list.filter((p) => diet.every((d) => (p.dietary || []).includes(d)));
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, cat, query, diet, sort]);

  return (
    <Wrap>
      <h1>Our Menu</h1>
      <p style={{ color: "#6b6b6b" }}>
        Flame-grilled, fresh and full of flavour. Add your favourites to the cart and order for
        delivery or collection.
      </p>

      <CatNav aria-label="Menu categories">
        {CATEGORIES.map((c) => (
          <CatBtn
            key={c.value}
            className={cat === c.value ? "active" : ""}
            onClick={() => setCat(c.value)}
          >
            {c.label}
          </CatBtn>
        ))}
      </CatNav>

      <Toolbar>
        <Search
          type="search"
          placeholder="Search the menu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the menu"
        />
        <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort menu">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </Select>
      </Toolbar>

      <Toolbar>
        {DIETARY.map((d) => (
          <Chip key={d} className={diet.includes(d) ? "active" : ""} onClick={() => toggleDiet(d)}>
            {d}
          </Chip>
        ))}
      </Toolbar>

      {loading ? (
        <Grid>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i}>
              <div className="ph img" />
              <div className="ph ln" />
              <div className="ph ln s" />
              <div className="ph price" />
            </Skeleton>
          ))}
        </Grid>
      ) : (
        <Grid>
          {visible.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {visible.length === 0 && <Loading>No items match your filters.</Loading>}
        </Grid>
      )}
    </Wrap>
  );
}
