import { CELL_STATES } from '../utils/constants';

const E = CELL_STATES.EMPTY;
const S = CELL_STATES.SUN;
const M = CELL_STATES.MOON;

export const LEVELS = [
    {
        id: 1,
        // Solution:
        // S M S M S M
        // M S M S M S
        // S M S M S M
        // M S M S M S
        // S M S M S M
        // M S M S M S
        initialGrid: [
            [S, E, S, E, E, E],
            [E, E, M, E, E, S],
            [E, M, E, E, E, E],
            [M, E, E, E, E, E],
            [E, E, E, E, S, E],
            [E, E, E, E, E, E],
        ],
        constraints: [
            { row: 0, col: 0, type: 'RIGHT', relation: 'OPPOSITE' },
            { row: 3, col: 0, type: 'BOTTOM', relation: 'OPPOSITE' },
        ]
    },
    {
        id: 2,
        // Solution:
        // M M S S M S
        // S S M M S M
        // M M S S M S
        // S S M M S M
        // M S M S S M
        // S M S M M S
        initialGrid: [
            [M, E, E, S, E, E],
            [E, E, E, E, E, M],
            [E, M, E, S, E, E],
            [E, E, E, E, E, E],
            [E, S, E, S, S, E],
            [S, E, E, E, E, E],
        ],
        constraints: [
            { row: 0, col: 1, type: 'RIGHT', relation: 'OPPOSITE' },
            { row: 5, col: 4, type: 'RIGHT', relation: 'OPPOSITE' },
        ]
    },
    {
        id: 3,
        // Custom valid
        initialGrid: [
            [E, S, E, E, M, E],
            [E, E, E, S, E, E],
            [M, E, E, E, E, S],
            [E, E, S, E, M, E],
            [S, E, E, E, E, E],
            [E, M, E, E, S, E],
        ],
        constraints: [
            { row: 0, col: 0, type: 'RIGHT', relation: 'OPPOSITE' },
            { row: 2, col: 2, type: 'BOTTOM', relation: 'EQUAL' },
        ]
    },
    {
        id: 4,
        initialGrid: [
            [E, E, M, M, E, E],
            [S, E, E, E, E, S],
            [E, M, E, E, S, E],
            [E, S, E, E, M, E],
            [M, E, E, E, E, M],
            [E, E, S, S, E, E],
        ],
        constraints: [
            { row: 0, col: 2, type: 'RIGHT', relation: 'EQUAL' },
            { row: 1, col: 0, type: 'BOTTOM', relation: 'OPPOSITE' },
        ]
    },
    {
        id: 5,
        initialGrid: [
            [S, S, E, E, M, M],
            [E, E, E, E, E, E],
            [E, E, S, S, E, E],
            [E, E, M, M, E, E],
            [M, M, E, E, S, S],
            [E, E, E, E, E, E],
        ],
        constraints: [
            { row: 0, col: 1, type: 'RIGHT', relation: 'OPPOSITE' },
        ]
    }
];

export const LEVEL_1 = LEVELS[0];
