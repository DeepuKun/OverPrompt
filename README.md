# OverPrompt

**OverPrompt** is a sleek, intelligent AI pricing and stack auditor. It helps developers, startup founders, and engineering teams review their active AI subscriptions, identify redundant/overlapping tools, analyze team seat allocations, and generate customized cost-efficiency recommendations to save on AI billing.

---

## 🚀 Features

- **Pricing Data Source-of-Truth**: Up-to-date monthly subscriptions and seat-metered pricing tier tracking for Cursor, GitHub Copilot, Windsurf, Claude, ChatGPT, Gemini, and direct developer APIs.
- **Smart Redundancy Analysis**: Automatically detects overlapping subscriptions (e.g., holding both Cursor and Copilot, or Claude Pro and ChatGPT Plus concurrently).
- **Seat & Intensity Adjustments**: Customize pricing evaluations based on the number of active user seats, usage intensity (light, moderate, heavy), and overage frequency.
- **Interactive Stack Optimization Wizard**: Walk through step-by-step inputs to generate custom, actionable recommendations (e.g., switching to direct token-metered APIs, consolidating licenses, or utilizing free tier limits).
- **Modern Premium Design**: Beautiful, responsive user interface styled with Tailwind CSS, custom loaders, and visual card layouts.

-----

## 🛠️ Technology Stack

- **Core**: React 19, Vite
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite`)
- **Routing**: React Router v7
- **Animations**: `react-type-animation` for custom loader stages

---

## 💻 Local Development Setup

To run this project locally, ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd "OverPrompt Main"
   ```

2. **Navigate into the client directory**:
   ```bash
   cd client
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser to the local URL (usually `http://localhost:5173`).

---

## 📦 Production & Deployment

### Build the Static Bundle
To build the application for production:
```bash
cd client
npm run build
```
This outputs compiled, optimized assets to the `client/dist` directory.

### Deploying to Vercel
The repository includes a [client/vercel.json](client/vercel.json) configuration that handles client-side routing rewrites for React Router (preventing 404 page-refresh issues).

#### Setup Steps:
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** $\rightarrow$ **Project**.
3. Import this repository.
4. **Important**: Under **Project Settings**, change the **Root Directory** to **`client`**.
5. Keep other build defaults (Vercel will auto-detect Vite inside `client`).
6. Click **Deploy**.
