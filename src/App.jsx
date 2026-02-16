import { useState } from 'react';
import { useTangoGame } from './hooks/useTangoGame';
import Grid from './components/Grid';
import WinModal from './components/WinModal';
import RulesModal from './components/RulesModal';
import Toolbar from './components/Toolbar';


function App() {
  const {
    grid, toggleCell, constraints, violations, lockedCells,
    isGameWon, timeElapsed, resetGrid, undo, giveHint, hint, progress,
    nextLevel, currentLevelIndex, isLastLevel
  } = useTangoGame();

  const [showRules, setShowRules] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-gray-800 font-sans selection:bg-sun/30 py-8">

      {/* Header */}
      <header className="flex flex-col items-center gap-4 mb-4 w-full">
        <h1 className="text-4xl font-extrabold tracking-widest uppercase text-[#0a192f]">TANGO</h1>
        <div className="flex gap-4">
          <div className="px-5 py-2 bg-white border border-gray-300 rounded text-xl font-bold text-[#0a192f] shadow-sm min-w-[100px] text-center">
            Level {currentLevelIndex + 1}
          </div>
          <div className="px-5 py-2 bg-white border border-gray-300 rounded text-xl font-mono text-gray-700 shadow-sm min-w-[100px] text-center">
            {formatTime(timeElapsed)}
          </div>
        </div>
      </header>

      {/* Progress Bars (Simple - Grey) */}
      <div className="flex gap-8 mb-6 text-sm font-semibold text-gray-500">
        <div className="flex flex-col items-center gap-1">
          <span>Rows Balanced: {progress.rows}/6</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-gray-500 rounded-full transition-all duration-500" style={{ width: `${(progress.rows / 6) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span>Cols Balanced: {progress.cols}/6</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-gray-500 rounded-full transition-all duration-500" style={{ width: `${(progress.cols / 6) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-1 shadow-2xl rounded bg-white mb-6">
        <Grid
          grid={grid}
          onCellClick={toggleCell}
          constraints={constraints}
          violations={violations}
          lockedCells={lockedCells}
          hint={hint}
        />
      </div>

      {/* Footer Buttons */}
      <Toolbar
        onUndo={undo}
        onHint={giveHint}
        onRules={() => setShowRules(true)}
      />

      <div className="mt-4 text-xs text-gray-400">
        Level {currentLevelIndex + 1}
      </div>

      {isGameWon && (
        <WinModal
          timeElapsed={timeElapsed}
          onReset={resetGrid}
          onNext={nextLevel}
          isLastLevel={isLastLevel}
        />
      )}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}

export default App;
