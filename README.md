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
A React app to quickly and easily input scores while playing the Carcassonne tile board game.

## Features

- **Start Screen**: Simple start screen with a start button to begin the game
- **Player Input Screen**: Add and manage players for your game
  - Add players using the + button
  - Remove players using the - button (minimum 1 player)
  - Enter player names
  - Select from standard Carcassonne player colors (Red, Blue, Yellow, Green, Black, Gray)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build

### Running the App

Start the development server:
```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000).

### Building for Production

Build the app for production:
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

## Usage

1. Click "Start Game" on the start screen
2. Add players by clicking the "+ Add Player" button
3. Enter each player's name
4. Select a color for each player from the dropdown
5. Remove the last player if needed using the "- Remove Player" button

## Future Enhancements

- Score tracking screen
- Game history
- Multiple game sessions
- Statistics and analytics
