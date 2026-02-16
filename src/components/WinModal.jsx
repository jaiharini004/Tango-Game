import React from 'react';

const WinModal = ({ timeElapsed, onReset, onNext, isLastLevel }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center border-4 border-moon animate-[popIn_0.3s_ease-out]">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Level Complete!</h2>
                <div className="text-4xl font-bold text-sun mb-6 font-mono">{formatTime(timeElapsed)}</div>
                <div className="flex gap-4 justify-center">
                    {!isLastLevel && (
                        <button
                            className="px-8 py-3 bg-sun text-white rounded-full font-bold shadow-lg hover:bg-orange-500 transition-colors"
                            onClick={onNext}
                        >
                            Play Next Level
                        </button>
                    )}
                    <button
                        className={`px-8 py-3 ${isLastLevel ? 'bg-moon' : 'bg-gray-200 text-gray-700'} rounded-full font-bold shadow-lg hover:brightness-110 transition-colors`}
                        onClick={onReset}
                    >
                        {isLastLevel ? 'Play Again' : 'Replay'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinModal;
