import React from 'react';

const Toolbar = ({ onUndo, onHint, onRules }) => {
    const baseBtnClass = "px-6 py-2 rounded-full font-semibold text-sm transition-transform active:scale-95 flex items-center gap-2 shadow-sm";

    return (
        <div className="flex gap-4 mt-8">
            <button
                className={`${baseBtnClass} bg-gray-200 text-gray-800 hover:bg-gray-300`}
                onClick={onUndo}
                title="Undo Last Move"
            >
                ↩ Undo
            </button>
            <button
                className={`${baseBtnClass} bg-white text-gray-800 border border-gray-300 hover:bg-gray-50`}
                onClick={onHint}
                title="Show Hint"
            >
                💡 Hint
            </button>
            <button
                className={`${baseBtnClass} bg-transparent text-gray-500 hover:text-gray-800`}
                onClick={onRules}
                title="Game Rules"
            >
                ❓ Rules
            </button>
        </div>
    );
};

export default Toolbar;
