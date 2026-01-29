import React from 'react';
import './StartScreen.css';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>Carcassonne Score Tracker</h1>
      <p>Welcome to the Carcassonne scoring app!</p>
      <button className="start-button" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}

export default StartScreen;
