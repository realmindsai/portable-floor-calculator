import type { CSSProperties } from "react";

import type { FloorResult } from "../lib/floor-calculator";

type ValidFloorResult = Extract<FloorResult, { valid: true }>;

type FloorPlanProps = {
  result: ValidFloorResult;
};

export function FloorPlan({ result }: FloorPlanProps) {
  return (
    <section className="plan-card" aria-labelledby="plan-heading">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Selected panel map</p>
          <h2 id="plan-heading">Your floor, piece by piece</h2>
        </div>
        <div className="plan-dimensions" aria-label="Usable floor dimensions">
          {result.usableLength} × {result.usableWidth} mm
        </div>
      </div>

      <div className="plan-frame">
        <div
          className="room-plan"
          style={{ aspectRatio: `${result.roomLength} / ${result.roomWidth}` }}
          aria-label={`Room plan showing ${result.totalPanels} panels in Orientation ${result.orientation}`}
        >
          <div
            className="usable-floor"
            style={{
              width: `${(result.usableLength / result.roomLength) * 100}%`,
              height: `${(result.usableWidth / result.roomWidth) * 100}%`,
            }}
          >
            {result.panels.map((panel, index) => {
              const style: CSSProperties = {
                left: `${(panel.x / result.usableLength) * 100}%`,
                top: `${(panel.y / result.usableWidth) * 100}%`,
                width: `${(panel.width / result.usableLength) * 100}%`,
                height: `${(panel.height / result.usableWidth) * 100}%`,
              };

              return (
                <div
                  className={`panel-piece panel-piece--${panel.type}`}
                  data-panel-piece={panel.type}
                  key={panel.id}
                  style={style}
                  title={`${panel.type === "primary" ? "1200 × 600" : "600 × 600"} mm panel ${index + 1}`}
                >
                  <span>{index + 1}</span>
                </div>
              );
            })}
          </div>
          {(result.unusedLength > 0 || result.unusedWidth > 0) && (
            <span className="unused-label">unused room edge</span>
          )}
        </div>
      </div>

      <div className="plan-legend" aria-label="Panel legend">
        <span><i className="legend-swatch legend-swatch--primary" />1200 × 600 mm</span>
        <span><i className="legend-swatch legend-swatch--filler" />600 × 600 mm filler</span>
        <span><i className="legend-swatch legend-swatch--unused" />Unused room edge</span>
      </div>
    </section>
  );
}
