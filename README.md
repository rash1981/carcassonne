# Carcassonne Score Tracker

A web application for tracking scores during Carcassonne board game sessions.

## Features

- **Player Management**: Add players with custom colors
- **Score Tracking**: Real-time score adjustment with +/- buttons
- **Game History**: Automatically saves game results to browser storage
- **Leaderboard**: View player rankings based on number of wins
- **Tie Handling**: Properly handles and displays tie scenarios

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Ant Design** for UI components
- **localStorage** for data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Usage

1. Click "New Game" on the start screen
2. Add at least 2 players with custom colors
3. Click "Start Game" to begin score tracking
4. Use +/- buttons to adjust player scores during the game
5. Click "End Game" to see the winner and save results
6. View the "Leaderboard" to see player rankings by wins

