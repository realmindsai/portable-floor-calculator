"use client";

import { useMemo, useState } from "react";

import { calculateFloor } from "../lib/floor-calculator";
import { FloorPlan } from "./floor-plan";

const formatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

function parseDimension(value: string) {
  if (value.trim() === "") return Number.NaN;
  return Number(value);
}

export function FloorCalculator() {
  const [roomLength, setRoomLength] = useState("3000");
  const [roomWidth, setRoomWidth] = useState("4000");
  const result = useMemo(
    () => calculateFloor(parseDimension(roomLength), parseDimension(roomWidth)),
    [roomLength, roomWidth],
  );

  return (
    <div className="calculator-shell">
      <section className="input-card" aria-labelledby="room-heading">
        <div>
          <p className="eyebrow">Step 1</p>
          <h2 id="room-heading">Enter the room size</h2>
          <p className="section-intro">
            Measure the clear rectangular space. We will use the largest complete
            600 mm grid that fits inside it.
          </p>
        </div>

        <div className="dimension-fields">
          <label>
            <span>Room length</span>
            <span className="input-wrap">
              <input
                type="number"
                inputMode="numeric"
                min="600"
                step="100"
                value={roomLength}
                onChange={(event) => setRoomLength(event.target.value)}
                aria-describedby="dimension-hint"
              />
              <b>mm</b>
            </span>
          </label>
          <span className="dimension-times" aria-hidden="true">×</span>
          <label>
            <span>Room width</span>
            <span className="input-wrap">
              <input
                type="number"
                inputMode="numeric"
                min="600"
                step="100"
                value={roomWidth}
                onChange={(event) => setRoomWidth(event.target.value)}
                aria-describedby="dimension-hint"
              />
              <b>mm</b>
            </span>
          </label>
        </div>
        <p className="input-hint" id="dimension-hint">Minimum room size: 600 × 600 mm.</p>
      </section>

      <div aria-live="polite">
        {!result.valid ? (
          <section className="empty-result" role="status">
            <span aria-hidden="true">↗</span>
            <div>
              <h2>Give us a little more room</h2>
              <p>{result.message}</p>
            </div>
          </section>
        ) : (
          <>
            <section className="result-card" aria-labelledby="result-heading">
              <div className="result-lead">
                <p className="eyebrow">Recommended layout · Orientation {result.orientation}</p>
                <h2 id="result-heading">{result.totalPanels} total panels</h2>
                <p>
                  The usable dance floor is <strong>{result.usableLength} × {result.usableWidth} mm</strong>,
                  covering <strong>{formatter.format(result.areaSquareMetres)} m²</strong>.
                </p>
              </div>
              <div className="result-counts">
                <div>
                  <span className="count-number">{result.primaryPanels}</span>
                  <span>1200 × 600 mm<br />primary panels</span>
                </div>
                <div>
                  <span className="count-number">{result.fillerPanels}</span>
                  <span>600 × 600 mm<br />filler panels</span>
                </div>
              </div>
              <div className="result-note">
                <span className="result-note-mark" aria-hidden="true">✓</span>
                <p>
                  <strong>Fewest pieces found.</strong> The 1200 mm edge runs along the usable {result.orientation === "A" ? "length" : "width"}.
                </p>
              </div>
            </section>

            <FloorPlan result={result} />

            <details className="comparison-card">
              <summary>
                <span>Compare both orientations</span>
                <span className="summary-hint">See the working</span>
              </summary>
              <div className="comparison-grid">
                {(["A", "B"] as const).map((orientation) => {
                  const option = result.comparison[orientation];
                  const selected = result.orientation === orientation;
                  return (
                    <article className={selected ? "comparison-option comparison-option--selected" : "comparison-option"} key={orientation}>
                      <div className="comparison-title">
                        <h3>Orientation {orientation}</h3>
                        {selected && <span>Selected</span>}
                      </div>
                      <p>1200 mm edge along the usable {orientation === "A" ? "length" : "width"}</p>
                      <dl>
                        <div><dt>Primary</dt><dd>{option.primaryPanels}</dd></div>
                        <div><dt>Fillers</dt><dd>{option.fillerPanels}</dd></div>
                        <div><dt>Total</dt><dd>{option.totalPanels}</dd></div>
                      </dl>
                    </article>
                  );
                })}
              </div>
              <p className="comparison-explanation">
                {result.comparison.A.totalPanels === result.comparison.B.totalPanels
                  ? "Both layouts use the same number of pieces, so Orientation A is shown for consistency."
                  : `Orientation ${result.orientation} saves ${Math.abs(result.comparison.A.totalPanels - result.comparison.B.totalPanels)} ${Math.abs(result.comparison.A.totalPanels - result.comparison.B.totalPanels) === 1 ? "piece" : "pieces"}.`}
              </p>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
