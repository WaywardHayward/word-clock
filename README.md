# Word Clock

A word-clock built with Next.js, TypeScript, and CSS Modules. Instead of showing digits, it lights up words on a letter grid to tell the time in natural English — "IT IS ABOUT QUARTER PAST THREE".

## Features

- **Word grid** — 11x13 letter panel with hidden words that light up to spell the current time
- **ABOUT / NEARLY** — approximates in-between minutes ("it is about half past", "it is nearly quarter to")
- **Second dots** — 60 dots arranged around the grid perimeter, filling up each minute like a progress ring
- **CSS Modules** — scoped styles with no class-name collisions
- **Custom hook** — `useWordTime` encapsulates all time/word/cell logic, keeping the component pure rendering

## Project structure

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── clock/          # Digital clock component
│   └── word-clock/     # Word clock component
│       ├── grid.ts     # Letter grid data
│       ├── WordClock.tsx
│       └── WordClock.module.css
└── hooks/
    └── useWordTime.ts  # Time → active cells logic
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the clock.

In VS Code, press **F5** to launch the dev server and open the browser automatically.

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via the included workflow.

**Live:** [https://waywardhayward.github.io/word-clock](https://waywardhayward.github.io/word-clock)

To enable, go to **Settings → Pages** in the repo and set the source to **GitHub Actions**.
