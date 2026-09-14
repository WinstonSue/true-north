import assert from 'node:assert/strict';
import test from 'node:test';
import { unexpectedRuntimeFailure } from '../runtime-exit.ts';

test('zero exit is success', () => {
  assert.equal(unexpectedRuntimeFailure(0, 'ignored'), null);
});

test('nonzero exit uses stderr or a fallback', () => {
  assert.equal(unexpectedRuntimeFailure(1, ' boom \n'), 'boom');
  assert.equal(unexpectedRuntimeFailure(2, ''), '编码 Agent 退出异常');
});

test('null exit is a failure even without stderr', () => {
  assert.equal(unexpectedRuntimeFailure(null, ''), '编码 Agent 异常结束');
  assert.equal(unexpectedRuntimeFailure(null, 'killed'), 'killed');
});
