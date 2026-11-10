<div align="center">

# 💸 SplitItUp

**An AI-powered expense and bill splitting web application built with React 19, TypeScript, and Tailwind CSS v4.**  
Split bills with friends — equally, by item, or by percentage — in seconds with automated AI bill parsing.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

Created with ❤️ by [Tejas Chaturvedi](https://github.com/chaturveditejas00)

</div>

---

## ✨ Features

- **3 Flexible Split Modes** — Equal split, item-based assignment, or custom percentage split
- **AI Bill Parsing** — Paste receipt text or upload a photo/camera snapshot and let Gemini AI extract item names and prices automatically
- **Group Management** — Save your squads (flatmates, trip friends, colleagues) and load them in one click
- **Expense History** — Track past settlements, toggle paid/pending status, and filter by group
- **Smart Settlement Algorithm** — Greedily minimizes the total number of transactions between participants
- **LocalStorage Persistence** — Your groups and settlement history stay saved in your browser
- **Confetti Celebration** — Rewarding animations on settling up 🎉
- **Sleek Dark Theme** — Responsive, modern dark UI crafted with glassmorphism and Tailwind CSS

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | Front-end UI and state management |
| Tailwind CSS v4 | Styling and animations |
| Vite 6 | Development and production bundling |
| Framer Motion | Smooth UI transitions and micro-interactions |
| Google Gemini AI | Server-side receipt and bill parsing |
| Canvas-Confetti | Settlement celebration animations |
| Lucide React | Modern minimalist icons |
| Vercel Serverless Functions | Production backend API |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A free [Google Gemini API key](https://aistudio.google.com/apikey)

### Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/chaturveditejas00/SplitItUp.git
cd SplitItUp
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**4. Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The AI bill parsing requires a `GEMINI_API_KEY`. If no key is set, you can still add bill items and people manually without any restrictions.

---

## ☁️ Deploy to Vercel

Deploying **SplitItUp** to Vercel takes less than a minute:

1. **Push your code to GitHub:**
   Ensure your code is pushed to your `chaturveditejas00/SplitItUp` repository.
2. **Go to [Vercel](https://vercel.com):**
   Click **Add New...** → **Project** and import `chaturveditejas00/SplitItUp`.
3. **Environment Variables:**
   Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
4. **Deploy:**
   Click **Deploy**. Vercel will automatically build the Vite frontend and deploy the serverless functions in `/api`.

---

## 📁 Project Structure

```
SplitItUp/
├── api/
│   └── parse-bill.ts        # Vercel serverless function (Gemini AI proxy)
├── src/
│   ├── App.tsx              # Main application component & steps
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styling & Tailwind v4 theme
│   ├── types.ts             # TypeScript definitions
│   ├── services/
│   │   └── aiService.ts     # Client for AI bill parsing
│   └── utils/
│       └── algorithm.ts     # Debt simplification settlement algorithm
├── server.ts                # Express development server (local preview)
├── vercel.json              # Vercel routing & configuration
├── vite.config.ts           # Vite configuration
└── package.json
```

---

## 🧮 Settlement Algorithm

SplitItUp calculates optimal settlements by minimizing transactions:
1. Calculates each participant's net balance: `paid - consumed`.
2. Categorizes people into debtors (negative balance) and creditors (positive balance).
3. Greedily pairs the largest debtor with the largest creditor.
4. Reduces individual balances iteratively until all accounts reach zero.

---

## 👤 Author

**Tejas Chaturvedi**
- GitHub: [@chaturveditejas00](https://github.com/chaturveditejas00)

---

<div align="center">
  <sub>Built with ❤️ by Tejas Chaturvedi. Give a ⭐ if you found this project useful!</sub>
</div>
