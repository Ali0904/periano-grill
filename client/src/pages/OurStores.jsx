import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaClock, FaSearch } from "react-icons/fa";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 30px auto;
  padding: 0 20px;
  h1 { font-size: 36px; }
`;

const SearchBar = styled.form`
  display: flex;
  gap: 10px;
  margin: 18px 0;
  input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid ${({ theme }) => theme.line};
    border-radius: 30px;
    font-size: 15px;
    outline: none;
    &:focus { border-color: ${({ theme }) => theme.red}; }
  }
  button {
    background: ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.onPrimary};
    border: none;
    border-radius: 30px;
    padding: 0 20px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
  @media (max-width: 880px) { grid-template-columns: 1fr; }
`;

const List = styled.div`
  max-height: 520px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  border: 2px solid ${({ theme }) => theme.line};
  border-radius: 14px;
  padding: 16px;
  h3 { margin: 0 0 6px; font-size: 16px; }
  .row { display: flex; align-items: center; gap: 8px; color: ${({ theme }) => theme.muted}; margin: 4px 0; font-size: 14px; }
  .open { color: #1a8a3c; font-weight: 700; }
  .dist { color: ${({ theme }) => theme.redDark}; font-weight: 700; }
`;

const MapWrap = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.line};
  #map { height: 520px; width: 100%; }
`;

const STORES = [
  { name: "Periano Grill - Edinburgh - Gorgie Road", address: "536 Gorgie Road, Edinburgh, EH11 3AL", phone: "+44 131 622 0020", hours: "11:00 – 23:00", lat: 55.9368, lng: -3.2368 },
  { name: "Periano Grill - Edinburgh - Home Street", address: "66 Home Street, Edinburgh, EH3 9NB", phone: "+44 131 228 4591", hours: "11:00 – 02:00", lat: 55.9421, lng: -3.2037 },
  { name: "Periano Grill - Edinburgh - Lothian Road", address: "100-104 Lothian Road, Edinburgh, EH3 9BE", phone: "+44 131 229 0011", hours: "11:00 – 23:00", lat: 55.9475, lng: -3.2095 },
  { name: "Periano Grill - Edinburgh - Crewe Road", address: "242A Crewe Road North, Edinburgh, EH5 1", phone: "+44 131 552 0022", hours: "11:00 – 23:00", lat: 55.9710, lng: -3.2190 },
  { name: "Periano Grill - Edinburgh - Leith Walk", address: "38-39 Elm Row, Edinburgh, EH7 4", phone: "+44 131 555 0033", hours: "11:00 – 23:00", lat: 55.9575, lng: -3.1860 },
  { name: "Periano Grill - Edinburgh - Gilmerton", address: "13a Drum Street, Gilmerton, Edinburgh, EH17 8QQ", phone: "+44 131 664 0044", hours: "11:00 – 23:00", lat: 55.9050, lng: -3.1360 }
];

function haversine(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function OurStores() {
  const [query, setQuery] = useState("");
  const [stores, setStores] = useState(STORES);
  const [error, setError] = useState("");
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!window.L || mapRef.current) return;
    const map = window.L.map("map").setView([55.94, -3.2], 12);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    mapRef.current = map;

    const icon = window.L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });

    STORES.forEach((s) => {
      window.L.marker([s.lat, s.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${s.name}</strong><br>${s.address}`);
    });
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    setError("");
    if (!query.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postcode=${encodeURIComponent(
          query
        )}&format=json&limit=1`,
        { headers: { Accept: "application/json" } }
      );
      const data = await res.json();
      if (!data.length) {
        setError("No location found for that postcode.");
        return;
      }
      const user = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      const ranked = STORES.map((s) => ({ ...s, distance: haversine(user, s) })).sort(
        (a, b) => a.distance - b.distance
      );
      setStores(ranked);

      if (mapRef.current) {
        mapRef.current.setView([user.lat, user.lng], 13);
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([user.lat, user.lng]);
        } else {
          userMarkerRef.current = window.L.marker([user.lat, user.lng])
            .addTo(mapRef.current)
            .bindPopup("You are here")
            .openPopup();
        }
      }
    } catch {
      setError("Could not search that postcode. Try again.");
    }
  };

  return (
    <Wrap>
      <h1>Our Stores</h1>
      <p style={{ color: "#6b6b6b" }}>
        Over 250 stores across the UK. Enter a postcode to find your nearest Periano Grill.
      </p>

      <SearchBar onSubmit={onSearch}>
        <input
          type="search"
          placeholder="Enter a postcode (e.g. EH11)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search by postcode"
        />
        <button type="submit"><FaSearch /> Search</button>
      </SearchBar>
      {error && <p style={{ color: "#e2231a", fontWeight: 700 }}>{error}</p>}

      <Layout>
        <List>
          {stores.map((s) => (
            <Card key={s.name}>
              <h3>{s.name}</h3>
              <div className="row"><FaMapMarkerAlt /> {s.address}</div>
              <div className="row"><FaPhone /> <a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a></div>
              <div className="row"><FaClock /> {s.hours} · <span className="open">Open</span></div>
              {typeof s.distance === "number" && (
                <div className="row"><span className="dist">{s.distance.toFixed(1)} km away</span></div>
              )}
            </Card>
          ))}
        </List>
        <MapWrap><div id="map" /></MapWrap>
      </Layout>
    </Wrap>
  );
}
