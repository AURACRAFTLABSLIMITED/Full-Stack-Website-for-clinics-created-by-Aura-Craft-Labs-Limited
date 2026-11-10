# Aura Medical & Aesthetic Clinic – Full Stack (Separated)

This project has been cleanly separated into **Frontend** (React + Vite) and **Backend** (Express + MongoDB).

They run on **different ports** and talk to each other via **Axios + CORS**.

```
aura-fullstack/
├── frontend/          # React + Vite (port 5173)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── .env           # VITE_API_BASE_URL=http://localhost:5000
│
└── backend/           # Express + Mongoose (port 5000)
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── server.js
    ├── package.json
    └── .env           # PORT=5000, MONGODB_URI, CLIENT_URL
```

---

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm or yarn
- MongoDB (local) **or** a free MongoDB Atlas cluster (already configured in `.env`)

---

## 1. Start the Backend (port 5000)

```bash
cd backend
npm install
npm run dev
```

You should see:

```
[MongoDB] Connected successfully to host: ...
[Aura Clinic Backend] Server running in development mode on port 5000
```

API endpoints:

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | `/api/health`         | Health check                   |
| POST   | `/api/appointments`   | Submit consultation request    |
| GET    | `/api/appointments`   | List appointments (staff view) |

---

## 2. Start the Frontend (port 5173)

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Vite will start at: **http://localhost:5173**

The frontend reads the backend URL from `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

---

## How the connection works

1. **Frontend** (`AppointmentForm.jsx`) uses **Axios**:

```js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
await axios.post(`${API_BASE}/api/appointments`, formData);
```

2. **Backend** enables CORS for the Vite origin:

```js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    // ...
  ],
  credentials: true
}));
```

---

## Changing ports

- **Backend port**: edit `backend/.env` → `PORT=5000`
- **Frontend API URL**: edit `frontend/.env` → `VITE_API_BASE_URL=http://localhost:XXXX`
- After changing env files, restart the corresponding server.

---

## Production notes

- Never commit real MongoDB credentials. Use environment variables / secrets.
- In production, set `CLIENT_URL` to your real frontend domain.
- Build frontend: `cd frontend && npm run build` → serve the `dist/` folder.
- Run backend with `NODE_ENV=production node server.js` (or use PM2 / Docker).

---

## Original AI Studio version

The original Google AI Studio export mixed Vite + Express in a single `server.ts`.  
That combined file has been removed in favor of this clean separation.
