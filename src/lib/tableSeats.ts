export interface Seat {
  col: number;
  row: number;
  colSpan: number;
  /** Panel rotation in degrees; must match `finalRot` in PlayerPanel.tsx. */
  rotation: number;
}

/**
 * Grid position and rotation of every seat for 3+ players (see "Layout & rotation invariants"
 * in CLAUDE.md). Two columns; in 3p/5p the last player gets a full-width row at 270°.
 */
export function getTableSeats(totalPlayers: number): Seat[] {
  return Array.from({ length: totalPlayers }, (_, i) => {
    const row = Math.floor(i / 2);
    if (totalPlayers % 2 === 1 && i === totalPlayers - 1) {
      return { col: 0, row, colSpan: 2, rotation: 270 };
    }
    return { col: i % 2, row, colSpan: 1, rotation: i % 2 === 0 ? 0 : 180 };
  });
}
