import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPlay, FaMotorcycle, FaStore, FaUtensils, FaUsers, FaStar, FaChild, FaLeaf, FaAward, FaTags, FaLemon, FaPepperHot, FaMapMarkerAlt } from "react-icons/fa";
import api from "../api/client.js";
import Newsletter from "../components/Newsletter.jsx";
import ProductCard from "../components/ProductCard.jsx";

const Hero = styled.section`
  position: relative;
  color: #fff;
  text-align: center;
  padding: 110px 20px 40px;
  background: linear-gradient(rgba(20,12,0,0.6), rgba(20,12,0,0.52)),
              url("/images/grill/mixed-grill.jpg") center/cover no-repeat;
  background-attachment: fixed;
  h1 { font-size: 52px; margin: 0 0 16px; font-weight: 800; text-shadow: 0 2px 14px rgba(0,0,0,0.55); }
  p { max-width: 680px; margin: 0 auto 26px; font-size: 19px; text-shadow: 0 1px 6px rgba(0,0,0,0.5); }
  @media (max-width: 768px) {
    padding: 78px 16px 32px;
    background-attachment: scroll;
    h1 { font-size: 34px; }
    p { font-size: 16px; }
  }
  @media (max-width: 420px) {
    h1 { font-size: 28px; }
  }
`;

const Offerings = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 18px;
  img {
    width: 78px;
    height: 78px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.85);
    box-shadow: 0 4px 14px rgba(0,0,0,0.35);
    transition: transform 0.15s;
    &:hover { transform: translateY(-4px) scale(1.05); }
  }
`;

const Cta = styled(Link)`
  display: inline-block;
  background: ${({ theme }) => theme.red};
  color: ${({ theme }) => theme.onPrimary};
  padding: 14px 30px;
  border-radius: 30px;
  font-weight: 800;
  font-size: 16px;
  &:hover { background: ${({ theme }) => theme.redDark}; }
`;

const Layout = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 28px;
  align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Main = styled.div`
  min-width: 0;
  section { margin-bottom: 44px; }
  h2 { font-size: 28px; text-align: center; margin-bottom: 18px; }
`;

const FlavourRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
`;

const FlavourItem = styled.div`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 14px;
  padding: 18px 22px;
  min-width: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: #fff;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: transform 0.15s;
  &:hover { transform: translateY(-3px); }
  .icons { font-size: 26px; display: flex; gap: 3px; }
  strong { font-size: 15px; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 18px;
`;

const DipsBanner = styled.div`
  background: linear-gradient(120deg, ${({ theme }) => theme.red}, ${({ theme }) => theme.orange});
  border-radius: 16px;
  padding: 24px;
  color: ${({ theme }) => theme.onPrimary};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  h3 { margin: 0 0 6px; font-size: 22px; }
  p { margin: 0; max-width: 420px; }
  a {
    background: ${({ theme }) => theme.charcoal};
    color: #fff;
    padding: 12px 22px;
    border-radius: 30px;
    font-weight: 800;
    white-space: nowrap;
  }
`;

/* Right-side info column (1/4 of the width) */
const Aside = styled.aside`
  position: sticky;
  top: 84px;
  @media (max-width: 1024px) { position: static; }
`;

const SideStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const SideCard = styled.section`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 16px;
  padding: 16px;
  background: #fff;
  h4 { margin: 0 0 4px; font-size: 16px; }
  .note { margin: 0 0 12px; font-size: 13px; color: ${({ theme }) => theme.muted}; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { padding: 7px 0; border-bottom: 1px solid ${({ theme }) => theme.line}; }
  a { color: ${({ theme }) => theme.redDark}; font-weight: 600; }
`;

const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  span {
    background: ${({ theme }) => theme.cream};
    border: 1px solid ${({ theme }) => theme.line};
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 700;
  }
`;

const ServiceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.line};
  font-size: 14px;
  svg { color: ${({ theme }) => theme.red}; }
`;

/* Bigger placeholder slots for the company's own 1:1 video & flyer */
const Slot = styled.div`
  border-radius: 12px;
  margin-bottom: 14px;
  background: repeating-linear-gradient(45deg, #f3f3f3, #f3f3f3 12px, #ececec 12px, #ececec 24px);
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.line};
  &.video { aspect-ratio: 16 / 10; }
  &.flyer { aspect-ratio: 3 / 4; }
  span.tag { font-weight: 800; font-size: 13px; color: ${({ theme }) => theme.charcoal}; }
  span.hint { font-size: 12px; }
`;

