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

const DIETARY = ["halal", "vegetarian", "vegan", "gluten-free"];

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState([]);
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
  }, [products, query, diet, sort]);

  return (
    <Wrap>
      <h1>Our Menu</h1>
      <p style={{ color: "#6b6b6b" }}>
        Flame-grilled, fresh and full of flavour. Add your favourites to the cart and order for
        delivery or collection.
      </p>

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
        <Loading>Loading menu…</Loading>
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
