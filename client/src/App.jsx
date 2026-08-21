import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Layout from "./components/Layout.jsx";
import ChatAssistant from "./components/ChatAssistant.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Menu = lazy(() => import("./pages/Menu.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const OurFood = lazy(() => import("./pages/OurFood.jsx"));
const OurStores = lazy(() => import("./pages/OurStores.jsx"));
const OurApp = lazy(() => import("./pages/OurApp.jsx"));
const Franchising = lazy(() => import("./pages/Franchising.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const TITLES = {
  "/": "Periano Grill — Flame-grilled Piri Piri Chicken",
  "/menu": "Menu — Periano Grill",
  "/stores": "Our Store — Periano Grill",
  "/our-food": "Our Food — Periano Grill",
  "/our-app": "Our App — Periano Grill",
  "/franchising": "Franchising — Periano Grill",
  "/cart": "Your Cart — Periano Grill",
  "/checkout": "Checkout — Periano Grill"
};

function TitleManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] || "Periano Grill";
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Layout>
      <TitleManager />
      <Suspense fallback={<div style={{ padding: "60px 20px", textAlign: "center", color: "#6b6b6b" }}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<ProductDetail />} />
          <Route path="/our-food" element={<OurFood />} />
          <Route path="/stores" element={<OurStores />} />
          <Route path="/our-app" element={<OurApp />} />
          <Route path="/franchising" element={<Franchising />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ChatAssistant />
    </Layout>
  );
}
