import React from 'react';
import './PlayerInput.css';

function PlayerInput({ player, index, onNameChange, onColorChange }) {
  // Standard Carcassonne player colors
  const colors = [
    { name: 'Red', value: '#E53935' },
    { name: 'Blue', value: '#1E88E5' },
    { name: 'Yellow', value: '#FDD835' },
    { name: 'Green', value: '#43A047' },
    { name: 'Black', value: '#212121' },
    { name: 'Gray', value: '#757575' }
  ];

  return (
    <div className="player-input">
      <div className="player-number">Player {index + 1}</div>
      <input
        type="text"
        className="player-name-input"
        placeholder="Enter player name"
        value={player.name}
        onChange={(e) => onNameChange(index, e.target.value)}
      />
      <div className="color-selector">
        <label>Color:</label>
        <select
          className="color-select"
          value={player.color}
          onChange={(e) => onColorChange(index, e.target.value)}
          style={{ backgroundColor: player.color }}
        >
          <option value="">Select color</option>
          {colors.map(color => (
            <option 
              key={color.value} 
              value={color.value}
              style={{ backgroundColor: color.value }}
            >
              {color.name}
            </option>
          ))}
        </select>
        <div 
          className="color-preview" 
          style={{ backgroundColor: player.color || '#ddd' }}
        />
      </div>
    </div>
  );
}

export default PlayerInput;
