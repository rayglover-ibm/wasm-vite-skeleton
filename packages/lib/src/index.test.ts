import { test, expect } from 'vitest';
import * as lib from './index';

const { memory, exports } = await lib.initialize();

test('multiply()', async () => {
  expect(exports.multiply(8)).toEqual(8n * 7n);
});

test('sum()', async () => {
  const N = 5;
  const xs = memory.newArray(Int32Array, N);

  for (let i = 0; i < N; i++) xs[i] = i + 1;

  const sum = exports.sumi32(memory.asPtr(xs), N);
  memory.freeArray(xs);

  expect(sum).toEqual(Math.floor(((1 + N) / 2) * N));
});
