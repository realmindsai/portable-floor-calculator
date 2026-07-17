# Portable Floor Calculator Design

## Purpose

Build a public, single-page calculator for Portable Floors. A venue planner enters a rectangular room's length and width in millimetres. The page immediately selects the layout that covers the largest usable 600 mm grid with the fewest physical panels, then draws every panel in the selected layout.

## Audience and tone

The primary audience is Portable Floors staff and prospective event-floor customers. The page should feel related to the existing Portable Floors website: slate-blue framing, restrained typography, generous space, and a warm timber floor. The interface should be plain enough to use while speaking with a customer.

## Calculation

The calculation accepts positive room dimensions in millimetres.

1. Round each room dimension down to the nearest 600 mm.
2. Calculate Orientation A with each 1200 mm edge aligned to usable length.
3. Calculate Orientation B with each 1200 mm edge aligned to usable width.
4. Select the orientation with fewer total pieces. Select Orientation A for a tie so results remain stable.
5. Report the usable footprint, usable area, unused strips, primary-panel count, filler-panel count, total count, and both orientation totals.

A valid result requires both usable dimensions to be at least 600 mm. Empty, non-numeric, negative, or smaller inputs produce clear guidance and no misleading layout.

## Interface

The page has four visible regions:

- A compact Portable Floors header with the existing brand name and “For all dance, anywhere” line.
- A room-size control card with labelled numeric inputs for length and width. The example starts at 3000 × 4000 mm.
- A result summary showing the chosen orientation, usable size, area, and counts for 1200 × 600 and 600 × 600 panels.
- A scaled top-down room plan. Warm wood rectangles represent primary panels; darker square tiles represent fillers. Dimension labels, a legend, and hatched unused strips explain the geometry.

The calculation runs after every input event. The drawing must remain legible on mobile and desktop, scale to its container, and preserve the room's aspect ratio within sensible display limits.

An expandable comparison shows both orientations and states why the selected layout uses fewer pieces. It explains ties without pretending one orientation is inherently better.

## Architecture

`app/lib/floor-calculator.ts` is a pure TypeScript domain module. It validates inputs, calculates both orientations, selects the winner, and returns explicit panel placements on the 600 mm grid. It has no React or browser dependencies.

`app/components/floor-calculator.tsx` owns input state and renders the result. `app/components/floor-plan.tsx` renders the returned placements with semantic HTML and CSS. `app/page.tsx` supplies the page shell and metadata.

No backend, database, analytics, account, or saved-project feature is required.

## Accessibility and errors

Inputs have visible labels, units, hints, and native numeric controls. Results use a polite live region. Colour is never the only distinction between panel types: labels, proportions, and patterns reinforce it. Focus indicators remain visible, and motion respects reduced-motion settings.

## Verification

- Unit tests cover the supplied 3000 × 4000 mm example, ties, both winning directions, rounding, panel placements, and invalid dimensions.
- Integration tests render the page server-side and confirm its essential content and accessible structure.
- End-to-end tests start the production server, enter room dimensions through the real page, and assert live results and the displayed panel count.
- Lint and production build must complete with no warnings.

## Publication

Create a public `realmindsai/portable-floor-calculator` repository. Publish the validated production site through GitHub Pages and return both repository and live-site URLs.
