# Repository Mirror

**See your code through a recruiter's eyes.**

Repository Mirror is an AI-powered GitHub repository evaluation platform that helps students and early-career developers understand how their projects measure up to real hiring expectations for specific roles.

![Repository Mirror](https://img.shields.io/badge/AI--Powered-Portfolio%20Review-amber)

---

## Features

- **Role-Calibrated Evaluation** - Scored against the exact signals hiring managers look for (Frontend, Backend, Full-Stack, Data/ML, Open Source)
- **Honest Feedback** - Clear strengths, non-negotiable gaps. No sugar-coating.
- **Strict Recruiter Scoring** - Based on real hiring criteria with hard caps for missing tests, README, etc.
- **Personalized Roadmap** - Prioritized steps to go from "interesting" to interview-worthy.

---

## How It Works

1. **Paste your GitHub repository URL** - Enter any public GitHub repository
2. **Select your target role** - Choose the role you are applying for
3. **Get AI-powered analysis** - Receive a detailed evaluation with:
   - Overall score (0-100)
   - Readiness tier (Not Ready → Role-Ready)
   - Strengths and gaps
   - Actionable improvement roadmap

---

## Scoring Rubric

| Category | Max Points |
|----------|------------|
| Code Quality & Readability | 25 |
| Project Structure & Organization | 15 |
| Documentation Quality | 15 |
| Testing & Maintainability | 15 |
| Real-World Applicability | 15 |
| Git & Commit Hygiene | 15 |

### Hard Caps (Automatic Score Limits)

- No README → Max score: 45
- No tests → Max score: 75
- One-day commit history → Max score: 65
- Tutorial clone → Max score: 70

---

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Lovable Cloud (Edge Functions)
- **AI**: Lovable AI (Google Gemini)

---

## Local Development Setup

### Prerequisites

- Node.js 18+ installed
- npm or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd repository-mirror
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## Deployment

This project is built with Lovable and can be deployed directly through the Lovable platform:

1. Click the **Publish** button in the Lovable editor
2. Your app will be deployed to a `.lovable.app` subdomain
3. Optionally connect a custom domain in Project Settings

---

## Project Structure

```
repository-mirror/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Header.tsx       # App header
│   │   ├── UrlInput.tsx     # GitHub URL input
│   │   ├── RoleSelector.tsx # Role selection
│   │   ├── ScoreDisplay.tsx # Circular score display
│   │   ├── EvaluationSummary.tsx
│   │   ├── Roadmap.tsx      # Improvement roadmap
│   │   └── AnalysisResults.tsx
│   ├── lib/
│   │   └── api/
│   │       └── analyze.ts   # API client for analysis
│   ├── pages/
│   │   └── Index.tsx        # Main page
│   └── index.css            # Global styles & design tokens
├── supabase/
│   └── functions/
│       └── analyze-repo/    # Edge function for AI analysis
└── README.md
```

---

## Usage

1. Enter a **public** GitHub repository URL
2. Select the role you want to be evaluated for:
   - Frontend Developer
   - Backend Developer
   - Full-Stack Developer
   - Data / ML Engineer
   - Open Source / Generalist
3. Click **Start Analysis**
4. Review your score, summary, and improvement roadmap

### Supported Repository Types

- ✅ Public GitHub repositories
- ❌ Private repositories (not accessible via public API)
- ❌ GitLab, Bitbucket, or other platforms

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - feel free to use this project for your own learning and development.

---

## Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- AI powered by Lovable AI

---

**Repository Mirror does not judge effort — it evaluates signal.**
