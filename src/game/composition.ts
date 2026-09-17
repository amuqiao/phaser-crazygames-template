import { STORAGE_KEYS } from './keys';
import type { ScoreRepository } from './core/ScoreRepository';
import { platform } from '../platform';

const STORAGE_CHECK_KEY = `${STORAGE_KEYS.runsPlayed}.storageCheck`;

export function assertScorePersistenceAvailable(): void {
  const marker = `ok-${Date.now()}`;
  platform().save(STORAGE_CHECK_KEY, marker);
  const saved = platform().load(STORAGE_CHECK_KEY);
  if (saved !== marker) {
    throw new Error('Score persistence check failed. Save/load returned inconsistent data.');
  }
}

class PlatformScoreRepository implements ScoreRepository {
  loadBestScore(): number {
    return Number.parseInt(platform().load(STORAGE_KEYS.bestScore) ?? '0', 10) || 0;
  }

  saveBestScore(score: number): void {
    platform().save(STORAGE_KEYS.bestScore, String(score));
  }

  loadRunsPlayed(): number {
    return Number.parseInt(platform().load(STORAGE_KEYS.runsPlayed) ?? '0', 10) || 0;
  }

  saveRunsPlayed(runs: number): void {
    platform().save(STORAGE_KEYS.runsPlayed, String(runs));
  }
}

export const scores: ScoreRepository = new PlatformScoreRepository();
