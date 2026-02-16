# Tango - Binary Logic Puzzle Engine

![Tango Project Banner](https://img.shields.io/badge/Status-Complete-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20ES6-orange)

**Lead Architect:** Antigravity  
**Version:** 1.0.0

## Project Overview

**Tango** is a web-based implementation of the classic binary logic puzzle (conceptually similar to *Binairo* or *0h h1*). The objective is to fill a 6x6 grid with two symbols—**Suns (Yellow)** and **Moons (Blue)**—while adhering to a strict set of logical constraints.

This project was developed as a high-fidelity Single Page Application (SPA) using React and Vite, focusing on clean architecture, real-time validation, and a polished user experience.

---

## Game Rules

The puzzle is governed by three immutable laws. A valid solution must satisfy all conditions simultaneously:

1.  **The Adjacency Rule**: No more than two identical symbols may appear consecutively in any row or column.
    *   *Valid:* `Sun, Sun, Moon`
    *   *Invalid:* `Sun, Sun, Sun` (Triggers Red Alert)

2.  **The Balance Rule**: Each row and each column must contain an equal number of Suns and Moons.
    *   *Target:* 3 Suns and 3 Moons per line (in a 6x6 grid).

3.  **The Constraint Rule ('X')**: Certain cells are separated by a small 'X' marker.
    *   These markers indicate that the two adjacent cells must contain **opposite** symbols.
    *   *Example:* If Cell A is `Sun` and has an 'X' connection to Cell B, Cell B *must* be `Moon`.

---

## Technical Stack

This project is built on a modern, lightweight frontend stack designed for performance and maintainability.

*   **Core Framework**: React 18 (Functional Components, Hooks)
*   **Build Tool**: Vite (Fast HMR, Optimized Bundling)
*   **Language**: JavaScript (ES6+)
*   **Styling**: CSS3 (CSS Variables for theming, Flexbox for layout)
*   **State Management**: `useTangoGame` Custom Hook (Centralized Game Logic)
*   **Assets**: Pure CSS shapes (no external image assets required)

**Architecture Note**: The game logic is decoupled from the UI. The `useTangoGame` hook manages the entire state machine (grid, constraints, violations, timer, win-state), while pure functional components (`Grid`, `Cell`) simply render the current state.

---

## Development Roadmap (The 6 Phases)

The project was executed in six distinct, verifiable phases to ensure logical integrity at every step:

| Phase | Objective | Deliverables |
| :--- | :--- | :--- |
| **Phase 1** | **Grid Architecture** | 6x6 Data Structure, Component Rendering, Cell Interaction (Empty -> Sun -> Moon cycle). |
| **Phase 2** | **Static Constraints** | Implementation of 'X' markers as a data layer overlaying the grid. |
| **Phase 3** | **Adjacency Logic** | Real-time validation algorithm to detect triples (3-in-a-row). Visual feedback implementation. |
| **Phase 4** | **Balance Logic** | Row/Column counting algorithms. merged validation to flag rows with >3 of a symbol. |
| **Phase 5** | **Level Initialization** | 'Locked Cell' system for immutable starting states. Level data structure integration. |
| **Phase 6** | **Game Loop & Polish** | Win condition detection, Timer implementation, Victory Modal, and UI refinement. |

---

## Installation & How to Run

This project requires a standard Node.js environment.

### 1. Prerequisites
Ensure you have **Node.js** (v14 or higher) and **npm** installed.

### 2. Setup
Clone the repository (or navigate to the project directory) and install dependencies:

```bash
cd tango-game
npm install
```

### 3. Run Locally
Start the development server:

```bash
npm run dev
```

Open your browser to the local URL (usually `http://localhost:5173`).

### 4. Build for Production
To create an optimized static build:

```bash
npm run build
```
The output will be in the `dist/` folder, ready for deployment to any static host (Netlify, Vercel, GitHub Pages).

---

## Controls & Gameplay

*   **Interaction**: Click (or Tap) on any empty cell to cycle its state:
    1.  **Empty** (Neutral)
    2.  **Sun** (Yellow)
    3.  **Moon** (Blue)
    4.  *Back to Empty*
*   **Locked Cells**: Cells that are pre-filled at the start of the level are **Locked**. They appear darker and cannot be changed.
*   **Validation**: The game validates your moves in real-time.
    *   **Red Glow**: Indicates a violation (either 3-in-a-row or too many of one symbol in a line). You must correct these to win.
*   **Winning**: The game ends when:
    1.  The grid is completely full.
    2.  No rule violations exist.

---

## Code Structure

A brief overview of the key directories and files:

```
src/
├── components/
│   ├── Cell.jsx           # Renders individual tile (Sun/Moon/Empty/Locked)
│   ├── Grid.jsx           # Renders the 6x6 board and Constraint Markers
│   ├── ConstraintMarker.jsx # Visual 'X' element
│   └── WinModal.jsx       # Victory overlay
├── data/
│   └── levels.js          # Configuration for puzzle levels (Initial State & Constraints)
├── hooks/
│   └── useTangoGame.js    # THE BRAIN. Contains all logic:
│                          # - Validation Algorithms (Adjacency, Balance)
│                          # - State Management (Grid, Timer, Game Status)
│                          # - Helper functions (toggleCell, resetGrid)
├── App.jsx                # Main layout and composition
├── index.css              # Global styles, Variables, and Animations
└── main.jsx               # Entry point
```

---

*Verified by Antigravity - Senior Game Systems Architect*
