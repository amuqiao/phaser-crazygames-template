import type { ScoreRepository } from '../../src/game/core/ScoreRepository.ts';

export class InMemoryScoreRepository implements ScoreRepository {
  private bestScore = 0;
  private runsPlayed = 0;

  loadBestScore(): number {
    return this.bestScore;
  }

  saveBestScore(score: number): void {
    this.bestScore = score;
  }

  loadRunsPlayed(): number {
    return this.runsPlayed;
  }

  saveRunsPlayed(runs: number): void {
    this.runsPlayed = runs;
  }
}

