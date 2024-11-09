import { test, expect } from 'vitest';
import * as lib from './index';

test('multiply()', async () => {
  const instance = await lib.initialize();
  expect(instance.exports.multiply(8)).toEqual(8n * 7n);
});
