import React from 'react';

const ConstraintMarker = ({ type, relation = 'OPPOSITE' }) => {
    const symbol = relation === 'EQUAL' ? '=' : '×';

    // Absolute positioning based on type
    // RIGHT: centered vertically, on right border (right: -marker_width/2)
    // BOTTOM: centered horizontally, on bottom border (bottom: -marker_height/2)

    let positionClasses = '';
    if (type === 'RIGHT') {
        positionClasses = 'top-1/2 -translate-y-1/2 -right-2'; // -right-2 is approx half of w-4 (1rem=16px)
    } else if (type === 'BOTTOM') {
        positionClasses = 'left-1/2 -translate-x-1/2 -bottom-2';
    }

    return (
        <div className={`absolute z-10 w-4 h-4 flex items-center justify-center bg-background text-gray-500 font-bold text-sm leading-none pointer-events-none ${positionClasses}`}>
            {symbol}
        </div>
    );
};

export default React.memo(ConstraintMarker);
