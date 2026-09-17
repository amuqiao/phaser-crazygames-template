export interface ScoreRepository {
  loadBestScore(): number;
  saveBestScore(score: number): void;
  loadRunsPlayed(): number;
  saveRunsPlayed(runs: number): void;
}

