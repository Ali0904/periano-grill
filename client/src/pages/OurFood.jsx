import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 36px; }
  p { max-width: 760px; color: ${({ theme }) => theme.muted}; font-size: 17px; }
`;

const Section = styled.section`
  background: ${({ theme }) => theme.cream};
  border-radius: 16px;
  padding: 28px;
  margin: 24px 0;
`;

export default function OurFood() {
  return (
    <Wrap>
      <h1>Our Food</h1>
      <p>
        Periano Grill is the home of flame-grilled Piri Piri chicken. The flavours on Periano Grill menu are unlike
        any other, with each dish specially marinated to match the unique Periano Grill brand taste.
      </p>

      <Section>
        <h2>Flame-Grilled, Never Fried-First</h2>
        <p>
          All of our chicken is Halal, and every order is prepared using fresh ingredients and
          grilled to order. From the legendary half chicken to tender strips, wings and quesadillas
          — there's a heat level for everyone.
        </p>
      </Section>

      <Section>
        <h2>Nutrition &amp; Allergens</h2>
        <p>
          We take allergens seriously. Full nutrition and allergen information is available in store
          and with every order. Vegetarian and kids options are always on the menu.
        </p>
      </Section>

      <div style={{ marginTop: 20 }}>
        <Link
          to="/menu"
          style={{
            background: "#FFC400",
            color: "#1c1c1c",
            padding: "14px 30px",
            borderRadius: 30,
            fontWeight: 800,
            display: "inline-block"
          }}
        >
          Explore the Menu
        </Link>
      </div>
    </Wrap>
  );
}
