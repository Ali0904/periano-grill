# Deploy Periano Grill — permanently, with NO credit card

The whole site now runs on two card-free services:
- **Netlify** → hosts the React front end AND the API (as a serverless function)
- **MongoDB Atlas** → free cloud database

No Render, no card, no recurring charges.

---

## 1. MongoDB Atlas (free, no card)
- Sign up at https://cloud.mongodb.com → create a **free (M0)** cluster.
- *Security → Database Access*: create a user (note the password).
- *Network Access*: add `0.0.0.0/0` (allow from anywhere).
- *Connect → Drivers*: copy the connection string and append your DB name:
  `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/periano-grill`

## 2. Netlify (front end + API, free, no card)
- Go to https://app.netlify.com → *Add new site → Import from Git* → connect **Ali0904/periano-grill**.
- Netlify reads `netlify.toml` automatically:
  - builds the client (`client/dist`)
  - serves the API from `server/netlify/functions/api.js`
  - redirects `/api/*` to that function
- **Environment variable** (Site settings → Environment variables):
  - `MONGO_URI` = your Atlas string from step 1
  - (optional) `JWT_SECRET` = a long random string
  - ⚠️ Do **NOT** set `VITE_API_URL` — the app calls `/api` on the same Netlify domain, so no CORS/card needed.
- Deploy. Your permanent link is the Netlify site URL
  (e.g. `https://periano-grill.netlify.app`).

That's it — one site, one database, zero cards.

---

## How it works
- Browser loads the Netlify site → React app.
- The app calls `/api/*` (same origin) → Netlify rewrites to the `api` function.
- The function runs your Express app (wrapped with `serverless-http`) and connects to Atlas.

## Run locally (unchanged)
- MongoDB running locally, then `node src/server.js` in `server/` (port 5000)
  and `npm run dev` in `client/` (port 5173, proxies `/api` → `localhost:5000`).

## Files of interest
- `server/src/app.js` — the Express app (no listen; used by both local server and the function).
- `server/src/server.js` — local entry point (connects DB + listens).
- `server/netlify/functions/api.js` — Netlify Function wrapping the app.
- `netlify.toml` — build + redirects config.
- `server/.env.example` — env vars for local/dev and the function.
