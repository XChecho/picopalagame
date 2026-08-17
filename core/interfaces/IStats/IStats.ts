export interface IPlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  bestScore: number;
  currentStreak: number;
  bestStreak: number;
  avgTimePerGame: number;
  totalPicos: number;
  totalPalas: number;
}

export interface ISyncStatsRequest {
  wins: number;
  losses: number;
  draws: number;
  totalPicos: number;
  totalPalas: number;
}
