# Portable Floor Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a responsive Portable Floors calculator that selects and draws the minimum-piece layout for any rectangular room.

**Architecture:** Keep the panel algorithm in a pure TypeScript module and let a small client component render its result. Draw panels as positioned semantic HTML elements inside an aspect-ratio-preserving room canvas. Use static GitHub Pages output for public hosting.

**Tech Stack:** TypeScript, React 19, Vinext/Vite, Node test runner, React Testing Library, Playwright, GitHub Actions, GitHub Pages

---

## File map

- `app/lib/floor-calculator.ts`: validation, orientation comparison, and panel-placement domain logic.
- `app/lib/floor-calculator.test.ts`: unit coverage for calculations and placements.
- `app/components/floor-calculator.tsx`: live inputs and result presentation.
- `app/components/floor-plan.tsx`: scaled panel and unused-strip visualisation.
- `app/page.tsx`: page composition and page metadata.
- `app/globals.css`: brand, layout, responsive, print, and accessibility styles.
- `tests/rendered-html.test.mjs`: production-render integration test.
- `tests/floor-calculator.e2e.ts`: browser-level live calculation test.
- `.github/workflows/pages.yml`: validated GitHub Pages deployment.

### Task 1: Calculation engine

- [ ] Write unit tests asserting `calculateFloor(3000, 4000)` returns a 3000 × 3600 footprint, Orientation B, 15 primary panels, no fillers, and 15 placements.
- [ ] Run the unit test and confirm it fails because `calculateFloor` does not exist.
- [ ] Implement `calculateFloor`, `calculateOrientation`, validation, stable tie-breaking, and explicit placements in `app/lib/floor-calculator.ts`.
- [ ] Add tests for rounding, Orientation A wins, ties, a filler strip, and invalid inputs; run each new test red before implementing its behaviour.
- [ ] Run the complete unit suite and confirm zero failures and warnings.

### Task 2: Live calculator and plan drawing

- [ ] Write a component test that enters 3000 × 4000 and expects the accessible result text “15 total panels”.
- [ ] Run it and confirm it fails because the calculator component does not exist.
- [ ] Implement the client calculator with controlled numeric inputs and a polite result live region.
- [ ] Implement `FloorPlan` from returned placements, using percentage positions and sizes so the room preserves its aspect ratio.
- [ ] Add component assertions for panel counts, chosen orientation, invalid input guidance, and the number of rendered panel elements; run the suite cleanly.

### Task 3: Portable Floors page styling

- [ ] Replace the starter page with the approved header, calculator, results, legend, comparison, and concise explanatory copy.
- [ ] Replace starter styles with the slate-blue and timber visual system, visible focus, responsive stacking, reduced-motion behaviour, and print rules.
- [ ] Remove `_sites-preview`, `react-loading-skeleton`, starter metadata, and unused starter assets.
- [ ] Update `app/layout.tsx`, the favicon, README, and package metadata with evergreen Portable Floor Calculator naming.

### Task 4: Integration and end-to-end coverage

- [ ] Replace the starter integration test with assertions for a successful render, page title, input labels, initial result, and absence of preview metadata.
- [ ] Run the integration test against a production build and confirm it fails before finishing the page shell.
- [ ] Add an end-to-end test that changes room dimensions and asserts the visible layout summary and exact number of rendered panel pieces.
- [ ] Run the e2e test against the production site and capture expected validation errors inside assertions.

### Task 5: Validation and publication

- [ ] Run unit, integration, and e2e tests, then lint and production build; require pristine output from each.
- [ ] Create `.github/workflows/pages.yml` to build, test, and publish the static production artifact.
- [ ] Create the public `realmindsai/portable-floor-calculator` repository, push the validated source, enable Pages through GitHub Actions, and wait for the deployment to succeed.
- [ ] Fetch the live URL with `curl` and assert the page title and calculator copy before reporting publication.
