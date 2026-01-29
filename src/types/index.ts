export interface Player {
  name: string;
  color: string;
  score: number;
}

export interface GameResult {
  players: Player[];
  date: string;
  winner: string[];
}

export interface LeaderboardEntry {
  name: string;
  wins: number;
}
