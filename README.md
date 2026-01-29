# Carcassonne Score Tracker

A React app to quickly and easily input scores while playing the Carcassonne tile board game.

🎮 **[Live Demo](https://rash1981.github.io/carcassonne/)** - Try it out on GitHub Pages!

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
- **Multi-Device Sync**: Synchronize game data across multiple devices without internet
  - **QR Code Sync**: Works on ALL devices (iOS, Android) and browsers (Safari, Firefox, Chrome)
  - **Bluetooth Sync**: Available on Chrome/Edge browsers for faster wireless sync
  - **Automatic Conflict Resolution**: Merges game data without duplicates

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

#### GitHub Pages Deployment

This repository is configured with GitHub Actions to automatically build and deploy to GitHub Pages:

- **Automatic Deployment**: Every push to the `main` branch triggers a build and deployment
- **Live URL**: https://rash1981.github.io/carcassonne/
- **Manual Trigger**: You can also manually trigger deployment from the Actions tab

The deployment workflow is located at `.github/workflows/deploy.yml`.

#### Static Deployment

The app is configured to work as a static application with:
- **Flexible paths**: Uses absolute paths (`/carcassonne/`) for GitHub Pages and relative paths for other deployments
- **Client-side navigation**: All navigation happens on the client side using React state
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

### Multi-Device Synchronization

Sync game data across multiple devices without an internet connection:

#### QR Code Sync (Recommended for iOS/Safari)
1. On **Device A**: Click the "Sync" button and select "Show QR Code"
2. On **Device B**: Click the "Sync" button and select "Scan QR Code"
3. Point Device B's camera at the QR code on Device A
4. Game data is automatically imported and merged

**Works on:** All devices and browsers including iOS Safari, Firefox, Chrome, Edge

#### Bluetooth Sync (Chrome/Edge only)
1. Ensure both devices have Bluetooth enabled
2. On both devices, open the app and click "Sync"
3. On **Device A**: Click "Connect to Device" and select Device B
4. Click "Sync Data" to exchange game history
5. Games are automatically merged without duplicates

**Works on:** Chrome and Edge browsers on Android and Desktop
**Note:** NOT supported on iOS Safari or Firefox

#### Browser Compatibility

| Feature | Chrome (Android/Desktop) | Edge (Desktop) | Safari (iOS/macOS) | Firefox |
|---------|-------------------------|----------------|-------------------|---------|
| QR Code Sync | ✅ Full Support | ✅ Full Support | ✅ Full Support | ✅ Full Support |
| Bluetooth Sync | ✅ Full Support | ✅ Full Support | ❌ Not Supported | ❌ Not Supported |

### Data Privacy

- All game data is stored locally on your device
- Bluetooth and QR code sync only transfers data directly between your devices
- No data is sent to any servers or third parties
- You have full control over when and with whom you share your data
