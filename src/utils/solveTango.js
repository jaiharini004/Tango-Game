import { CELL_STATES, GRID_SIZE } from './constants';

const EMP = CELL_STATES.EMPTY;
const SUN = CELL_STATES.SUN;
const MOON = CELL_STATES.MOON;

export const solveTango = (initialGrid, constraints) => {
    // Clone grid
    const grid = initialGrid.map(row => [...row]);

    if (solve(grid, 0, 0, constraints)) {
        return grid;
    }
    return null; // No solution
};

const solve = (grid, r, c, constraints) => {
    if (r === GRID_SIZE) return true; // Reached end

    const nextR = c === GRID_SIZE - 1 ? r + 1 : r;
    const nextC = c === GRID_SIZE - 1 ? 0 : c + 1;

    // If cell is pre-filled, strictly validate it and move on
    if (grid[r][c] !== EMP) {
        if (isValid(grid, r, c, grid[r][c], constraints)) {
            return solve(grid, nextR, nextC, constraints);
        }
        return false;
    }

    // Try SUN then MOON
    for (const val of [SUN, MOON]) {
        if (isValid(grid, r, c, val, constraints)) {
            grid[r][c] = val;
            if (solve(grid, nextR, nextC, constraints)) return true;
            grid[r][c] = EMP; // Backtrack
        }
    }

    return false;
};

const isValid = (grid, r, c, val, constraints) => {
    // 1. Adjacency: No 3 same
    // Check Row (Left)
    if (c >= 2) {
        if (grid[r][c - 1] === val && grid[r][c - 2] === val) return false;
    }
    // Check Col (Top)
    if (r >= 2) {
        if (grid[r - 1][c] === val && grid[r - 2][c] === val) return false;
    }
    // Note: We traverse Top->Bottom, Left->Right, so we only check 'backwards' (Left/Top).
    // EXCEPT: If we are filling a blank in a "pre-filled" sea (rare in solver, but possible), we might need forward checks.
    // Our solver fills sequentially, so backward checks are sufficient for "No 3 in a row created *so far*".
    // Wait, if grid has pre-filled items "ahead", we must check those too? 
    // Yes. The 'initialGrid' might have gaps. The solver fills holes.
    // So we should check neighbors in all directions?
    // Actually, simple forward check:
    if (c <= GRID_SIZE - 3 && grid[r][c + 1] === val && grid[r][c + 2] === val) return false;
    if (c >= 1 && c <= GRID_SIZE - 2 && grid[r][c - 1] === val && grid[r][c + 1] === val) return false; // Middle

    if (r <= GRID_SIZE - 3 && grid[r + 1][c] === val && grid[r + 2][c] === val) return false;
    if (r >= 1 && r <= GRID_SIZE - 2 && grid[r - 1][c] === val && grid[r + 1][c] === val) return false; // Middle

    // 2. Balance: Max 3 of same kind per row/col
    const limit = GRID_SIZE / 2;
    let rowCount = 0;
    for (let i = 0; i < GRID_SIZE; i++) if (grid[r][i] === val) rowCount++;
    if (rowCount > limit) return false; // Note: Current cell is not yet 'set' in grid[r][c] physically when calling isValid? 
    // Ah, my solver sets `grid[r][c] = val` *inside* the loop? No, it calls `isValid` *before* setting.
    // So current cell is technically 'Virtual'.
    // rowCount counts existing. If existing is 3, and we add 1 -> 4 -> Invalid. Correct.
    if (grid[r][c] === val) rowCount--; // If we iterate and count self (because pre-filled case might need care)

    let colCount = 0;
    for (let i = 0; i < GRID_SIZE; i++) if (grid[i][c] === val) colCount++;
    if (colCount > limit) return false;

    // 3. Constraints
    // Find constraints involving (r, c)
    for (const k of constraints) {
        // If (r,c) is the 'First' or 'Second' cell in constraint
        let r2 = k.row, c2 = k.col;
        if (k.type === 'RIGHT') c2 += 1;
        if (k.type === 'BOTTOM') r2 += 1;

        let otherVal = null;
        if (k.row === r && k.col === c) { // We are 'First'
            otherVal = grid[r2][c2];
        } else if (r2 === r && c2 === c) { // We are 'Second'
            otherVal = grid[k.row][k.col]; // First
        }

        if (otherVal && otherVal !== EMP) {
            if (k.relation === 'EQUAL' && val !== otherVal) return false;
            if (k.relation === 'OPPOSITE' && val === otherVal) return false;
        }
    }

    return true;
};
