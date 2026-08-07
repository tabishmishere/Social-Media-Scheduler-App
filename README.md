# 🚀 Social Media Scheduler

A full-stack social media scheduling application that empowers users to connect their social accounts, plan posts, and manage content seamlessly, featuring AI-assisted post generation.

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
*   **Database:** MongoDB + Mongoose (hosted on MongoDB Atlas)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Media Storage:** Cloudinary
*   **File Handling:** Multer
*   **Task Scheduling:** `node-cron` (Note: configured for local/stateful environments)
*   **AI Integrations:** Google Gemini AI / Groq SDK for content generation

---

## ✨ Features

*   **Secure Authentication:** User sign-up and sign-in utilizing JWT.
*   **Social Connectivity:** OAuth integration to connect various social media accounts.
*   **Content Management:** Create, schedule, edit, and manage social media posts from a centralized dashboard.
*   **Automated Publishing:** Background scheduler automatically publishes posts at the user's defined time.
*   **AI-Powered Assistance:** Generate engaging post content and suggestions using integrated AI (Gemini/Groq).
*   **Activity Tracking:** Comprehensive activity log to monitor scheduled and published content.
*   **Media Support:** Seamless image and video uploads powered by Cloudinary.

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
    ├── routes/
    ├── services/
    └── server.ts
```

## ⚙️ Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Gemini / Groq API keys (for AI features)

### 1. Clone the repo
```bash
git clone [https://github.com/Tusharlalwani1/Social-media-Scheduler.git](https://github.com/Tusharlalwani1/Social-media-Scheduler.git)
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
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_GENAI_API_KEY=your_google_genai_key
GROQ_API_KEY=your_groq_api_key
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
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```
App will run at `http://localhost:5173`

## 🌐 Deployment

- **Backend**: Deployed on [Vercel](https://vercel.com)
- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)

## 📄 License

ISC
