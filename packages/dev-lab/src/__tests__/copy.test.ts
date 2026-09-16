import assert from 'node:assert/strict';
import test from 'node:test';
import { toCopyJson } from '../panel/copy.ts';

test('pretty-prints objects', () => {
  assert.equal(
    toCopyJson({ method: 'POST', path: '/ai/conversations' }),
    '{\n  "method": "POST",\n  "path": "/ai/conversations"\n}',
  );
});

test('quotes strings as JSON', () => {
  assert.equal(toCopyJson('sid-1'), '"sid-1"');
});

test('maps undefined to null', () => {
  assert.equal(toCopyJson(undefined), 'null');
});

test('does not throw on circular values', () => {
  const cycle: { self?: unknown } = {};
  cycle.self = cycle;
  assert.equal(toCopyJson(cycle), '[object Object]');
});
