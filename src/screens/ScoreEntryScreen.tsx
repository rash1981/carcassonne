import React, { useState } from 'react';
import { Button, Space, Typography, Card, Modal } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import type { Player, GameResult } from '../types';
import { saveGameResult } from '../utils/storage';

const { Title } = Typography;

interface ScoreEntryScreenProps {
  initialPlayers: Player[];
  onEndGame: () => void;
}

const ScoreEntryScreen: React.FC<ScoreEntryScreenProps> = ({ initialPlayers, onEndGame }) => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const handleScoreChange = (index: number, delta: number) => {
    setPlayers(prevPlayers =>
      prevPlayers.map((player, i) =>
        i === index ? { ...player, score: Math.max(0, player.score + delta) } : player
      )
    );
  };

  const handleEndGame = () => {
    const maxScore = Math.max(...players.map(p => p.score));
    const winners = players.filter(p => p.score === maxScore);
    const winnerNames = winners.map(w => w.name);

    const gameResult: GameResult = {
      players: players,
      date: new Date().toISOString(),
      winner: winnerNames,
    };

    saveGameResult(gameResult);

    Modal.success({
      title: 'Game Over!',
      content: (
        <div>
          {winners.length === 1 ? (
            <p>
              Winner: <span style={{ fontWeight: 'bold', color: winners[0].color }}>
                {winners[0].name}
              </span> with {maxScore} points!
            </p>
          ) : (
            <div>
              <p>It's a tie!</p>
              <p>Winners:</p>
              <ul>
                {winners.map((winner, idx) => (
                  <li key={idx}>
                    <span style={{ fontWeight: 'bold', color: winner.color }}>
                      {winner.name}
                    </span> with {maxScore} points
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
      onOk: onEndGame,
    });
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
      <Title level={2}>Score Tracker</Title>
      
      <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '20px' }}>
        {players.map((player, index) => (
          <Card
            key={index}
            style={{ width: '100%' }}
          >
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold', color: player.color, fontSize: '18px' }}>
                {player.name}
              </span>
              <Space size="middle">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<MinusOutlined />}
                  onClick={() => handleScoreChange(index, -1)}
                />
                <span style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '50px', textAlign: 'center' }}>
                  {player.score}
                </span>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  onClick={() => handleScoreChange(index, 1)}
                />
              </Space>
            </Space>
          </Card>
        ))}

        <Button
          type="primary"
          size="large"
          onClick={handleEndGame}
          style={{ width: '100%', marginTop: '20px' }}
        >
          End Game
        </Button>
      </Space>
    </div>
  );
};

export default ScoreEntryScreen;
