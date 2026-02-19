import React, { useState } from 'react';
import { useTangoGame } from '../hooks/useTangoGame';
import Grid from './Grid';
import WinModal from './WinModal';
import RulesModal from './RulesModal';
import Toolbar from './Toolbar';
import { ChevronLeft, Pause, Play } from 'lucide-react';

function TangoGame({ onBack }) {
    const [paused, setPaused] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const {
        grid, toggleCell, constraints, violations, lockedCells,
        isGameWon, timeElapsed, resetGrid, undo, giveHint, hint, progress,
        nextLevel, levelNumber, checkCellError, setIsGameActive
    } = useTangoGame();

    const handlePause = () => {
        setPaused(true);
        setIsGameActive(false);
    };

    const handleResume = () => {
        setPaused(false);
        setIsGameActive(true);
    };

    const handleBack = () => {
        onBack();
    };

    const handleNextLevel = () => {
        nextLevel();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Safeguard: Conditional Rendering
    if (!grid) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-[#0a192f]">
                <div className="w-16 h-16 border-4 border-[#316FCF] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-bold tracking-widest animate-pulse">GENERATING LEVEL...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-cream text-gray-800 font-sans selection:bg-sun/30 py-8 relative w-full">

            {/* Top Navigation */}
            <div className="w-full max-w-lg flex justify-between px-4 mb-4">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#316FCF] hover:bg-white rounded-full transition-all shadow-sm font-bold"
                    title="Back to Home"
                >
                    {/* Fallback SVG if lucide missing, though installed */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    BACK
                </button>

                <button
                    onClick={paused ? handleResume : handlePause}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all shadow-sm font-bold ${paused ? 'bg-[#F7A028] text-white animate-pulse' : 'bg-white text-gray-600 hover:text-[#F7A028]'}`}
                >
                    {paused ? (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                            RESUME
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                            PAUSE
                        </>
                    )}
                </button>
            </div>


            {/* Game Header */}
            <header className="flex flex-col items-center gap-4 mb-4 w-full">
                <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">LEVEL</span>
                        <div className="px-6 py-2 bg-white border-2 border-gray-100 rounded-xl text-2xl font-black text-[#316FCF] shadow-md min-w-[100px] text-center">
                            {levelNumber}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">TIME</span>
                        <div className="px-6 py-2 bg-white border-2 border-gray-100 rounded-xl text-2xl font-mono font-bold text-gray-700 shadow-md min-w-[100px] text-center">
                            {formatTime(timeElapsed)}
                        </div>
                    </div>
                </div>
            </header>

            {/* Progress Bars */}
            <div className="flex gap-8 mb-6 text-xs font-bold tracking-widest text-gray-400 uppercase">
                <div className="flex flex-col items-center gap-2">
                    <span>Rows</span>
                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${progress.rows === 6 ? 'bg-[#F7A028]' : 'bg-[#316FCF]'}`}
                            style={{ width: `${(progress.rows / 6) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span>Cols</span>
                    <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${progress.cols === 6 ? 'bg-[#F7A028]' : 'bg-[#316FCF]'}`}
                            style={{ width: `${(progress.cols / 6) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Grid Container with Pause Overlay */}
            <div className="relative p-2 shadow-2xl shadow-blue-900/5 rounded-xl bg-white mb-6 border border-gray-100">
                <Grid
                    grid={grid}
                    onCellClick={toggleCell}
                    constraints={constraints}
                    violations={violations}
                    lockedCells={lockedCells}
                    hint={hint}
                    checkCellError={checkCellError}
                />

                {/* Pause Overlay */}
                {paused && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-200">
                        <span className="text-4xl font-black text-[#316FCF] mb-6 tracking-widest drop-shadow-sm">PAUSED</span>
                        <button
                            onClick={handleResume}
                            className="px-10 py-4 bg-[#F7A028] text-white rounded-full font-bold shadow-xl hover:scale-105 hover:shadow-orange-500/30 transition-all"
                        >
                            RESUME GAME
                        </button>
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <Toolbar
                onUndo={undo}
                onHint={giveHint}
                onRules={() => setShowRules(true)}
            />

            {isGameWon && (
                <WinModal
                    timeElapsed={timeElapsed}
                    onReset={resetGrid}
                    onNext={handleNextLevel}
                    isLastLevel={false} // Infinite
                />
            )}
            {showRules && <RulesModal onClose={() => setShowRules(false)} />}
        </div>
    );
}

export default TangoGame;
