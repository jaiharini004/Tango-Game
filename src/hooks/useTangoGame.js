import { useState, useCallback, useEffect } from 'react';
import { LEVELS } from '../data/levels';
import { CELL_STATES, GRID_SIZE } from '../utils/constants';
import { solveTango } from '../utils/solveTango';

/**
 * Custom hook to manage the Tango game state.
 * @returns {object} { grid, toggleCell, resetGrid, nextLevel, currentLevelIndex, isLastLevel }
 */
export const useTangoGame = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const currentLevel = LEVELS[currentLevelIndex];
    const isLastLevel = currentLevelIndex === LEVELS.length - 1;

    // Initialize grid from level data
    // If a cell in initialLevel.initialGrid is not null, it's locked.
    const [grid, setGrid] = useState(() => {
        return currentLevel.initialGrid.map(row =>
            row.map(cell => cell === null ? CELL_STATES.EMPTY : cell)
        );
    });

    const [constraints, setConstraints] = useState(currentLevel.constraints);

    // Identify locked cells (cells that were not empty in the level definition)
    // Store as a Set of strings "row-col" for O(1) lookup
    const [lockedCells, setLockedCells] = useState(new Set());

    // Solver Integration
    const [solutionGrid, setSolutionGrid] = useState(null);

    // Update state when level changes
    useEffect(() => {
        setGrid(currentLevel.initialGrid.map(row =>
            row.map(cell => cell === null ? CELL_STATES.EMPTY : cell)
        ));
        setConstraints(currentLevel.constraints);

        const locked = new Set();
        currentLevel.initialGrid.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell !== null) {
                    locked.add(`${r}-${c}`);
                }
            });
        });
        setLockedCells(locked);

        // Solve the level
        const sol = solveTango(currentLevel.initialGrid, currentLevel.constraints);
        if (sol) {
            setSolutionGrid(sol);
        } else {
            console.error("Level has no solution!", currentLevel);
        }

        // Reset game state
        setViolations([]);
        setIsGameWon(false);
        setIsGameActive(true);
        setTimeElapsed(0);
        setHistory([]);
        setHint(null);
    }, [currentLevelIndex]);

    // Phase 3: Adjacency Logic
    const [violations, setViolations] = useState([]);

    // Phase 6: Game Logic
    const [isGameWon, setIsGameWon] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isGameActive, setIsGameActive] = useState(true);

    // Phase 7: User Assistance
    const [history, setHistory] = useState([]);
    const [hint, setHint] = useState(null); // { row, col } or null

    // Clear hint on any interaction
    useEffect(() => {
        if (hint) {
            const timer = setTimeout(() => setHint(null), 2000); // Auto-hide hint after 2s
            return () => clearTimeout(timer);
        }
    }, [hint]);

    // Timer Effect
    useEffect(() => {
        let interval;
        if (isGameActive && !isGameWon) {
            interval = setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isGameActive, isGameWon]);

    // Check for Constraint Violations (Win Condition Strictness)
    const checkConstraintViolations = useCallback((currentGrid) => {
        for (const constraint of constraints) {
            const r1 = constraint.row;
            const c1 = constraint.col;
            let r2 = r1;
            let c2 = c1;

            if (constraint.type === 'RIGHT') c2 += 1;
            if (constraint.type === 'BOTTOM') r2 += 1;

            const val1 = currentGrid[r1][c1];
            const val2 = currentGrid[r2][c2];

            // If either is empty, it's not a violation *yet* for game-play,
            // but for WIN condition, it means not done.
            if (val1 === CELL_STATES.EMPTY || val2 === CELL_STATES.EMPTY) return true; // Treat as "not satisfied"

            if (constraint.relation === 'EQUAL') {
                if (val1 !== val2) return true;
            } else if (constraint.relation === 'OPPOSITE') {
                if (val1 === val2) return true;
            }
        }
        return false;
    }, [constraints]);

    // Check Win Condition
    useEffect(() => {
        if (violations.length > 0) return;

        // Check if grid is full
        let isFull = true;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === CELL_STATES.EMPTY) {
                    isFull = false;
                    break;
                }
            }
        }

        // Validate Constraints STRICTLY
        const hasConstraintViolations = checkConstraintViolations(grid);

        // Win requires: Full Grid AND No Pattern Violations AND No Constraint Violations
        if (isFull && violations.length === 0 && !hasConstraintViolations) {
            setIsGameWon(true);
            setIsGameActive(false);
        }
    }, [grid, violations, checkConstraintViolations]);




    // Check for 3 consecutive identical symbols
    const checkAdjacencyViolations = useCallback((currentGrid) => {
        const newViolations = new Set();

        // Check Rows
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 2; c++) {
                const v1 = currentGrid[r][c];
                const v2 = currentGrid[r][c + 1];
                const v3 = currentGrid[r][c + 2];

                if (v1 && v1 === v2 && v2 === v3) {
                    newViolations.add(`${r}-${c}`);
                    newViolations.add(`${r}-${c + 1}`);
                    newViolations.add(`${r}-${c + 2}`);
                }
            }
        }

        // Check Columns
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 2; r++) {
                const v1 = currentGrid[r][c];
                const v2 = currentGrid[r + 1][c];
                const v3 = currentGrid[r + 2][c];

                if (v1 && v1 === v2 && v2 === v3) {
                    newViolations.add(`${r}-${c}`);
                    newViolations.add(`${r + 1}-${c}`);
                    newViolations.add(`${r + 2}-${c}`);
                }
            }
        }

        return Array.from(newViolations);
    }, []);

    /**
     * Toggles the state of a cell at (row, col).
     * Cycle: EMPTY -> SUN -> MOON -> EMPTY
     */
    const toggleCell = useCallback((row, col) => {
        if (lockedCells.has(`${row}-${col}`)) return;
        if (isGameWon) return; // Disable interaction on win

        setGrid((prevGrid) => {
            // Save history
            setHistory(prev => [...prev, prevGrid.map(r => [...r])]);

            // Create a deep copy of the grid to ensure immutability
            const newGrid = prevGrid.map((r) => [...r]);
            const currentVal = newGrid[row][col];

            let nextVal;
            if (currentVal === CELL_STATES.EMPTY) {
                nextVal = CELL_STATES.SUN;
            } else if (currentVal === CELL_STATES.SUN) {
                nextVal = CELL_STATES.MOON;
            } else {
                nextVal = CELL_STATES.EMPTY;
            }

            newGrid[row][col] = nextVal;
            return newGrid;
        });
    }, [lockedCells, isGameWon]);

    const undo = useCallback(() => {
        setHistory(prev => {
            if (prev.length === 0) return prev;
            const previousGrid = prev[prev.length - 1];
            setGrid(previousGrid);
            return prev.slice(0, -1);
        });
    }, []);

    // Phase 14: Self-Correcting Hint Logic
    const giveHint = useCallback(() => {
        if (hint || isGameWon || !solutionGrid) return;

        // 1. Error Detection Mode
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const currentVal = grid[r][c];
                const correctVal = solutionGrid[r][c];

                if (currentVal !== CELL_STATES.EMPTY && currentVal !== correctVal) {
                    // Found an error!
                    setHint({ row: r, col: c, val: correctVal, type: 'error' }); // Blue flash

                    // Auto-correct after delay
                    setTimeout(() => {
                        setGrid(prev => {
                            const newGrid = prev.map(row => [...row]);
                            newGrid[r][c] = correctVal;
                            setHistory(h => [...h, prev.map(row => [...row])]); // Save history
                            return newGrid;
                        });
                        setHint(null);
                    }, 1000);
                    return;
                }
            }
        }

        // 2. Progressive Hint Mode
        let target = null;
        outer: for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === CELL_STATES.EMPTY) {
                    const hasNeighbor = (r > 0 && grid[r - 1][c]) || (r < 5 && grid[r + 1][c]) || (c > 0 && grid[r][c - 1]) || (c < 5 && grid[r][c + 1]);
                    if (hasNeighbor) {
                        target = { r, c };
                        break outer;
                    }
                }
            }
        }

        if (!target) {
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (grid[r][c] === CELL_STATES.EMPTY) {
                        target = { r, c };
                        break;
                    }
                }
                if (target) break;
            }
        }

        if (target) {
            const correctVal = solutionGrid[target.r][target.c];
            setHint({ row: target.r, col: target.c, val: correctVal, type: 'reveal' }); // Gold flash

            // Auto-fill after delay
            setTimeout(() => {
                setGrid(prev => {
                    const newGrid = prev.map(row => [...row]);
                    newGrid[target.r][target.c] = correctVal;
                    setHistory(h => [...h, prev.map(row => [...row])]);
                    return newGrid;
                });
                setHint(null);
            }, 1000);
        }
    }, [grid, solutionGrid, hint, isGameWon]);

    // Check for Row/Col balance violations (Max 3 of each type)
    const checkBalanceViolations = useCallback((currentGrid) => {
        const newViolations = new Set();
        const limit = GRID_SIZE / 2;

        // Check Rows
        for (let r = 0; r < GRID_SIZE; r++) {
            let suns = [];
            let moons = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                if (currentGrid[r][c] === CELL_STATES.SUN) suns.push(`${r}-${c}`);
                if (currentGrid[r][c] === CELL_STATES.MOON) moons.push(`${r}-${c}`);
            }
            if (suns.length > limit) suns.forEach(v => newViolations.add(v));
            if (moons.length > limit) moons.forEach(v => newViolations.add(v));
        }

        // Check Columns
        for (let c = 0; c < GRID_SIZE; c++) {
            let suns = [];
            let moons = [];
            for (let r = 0; r < GRID_SIZE; r++) {
                if (currentGrid[r][c] === CELL_STATES.SUN) suns.push(`${r}-${c}`);
                if (currentGrid[r][c] === CELL_STATES.MOON) moons.push(`${r}-${c}`);
            }
            if (suns.length > limit) suns.forEach(v => newViolations.add(v));
            if (moons.length > limit) moons.forEach(v => newViolations.add(v));
        }

        return newViolations;
    }, []);

    // Effect to validate grid whenever it changes
    useEffect(() => {
        const adjacency = checkAdjacencyViolations(grid);
        const balance = checkBalanceViolations(grid);

        const allViolations = new Set([...adjacency, ...balance]);
        setViolations(Array.from(allViolations));
    }, [grid, checkAdjacencyViolations, checkBalanceViolations]);

    // Calculate Progress (Balanced Rows/Cols)
    const [progress, setProgress] = useState({ rows: 0, cols: 0 });

    useEffect(() => {
        let rCount = 0;
        let cCount = 0;
        const limit = GRID_SIZE / 2;

        for (let r = 0; r < GRID_SIZE; r++) {
            let s = 0, m = 0;
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === CELL_STATES.SUN) s++;
                if (grid[r][c] === CELL_STATES.MOON) m++;
            }
            if (s === limit && m === limit) rCount++;
        }

        for (let c = 0; c < GRID_SIZE; c++) {
            let s = 0, m = 0;
            for (let r = 0; r < GRID_SIZE; r++) {
                if (grid[r][c] === CELL_STATES.SUN) s++;
                if (grid[r][c] === CELL_STATES.MOON) m++;
            }
            if (s === limit && m === limit) cCount++;
        }

        setProgress({ rows: rCount, cols: cCount });
    }, [grid]);

    const resetGrid = useCallback(() => {
        setGrid(currentLevel.initialGrid.map(row =>
            row.map(cell => cell === null ? CELL_STATES.EMPTY : cell)
        ));
        setViolations([]);
        setIsGameWon(false);
        setIsGameActive(true);
        setTimeElapsed(0);
        setHistory([]);
        setHint(null);
    }, [currentLevel]);

    const nextLevel = useCallback(() => {
        if (currentLevelIndex < LEVELS.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
        }
    }, [currentLevelIndex]);

    // Auto-Advance Effect
    useEffect(() => {
        if (isGameWon && !isLastLevel) {
            const timer = setTimeout(() => {
                nextLevel();
            }, 2000); // 2 seconds delay before auto-advancing
            return () => clearTimeout(timer);
        }
    }, [isGameWon, isLastLevel, nextLevel]);

    return {
        grid,
        toggleCell,
        resetGrid,
        nextLevel,
        currentLevelIndex,
        isLastLevel: currentLevelIndex === LEVELS.length - 1,
        undo,
        giveHint,
        hint,
        constraints,
        violations,
        lockedCells,
        isGameWon,
        timeElapsed,
        progress,
    };
};
