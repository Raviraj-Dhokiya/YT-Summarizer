# 🎬 YT Summarizer

An AI-powered YouTube video summarizer built with **React + Redux Toolkit** (frontend) and **Node.js + Express + MongoDB** (backend), using **Google Gemini AI** for intelligent summaries.

---

## 📁 Project Structure

```
youtubesummarizer/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── videoController.js     # Route handlers (business logic)
│   ├── middleware/
│   │   └── errorHandler.js        # Global error handling
│   ├── models/
│   │   └── Video.js               # Mongoose schema
│   ├── routes/
│   │   └── videoRoutes.js         # API route definitions
│   ├── services/
│   │   └── geminiService.js       # Gemini AI integration
│   ├── utils/
│   │   ├── extractVideoId.js      # YouTube URL parser
│   │   └── formatTime.js          # Seconds → MM:SS formatter
│   ├── .env                        # Environment variables (not in git)
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── History.jsx        # Sidebar history list
│   │   │   ├── History.module.css
│   │   │   ├── URLInput.jsx       # URL input form
│   │   │   ├── URLInput.module.css
│   │   │   ├── VideoResult.jsx    # Video summary display
│   │   │   └── VideoResult.module.css
│   │   ├── constants/
│   │   │   └── index.js           # App-wide constants
│   │   ├── hooks/
│   │   │   ├── useVideo.js        # Video + history state hook
│   │   │   └── useTheme.js        # Theme toggle hook
│   │   ├── store/
│   │   │   ├── index.js           # Redux store config
│   │   │   ├── videoSlice.js      # Video state + async thunks
│   │   │   ├── historySlice.js    # History state + async thunks
│   │   │   └── themeSlice.js      # Dark/light theme state
│   │   ├── utils/
│   │   │   └── helpers.js         # Date formatting, URL validation
│   │   ├── App.jsx                # Root component
│   │   ├── App.module.css
│   │   ├── api.js                 # Axios API calls
│   │   ├── index.css              # Global CSS + theme tokens
│   │   └── main.jsx               # React entry point + Redux Provider
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # Vite + API proxy config
│
├── .gitignore
├── package.json                   # Root: concurrently dev script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd youtubesummarizer
npm run install-all
```

### 2. Configure Environment

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Servers

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/summarize` | Summarize a YouTube video |
| `GET` | `/api/history` | Get last 20 summarized videos |
| `DELETE` | `/api/history/:videoId` | Delete a video from history |
| `GET` | `/health` | Server health check |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, Axios, Vite |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| AI | Google Gemini 2.5 Flash |
| Transcripts | youtube-transcript |
| Styling | Vanilla CSS (CSS Modules) |
