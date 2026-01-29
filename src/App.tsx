import { useState } from 'react';
import StartScreen from './screens/StartScreen';
import PlayerInputScreen from './screens/PlayerInputScreen';
import ScoreEntryScreen from './screens/ScoreEntryScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import type { Player } from './types';

type Screen = 'start' | 'playerInput' | 'scoreEntry' | 'leaderboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('start');
  const [players, setPlayers] = useState<Player[]>([]);

  const handleNewGame = () => {
    setCurrentScreen('playerInput');
  };

  const handleLeaderboard = () => {
    setCurrentScreen('leaderboard');
  };

  const handleStartGame = (gamePlayers: Player[]) => {
    setPlayers(gamePlayers);
    setCurrentScreen('scoreEntry');
  };

  const handleEndGame = () => {
    setCurrentScreen('start');
    setPlayers([]);
  };

  const handleBack = () => {
    setCurrentScreen('start');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {currentScreen === 'start' && (
        <StartScreen
          onNewGame={handleNewGame}
          onLeaderboard={handleLeaderboard}
        />
      )}
      {currentScreen === 'playerInput' && (
        <PlayerInputScreen
          onStartGame={handleStartGame}
          onBack={handleBack}
        />
      )}
      {currentScreen === 'scoreEntry' && (
        <ScoreEntryScreen
          initialPlayers={players}
          onEndGame={handleEndGame}
        />
      )}
      {currentScreen === 'leaderboard' && (
        <LeaderboardScreen
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
