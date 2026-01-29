import React, { useState } from 'react';
import PlayerInput from './PlayerInput';
import './PlayerInputScreen.css';

function PlayerInputScreen() {
  const [players, setPlayers] = useState([
    { name: '', color: '' }
  ]);

  const handleAddPlayer = () => {
    setPlayers([...players, { name: '', color: '' }]);
  };

  const handleRemovePlayer = () => {
    if (players.length > 1) {
      setPlayers(players.slice(0, -1));
    }
  };

  const handleNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const handleColorChange = (index, color) => {
    const newPlayers = [...players];
    newPlayers[index].color = color;
    setPlayers(newPlayers);
  };

  return (
    <div className="player-input-screen">
      <div className="container">
        <h1>Add Players</h1>
        <p className="instructions">
          Add players to your game. Each player needs a name and color.
        </p>
        
        <div className="players-list">
          {players.map((player, index) => (
            <PlayerInput
              key={index}
              player={player}
              index={index}
              onNameChange={handleNameChange}
              onColorChange={handleColorChange}
            />
          ))}
        </div>

        <div className="button-group">
          <button 
            className="add-button" 
            onClick={handleAddPlayer}
          >
            + Add Player
          </button>
          <button 
            className="remove-button" 
            onClick={handleRemovePlayer}
            disabled={players.length <= 1}
          >
            - Remove Player
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayerInputScreen;
