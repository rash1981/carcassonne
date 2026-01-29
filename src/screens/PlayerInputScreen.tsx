import React, { useState } from 'react';
import { Button, Input, ColorPicker, List, Space, Typography, message } from 'antd';
import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';
import type { Player } from '../types';

const { Title } = Typography;

interface PlayerInputScreenProps {
  onStartGame: (players: Player[]) => void;
  onBack: () => void;
}

const PlayerInputScreen: React.FC<PlayerInputScreenProps> = ({ onStartGame, onBack }) => {
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState<string>('#1677ff');
  const [players, setPlayers] = useState<Player[]>([]);

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

    setPlayers([...players, newPlayer]);
    setPlayerName('');
    setPlayerColor('#1677ff');
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

  const handleColorChange = (color: Color) => {
    setPlayerColor(color.toHexString());
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
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Player name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onPressEnter={handleAddPlayer}
            style={{ flex: 1 }}
          />
          <ColorPicker
            value={playerColor}
            onChange={handleColorChange}
          />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddPlayer}
          >
            Add
          </Button>
        </Space.Compact>

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