const Promo = styled.div`
  background: ${({ theme }) => theme.orange};
  color: #fff;
  text-align: center;
  padding: 10px 16px;
  font-weight: 700;
  font-size: 14px;
  a { color: #fff; text-decoration: underline; }
`;

const About = styled.div`
  text-align: center;
  h2 { font-size: 30px; margin-bottom: 12px; }
  p { max-width: 760px; margin: 0 auto; color: ${({ theme }) => theme.charcoal}; font-size: 16px; line-height: 1.65; }
`;

const Combos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 16px;
`;

const ComboCard = styled.div`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 14px;
  padding: 18px;
  text-align: center;
  background: #fff;
  display: flex;
  flex-direction: column;
  h3 { margin: 0 0 6px; color: ${({ theme }) => theme.redDark}; font-size: 18px; }
  p { font-size: 13px; color: ${({ theme }) => theme.muted}; margin: 0 0 10px; flex: 1; }
  .price { font-size: 22px; font-weight: 800; margin-bottom: 12px; color: ${({ theme }) => theme.charcoal}; }
  a {
    display: inline-block;
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    padding: 9px 18px;
    border-radius: 24px;
    font-weight: 800;
  }
`;

const Rewards = styled.div`
  border: 2px solid ${({ theme }) => theme.red};
  border-radius: 14px;
  padding: 20px;
  background: ${({ theme }) => theme.cream};
  text-align: center;
  h3 { margin: 0 0 6px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  p { font-size: 14px; color: ${({ theme }) => theme.charcoal}; margin: 0 auto 14px; max-width: 620px; }
  a {
    display: inline-block;
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    padding: 9px 18px;
    border-radius: 24px;
    font-weight: 800;
  }
`;

const Stamps = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 14px;
  span {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.orange};
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: ${({ theme }) => theme.orange};
  }
  span.filled { background: ${({ theme }) => theme.red}; border-color: ${({ theme }) => theme.red}; color: #fff; }
`;

const Allergen = styled.div`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 14px;
  padding: 20px;
  background: #fff;
  h3 { margin: 0 0 10px; display: flex; align-items: center; gap: 8px; }
  ul { margin: 0 0 10px; padding-left: 18px; color: ${({ theme }) => theme.charcoal}; font-size: 14px; line-height: 1.7; }
  a { color: ${({ theme }) => theme.redDark}; font-weight: 700; }
`;

const KidsBanner = styled.div`
  background: linear-gradient(120deg, ${({ theme }) => theme.red}, ${({ theme }) => theme.orange});
  color: ${({ theme }) => theme.onPrimary};
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  h3 { margin: 0 0 4px; font-size: 20px; display: flex; align-items: center; gap: 8px; }
  p { margin: 0; font-size: 14px; }
  a {
    background: ${({ theme }) => theme.charcoal};
    color: #fff;
    padding: 10px 18px;
    border-radius: 24px;
    font-weight: 800;
    white-space: nowrap;
  }
`;

const Location = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
  align-items: stretch;
  .info {
    background: #fff;
    border: 2px solid ${({ theme }) => theme.line};
    border-radius: 16px;
    padding: 22px;
    box-shadow: ${({ theme }) => theme.shadow};
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .info h3 { margin: 0 0 6px; display: flex; align-items: center; gap: 8px; font-size: 19px; }
  .info p { margin: 4px 0; color: ${({ theme }) => theme.muted}; }
  .info a { color: ${({ theme }) => theme.redDark}; font-weight: 800; margin-top: 8px; }
  iframe {
    width: 100%;
    height: 100%;
    min-height: 300px;
    border: 2px solid ${({ theme }) => theme.line};
    border-radius: 16px;
  }
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const spiceColors = ["#f4791f", "#f4791f", "#e8772e", "#e05a2b", "#e2231a", "#9b1b13"];
const CATEGORIES = ["pizzas", "burgers", "wraps", "grill-specialties", "sides", "kids-meals", "dips", "desserts", "drinks"];

const COMPANY_DESCRIPTION =
  "Periano Grill is the UK's home of flame-grilled Piri Piri chicken. We marinate our chicken in a signature blend of African Bird's Eye chillies and herbs, then grill it over an open flame for that unmistakable smoky heat. From gentle & lemony to our full inferno, every box is built to your taste — paired with golden fries, fresh dips and ice-cold drinks. Whether you order delivery, click & collect, or sit down with family, Periano Grill brings bold flavour, halal-certified chicken and friendly service to your neighbourhood.";

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [dips, setDips] = useState([]);

  useEffect(() => {
    api.get("/products").then((r) => {
      const all = r.data.filter((p) => p.category !== "addon");
      setPopular(all.slice(0, 4));
      setDips(all.filter((p) => p.category === "dips").slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <>
      <Promo>
        🔥 Limited-time Summer Deal — get a <strong>free Piri Piri Dip</strong> with every 2+ person
        combo. Ends 31 Aug. <Link to="/menu">Order now</Link>
      </Promo>

      <Hero>
        <h1>We love chicken.</h1>
        <p>
          Fresh grilled piri piri chicken, prepared to eat in or take home. Infused with the taste
          and flavours specially created for Periano Grill.
        </p>
        <Cta to="/menu">Order Now</Cta>
        <Offerings>
          <img src="/images/grill/quarter-chicken.jpg" alt="Grilled chicken" />
          <img src="/images/pizzas/margherita-pizza.jpg" alt="Pizza" />
          <img src="/images/burgers/classic-burger.jpg" alt="Burger" />
          <img src="/images/wraps/classico-wrapster.jpg" alt="Wrap" />
        </Offerings>
      </Hero>

      <Layout>
        <Main>
          <section>
            <About>
              <h2>About Periano Grill</h2>
              <p>{COMPANY_DESCRIPTION}</p>
            </About>
          </section>

          <section>
            <h2>Find Your Heat</h2>
            <FlavourRow>
              {[
                { label: "Lemon & Herb", lemon: true, color: "#7CB342" },
                { label: "Mild", count: 1, color: "#F9A825" },
                { label: "Medium", count: 2, color: "#FB8C00" },
                { label: "Hot", count: 3, color: "#E64A19" },
                { label: "Extra Hot", count: 4, color: "#C62828" },
              ].map((f) => (
                <FlavourItem key={f.label}>
                  <div className="icons" style={{ color: f.color }}>
                    {f.lemon
                      ? <FaLemon />
                      : Array.from({ length: f.count }).map((_, i) => <FaPepperHot key={i} />)}
                  </div>
                  <strong>{f.label}</strong>
                </FlavourItem>
              ))}
            </FlavourRow>
            <p style={{ textAlign: "center", color: "#6b6b6b", marginTop: 14, maxWidth: 560, margin: "14px auto 0" }}>
              From zesty lemon &amp; herb to our full Periano Grill inferno — pick the heat that hits you.
            </p>
          </section>

          <section>
            <h2>What's Popular</h2>
            <Grid>
              {popular.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </Grid>
          </section>

          <section>
            <h2>Dips That Hit</h2>
            <Grid>
              {dips.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </Grid>
            <DipsBanner style={{ marginTop: 18 }}>
              <div>
                <h3>Make your own flavour</h3>
                <p>
                  Mix, match and build the heat that hits you. Combine any dip with your meal and
                  craft your signature Periano Grill box.
                </p>
              </div>
              <Link to="/menu">Build yours <FaArrowRight /></Link> {/* placeholder */}
            </DipsBanner>
          </section>

          <section>
            <h2><FaTags /> Periano Combos</h2>
            <Combos>
              <ComboCard>
                <h3>1-Person Combo</h3>
                <p>Any grilled meal + regular fries + drink + dip.</p>
                <div className="price">£9.99</div>
                <Link to="/menu">Order combo</Link>
              </ComboCard>
              <ComboCard>
                <h3>2-Person Combo</h3>
                <p>2 grilled meals + large fries + 2 drinks + 2 dips. Free dip this week!</p>
                <div className="price">£19.99</div>
                <Link to="/menu">Order combo</Link>
              </ComboCard>
              <ComboCard>
                <h3>Family 4-Person</h3>
                <p>Family platter + 4 sides + 4 drinks + 4 dips.</p>
                <div className="price">£36.99</div>
                <Link to="/menu">Order combo</Link>
              </ComboCard>
            </Combos>
          </section>

          <section>
            <Rewards>
              <h3><FaAward /> Collect stamps, eat free.</h3>
              <p>
                Earn 1 stamp for every order over £10. Collect 10 stamps and redeem a free item of
                your choice. Members also get birthday perks and early access to new drops.
              </p>
              <Stamps>
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className={i < 3 ? "filled" : ""}>{i < 3 ? "✓" : i + 1}</span>
                ))}
              </Stamps>
              <Link to="/our-app">Join Periano Rewards</Link>
            </Rewards>
          </section>

          <section>
            <h2><FaLeaf /> Allergens &amp; Nutrition</h2>
            <Allergen>
              <h3>Good to know</h3>
              <ul>
                <li>All chicken is <strong>halal</strong> certified.</li>
                <li><strong>Gluten-free</strong> and <strong>vegan</strong> options available across the menu.</li>
                <li>Full allergen &amp; nutritional info is listed on every product page.</li>
              </ul>
              <Link to="/menu">Browse the full menu →</Link>
            </Allergen>
          </section>

          <section>
            <KidsBanner>
              <div>
                <h3><FaChild /> Kids Eat Free every Tuesday</h3>
                <p>One free kids meal with every adult main (dine-in). Plus our £6.99 Kids Meal deal any day.</p>
              </div>
              <Link to="/menu">See kids menu</Link>
            </KidsBanner>
          </section>

          <section>
            <h2><FaMapMarkerAlt /> Find Us</h2>
            <Location>
              <div className="info">
                <h3><FaStore /> Periano Grill — Corstorphine</h3>
                <p><strong>Address:</strong> 141A St John's Rd, Corstorphine, Edinburgh EH12 7SD</p>
                <p><strong>Opening hours:</strong> Open daily 11:00 – 23:00</p>
                <p><strong>Delivery:</strong> Right across Edinburgh until late</p>
                <a href="https://maps.google.com/?q=141A+St+John's+Rd+Corstorphine+Edinburgh+EH12+7SD" target="_blank" rel="noopener noreferrer">
                  Open in Google Maps →
                </a>
              </div>
              <iframe
                title="Periano Grill location map"
                loading="lazy"
                src="https://maps.google.com/maps?q=141A+St+John's+Rd+Corstorphine+Edinburgh+EH12+7SD&output=embed"
                allowFullScreen
              ></iframe>
            </Location>
          </section>
        </Main>

        <Aside aria-label="Quick info">
          <SideStack>
            <SideCard>
              <h4>Payment Options</h4>
              <p className="note">All major cards &amp; wallets accepted, in store and online.</p>
              <Pills>
                <span>Visa</span>
                <span>Mastercard</span>
                <span>Apple Pay</span>
                <span>Google Pay</span>
                <span>PayPal</span>
                <span>Cash</span>
              </Pills>
            </SideCard>

            <SideCard>
              <h4>Categories</h4>
              <p className="note">Browse the full Periano Grill menu by category.</p>
              <ul>
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <Link to="/menu">{c.charAt(0).toUpperCase() + c.slice(1)}</Link>
                  </li>
                ))}
              </ul>
            </SideCard>

            <SideCard>
              <h4>Services</h4>
              <p className="note">Flexible ways to enjoy your meal.</p>
              <ServiceRow><FaMotorcycle /> Delivery to your door</ServiceRow>
              <ServiceRow><FaStore /> Collection / takeaway</ServiceRow>
              <ServiceRow><FaUtensils /> Dine-in</ServiceRow>
              <ServiceRow><FaUsers /> Catering for events</ServiceRow>
            </SideCard>

            <SideCard>
              <h4>1:1 Video</h4>
              <p className="note">Drop in the company's own video here.</p>
              <Slot className="video">
                <div className="play"><FaPlay /></div>
                <span className="tag">1:1 Video</span>
                <span className="hint">Your video goes here</span>
              </Slot>
              <a href="#book" style={{ display: "inline-block", marginTop: 4, color: "var(--redDark, #C99700)", fontWeight: 700 }}>
                Book a 1:1 call
              </a>
            </SideCard>

            <SideCard>
              <h4>Flyer</h4>
              <p className="note">Drop in the company's own flyer image here.</p>
              <Slot className="flyer">
                <span className="tag">Flyer</span>
                <span className="hint">Your flyer image goes here</span>
              </Slot>
            </SideCard>
          </SideStack>
        </Aside>
      </Layout>

      <Newsletter />
    </>
  );
}
