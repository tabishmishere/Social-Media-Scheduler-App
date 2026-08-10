# 🚀 Social Media Scheduler

A full-stack social media scheduling application that empowers users to connect their social accounts, plan posts, and manage content seamlessly using Supabase, Zernio, and Groq.

## 🔗 Live Demo

*   **Frontend (Live):** [https://social-media-schedular-kx5s-topaz.vercel.app](https://social-media-schedular-kx5s-topaz.vercel.app)
*   **Backend (API):** [https://social-media-schedular6.vercel.app](https://social-media-schedular6.vercel.app)

---

## 🛠 Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **HTTP Client:** Axios

### Backend
*   **Runtime:** Node.js + Express
*   **Language:** TypeScript (run via `tsx`)
*   **Database:** Supabase PostgreSQL
*   **Storage:** Supabase Storage
*   **Authentication:** JWT (JSON Web Tokens)
*   **Social Posting:** Zernio API
*   **AI Integrations:** Groq SDK for text/image prompt generation
*   **Task Scheduling:** Inngest cron and event functions served via `/api/inngest`

---

## ✨ Features

*   **Secure Authentication:** User sign-up and sign-in with JWT.
*   **Social Connectivity:** OAuth integration to connect social media accounts via Zernio.
*   **Content Management:** Create, schedule, and manage social media posts from a centralized dashboard.
*   **Automated Publishing:** Publish scheduled posts via Zernio and log activity.
*   **AI-Powered Assistance:** Generate post descriptions and image prompts using Groq.
*   **Media Support:** Upload images and videos to Supabase Storage with local fallback.
*   **Activity Tracking:** Store activity logs and display recent publishing history.

---

## 📁 Project Structure

```text
social-schedular/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
└── server/          # Express backend (TypeScript)
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    ├── services/
    ├── inngest/      # Optional Inngest function definitions
    └── server.ts
```

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- Supabase project with PostgreSQL and Storage bucket
- Zernio account / API key
- Groq API key

### 1. Clone the repo
```bash
git clone https://github.com/Tusharlalwani1/Social-media-Scheduler.git
cd Social-media-Scheduler
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=3000

SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
API_KEY=your_zernio_api_key
# or ZERNIO_API_KEY=your_zernio_api_key

# Inngest configuration
INNGEST_SERVE_PATH=/api/inngest
INNGEST_SERVE_ORIGIN=http://localhost:3000
# Optional if your Inngest deployment requires signing
# INNGEST_SIGNING_KEY=your_inngest_signing_key
``` 

Run the backend:
```bash
npm start
```
Server will run at `http://localhost:3000`

### 3. Frontend setup
```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

Run the frontend:
```bash
npm run dev
```
App will run at `http://localhost:5173`

## 🧩 Important Notes

* `server/inngest/inngestFunctions.ts` defines the Inngest cron and event functions. The Express app now serves them at `/api/inngest`.
* The backend currently relies on Zernio for social account linking and publishing. Keep Zernio credentials in `.env`.
* Groq is used for AI post content + prompt generation. Pollinations is a fallback image generator used by the AI generation route.
* The previous MongoDB and Cloudinary references have been removed from the current backend implementation.

## 🌐 Deployment

- **Backend**: Backend is configured for Vercel via `server/vercel.json`.
- **Frontend**: Frontend can be deployed on Vercel.
- **Database**: Use Supabase PostgreSQL and Supabase Storage.

## 🔧 What I need from you

1. Add the required environment variables to `server/.env`:
   * `SUPABASE_URL`
   * `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY`
   * `JWT_SECRET`
   * `GROQ_API_KEY`
   * `API_KEY` or `ZERNIO_API_KEY`
   * `INNGEST_SERVE_PATH` (optional, default `/api/inngest`)
   * `INNGEST_SERVE_ORIGIN` (optional, default `http://localhost:3000`)
   * `INNGEST_SIGNING_KEY` (optional, if using Inngest request signing)

2. Ensure your Supabase schema is applied and your `media` bucket exists.

## 📄 License

ISC
