import { strict as assert } from 'node:assert';
import test from 'node:test';
import { RUN } from '../src/game/tuning.ts';
import { RunState } from '../src/game/core/RunState.ts';
import { InMemoryScoreRepository } from './fakes/InMemoryScoreRepository.ts';

class ThrowingLoadBestScoreRepository extends InMemoryScoreRepository {
  override loadBestScore(): number {
    throw new Error('best score load failed');
  }
}

class ThrowingSaveRepository extends InMemoryScoreRepository {
  override saveRunsPlayed(_runs: number): void {
    throw new Error('storage disabled');
  }
}

class ThrowingLoadRunsRepository extends InMemoryScoreRepository {
  override loadRunsPlayed(): number {
    throw new Error('load failed');
  }
}

test('collecting items increases score', () => {
  const state = new RunState(new InMemoryScoreRepository());
  state.collect();
  state.collect();
  assert.equal(state.score, 20);
});

test('hazard penalty never makes score negative', () => {
  const state = new RunState(new InMemoryScoreRepository());
  state.hitHazard();
  assert.equal(state.score, 0);
});

test('finish writes a new best score and preserves previous best', () => {
  const repo = new InMemoryScoreRepository();
  repo.saveBestScore(10);
  const state = new RunState(repo);
  state.collect();
  state.collect();

  const result = state.finish();

  assert.equal(result.isNewBest, true);
  assert.equal(result.previousBest, 10);
  assert.equal(result.bestScore, 20);
  assert.equal(result.progressSaved, true);
  assert.equal(repo.loadBestScore(), 20);
});

test('finish increments runs played', () => {
  const repo = new InMemoryScoreRepository();
  new RunState(repo).finish();
  const second = new RunState(repo).finish();
  assert.equal(second.runsPlayed, 2);
  assert.equal(second.progressSaved, true);
  assert.equal(repo.loadRunsPlayed(), 2);
});

test('finish returns a visible unsaved result when best score load fails', () => {
  const state = new RunState(new ThrowingLoadBestScoreRepository());
  state.collect();

  const result = state.finish();

  assert.equal(result.score, 10);
  assert.equal(result.bestScore, 10);
  assert.equal(result.progressSaved, false);
  assert.equal(result.saveErrorMessage, 'best score load failed');
});

test('finish returns a visible unsaved result when persistence save fails', () => {
  const state = new RunState(new ThrowingSaveRepository());
  state.collect();

  const result = state.finish();

  assert.equal(result.score, 10);
  assert.equal(result.runsPlayed, 1);
  assert.equal(result.progressSaved, false);
  assert.equal(result.saveErrorMessage, 'storage disabled');
});

test('finish returns a visible unsaved result when persistence read fails', () => {
  const state = new RunState(new ThrowingLoadRunsRepository());
  state.collect();

  const result = state.finish();

  assert.equal(result.score, 10);
  assert.equal(result.runsPlayed, 0);
  assert.equal(result.progressSaved, false);
  assert.equal(result.saveErrorMessage, 'load failed');
});

test('progress is clamped to one', () => {
  const state = new RunState(new InMemoryScoreRepository());
  state.tick(RUN.durationMs * 2);
  assert.equal(state.progress, 1);
  assert.equal(state.complete, true);
});
