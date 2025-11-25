
# A360 Intelligence 🧠 ✨

**A360 Intelligence** is a cutting-edge, AI-powered analytics dashboard designed specifically for dermatology and aesthetic clinics. It transforms raw consultation transcripts into actionable business intelligence, patient sentiment analysis, and practitioner coaching tools.

This application serves as the frontend interface for a sophisticated RAG (Retrieval-Augmented Generation) backend, visualizing data in real-time and providing interactive AI tools.

---

## 📑 Table of Contents

1.  [Overview](#-overview)
2.  [Key Features](#-key-features)
3.  [Technology Stack](#-technology-stack)
4.  [Project Architecture](#-project-architecture)
5.  [Folder Structure](#-folder-structure)
6.  [Deep Dive: Core Modules](#-deep-dive-core-modules)
    *   [Dashboard & Analytics](#dashboard--analytics)
    *   [Streaming AI Chat](#streaming-ai-chat)
    *   [Voice Consultation Simulator](#voice-consultation-simulator)
    *   [Podcasts & Audio](#podcasts--audio)
7.  [Authentication & Security](#-authentication--security)
8.  [Configuration & Setup](#-configuration--setup)

---

## 🔭 Overview

Aesthetics360 allows clinic administrators and practitioners to:
*   **Monitor KPIs:** Track consultation volume, conversion rates, and patient satisfaction in real-time.
*   **Analyze Sentiment:** Use NLP to understand patient concerns, objections, and educational gaps.
*   **Train Staff:** Use AI-simulated roleplay scenarios to improve sales and bedside manner.
*   **Forecast Trends:** Predict future treatment demand based on historical data.
*   **Query Data:** Chat with the entire database of transcripts to find specific information.

---

## 🚀 Key Features

### 📊 Analytics Suite
*   **Executive Dashboard:** High-level metrics (Satisfaction, Education Score, Top Procedures) with AI-generated narrative insights.
*   **Patient Concerns Analysis:** Interactive charts visualizing symptom breakdown by demographics.
*   **Treatment Trends:** Monthly performance tracking of procedures (Botox, Fillers, Lasers).
*   **Market Intelligence:** Competitor pricing analysis and social media trend tracking.
*   **Forecasting:** Predictive models for treatment demand and campaign simulation.

### 🤖 AI Tools
*   **A360 Chat (RAG):** A ChatGPT-like interface that answers questions based *only* on the clinic's private data. Supports citation sources and streaming responses.
*   **Consultation Simulator:** A voice-interactive mode where users practice consultations against an AI persona (e.g., "Anxious Amy", "Budgeting Ben").
*   **Prompt Library:** Manage system prompts that dictate AI behavior.
*   **Weekly Podcasts:** AI-generated audio summaries of weekly performance for on-the-go consumption.

### 📝 Data Explorer
*   **Transcripts Explorer:** A master-detail view to search, filter, and read full consultation logs.
*   **Opportunities Hub:** Automatically flagged moments in conversations (Missed Upsells, Poor Objection Handling) for review.
*   **Clinic Performance:** Comparative analysis between multiple clinic locations (Super Admin only).

---

## 💻 Technology Stack

*   **Framework:** [React 19](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:**
    *   Radix UI Primitives (via custom components)
    *   [Lucide React](https://lucide.dev/) (Icons)
    *   Shepherd.js (Guided Tours)
*   **Visualization:** [Recharts](https://recharts.org/)
*   **State Management:** React Context API (`AuthContext`, `PlayerContext`)
*   **Backend Integration:**
    *   REST API (FastAPI / Python)
    *   Supabase (Authentication)
    *   Google GenAI SDK (Gemini Models)
    *   ElevenLabs (Text-to-Speech)
*   **Markdown Rendering:** `react-markdown` & `remark-gfm`

---

## 🏗 Project Architecture

The application follows a **feature-based architecture** wrapped in global context providers.

### Data Flow
1.  **Authentication:** The `AuthProvider` initializes the Supabase session. All API requests are intercepted to inject the `Bearer` token.
2.  **Custom Hooks:** Data fetching is encapsulated in hooks (e.g., `useDashboardData`, `useTranscripts`). These hooks handle:
    *   Loading states
    *   Error handling
    *   Data transformation (converting raw API JSON into UI-ready formats).
3.  **Components:** Presentational components (Charts, Cards) receive data via props.
4.  **AI Interaction:**
    *   **Streaming:** The Chat interface uses `ReadableStream` to process Server-Sent Events (SSE) from the backend for real-time typing effects.
    *   **Audio:** The `PlayerContext` manages global audio state for podcasts, persisting playback across page navigation.

---

## 📂 Folder Structure

```text
/
├── components/          # Reusable UI components
│   ├── forecasting/     # Components specific to Forecasting page
│   ├── icons/           # Custom SVG icons
│   ├── journey/         # Patient Journey timeline components
│   ├── layout/          # Sidebar and layout shells
│   ├── market/          # Market Intelligence tables/charts
│   ├── opportunities/   # Opportunity cards and filters
│   ├── performance/     # Practitioner leaderboard and radar charts
│   ├── practice/        # Voice simulator and roleplay UI
│   ├── treatments/      # Treatment analysis specific charts
│   ├── ui/              # Base UI elements (Button, Card, Input, Badge)
│   └── ...              # Generic components (DateRangePicker, MetricCard)
├── contexts/            # Global State (Auth, Audio Player)
├── data/                # Static mock data for fallbacks/demos
├── hooks/               # API integration logic (useTranscripts, useKpis, etc.)
├── lib/                 # Utilities (Supabase client, ElevenLabs, class merger)
├── pages/               # Main route views (Dashboard, Chat, Settings)
├── App.tsx              # Main Router and Layout composition
├── config.ts            # Environment configuration
└── types.ts             # TypeScript interfaces for the entire app
```

---

## 🔍 Deep Dive: Core Modules

### Dashboard & Analytics
*   **File:** `pages/DashboardPage.tsx`
*   **Logic:** Aggregates data from multiple endpoints (`/summary`, `/concerns`, `/trends`).
*   **Narrative Pane:** When a user clicks a metric card, `NarrativePane.tsx` opens. It fetches a specific AI report (`/reports/{slug}`) and uses Regex/Markdown processing to format the raw text into structured headings, bullet points, and citations.
*   **Fallbacks:** The dashboard includes a robust `FALLBACK_ANALYSES` system. If the API fails, it seamlessly serves realistic mock data to ensure the demo never breaks.

### Streaming AI Chat
*   **File:** `pages/ChatPage.tsx`
*   **Technical Highlight:** Custom SSE (Server-Sent Events) Parser.
    *   The standard `EventSource` API is bypassed in favor of `fetch` with a custom `streamAsyncIterator`.
    *   This allows handling custom events (`event: metadata`, `event: message`) and passing the `Authorization` header (which standard EventSource cannot do easily).
    *   **Source Attribution:** The stream parses `metadata` events to extract `citation` sources, which are deduplicated and rendered as interactive badges at the bottom of the message bubble.

### Voice Consultation Simulator
*   **Files:** `pages/PracticePage.tsx` & `components/practice/voice/*`
*   **Workflow:**
    1.  **Scenario Selection:** User picks a difficulty level (e.g., "Price-Conscious Client").
    2.  **State Machine:** The UI transitions between `idle` -> `speaking` (AI audio) -> `listening` (User turn) -> `analyzing` (Feedback generation).
    3.  **Audio Generation:** Uses `lib/elevenlabs.ts` to generate dynamic speech from the AI persona's text.
    4.  **Feedback Loop:** After the user speaks, the system analyzes the transcript and provides real-time "Toasts" (Tips, Errors, Successes) without stopping the flow.

### Podcasts & Audio
*   **Context:** `contexts/PlayerContext.tsx`
*   **Features:**
    *   **Global Persistence:** The player floats at the bottom (`Player.tsx`) and continues playing even if you navigate to a different page.
    *   **Expanded View:** `ExpandedPlayer.tsx` offers an immersive "Spotify-like" experience with blurred backgrounds, large album art, and synchronized subtitles.
    *   **Sync Logic:** Subtitles are calculated based on character count and total audio duration to provide an estimated karaoke-style sync.

---

## 🔐 Authentication & Security

*   **Provider:** Supabase Auth.
*   **Implementation:** `AuthContext.tsx` manages the session state.
*   **Protection:**
    *   `App.tsx` conditionally renders the `LoginPage` if no session exists.
    *   **Role-Based Access Control (RBAC):** The `isSuperAdmin` flag (derived from email domain) controls access to specific views like "Clinic Performance" and the clinic dropdown selector.
*   **Token Handling:** The JWT access token is automatically appended to the `Authorization` header of every fetch request in the custom hooks.

---

## ⚙️ Configuration & Setup

### Prerequisites
1.  **Node.js** (v18 or higher)
2.  **Supabase Account** (for Auth)
3.  **Google Gemini API Key** (if running AI features locally)
4.  **ElevenLabs API Key** (for voice features)

### Environment Variables
The application relies on `config.ts` and system environment variables.

*   `SUPABASE_URL`: Your Supabase project URL.
*   `SUPABASE_ANON_KEY`: Your Supabase public API key.
*   `API_KEY`: Google GenAI API Key (injected via process.env in the build).

### Running Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```

---

## 🎨 Styling Guide

The app uses a custom Tailwind configuration defined in `index.html`:
*   **Font:** `Plus Jakarta Sans` for a modern, clinical, yet approachable feel.
*   **Colors:**
    *   `Primary`: HSL(212, 33%, 49%) - A trustworthy medical blue.
    *   `Secondary`: HSL(220, 27%, 94%) - Soft gray-blue for backgrounds.
    *   `Destructive`: Red for errors/alerts.
    *   `Success`: Green for positive KPIs.
*   **Components:** Extensive use of `backdrop-blur`, rounded corners (`rounded-xl`), and subtle shadows to create a "Glassmorphism" inspired interface.

---

*Documentation generated for Aesthetics360 Engineering Team.*
