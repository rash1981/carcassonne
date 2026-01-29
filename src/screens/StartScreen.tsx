import React, { useState } from 'react';
import { Button, Space, Typography } from 'antd';
import { TrophyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import BluetoothSyncButton from '../components/BluetoothSyncButton';

const { Title } = Typography;

interface StartScreenProps {
  onNewGame: () => void;
  onLeaderboard: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onNewGame, onLeaderboard }) => {
  const [, setRefreshKey] = useState(0);

  const handleSyncComplete = () => {
    // Trigger a refresh (though start screen doesn't display data, this ensures consistency)
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Title level={1}>Carcassonne Score Tracker</Title>
      <Space direction="vertical" size="large" style={{ marginTop: '40px' }}>
        <Button
          type="primary"
          size="large"
          icon={<PlayCircleOutlined />}
          onClick={onNewGame}
          style={{ width: '200px', height: '50px', fontSize: '18px' }}
        >
          New Game
        </Button>
        <Button
          size="large"
          icon={<TrophyOutlined />}
          onClick={onLeaderboard}
          style={{ width: '200px', height: '50px', fontSize: '18px' }}
        >
          Leaderboard
        </Button>
        <div style={{ textAlign: 'center' }}>
          <BluetoothSyncButton onSyncComplete={handleSyncComplete} />
        </div>
      </Space>
    </div>
  );
};

export default StartScreen;
