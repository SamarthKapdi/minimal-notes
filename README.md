# Minimal Notes App (MERN Assessment)

A minimal single-page Notes application built with Node.js, Express, and React (Vite). It allows users to create notes with required titles, view all notes, and delete notes, featuring clean asynchronous state handling (loading, error, and empty states).

---

## Deliverables & Submission Links

- **Live Frontend URL:** `[Insert deployed frontend URL after Vercel deployment]`
- **Live Backend API URL:** `[Insert deployed backend URL after Render deployment]`
- **Website Demo Video (1–2 mins):** `[Insert Loom / YouTube Unlisted link]`
- **Code Explanation Video (3–5 mins):** `[Insert Loom / YouTube Unlisted link]`
- **GitHub Repository:** `https://github.com/SamarthKapdi/minimal-notes`

---

## Tech Stack

- **Backend:** Node.js, Express, `cors`
- **Frontend:** React 18, Vite, Native `fetch` API, CSS3
- **Data Store:** In-memory storage with native `crypto.randomUUID()`

---

## Features

- **Create Note:** Add a note with a required title and optional content.
- **List Notes:** View all notes in reverse chronological order (newest first).
- **Delete Note:** Delete a note by its ID with instant UI update.
- **Validation:** Enforces non-empty, trimmed title inputs on both frontend and backend.
- **UI States:** Explicit loading spinner, empty state illustration, per-item deleting state, and dismissible network error banner.

---

## Implementation Approach & Architecture

1. **Architecture:** Clean client-server separation. The `/server` directory contains the Express REST API, and the `/client` directory contains the React SPA built with Vite.
2. **Why In-Memory Storage Was Chosen:** Per the assessment specification (*"In-memory store OR simple MongoDB"*), an in-memory array was selected. This eliminates external database network latency, connection timeouts, and cloud firewall/IP whitelist failure modes during deployment, ensuring rapid, reliable evaluation. The logic is cleanly isolated in the handler layer, making it straightforward to attach MongoDB/Mongoose later if persistence is needed.
3. **State Management:** Handled cleanly with React's built-in `useState` and `useEffect` in `App.jsx`, passing explicit callbacks to presentational components. No complex state libraries (Redux/Zustand) were needed for this scope.
4. **Resilience:** The API validates payloads and returns standard HTTP status codes (`200`, `201`, `400`, `404`, `500`). The UI prevents double submissions by disabling buttons during in-flight network requests.

---

## API Endpoints

**Base URL (Local):** `http://localhost:5000`

| Method | Endpoint | Description | Request Body | Success Status | Error Status |
|---|---|---|---|---|---|
| `GET` | `/` | Health check | None | `200 OK` | — |
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

### Prerequisites
- Node.js (v18.x or later)
- npm

### 1. Run Backend Server
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Run Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
The client will start on `http://localhost:5173`.

---

## Production Deployment Guide

### Backend (Render)
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment Variables:** None required (`PORT` is assigned automatically by Render).

### Frontend (Vercel)
- **Root Directory:** `client`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL`: `https://<your-deployed-backend-url>.onrender.com`
