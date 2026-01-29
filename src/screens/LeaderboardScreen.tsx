import React, { useState } from 'react';
import { Button, Table, Typography, Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { getLeaderboard } from '../utils/storage';
import type { ColumnsType } from 'antd/es/table';
import type { LeaderboardEntry } from '../types';
import BluetoothSyncButton from '../components/BluetoothSyncButton';

const { Title } = Typography;

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());

  const handleSyncComplete = () => {
    // Refresh leaderboard after sync
    setLeaderboard(getLeaderboard());
  };

  const columns: ColumnsType<LeaderboardEntry> = [
    {
      title: 'Rank',
      key: 'rank',
      render: (_text, _record, index) => {
        const rank = index + 1;
        return (
          <span>
            {rank === 1 && '🥇 '}
            {rank === 2 && '🥈 '}
            {rank === 3 && '🥉 '}
            {rank > 3 && `${rank}. `}
          </span>
        );
      },
      width: 80,
    },
    {
      title: 'Player',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span style={{ fontWeight: 'bold' }}>{name}</span>,
    },
    {
      title: 'Wins',
      dataIndex: 'wins',
      key: 'wins',
      render: (wins: number) => (
        <span>
          <TrophyOutlined style={{ marginRight: '8px', color: '#faad14' }} />
          {wins}
        </span>
      ),
      align: 'right' as const,
      width: 120,
    },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <Title level={2}>
        <TrophyOutlined style={{ marginRight: '12px' }} />
        Leaderboard
      </Title>
      
      <Table
        columns={columns}
        dataSource={leaderboard}
        pagination={false}
        style={{ width: '100%', marginTop: '20px' }}
        rowKey="name"
        locale={{ emptyText: 'No games played yet. Start a new game to see the leaderboard!' }}
      />

      <Space style={{ marginTop: '20px' }}>
        <Button
          type="primary"
          onClick={onBack}
        >
          Back to Start
        </Button>
        <BluetoothSyncButton onSyncComplete={handleSyncComplete} />
      </Space>
    </div>
  );
};

export default LeaderboardScreen;
