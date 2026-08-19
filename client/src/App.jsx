import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import OurFood from "./pages/OurFood.jsx";
import OurStores from "./pages/OurStores.jsx";
import OurApp from "./pages/OurApp.jsx";
import Franchising from "./pages/Franchising.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import NotFound from "./pages/NotFound.jsx";
import ChatAssistant from "./components/ChatAssistant.jsx";

export default function App() {
  return (
    <Layout>
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
      <ChatAssistant />
    </Layout>
  );
}
