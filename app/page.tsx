import type { Metadata } from "next";

import { FloorCalculator } from "./components/floor-calculator";

export const metadata: Metadata = {
  title: "Portable Floor Calculator | Portable Floors",
  description: "Calculate the most efficient Nice & Easy portable dance floor layout for any rectangular room.",
};

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Portable Floors home">
          PORTABLE-FLOORS.CO.UK
        </a>
        <span className="tagline">For all dance, anywhere</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow eyebrow--light">Nice &amp; Easy portable floors</p>
            <h1>Plan the floor.<br /><em>Not the faff.</em></h1>
            <p className="hero-intro">
              Enter the room dimensions and get the biggest usable dance floor,
              the fewest panels, and a layout your crew can follow.
            </p>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <span className="hero-panel-number">01</span>
            <div className="hero-floor-sample">
              <i /><i /><i /><i /><i /><i />
            </div>
            <p>600 mm modular grid</p>
          </div>
        </section>

        <FloorCalculator />

        <section className="method-note">
          <p className="eyebrow">How it works</p>
          <h2>Maximum floor. Minimum handling.</h2>
          <p>
            Every room is rounded down to a complete 600 mm grid. We test the
            1200 × 600 mm panels in both directions, then choose the layout with
            the lowest total piece count. No mysterious AI. Just tidy maths.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <span>PORTABLE-FLOORS.CO.UK</span>
        <span>Nice &amp; Easy floor planner</span>
      </footer>
    </>
  );
}
