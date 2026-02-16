import { LEVELS } from '../data/levels.js';
import { solveTango } from './solveTango.js';
import { CELL_STATES, GRID_SIZE } from './constants.js';

console.log("Starting Level Audit...");

LEVELS.forEach((level, index) => {
    console.log(`\nAuditing Level ${index + 1}...`);

    // 1. Solve
    const solution = solveTango(level.initialGrid, level.constraints);

    if (!solution) {
        console.error(`❌ Level ${index + 1}: NO SOLUTION FOUND!`);
        return;
    }

    console.log(`✅ Level ${index + 1}: Solution Found.`);

    // 2. Validate Balance (3 Suns, 3 Moons)
    let balanced = true;
    for (let i = 0; i < GRID_SIZE; i++) {
        let rS = 0, rM = 0, cS = 0, cM = 0;
        for (let j = 0; j < GRID_SIZE; j++) {
            if (solution[i][j] === CELL_STATES.SUN) rS++; else rM++;
            if (solution[j][i] === CELL_STATES.SUN) cS++; else cM++;
        }
        if (rS !== 3 || rM !== 3) { console.error(`❌ Row ${i} Imbalanced: ${rS}S/${rM}M`); balanced = false; }
        if (cS !== 3 || cM !== 3) { console.error(`❌ Col ${i} Imbalanced: ${cS}S/${cM}M`); balanced = false; }
    }
    if (balanced) console.log(`✅ Level ${index + 1}: Perfectly Balanced.`);

    // 3. Validate Adjacency
    let validAdj = true;
    // (Solver should guarantee this, but double check)
    // ...
});
