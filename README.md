# Mis-Info 🛡️

Mis-Info is a modern, interactive web application designed to scan, analyze, and verify digital content (text, URLs, and screenshots) against trusted sources to detect potential misinformation. It features a full-stage verification pipeline, trust metrics, real-time analytics, and visual reports.

---

## 🚀 Quick Start

Get the project up and running locally in under 5 minutes.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) (installed automatically with Node.js)

### Installation Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Aarav-bit/Mis-Info.git
   cd Mis-Info
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## ✨ Features

* **Multi-Format Ingestion**: Verify claims submitted via plain text, web URLs, or visual screenshots.
* **5-Stage Verification Pipeline**: Visually tracks the verification lifecycle (Extracting Claim, Searching Sources, Evaluating Credibility, Generating Trust Score, Preparing Report).
* **Rule-Based Scorer**: Combines required/optional keyword weights, negation penalties, and keyword rarity bonuses to calibrate an accurate trust score.
* **Detailed Reports**: View detailed analysis, including support sources, credibility factors, structural reasoning, and visual trust gauge charts.
* **Personalized Dashboard & History**: Save/bookmark reports, search past analyses via a built-in command palette, and manage history.
* **Interactive Analytics**: Interactive charts powered by `Recharts` showing daily verification counts, verified-to-false ratios, and popular topics.
* **Dark Mode Support**: Sleek, theme-aware modern layout built on Radix UI primitives and custom CSS styling.

---

## 🛠️ Technology Stack

* **Frontend Framework**: [React 19](https://react.dev/) & [Vite 8](https://vite.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Routing**: [React Router 7](https://reactrouter.com/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Charts**: [Recharts](https://recharts.org/)
* **UI Components**: [Radix UI primitives](https://www.radix-ui.com/)

---

## 📂 Project Structure

```
misinfo/
├── public/                 # Static assets (favicons, system SVG maps)
├── src/
│   ├── assets/             # Brand images and illustration assets
│   ├── components/
│   │   ├── features/       # Feature-specific components (Pipeline, Score Rings)
│   │   ├── layout/         # Shell components (Sidebar, TopNav, AppLayout)
│   │   └── ui/             # Radix & primitive design system components (Button, Badge, etc.)
│   ├── contexts/           # Global states (ThemeContext, VerificationContext)
│   ├── data/               # Static/mock verification database
│   ├── hooks/              # Reusable custom hooks (e.g., useCommandPalette)
│   ├── lib/                # Core logic & utilities (Keyword scorer, formatting helpers)
│   ├── pages/              # Main route pages (Dashboard, Analytics, Reports, History)
│   ├── types/              # TypeScript interface definitions
│   ├── App.tsx             # Main App layout & routing config
│   ├── index.css           # Global Tailwind & design token configurations
│   └── main.tsx            # Application entry point
├── package.json
└── vite.config.ts
```

---

## ⚙️ Configuration

The project utilizes standard environment configurations. If API endpoints or backend integration are introduced in the future, specify them in a `.env` file in the root directory:

| Environment Variable | Description | Default |
|----------------------|-------------|---------|
| `PORT`               | Local port to serve the app | `5173` |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
