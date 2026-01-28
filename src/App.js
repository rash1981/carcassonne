import React, { useState } from 'react';
import StartScreen from './StartScreen';
import PlayerInputScreen from './PlayerInputScreen';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');

  const handleStart = () => {
    setCurrentScreen('playerInput');
  };

  return (
    <div className="App">
      {currentScreen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      {currentScreen === 'playerInput' && (
        <PlayerInputScreen />
      )}
    </div>
  );
}

export default App;
