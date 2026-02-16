import React from 'react';
import { CELL_STATES } from '../utils/constants';

const Cell = ({ value, onClick, row, col, isInvalid, isLocked, isHint }) => {
    let content = null;

    // Base styling
    // 60x60 fixed size, border right/bottom for grid lines
    let baseClasses = "w-[60px] h-[60px] border-r border-b border-grid-line flex items-center justify-center cursor-pointer transition-colors duration-75 relative";

    // Background handling
    if (isLocked) {
        baseClasses += " bg-locked"; // #F1EBE0
    } else {
        baseClasses += " bg-background hover:bg-gray-50"; // #FCFBF8
    }



    if (isHint) {
        if (isHint.type === 'error') {
            baseClasses += " ring-inset ring-4 ring-blue-500 z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]"; // Blue Glow
        } else {
            baseClasses += " ring-inset ring-4 ring-yellow-400 z-10 shadow-[0_0_15px_rgba(250,204,21,0.5)]"; // Gold Glow
        }
    }

    // Inline SVGs for exact control
    if (value === CELL_STATES.SUN) {
        content = (
            <svg viewBox="0 0 100 100" className="w-[60%] h-[60%] fill-sun drop-shadow-sm">
                <circle cx="50" cy="50" r="48" />
            </svg>
        );
    } else if (value === CELL_STATES.MOON) {
        content = (
            <svg viewBox="0 0 100 100" className="w-[50%] h-[50%] fill-moon drop-shadow-sm -rotate-45">
                <path d="M50 0 C22.4 0 0 22.4 0 50 C0 77.6 22.4 100 50 100 C40 100 20 80 20 50 C20 20 40 0 50 0 Z" />
            </svg>
        );
    }

    return (
        <div
            className={baseClasses}
            onClick={() => onClick(row, col)}
            role="button"
            aria-label={`Cell at ${row},${col}, value: ${value || 'empty'}`}
        >
            {content}
        </div>
    );
};

export default React.memo(Cell);
