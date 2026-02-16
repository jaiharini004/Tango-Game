import React from 'react';

const RulesModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md border-2 border-gray-200" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">How to Play</h2>
                <ul className="space-y-3 text-gray-600 mb-8 list-disc pl-5">
                    <li><strong>Sun & Moon:</strong> Fill the grid with Sun (Yellow) and Moon (Blue) symbols.</li>
                    <li><strong>No Triples:</strong> You cannot have 3 consecutive identical symbols.</li>
                    <li><strong>Balance:</strong> Each row and column must have an equal number of Suns and Moons.</li>
                    <li><strong>Opposite Neighbors:</strong> Cells separated by an 'x' must have opposite symbols.</li>
                </ul>
                <div className="text-center">
                    <button
                        className="px-6 py-2 bg-moon text-white rounded-full font-semibold hover:bg-blue-600 transition-colors"
                        onClick={onClose}
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RulesModal;
