# GymAI

GymAI is an AI-powered workout planning app. Users sign in, complete a fitness
profile, and generate a personalized training plan based on their goal,
experience level, available equipment, schedule, and session length.

## Features

- React + Vite frontend with Tailwind CSS styling
- Neon Auth integration for user authentication
- Guided onboarding for training goals and preferences
- Express API for saving profiles and generating plans
- Prisma + PostgreSQL persistence for profiles and training plans
- OpenRouter-backed AI plan generation

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React icons
- Neon Auth UI

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma 7
- PostgreSQL
- OpenAI SDK configured for OpenRouter

## Project Structure

```text
gymAI/
├── public/              # Static assets
├── src/                 # React frontend
│   ├── componets/       # Shared UI and layout components
│   ├── context/         # Auth context
│   ├── lib/             # Frontend API/auth helpers
│   ├── pages/           # App pages
│   └── types/           # Shared frontend types
├── server/              # Express backend
│   ├── prisma/          # Prisma schema and migrations
│   ├── src/
│   │   ├── lib/         # Prisma and AI helpers
│   │   └── routes/      # API routes
│   └── types/           # Backend/shared API types
└── README.md
```

Note: the component folder is currently named `componets` in the codebase.

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL database connection string
- Neon Auth project URL
- OpenRouter API key

## Environment Variables

Create a `.env` file in the project root for frontend values:

```env
VITE_API_URL=http://localhost:3001
VITE_NEON_AUTH_URL=your_neon_auth_url
```

Create a `.env` file in `server/` for backend values:

```env
DATABASE_URL=postgresql://user:password@host:port/database
OPEN_ROUTER_KEY=your_openrouter_api_key
BASE_URL=http://localhost:3001
PORT=3001
```

## Installation

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

## Database Setup

From the `server/` directory, run Prisma migrations:

```bash
npx prisma migrate dev
```

If the Prisma client needs to be regenerated:

```bash
npx prisma generate
```

## Running Locally

Start the backend API from `server/`:

```bash
npm run dev:server
```

Start the frontend from the project root:

```bash
npm run dev
```

The frontend runs on the Vite dev server, usually `http://localhost:5173`.
The backend defaults to `http://localhost:3001`.

## Available Scripts

Frontend scripts:

```bash
npm run dev       # Start the Vite dev server
npm run build     # Type-check and build the frontend
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

Backend scripts:

```bash
npm run dev:server  # Start the Express API with tsx watch
```

## API Overview

- `POST /api/profile` saves or updates a user's fitness profile
- `POST /api/plan/generate` creates a new AI-generated training plan
- `GET /api/plan/current?userId=<id>` returns the latest saved plan

## Development Notes

- Authenticated users are redirected from the home page to their profile.
- The plan generator requires a completed user profile before it can create a
  workout plan.
- AI responses are requested as JSON and stored in the `training_plans` table.
- The frontend falls back to `http://localhost:3001` when `VITE_API_URL` is not
  set.
