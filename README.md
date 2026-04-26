# DeepMatch

> A dating app that matches people on what actually matters.

Most dating apps optimize for looks. DeepMatch is built on the premise that lasting connections come from alignment on deeper dimensions — personality, values, intellect, spirituality, communication style, attachment patterns, lifestyle, humor, ambition, intimacy, finances, and location.

No swiping. No noise. Just real matches.

---

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS v3
- **Routing:** React Router v6
- **Backend:** Node.js + Express

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/BarrenWuffet402/deep-match.git
cd deep-match
npm install
```

**Run frontend + backend together:**
```bash
npm run dev:full
```

- Frontend: http://localhost:3001 (or next available port)
- Backend API: http://localhost:4000

**Run separately:**
```bash
npm run dev      # frontend only
npm run server   # backend only
npm run build    # production build
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, stats, sample match cards, question preview, how it works |
| `/matches` | Match grid with 12-dimension filters |
| `/matches/:id` | Match detail — full profile, dimension chart, conversation starter |
| `/profile` | 2-step profile setup (basics + values) |
| `/questions` | Deep question flow with animated transitions |

---

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/matches` | Fetch sample matches |
| `POST` | `/api/profile` | Submit profile |
| `POST` | `/api/answers` | Submit question answers |

---

## Project structure

```
deep-match/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level page components
│   ├── context/        # React context (auth, etc.)
│   └── styles/         # Global CSS
├── server/
│   └── index.js        # Express backend
├── public/
└── index.html
```

---

## Design system

| Token | Value |
|---|---|
| Background | `#0d0d1a` |
| Surface | `#14142a` |
| Border | `#1e1e35` |
| Text | `#e8e0d5` |
| Subtle | `#9b95a3` |
| Gold accent | `#c9a96e` |
| Font | Georgia, serif |

---

## Contributing with OpenClaw

See [OPENCLAW.md](./OPENCLAW.md) for how to run an autonomous coding loop on this project using OpenClaw.

---

## Concept

This project was born from a simple observation: people — including those who are not conventionally attractive — often chase short-term relationships with attractive partners, ending up in superficial cycles. DeepMatch is an attempt to build something that rewards depth. The 12-dimension matching model is designed to surface compatibility that holds over time: not just "do we vibe?" but "do we actually fit each other's lives?"

---

## License

MIT
