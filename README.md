# Portable Floor Calculator

A live layout calculator for Portable Floors' Nice & Easy modular dance floor.
Enter a rectangular room size to see the largest usable 600 mm grid, the
lowest-piece panel orientation, and every 1200 × 600 mm and 600 × 600 mm piece.

## Run locally

Requires Node.js 22.13 or later.

```bash
npm ci
npm run dev
```

## Verify

```bash
npm test
npm run lint
```

The test suite includes unit, integration, and end-to-end coverage. The GitHub
Pages workflow runs the full suite before publishing.
