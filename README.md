# DeepMatch

A dating app that matches people on deep dimensions — personality, values, intellect, spirituality, interests, location, finances.

**Anti-superficial. Real connections.**

---

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS v3
- **Routing:** React Router v6
- **Backend:** Express.js (Node)

## Get started

```bash
cd deep-match

# Install deps
npm install

# Run frontend only (default port 3000)
npm run dev

# Run backend only (port 4000)
npm run server

# Run both together
npm run dev:full
```

## Pages

| Route | Page |
|-------|------|
| `/` | Home — hero, stats, sample matches, question preview, how it works |
| `/matches` | Matches — full match grid with dimension filters |
| `/profile` | Profile setup — 2-step form (basics + values) |
| `/questions` | Question flow — 7 deep questions |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/matches` | Get sample matches |
| POST | `/api/profile` | Create profile |
| POST | `/api/answers` | Submit question answers |

## Design system

- **Background:** `#0d0d1a`
- **Surface:** `#14142a`
- **Text:** `#e8e0d5`
- **Subtle:** `#9b95a3`
- **Gold accent:** `#c9a96e`
- **Font:** Georgia, serif
