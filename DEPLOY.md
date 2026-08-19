# Deploy Periano Grill (permanent public link)

The repo is split into `client/` (React, static) and `server/` (Express API).
For production you need three free services:

1. **MongoDB Atlas** — cloud database
2. **Render** — hosts the Express API
3. **Netlify** — hosts the React front end (the URL you share)

---

## 1. MongoDB Atlas (free)
- Sign up at https://cloud.mongodb.com → create a **free** cluster.
- Under *Security → Database Access*, create a user (remember user/password).
- Under *Network Access*, add `0.0.0.0/0` (allow everywhere).
- Click *Connect → Drivers*, copy the connection string.
  It looks like:
  `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
  Append your DB name: `...mongodb.net/periano-grill`.

## 2. Render (API) — free
- Go to https://render.com → *New → Web Service* → connect this GitHub repo.
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Path:** `/api/health`
- Add environment variables (see `server/.env.example`):
  - `NODE_ENV` = `production`
  - `MONGO_URI` = the Atlas string from step 1
  - `JWT_SECRET` = a long random string
  - `CLIENT_ORIGIN` = your Netlify URL (from step 3), e.g. `https://periano-grill.netlify.app`
- Deploy. Note the API URL, e.g. `https://periano-grill-api.onrender.com`.

## 3. Netlify (front end) — free
- Go to https://app.netlify.com → *Add new site → Import from Git* → connect this repo.
- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment variable:** `VITE_API_URL` = your Render API URL from step 2
  (e.g. `https://periano-grill-api.onrender.com`).
- Deploy. Your permanent link is the Netlify site URL
  (e.g. `https://periano-grill.netlify.app`). You can add a custom domain later.

---

## How it fits together
- Browser loads the Netlify site → React app.
- The app calls `VITE_API_URL` (the Render API) for `/api/*` requests.
- The API connects to MongoDB Atlas.
- CORS is locked to `CLIENT_ORIGIN` (your Netlify URL).

## Run locally (already set up)
- MongoDB running locally, then `npm run dev` (server) + `npm run dev` (client, port 5173).
- The client uses the Vite proxy (`/api` → `localhost:5000`) when `VITE_API_URL` is unset.
