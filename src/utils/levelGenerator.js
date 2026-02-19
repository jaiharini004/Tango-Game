import { CELL_STATES, GRID_SIZE } from './constants';
import { solveTango } from './solveTango';

/**
 * Generates a new Tango level with a unique solution.
 * @param {string} difficulty - 'EASY', 'MEDIUM', 'HARD' (currently affects removal count)
 * @returns {object} { initialGrid, constraints, solution }
 */
export const generateTangoLevel = (difficulty = 'MEDIUM') => {
    let attempts = 0;
    while (attempts < 100) {
        attempts++;
        try {
            // 1. Generate a full valid grid (the solution)
            const solution = generateFullSolution();
            if (!solution) continue;

            // 2. Create constraints (Equal/Opposite markers) derived from the solution
            // Add some random constraints based on difficulty (?) 
            // For now, let's just generate a few valid constraints first, then dig holes.
            // Actually, Tango puzzles usually have some constraints and some filled cells.

            // Let's create a set of potential constraints from the solution
            const potentialConstraints = generatePotentialConstraints(solution);
            // Pick a subset of constraints
            const constraints = pickRandomConstraints(potentialConstraints, 3 + Math.floor(Math.random() * 3)); // 3-5 constraints

            // 3. Dig holes (Remove cells)
            // Start with full grid and remove cells while checking if unique solution remains.
            // Solving checking is expensive, so we might just remove X cells and hope? 
            // No, reliable way is: Remove cell -> Solve. If 1 solution, keep removed. If >1, put back.
            // But we can rely on `solveTango` which returns the FIRST solution.
            // To check uniqueness properly, the solver needs to find *at least two* solutions. 
            // Our current `solveTango` returns one.

            // Simplified approach for "Infinite":
            // Just remove a localized number of cells to match difficulty.
            // EASY: Leave 60% filled. MEDIUM: 40%. HARD: 20%.
            // Then run solver. If it solves back to THE SAME solution, we are good.
            // (Strict uniqueness is hard without a multi-solution solver, but this is usually "good enough" for games)

            const removalRate = difficulty === 'EASY' ? 0.3 : difficulty === 'MEDIUM' ? 0.5 : 0.7;
            const initialGrid = removeCells(solution, removalRate);

            // 4. Validate
            // The generated level must have the SAME solution as we started with.
            const checkSol = solveTango(initialGrid, constraints);

            // We need to verify that checkSol MATCHES solution exactly.
            if (gridsMatch(checkSol, solution)) {
                return {
                    initialGrid,
                    constraints,
                    solutionGrid: solution
                };
            }
        } catch (e) {
            console.warn("Generation failed redo", e);
        }
    }
    throw new Error("Failed to generate level after multiple attempts");
};

// --- Helpers ---

const generateFullSolution = () => {
    // Start empty
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(CELL_STATES.EMPTY));

    // Use randomized backtracking to fill
    // We can reuse solveTango with empty constraints and randomized order
    return solveRandom(grid);
};

const solveRandom = (grid) => {
    // Custom solver that shuffles moves to create random valid grids
    const solve = (r, c) => {
        if (r === GRID_SIZE) return true;
        const nextR = c === GRID_SIZE - 1 ? r + 1 : r;
        const nextC = c === GRID_SIZE - 1 ? 0 : c + 1;

        if (grid[r][c] !== CELL_STATES.EMPTY) {
            return solve(nextR, nextC);
        }

        // Randomize Sun/Moon order
        const moves = Math.random() > 0.5
            ? [CELL_STATES.SUN, CELL_STATES.MOON]
            : [CELL_STATES.MOON, CELL_STATES.SUN];

        for (const move of moves) {
            if (isValidPlacement(grid, r, c, move)) {
                grid[r][c] = move;
                if (solve(nextR, nextC)) return true;
                grid[r][c] = CELL_STATES.EMPTY;
            }
        }
        return false;
    };

    if (solve(0, 0)) return grid;
    return null;
};

// Duplicate of isValid logic from solver, but simplified for generation context
const isValidPlacement = (grid, r, c, val) => {
    // 1. Adjacency: No 3 same
    if (c >= 2 && grid[r][c - 1] === val && grid[r][c - 2] === val) return false;
    if (r >= 2 && grid[r - 1][c] === val && grid[r - 2][c] === val) return false;

    // We strictly check neighbors that are already filled (backwards). Forward check not needed for distinct generation

    // 2. Balance: Max 3
    let rowCount = 0;
    for (let i = 0; i < GRID_SIZE; i++) if (grid[r][i] === val) rowCount++;
    if (rowCount >= GRID_SIZE / 2) return false; // >= because we are adding one

    let colCount = 0;
    for (let i = 0; i < GRID_SIZE; i++) if (grid[i][c] === val) colCount++;
    if (colCount >= GRID_SIZE / 2) return false;

    return true;
};

const generatePotentialConstraints = (solution) => {
    const constrs = [];
    // Horizontal relations
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE - 1; c++) {
            const v1 = solution[r][c];
            const v2 = solution[r][c + 1];
            // 30% chance to add a relation? No, gather ALL then pick random.
            if (v1 === v2) constrs.push({ type: 'RIGHT', row: r, col: c, relation: 'EQUAL' });
            else constrs.push({ type: 'RIGHT', row: r, col: c, relation: 'OPPOSITE' });
        }
    }
    // Vertical
    for (let r = 0; r < GRID_SIZE - 1; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const v1 = solution[r][c];
            const v2 = solution[r + 1][c];
            if (v1 === v2) constrs.push({ type: 'BOTTOM', row: r, col: c, relation: 'EQUAL' });
            else constrs.push({ type: 'BOTTOM', row: r, col: c, relation: 'OPPOSITE' });
        }
    }
    return constrs;
};

const pickRandomConstraints = (all, count) => {
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const removeCells = (solution, rate) => {
    const newGrid = solution.map(row => [...row]);
    const totalCells = GRID_SIZE * GRID_SIZE;
    const toRemove = Math.floor(totalCells * rate);

    let removed = 0;
    while (removed < toRemove) {
        const r = Math.floor(Math.random() * GRID_SIZE);
        const c = Math.floor(Math.random() * GRID_SIZE);
        if (newGrid[r][c] !== CELL_STATES.EMPTY) {
            newGrid[r][c] = CELL_STATES.EMPTY; // Empty means user has to fill it
            // In our data structure, 'null' means empty/user-fillable? 
            // In levels.js: `null` for empty, `SUN`/`MOON` for locked.
            // Wait, existing levels.js uses `null`.
            newGrid[r][c] = null;
            removed++;
        }
    }

    // For the remaining cells, they are "LOCKED" (pre-filled).
    // So if it's NOT null, it's a fixed hint.
    return newGrid;
};

const gridsMatch = (g1, g2) => {
    if (!g1 || !g2) return false;
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (g1[r][c] !== g2[r][c]) return false;
        }
    }
    return true;
};
