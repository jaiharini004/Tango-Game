import React from 'react';
import Cell from './Cell';
import ConstraintMarker from './ConstraintMarker';

const Grid = ({ grid, onCellClick, constraints = [], violations = [], lockedCells = new Set(), hint }) => {
  // Helper to check for constraints at a specific cell
  const getConstraint = (row, col, type) => {
    return constraints.find(c => c.row === row && c.col === col && c.type === type);
  };

  const isCellInvalid = (row, col) => {
    return violations.includes(`${row}-${col}`);
  };

  const isCellLocked = (row, col) => {
    return lockedCells.has(`${row}-${col}`);
  };

  return (
    // Outer border container
    <div className="border-t border-l border-grid-line shadow-lg rounded-sm overflow-visible bg-background">
      {grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {row.map((cellValue, colIndex) => {
            const rightConstraint = getConstraint(rowIndex, colIndex, 'RIGHT');
            const bottomConstraint = getConstraint(rowIndex, colIndex, 'BOTTOM');

            const isHinted = hint && hint.row === rowIndex && hint.col === colIndex;

            return (
              <div key={`${rowIndex}-${colIndex}`} className="relative">
                <Cell
                  row={rowIndex}
                  col={colIndex}
                  value={cellValue}
                  onClick={onCellClick}
                  isInvalid={isCellInvalid(rowIndex, colIndex)}
                  isLocked={isCellLocked(rowIndex, colIndex)}
                  isHint={isHinted}
                />
                {/* Pass relation if available in data, mostly undefined now so defaults to OPPOSITE */}
                {rightConstraint && <ConstraintMarker type="RIGHT" relation={rightConstraint.relation} />}
                {bottomConstraint && <ConstraintMarker type="BOTTOM" relation={bottomConstraint.relation} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default React.memo(Grid);
