export type Orientation = "A" | "B";

export type PanelPlacement = {
  id: string;
  type: "primary" | "filler";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OrientationLayout = {
  orientation: Orientation;
  primaryPanels: number;
  fillerPanels: number;
  totalPanels: number;
  panels: PanelPlacement[];
};

export type FloorResult =
  | { valid: false; message: string }
  | {
      valid: true;
      roomLength: number;
      roomWidth: number;
      usableLength: number;
      usableWidth: number;
      unusedLength: number;
      unusedWidth: number;
      areaSquareMetres: number;
      orientation: Orientation;
      primaryPanels: number;
      fillerPanels: number;
      totalPanels: number;
      panels: PanelPlacement[];
      comparison: Record<Orientation, OrientationLayout>;
    };

const GRID_SIZE = 600;
const PRIMARY_SIZE = 1200;
const INVALID_MESSAGE = "Enter room dimensions of at least 600 mm.";

function calculateOrientation(
  usableLength: number,
  usableWidth: number,
  orientation: Orientation,
): OrientationLayout {
  const panels: PanelPlacement[] = [];

  if (orientation === "A") {
    const primaryColumns = Math.floor(usableLength / PRIMARY_SIZE);
    const rows = usableWidth / GRID_SIZE;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < primaryColumns; column += 1) {
        panels.push({
          id: `A-primary-${row}-${column}`,
          type: "primary",
          x: column * PRIMARY_SIZE,
          y: row * GRID_SIZE,
          width: PRIMARY_SIZE,
          height: GRID_SIZE,
        });
      }
    }

    if (usableLength % PRIMARY_SIZE !== 0) {
      for (let row = 0; row < rows; row += 1) {
        panels.push({
          id: `A-filler-${row}`,
          type: "filler",
          x: usableLength - GRID_SIZE,
          y: row * GRID_SIZE,
          width: GRID_SIZE,
          height: GRID_SIZE,
        });
      }
    }
  } else {
    const columns = usableLength / GRID_SIZE;
    const primaryRows = Math.floor(usableWidth / PRIMARY_SIZE);

    for (let column = 0; column < columns; column += 1) {
      for (let row = 0; row < primaryRows; row += 1) {
        panels.push({
          id: `B-primary-${column}-${row}`,
          type: "primary",
          x: column * GRID_SIZE,
          y: row * PRIMARY_SIZE,
          width: GRID_SIZE,
          height: PRIMARY_SIZE,
        });
      }
    }

    if (usableWidth % PRIMARY_SIZE !== 0) {
      for (let column = 0; column < columns; column += 1) {
        panels.push({
          id: `B-filler-${column}`,
          type: "filler",
          x: column * GRID_SIZE,
          y: usableWidth - GRID_SIZE,
          width: GRID_SIZE,
          height: GRID_SIZE,
        });
      }
    }
  }

  const primaryPanels = panels.filter((panel) => panel.type === "primary").length;
  const fillerPanels = panels.length - primaryPanels;

  return {
    orientation,
    primaryPanels,
    fillerPanels,
    totalPanels: panels.length,
    panels,
  };
}

export function calculateFloor(
  roomLength: number,
  roomWidth: number,
): FloorResult {
  if (
    !Number.isFinite(roomLength) ||
    !Number.isFinite(roomWidth) ||
    roomLength < GRID_SIZE ||
    roomWidth < GRID_SIZE
  ) {
    return { valid: false, message: INVALID_MESSAGE };
  }

  const usableLength = Math.floor(roomLength / GRID_SIZE) * GRID_SIZE;
  const usableWidth = Math.floor(roomWidth / GRID_SIZE) * GRID_SIZE;
  const comparison = {
    A: calculateOrientation(usableLength, usableWidth, "A"),
    B: calculateOrientation(usableLength, usableWidth, "B"),
  };
  const selected =
    comparison.B.totalPanels < comparison.A.totalPanels
      ? comparison.B
      : comparison.A;

  return {
    valid: true,
    roomLength,
    roomWidth,
    usableLength,
    usableWidth,
    unusedLength: roomLength - usableLength,
    unusedWidth: roomWidth - usableWidth,
    areaSquareMetres: (usableLength * usableWidth) / 1_000_000,
    orientation: selected.orientation,
    primaryPanels: selected.primaryPanels,
    fillerPanels: selected.fillerPanels,
    totalPanels: selected.totalPanels,
    panels: selected.panels,
    comparison,
  };
}
