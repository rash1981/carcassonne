import type { GameResult, LeaderboardEntry } from '../types';

const GAMES_KEY = 'carcassonne_games';

export const saveGameResult = (result: GameResult): void => {
  const games = getGameResults();
  games.push(result);
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
};

export const getGameResults = (): GameResult[] => {
  const gamesJson = localStorage.getItem(GAMES_KEY);
  return gamesJson ? JSON.parse(gamesJson) : [];
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  const games = getGameResults();
  const winCounts: { [name: string]: number } = {};

  games.forEach((game) => {
    game.winner.forEach((winnerName) => {
      winCounts[winnerName] = (winCounts[winnerName] || 0) + 1;
    });
  });

  const leaderboard = Object.entries(winCounts).map(([name, wins]) => ({
    name,
    wins,
  }));

  return leaderboard.sort((a, b) => b.wins - a.wins);
};
