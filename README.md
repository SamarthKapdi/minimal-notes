# Minimal Notes App (MERN Assessment — Single Vercel Project)

A minimal single-page Notes application built with Node.js, Express, and React (Vite). Both the React frontend and Express API are deployed together as **one single Vercel deployment** under a single domain.

---

## Deliverables & Submission Links

- **Live Application URL (Frontend & API):** `[Insert deployed Vercel URL, e.g., https://minimal-notes-xxxx.vercel.app]`
- **Live API Endpoint:** `[Insert https://<your-vercel-domain>/notes]`
- **Website Demo Video (1–2 mins):** `[Insert Loom / YouTube Unlisted link]`
- **Code Explanation Video (3–5 mins):** `[Insert Loom / YouTube Unlisted link]`
- **GitHub Repository:** `https://github.com/SamarthKapdi/minimal-notes`

---

## Architecture & Unified Vercel Deployment

1. **Single Domain Architecture:**
   - Both the React frontend and Express REST API share the exact same domain on Vercel.
   - `https://<vercel-domain>/` serves the React SPA from Vite production assets (`client/dist`).
   - `https://<vercel-domain>/notes` routes directly to the Express serverless function (`/api/index.js`) via `vercel.json` rewrites.
   - Eliminates cross-origin requests, CORS complexity, and third-party backend hosting delays.

2. **In-Memory Store:**
   - Per the assessment specification (*"In-memory store OR simple MongoDB"*), an in-memory data store using Node.js's built-in `crypto.randomUUID()` is used.
   - Keeps data access fast, reliable, and free of database network connection failures or IP whitelist barriers.

3. **Same-Origin API Configuration:**
   - In production, the React frontend issues requests to `/notes` on the current domain (`API_BASE_URL = ''`).
   - In local development (`npm run dev`), the frontend automatically falls back to `http://localhost:5000`.

---

## Tech Stack

- **Frontend:** React 18, Vite, Native `fetch` API, CSS3
- **Backend:** Node.js, Express, `cors`, `crypto`
- **Deployment:** Vercel (Unified Static Assets + Vercel Serverless Function)

---

## Features

- **Create Note:** Add a note with a required title and optional content.
- **List Notes:** View notes ordered newest first.
- **Delete Note:** Delete a note by its ID with instant UI update.
- **Validation:** Enforces non-empty, trimmed title inputs on both frontend and backend.
- **UI States:** Loading spinner, clean empty state, per-item delete indicator, and dismissible network error banner with retry.

---

## API Endpoints

**Production Base:** `https://<your-vercel-domain>`  
**Local Base:** `http://localhost:5000`

| Method | Endpoint | Description | Request Body | Success Status | Error Status |
|---|---|---|---|---|---|
| `GET` | `/` | Health check (or frontend root) | None | `200 OK` | — |
| `GET` | `/notes` | Retrieve all notes (newest first) | None | `200 OK` | `500 Internal Server Error` |
| `POST` | `/notes` | Create a new note | `{ "title": "...", "content": "..." }` | `201 Created` | `400 Bad Request` |
| `DELETE` | `/notes/:id` | Delete a note by ID | None | `200 OK` | `404 Not Found` |

### Sample Payloads

**POST /notes (Request):**
```json
{
  "title": "Meeting Summary",
  "content": "Discuss deployment and documentation."
}
```

**POST /notes (Response — 201):**
```json
{
  "id": "c1f7a0de-4c12-4217-91f1-3ec7d7bfa511",
  "title": "Meeting Summary",
  "content": "Discuss deployment and documentation.",
  "createdAt": "2026-09-04T12:00:00.000Z"
}
```

**Validation Error (Response — 400):**
```json
{
  "error": "Title is required and cannot be empty."
}
```

---

## Local Setup & Development

### 1. Run Backend Server
In terminal 1:
```bash
cd server
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Run Frontend Client
In terminal 2:
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## Vercel Deployment Instructions (Single Project)

1. Push this repository to GitHub: `https://github.com/SamarthKapdi/minimal-notes`.
2. In [Vercel](https://vercel.com/), click **Add New** → **Project** and select `minimal-notes`.
3. Configure Project Settings:
   - **Framework Preset:** `Vite` (or `Other`)
   - **Root Directory:** `./` *(leave as default repository root)*
   - **Build Command:** `npm run build` *(runs root build script which compiles `client`)*
   - **Output Directory:** `client/dist` *(preconfigured in `vercel.json`)*
   - **Environment Variables:** None required! *(API and frontend share the same origin)*
4. Click **Deploy**.
5. Both your frontend UI and your Express REST API (`/notes`) will be live on your single Vercel URL!
