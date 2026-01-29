# Carcassonne Score Tracker

A React app to quickly and easily input scores while playing the Carcassonne tile board game.

## Features

- **Start Screen**: Simple start screen with "New Game" and "Leaderboard" buttons
- **Player Input Screen**: Add and manage players for your game
  - Add players using the + button
  - Remove players using the - button (minimum 1 player)
  - Enter player names
  - Select from standard Carcassonne player colors (Red, Blue, Yellow, Green, Black, Gray)
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
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

Build the app for production:
```bash
npm run build
```

The build process creates a fully static application in the `dist/` folder that can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, AWS S3, etc.).

#### Static Deployment

The app is configured to work as a static application with:
- **Relative paths**: All assets use relative paths for flexible deployment
- **Client-side routing**: All navigation happens on the client side
- **Local storage**: Game data persists in the browser's local storage
- **No server required**: The app runs entirely in the browser

To preview the production build locally:
```bash
npm run preview
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
