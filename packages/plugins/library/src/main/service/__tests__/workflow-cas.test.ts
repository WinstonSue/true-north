import assert from 'node:assert/strict';
import test from 'node:test';
import { decideCreateBookmark } from '../workflow-cas.ts';

test('createBookmark requires title and url', () => {
  const missing = decideCreateBookmark({});
  const missingUrl = decideCreateBookmark({ title: '文档' });
  const ok = decideCreateBookmark({ title: '文档', url: 'https://example.com' });
  assert.equal('proceed' in missing, false);
  assert.equal('proceed' in missingUrl, false);
  assert.equal('proceed' in ok, true);
});
