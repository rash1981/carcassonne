import React, { useState, useMemo } from 'react';
import { Button, AutoComplete, List, Space, Typography, message } from 'antd';
import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import type { Player } from '../types';
import { getPlayerNames } from '../utils/storage';

const { Title } = Typography;

// Standard Carcassonne player colors
const CARCASSONNE_COLORS = [
  { name: 'Red', value: '#E74C3C' },
  { name: 'Blue', value: '#3498DB' },
  { name: 'Yellow', value: '#F1C40F' },
  { name: 'Green', value: '#27AE60' },
  { name: 'Black', value: '#2C3E50' },
  { name: 'Gray', value: '#95A5A6' },
];

interface PlayerInputScreenProps {
  onStartGame: (players: Player[]) => void;
  onBack: () => void;
}

const PlayerInputScreen: React.FC<PlayerInputScreenProps> = ({ onStartGame, onBack }) => {
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState<string>(CARCASSONNE_COLORS[0].value);
  const [players, setPlayers] = useState<Player[]>([]);
  
  // Get autocomplete options from stored player names, excluding already picked players
  const autocompleteOptions = useMemo(() => {
    return getPlayerNames()
      .filter(name => !players.some(p => p.name.toLowerCase() === name.toLowerCase()))
      .map(name => ({ value: name }));
  }, [players]);

  const handleAddPlayer = () => {
    if (!playerName.trim()) {
      message.warning('Please enter a player name');
      return;
    }

    if (players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      message.warning('Player name already exists');
      return;
    }

    const newPlayer: Player = {
      name: playerName.trim(),
      color: playerColor,
      score: 0,
    };

    const updatedPlayers = [...players, newPlayer];
    setPlayers(updatedPlayers);
    setPlayerName('');
    // Select next available color that's not already used
    const usedColors = updatedPlayers.map(p => p.color);
    const nextColor = CARCASSONNE_COLORS.find(c => !usedColors.includes(c.value));
    setPlayerColor(nextColor ? nextColor.value : CARCASSONNE_COLORS[0].value);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      message.warning('Please add at least 2 players');
      return;
    }
    onStartGame(players);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <Title level={2}>Add Players</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '20px' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <AutoComplete
            placeholder="Player name"
            value={playerName}
            onChange={setPlayerName}
            options={autocompleteOptions}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddPlayer();
              }
            }}
            style={{ width: '100%' }}
            filterOption={(inputValue, option) =>
              option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
          <div>
            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
              Select Color:
            </div>
            <div role="radiogroup" aria-label="Player color selection">
              <Space wrap>
                {CARCASSONNE_COLORS.map((color) => (
                  <div
                    key={color.value}
                    role="radio"
                    aria-checked={playerColor === color.value}
                    aria-label={color.name}
                    tabIndex={0}
                    onClick={() => setPlayerColor(color.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setPlayerColor(color.value);
                      }
                    }}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: color.value,
                      borderRadius: '4px',
                      border: playerColor === color.value ? '3px solid #1890ff' : '2px solid #d9d9d9',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: playerColor === color.value ? '0 0 8px rgba(24, 144, 255, 0.5)' : 'none',
                    }}
                    title={color.name}
                  />
                ))}
              </Space>
            </div>
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddPlayer}
            block
          >
            Add Player
          </Button>
        </Space>

        {players.length > 0 && (
          <List
            bordered
            dataSource={players}
            renderItem={(player, index) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemovePlayer(index)}
                  />
                ]}
              >
                <Space>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: player.color,
                      borderRadius: '4px',
                      border: '1px solid #d9d9d9'
                    }}
                  />
                  <span style={{ fontWeight: 'bold' }}>{player.name}</span>
                </Space>
              </List.Item>
            )}
          />
        )}

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button onClick={onBack}>Back</Button>
          <Button
            type="primary"
            onClick={handleStartGame}
            disabled={players.length < 2}
          >
            Start Game
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default PlayerInputScreen;
