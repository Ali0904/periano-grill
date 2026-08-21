import styled from "styled-components";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 36px; margin-bottom: 6px; }
  p.lead { color: ${({ theme }) => theme.muted}; margin: 0 0 22px; }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 20px;
  align-items: stretch;
  @media (max-width: 880px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: #fff;
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 16px;
  padding: 22px;
  box-shadow: ${({ theme }) => theme.shadow};
  h3 { margin: 0 0 10px; display: flex; align-items: center; gap: 8px; font-size: 19px; }
  .row { display: flex; align-items: center; gap: 8px; color: ${({ theme }) => theme.muted}; margin: 8px 0; font-size: 15px; }
  a { color: ${({ theme }) => theme.redDark}; font-weight: 700; }
`;

const MapWrap = styled.div`
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.line};
  iframe { width: 100%; height: 100%; min-height: 340px; border: 0; display: block; }
`;

const ADDRESS = "141A St John's Rd, Corstorphine, Edinburgh EH12 7SD";
const MAP_URL = "https://maps.google.com/maps?q=" + encodeURIComponent(ADDRESS) + "&output=embed";

export default function OurStores() {
  return (
    <Wrap>
      <h1>Our Store</h1>
      <p className="lead">One location, all the flavour. Visit us or get it delivered.</p>
      <Layout>
        <Card>
          <h3><FaMapMarkerAlt /> Periano Grill — Corstorphine</h3>
          <div className="row"><FaMapMarkerAlt /> {ADDRESS}</div>
          <div className="row"><FaClock /> Open daily 11:00 – 23:00</div>
          <div className="row">
            <a href={"https://maps.google.com/?q=" + encodeURIComponent(ADDRESS)} target="_blank" rel="noopener noreferrer">
              Get directions →
            </a>
          </div>
        </Card>
        <MapWrap>
          <iframe title="Periano Grill location map" loading="lazy" src={MAP_URL} allowFullScreen></iframe>
        </MapWrap>
      </Layout>
    </Wrap>
  );
}
