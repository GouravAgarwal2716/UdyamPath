# 🚀 Udyam AI — Build Your Startup Journey

Udyam AI is a full-stack, AI-powered, gamified web platform that transforms any idea into a **personalized, interactive 7-level startup journey**.

It acts as your **AI co-founder, mentor, and simulator**, helping aspiring entrepreneurs validate, learn, and grow — regardless of language or background.

---

## 🌟 What Makes It Special

- 🧠 **Dynamic AI Generation** — Every level, challenge, and suggestion is uniquely generated based on your idea
- 🎮 **Gamified Learning** — Learn entrepreneurship through interactive simulations and games
- 🤖 **AI Co-Founder (Agentic AI)** — Tracks your progress and guides you
- 🌐 **Multilingual Support** — Powered by Sarvam AI (English, Telugu, Hindi, Tamil)
- 📊 **Real-Time Scoring** — Impact, Trust, Feasibility, Scalability
- 🎯 **India-Focused Insights** — Built for real-world startup challenges

---

## 🎮 How It Works

1. 💡 **Enter your startup idea** (or upload a document)
2. 📊 **Get an AI-generated validation dashboard**
3. 🚀 **Start a 7-level simulation journey**
4. 🎲 **Play interactive games** (MCQs, decisions, matching)
5. 📈 **Watch your scores evolve** based on decisions
6. 🛣️ **View your final startup roadmap**

---

## 🧠 Agentic AI System

Udyam AI uses a multi-agent system:

- **Validator Agent** → Evaluates your idea
- **Simulation Agent** → Generates level scenarios
- **Planner Agent** → Suggests next actions
- **Coach Agent** → Motivates & guides
- **Research Agent** → Fetches insights

All agents work together to simulate a **real startup journey**.

---

## 📁 Project Structure

```
.
├── src/
│ ├── components/ # UI components (Navbar, Chatbot, Game UI)
│ ├── context/ # Global state (IdeaContext)
│ ├── pages/ # Views (Input, Dashboard, Levels, Roadmap)
│ ├── services/ # API integrations (AI, Translation, YouTube)
│ ├── App.jsx # Routing
│ ├── main.jsx # Entry point
│ └── index.css # Styles
├── public/ # Static assets
├── .env # Environment variables
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠️ Tech Stack

| Layer              | Technology                 |
| ------------------ | -------------------------- |
| Frontend           | React + Vite + TailwindCSS |
| AI Engine          | OpenAI / Gemini            |
| Translation        | Sarvam AI                  |
| Videos             | YouTube Data API           |
| Backend (optional) | Node.js + Express          |
| Database           | Firebase Firestore         |
| Auth               | Firebase Auth              |

---

## 🔐 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_SARVAM_API_KEY=your_sarvam_api_key

# Firebase (optional)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 🚀 Installation

```bash
npm install
```

---

## ▶️ Run the App

```bash
npm run dev
```

App will run at:
[http://localhost:5173](http://localhost:5173)

---

## 🌐 Features Breakdown

### 📊 AI Dashboard

- Idea validation
- Strengths & weaknesses
- Multi-metric scoring

---

### 🎮 Simulation Levels

- 7 dynamic levels
- AI-generated scenarios
- Interactive games
- Decision-based outcomes

---

### 📈 Score System

- Impact Score
- Trust Score
- Feasibility Score
- Scalability Score

---

### 🎥 Smart Sidebar

- Context-aware YouTube videos
- Learning resources per level

---

### 🤖 AI Chatbot (Multilingual)

- Context-aware responses
- Uses Sarvam AI for translation
- Supports multiple Indian languages
- Provides guidance, motivation, and action steps

---

### 📂 File Upload

- Upload idea via PDF/DOCX/TXT
- Auto text extraction

---

### 🛣️ Journey Roadmap

- Visual scroll-based journey
- Shows growth and decisions
- Final startup evolution

---

## ⚡ Future Enhancements

- 🎤 Voice-based AI interaction
- 🧑🤝🧑 Multiplayer simulation
- 🧪 “What-if” scenario testing
- 🏅 XP, badges & achievements
- 📊 Advanced analytics dashboard

---

## 🏆 Hackathon Pitch Line

> "Udyam AI is not just a tool — it’s a personalized startup journey powered by AI that acts like your co-founder, guiding you from idea to execution."

---

## 💬 Final Note

This project is built to democratize entrepreneurship by giving every aspiring founder:

- Guidance
- Simulation
- Support
- Confidence
