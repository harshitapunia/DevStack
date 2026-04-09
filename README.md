

# DevStakes

**A visual, node-based skill roadmap builder for developers.**
Build your personal learning path, track progress across skills, and define prerequisites — all in a beautiful, interactive canvas.

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-optional-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## What is DevStakes?

DevStakes lets you design your own developer roadmap as a visual graph. Each node represents a skill or milestone. Connect nodes to define learning prerequisites — when you complete a prerequisite, its dependents automatically unlock. Track your progress, add resources, and save multiple roadmaps to your personal library.

Built as a submission for **GDG RAGATHON 2026**, it works fully offline (no account required) and optionally syncs to Supabase for cloud persistence.

---

## Features

- **Interactive canvas** — pan, zoom, drag nodes, connect them with edges
- **Node-based skill tracking** — mark skills as Pending, In Progress, or Done
- **Prerequisite system** — nodes lock/unlock automatically based on dependency completion
- **8 skill categories** — Frontend, Backend, AI/ML, DevOps, Database, Design, Mobile, Security (auto-detected from title)
- **5 ways to link nodes** — drag handles, hover button, right-click menu, Link toolbar button, or sidebar
- **Roadmap library** — save, name, and manage multiple roadmaps
- **Preset templates** — curated starter roadmaps to modify
- **Import / Export** — load/save roadmaps as `.json` files
- **Undo / Redo** — full history for node and edge changes
- **Offline-first** — works 100% without a Supabase account (localStorage)
- **Auth system** — optional Supabase email/password auth for cloud sync
- **Keyboard shortcuts** — `N` new node, `E` edit mode, `Del` delete, `Ctrl+Z/Y` undo/redo

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS 4 + inline styles |
| Canvas | React Flow 11 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| State | Zustand 5 |
| Routing | React Router 7 |
| Backend (optional) | Supabase (Auth + Postgres + RLS) |
| Persistence (offline) | `localStorage` |

---

## Project Structure

```
DevStack/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx                      # Root routing + save/import logic
│   ├── main.jsx                     # React entry point
│   ├── index.css                    # Global styles + ReactFlow overrides
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthPage.jsx         # Sign in / Sign up page
│   │   ├── canvas/
│   │   │   ├── CanvasToolbar.jsx    # Top toolbar (mode, undo, save, etc.)
│   │   │   ├── FlowCanvas.jsx       # Main ReactFlow canvas + interactions
│   │   │   ├── ProgressDashboard.jsx# Progress bar widget
│   │   │   └── SaveModal.jsx        # SaveModal + ImportModal components
│   │   ├── landing/
│   │   │   └── LandingPage.jsx      # Home / marketing page
│   │   ├── library/
│   │   │   └── RoadmapLibrary.jsx   # Roadmap grid + templates + import
│   │   ├── nodes/
│   │   │   └── SkillNode.jsx        # Custom ReactFlow node component
│   │   └── sidebar/
│   │       ├── AddSkillModal.jsx    # Create new skill node modal
│   │       └── NodeSidebar.jsx      # Edit selected node panel
│   ├── data/
│   │   └── presets.js              # Preset roadmap templates
│   ├── lib/
│   │   └── supabase.js             # Supabase client + API helpers
│   ├── store/
│   │   ├── useStore.js             # Main graph state (Zustand)
│   │   └── useAuthStore.js         # Auth state (Zustand)
│   └── styles/
│       └── theme.js                # Design tokens
├── supabase-schema.sql             # Database schema (run in Supabase SQL editor)
├── .env.example                    # Environment variable template
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher (comes with Node)

### 1. Clone the repository

```bash
git clone https://github.com/harshitapunia/DevStack.git
cd DevStack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

> **Skip this step if you want offline/demo mode.** The app works fully without Supabase — your roadmaps are saved to browser localStorage instead.

If you want cloud sync, open `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from your [Supabase dashboard](https://app.supabase.com) → Project Settings → API.

### 4. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (or the next free port).

---

## Setting up Supabase (Optional)

Only needed if you want multi-device sync and user accounts. Skip entirely for offline/demo mode.

**Step 1** — Create a free project at [supabase.com](https://supabase.com)

**Step 2** — Open the SQL Editor in your Supabase dashboard

**Step 3** — Paste and run the contents of `supabase-schema.sql`

This creates the `roadmaps` table with:
- Row Level Security (each user can only read/write their own data)
- Auto-updating `updated_at` timestamp
- Support for public roadmap sharing (`is_public` flag)

**Step 4** — Copy your Project URL and anon key into the `.env` file (see above)

**Step 5** — Enable Email auth in Supabase: Authentication → Providers → Email

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## How to Use

### Creating Your First Roadmap

1. Open the app and click **Get Started** → you land on the Library
2. Click **New Roadmap** to open the canvas editor
3. Press **N** (or click **+ Add Skill**) to create your first node
4. Type a skill name (e.g. "HTML Basics") and pick a category
5. Click **Quick Create** to place it on the canvas instantly

### Connecting Nodes (Prerequisites)

There are 5 ways to link two nodes:

| Method | How |
|---|---|
| **Drag handle** | Switch to **Edit** mode → drag the blue dot (top/bottom/left/right of a node) to another node |
| **Hover ⊕ button** | Hover over a node → a small `+` floats below → click to add a child |
| **Right-click menu** | Right-click any node → **Add Child Node** |
| **Toolbar Link button** | Select a node → click the amber **Link** button → click the target node |
| **Sidebar button** | Click a node → open sidebar → click **Add Child Skill** |

### Tracking Progress

Click any node to open the **details sidebar** on the right. Use the status buttons to mark a skill:

- ⬜ **Pending** — not started yet
- ⚡ **In Progress** — actively learning
- ✅ **Done** — skill completed!

Completing a skill automatically **unlocks** its dependent nodes.

### Saving Your Roadmap

Click the green **Save** button in the top-right toolbar. A modal will appear — give your roadmap a title and optional description, then click **Save Roadmap**.

Saved roadmaps appear in your Library and persist across sessions.

### Importing & Exporting

- **Export** → Click the download icon in the toolbar to save a `.json` file
- **Import** → In the Library, click **Import** → drag your `.json` file or click to browse

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `N` | Add new skill node |
| `E` | Toggle Edit mode |
| `Del` | Delete selected node (Edit mode) |
| `Esc` | Deselect / cancel current action |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + S` | Save roadmap |
| `?` | Show/hide shortcuts panel |

---

## Offline Mode

DevStakes is fully offline-first. Without a `.env` file (or invalid Supabase credentials):

- No account is required — skip the auth page entirely
- All roadmaps are saved to **browser localStorage**
- Import/Export JSON works as your backup method
- Every feature of the editor works identically

This makes it ideal for demos and hackathon presentations.

---

## Contributing

Pull requests and issues are welcome. Please open an issue first to discuss larger changes.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for **GDG RAGATHON 2026**

</div>
