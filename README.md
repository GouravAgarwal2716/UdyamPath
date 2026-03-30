# UdyamPath 🚀
### Your Multilingual AI Co-founder for Social Entrepreneurship in Bharat

**UdyamPath** is a production-quality, multilingual AI-powered learning platform built natively for the Google Developer Group Hackathon. It acts as an AI co-founder that combines the experiential learning of Monopoly, the structured guidance of top incubators, and the emotional support of a personal mentor — in 4 Indian languages (English, Hindi, Telugu, Tamil).

---

## 🌟 Key Features

1. **Gamified Trial-and-Error Simulations**: Step into the role of a CEO. Take interactive challenges dynamically tailored to your unique startup idea. Make mistakes, lose simulated budget/trust, and learn from immediate real-world consequences without the actual risk.
2. **Dynamic Idea Validation**: Powered by Gemini 1.5 Flash, generating a holistic 6-point feasibility and uniqueness report in under 5 seconds.
3. **Multilingual Text-to-Speech**: Utilizing Sarvam AI to natively synthesize scenario contexts into colloquial regional languages for maximum accessibility.
4. **Custom PDF Executive Summaries**: Built-in 1-click `jsPDF` reporting system that charts your failed attempts and highlights the ultimate real-world "Golden Formula" methodology mapped against actual successful Indian startups.
5. **Udyam Guru (AI Coach)**: An empathetic sidebar AI assistant seeded directly against the founder's biggest personal fears. 

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Leveraging specific Saffron/Navy custom tokens & Glassmorphism)
- **Visuals**: Recharts (Dynamic scoring rings), Lucide-React (Iconography)
- **AI Core**: Google Generative AI (Gemini 1.5 Flash), Sarvam AI (Regional Speech)
- **Live Data APIs**: GNews API, YouTube Data v3 API
- **Document Generation**: jsPDF

---

## ⚙️ Quick Start Guide

### 1. Requirements
Ensure you have Node.js (v18+) and npm installed on your machine.

### 2. Clone and Install
\`\`\`bash
git clone https://github.com/your-username/udyampath.git
cd udyampath
npm install
\`\`\`

### 3. Environment Setup
Create a `.env` file in the root directory and add the following securely. Do NOT commit this file to version control logic:
\`\`\`env
# Core AI Engine (crucial for Validation, Simulation, AI Coach)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Voice Synthesis (For Regional Scenarios)
VITE_SARVAM_API_KEY=your_sarvam_api_key_here

# Live Data Feeds
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
VITE_GNEWS_API_KEY=your_gnews_api_key_here
\`\`\`

### 4. Running Locally
Simply spin up the lightning-fast Vite dev server:
\`\`\`bash
npm run dev
\`\`\`
The interactive UI will be available at [http://localhost:5173/](http://localhost:5173/) !

### 5. Build for Production
\`\`\`bash
npm run build
\`\`\`
The bundled frontend assets will be output safely directly to the `/dist` directory.

---
*Built with ❤️ for the Google Developer Group Hackathon.*
