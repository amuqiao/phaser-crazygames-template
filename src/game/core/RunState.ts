import { COLLECTIBLE, HAZARD, RUN } from '../tuning.ts';
import type { ScoreRepository } from './ScoreRepository.ts';

export interface FinishResult {
  score: number;
  bestScore: number;
  previousBest: number;
  isNewBest: boolean;
  runsPlayed: number;
  survivedMs: number;
  progress: number;
  progressSaved: boolean;
  saveErrorMessage?: string;
}

export class RunState {
  private readonly scores: ScoreRepository;
  private scoreValue = 0;
  private elapsedValue = 0;
  private bestScoreValue: number;
  private initialLoadErrorMessage: string | undefined;

  constructor(scores: ScoreRepository) {
    this.scores = scores;
    try {
      this.bestScoreValue = scores.loadBestScore();
    } catch (error) {
      this.initialLoadErrorMessage = error instanceof Error ? error.message : String(error);
      this.bestScoreValue = 0;
    }
  }

  get score(): number {
    return this.scoreValue;
  }

  get elapsedMs(): number {
    return this.elapsedValue;
  }

  get progress(): number {
    return Math.max(0, Math.min(1, this.elapsedValue / RUN.durationMs));
  }

  get complete(): boolean {
    return this.elapsedValue >= RUN.durationMs;
  }

  collect(): void {
    this.scoreValue += COLLECTIBLE.score;
  }

  hitHazard(): void {
    this.scoreValue = Math.max(0, this.scoreValue - HAZARD.scorePenalty);
  }

  tick(deltaMs: number): void {
    this.elapsedValue += Math.max(0, deltaMs);
  }

  finish(): FinishResult {
    const previousBest = this.bestScoreValue;
    const isNewBest = this.scoreValue > previousBest;
    const bestScore = isNewBest ? this.scoreValue : previousBest;
    let runsPlayed = 0;
    let saveErrorMessage = this.initialLoadErrorMessage;

    try {
      runsPlayed = this.scores.loadRunsPlayed() + 1;
      if (isNewBest) {
        this.scores.saveBestScore(bestScore);
        this.bestScoreValue = bestScore;
      }
      this.scores.saveRunsPlayed(runsPlayed);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      saveErrorMessage = saveErrorMessage ? `${saveErrorMessage}; ${message}` : message;
    }

    return {
      score: this.scoreValue,
      bestScore,
      previousBest,
      isNewBest,
      runsPlayed,
      survivedMs: Math.min(this.elapsedValue, RUN.durationMs),
      progress: this.progress,
      progressSaved: saveErrorMessage === undefined,
      saveErrorMessage,
    };
  }
}
