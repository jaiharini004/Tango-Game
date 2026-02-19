import { useState, useCallback, useEffect } from 'react';
import { CELL_STATES, GRID_SIZE } from '../utils/constants';
import { generateTangoLevel } from '../utils/levelGenerator';

/**
 * Custom hook to manage the Tango game state.
 * @returns {object} { grid, toggleCell, resetGrid, nextLevel, levelNumber, isLastLevel, checkCellError, setIsGameActive, isGameActive ... }
 */
export const useTangoGame = () => {
    // Level Management
    const [levelNumber, setLevelNumber] = useState(1); // 1-based index for UI

    // Game Data
    const [levelData, setLevelData] = useState(null); // { initialGrid, constraints, solutionGrid }

    const [grid, setGrid] = useState(null);
    const [lockedCells, setLockedCells] = useState(new Set());
    const [constraints, setConstraints] = useState([]);

    // Game State
    const [isGameWon, setIsGameWon] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false); // Paused until data loaded OR explicitly paused

    // Helper state
    const [history, setHistory] = useState([]);
    const [hint, setHint] = useState(null);
    const [violations, setViolations] = useState([]);

    // --- Initialization ---

    // Load Level on levelNumber change
    useEffect(() => {
        // Generate new level
        const difficulty = levelNumber <= 2 ? 'EASY' : levelNumber <= 5 ? 'MEDIUM' : 'HARD';
        try {
            const data = generateTangoLevel(difficulty);
            setLevelData(data);

            // Set Grid
            const userGrid = data.initialGrid.map(row =>
                row.map(cell => cell === null ? CELL_STATES.EMPTY : cell)
            );
            setGrid(userGrid);
            setConstraints(data.constraints);

            // Lock Check
            const locked = new Set();
            data.initialGrid.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell !== null) {
                        locked.add(`${r}-${c}`);
                    }
                });
            });
            setLockedCells(locked);

            // Reset State
            setIsGameWon(false);
            setIsGameActive(true);
            setTimeElapsed(0);
            setHistory([]);
            setHint(null);
            setViolations([]);
        } catch (e) {
            console.error("Failed to generate level", e);
        }
    }, [levelNumber]);

    // --- Actions ---

    // Timer
    useEffect(() => {
        let interval;
        if (isGameActive && !isGameWon) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isGameActive, isGameWon]);

    // Validation (Adjacency & Balance)
    const validateGrid = useCallback((currentGrid) => {
        const newViolations = new Set();

        // 1. Adjacency (3 same)
        // Rows
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 2; c++) {
                const v1 = currentGrid[r][c];
                const v2 = currentGrid[r][c + 1];
                const v3 = currentGrid[r][c + 2];
                if (v1 !== CELL_STATES.EMPTY && v1 === v2 && v2 === v3) {
                    newViolations.add(`${r}-${c}`);
                    newViolations.add(`${r}-${c + 1}`);
                    newViolations.add(`${r}-${c + 2}`);
                }
            }
        }
        // Cols
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 2; r++) {
                const v1 = currentGrid[r][c];
                const v2 = currentGrid[r + 1][c];
                const v3 = currentGrid[r + 2][c];
                if (v1 !== CELL_STATES.EMPTY && v1 === v2 && v2 === v3) {
                    newViolations.add(`${r}-${c}`);
                    newViolations.add(`${r + 1}-${c}`);
                    newViolations.add(`${r + 2}-${c}`);
                }
            }
        }

        // 2. Balance (Max 3)
        const limit = GRID_SIZE / 2;
        // Rows
        for (let r = 0; r < GRID_SIZE; r++) {
            let suns = [], moons = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentGrid[r][c] === CELL_STATES.SUN) suns.push(`${r}-${c}`);
                if (currentGrid[r][c] === CELL_STATES.MOON) moons.push(`${r}-${c}`);
            }
            if (suns.length > limit) suns.forEach(v => newViolations.add(v));
            if (moons.length > limit) moons.forEach(v => newViolations.add(v));
        }
        // Cols
        for (let c = 0; c < GRID_SIZE; c++) {
            let suns = [], moons = [];
            for (let r = 0; r < GRID_SIZE; r++) {
                if (currentGrid[r][c] === CELL_STATES.SUN) suns.push(`${r}-${c}`);
                if (currentGrid[r][c] === CELL_STATES.MOON) moons.push(`${r}-${c}`);
            }
            if (suns.length > limit) suns.forEach(v => newViolations.add(v));
            if (moons.length > limit) moons.forEach(v => newViolations.add(v));
        }

        return Array.from(newViolations);
    }, []);

    // Check Win
    const checkWinCondition = useCallback((currentGrid) => {
        if (!levelData) return;

        // Is Full?
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentGrid[r][c] === CELL_STATES.EMPTY) return false;
            }
        }

        // No Violations?
        if (violations.length > 0) return false;

        // Valid Constraints?
        for (const k of constraints) {
            let r2 = k.row, c2 = k.col;
            if (k.type === 'RIGHT') c2 += 1;
            if (k.type === 'BOTTOM') r2 += 1;

            const v1 = currentGrid[k.row][k.col];
            const v2 = currentGrid[r2][c2];

            if (k.relation === 'EQUAL' && v1 !== v2) return false;
            if (k.relation === 'OPPOSITE' && v1 === v2) return false;
        }

        // Matches Solution? (Ultimate Check)
        // With unique solution logic, if it satisfies all rules it MUST match solution.
        // But let's check generated solution to be ultra safe.
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentGrid[r][c] !== levelData.solutionGrid[r][c]) return false;
            }
        }

        setIsGameWon(true);
        setIsGameActive(false);
    }, [violations, constraints, levelData]);

    const toggleCell = useCallback((r, c) => {
        if (!isGameActive) return; // Prevent edits if paused
        if (lockedCells.has(`${r}-${c}`)) return;
        if (isGameWon) return; // Prevent edits after win

        setGrid(prev => {
            const next = prev.map(row => [...row]);
            setHistory(h => [...h, prev]); // Save history

            const val = next[r][c];
            if (val === CELL_STATES.EMPTY) next[r][c] = CELL_STATES.SUN;
            else if (val === CELL_STATES.SUN) next[r][c] = CELL_STATES.MOON;
            else next[r][c] = CELL_STATES.EMPTY;

            return next;
        });
    }, [lockedCells, isGameWon, isGameActive]);

    // Validation Effect
    useEffect(() => {
        if (!grid) return;
        const v = validateGrid(grid);
        setViolations(v);
        // Only check win if no violations
        if (v.length === 0) {
            checkWinCondition(grid);
        }
    }, [grid, validateGrid, checkWinCondition]);

    const undo = useCallback(() => {
        if (!isGameActive) return;
        setHistory(prev => {
            if (prev.length === 0) return prev;
            const last = prev[prev.length - 1];
            setGrid(last);
            return prev.slice(0, -1);
        });
    }, [isGameActive]);

    const giveHint = useCallback(() => {
        if (isGameWon || !levelData || !isGameActive) return;

        // 1. Correct Errors
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] !== CELL_STATES.EMPTY && grid[r][c] !== levelData.solutionGrid[r][c]) {
                    setHint({ row: r, col: c, type: 'error' });
                    setTimeout(() => {
                        setGrid(g => {
                            const n = g.map(row => [...row]);
                            n[r][c] = levelData.solutionGrid[r][c];
                            return n;
                        });
                        setHint(null);
                    }, 1000);
                    return;
                }
            }
        }

        // 2. Reveal Empty
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === CELL_STATES.EMPTY) {
                    setHint({ row: r, col: c, type: 'reveal' });
                    setTimeout(() => {
                        setGrid(g => {
                            const n = g.map(row => [...row]);
                            n[r][c] = levelData.solutionGrid[r][c];
                            return n;
                        });
                        setHint(null);
                    }, 1000);
                    return;
                }
            }
        }

    }, [grid, isGameWon, levelData, isGameActive]);

    const nextLevel = useCallback(() => {
        setLevelNumber(prev => prev + 1);
    }, []);

    const resetGrid = useCallback(() => {
        if (!levelData) return;
        setGrid(levelData.initialGrid.map(row =>
            row.map(cell => cell === null ? CELL_STATES.EMPTY : cell)
        ));
        setViolations([]);
        setIsGameWon(false);
        setIsGameActive(true);
        setTimeElapsed(0);
        setHistory([]);
    }, [levelData]);

    // Check Cell Error (Visual Feedback)
    const checkCellError = useCallback((r, c) => {
        if (!grid || !levelData) return false;
        const val = grid[r][c];
        // If empty, no error. If matches solution, no error.
        if (val === CELL_STATES.EMPTY) return false;
        return val !== levelData.solutionGrid[r][c];
    }, [grid, levelData]);

    // Progress
    const [progress, setProgress] = useState({ rows: 0, cols: 0 });
    useEffect(() => {
        if (!grid) return;
        let rCount = 0, cCount = 0;
        const limit = GRID_SIZE / 2;

        // Rows
        for (let r = 0; r < GRID_SIZE; r++) {
            let sunCount = 0, moonCount = 0;
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === CELL_STATES.SUN) sunCount++;
                if (grid[r][c] === CELL_STATES.MOON) moonCount++;
            }
            if (sunCount === limit && moonCount === limit) rCount++;
        }

        // Cols
        for (let c = 0; c < GRID_SIZE; c++) {
            let sunCount = 0, moonCount = 0;
            for (let r = 0; r < GRID_SIZE; r++) {
                if (grid[r][c] === CELL_STATES.SUN) sunCount++;
                if (grid[r][c] === CELL_STATES.MOON) moonCount++;
            }
            if (sunCount === limit && moonCount === limit) cCount++;
        }
        setProgress({ rows: rCount, cols: cCount });
    }, [grid]);


    return {
        grid,
        toggleCell,
        resetGrid,
        nextLevel,
        undo,
        giveHint,
        hint,
        constraints,
        violations,
        lockedCells,
        isGameWon,
        timeElapsed,
        progress,
        levelNumber,
        checkCellError,
        setIsGameActive,
        isGameActive
    };
};
