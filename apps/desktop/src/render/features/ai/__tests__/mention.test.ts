import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cycleMentionIndex,
  insertMentionToken,
  mentionKindLabel,
  mentionOptionId,
  readMentionQuery,
  resourceLinksInText,
  splitTextByMentions,
  upsertResourceLink,
} from '../mention.ts';

test('readMentionQuery captures the in-progress @ token', () => {
  assert.deepEqual(readMentionQuery('看看 @产', 5), { start: 3, query: '产' });
  assert.equal(readMentionQuery('看看 @产 继续', 8), null);
  assert.deepEqual(readMentionQuery('@', 1), { start: 0, query: '' });
});

test('inserting a mention keeps later text and upserts the uri', () => {
  const applied = insertMentionToken('看看 @产', 5, '完成产品化');
  assert.deepEqual(applied, { text: '看看 @完成产品化 ', cursor: 10 });
  const links = resourceLinksInText(
    applied!.text,
    upsertResourceLink([], { uri: 'tn://growth/goals/g1', label: '完成产品化' }),
  );
  assert.deepEqual(links, [{ uri: 'tn://growth/goals/g1', label: '完成产品化' }]);
  assert.deepEqual(resourceLinksInText('看看 完成产品化', links), []);
});

test('keyboard cycling wraps and locale keys map to plugin copy', () => {
  assert.equal(cycleMentionIndex(0, 1, 3), 1);
  assert.equal(cycleMentionIndex(2, 1, 3), 0);
  assert.equal(cycleMentionIndex(0, -1, 3), 2);
  assert.equal(mentionKindLabel({ labelKey: 'menu.goal' }, { 'menu.goal': '目标' }), '目标');
  assert.equal(mentionOptionId('tn://growth/goals/g1'), 'mention-tn-growth-goals-g1');
});

test('decompose kickoff keeps the @label token linked to the resource', () => {
  const text = '请帮我拆解 @完成产品化';
  const links = resourceLinksInText(text, [{ uri: 'tn://growth/goals/g1', label: '完成产品化' }]);
  assert.deepEqual(links, [{ uri: 'tn://growth/goals/g1', label: '完成产品化' }]);
  const split = splitTextByMentions(text, links);
  assert.deepEqual(
    split.segments.map((segment) =>
      segment.type === 'text' ? segment.value : `${segment.type}:${segment.label}`,
    ),
    ['请帮我拆解 ', 'resource:完成产品化'],
  );
});

test('message text linkifies an in-place mention once', () => {
  const split = splitTextByMentions(
    '基于 @年底弹跳恢复能扣篮 目前的安排',
    [{ uri: 'tn://growth/goals/g1', label: '年底弹跳恢复能扣篮' }],
  );
  assert.deepEqual(
    split.segments.map((segment) =>
      segment.type === 'text' ? segment.value : `${segment.type}:${segment.label}`,
    ),
    ['基于 ', 'resource:年底弹跳恢复能扣篮', ' 目前的安排'],
  );
  assert.deepEqual(split.unmatchedResources, []);
});

test('multiple mentions keep their own links and unmatched links stay as fallbacks', () => {
  const split = splitTextByMentions(
    '对比 @目标A 和 @目标B',
    [
      { uri: 'tn://growth/goals/a', label: '目标A' },
      { uri: 'tn://growth/goals/b', label: '目标B' },
      { uri: 'tn://growth/goals/c', label: '目标C' },
    ],
  );
  assert.equal(split.segments.filter((segment) => segment.type === 'resource').length, 2);
  assert.deepEqual(split.unmatchedResources, [{ uri: 'tn://growth/goals/c', label: '目标C' }]);
});

test('longer labels win over prefixes and special characters stay intact', () => {
  const split = splitTextByMentions('看 @目标树/脑图', [
    { uri: 'tn://growth/goals/short', label: '目标树' },
    { uri: 'tn://growth/goals/long', label: '目标树/脑图' },
  ]);
  assert.deepEqual(split.segments[1], { type: 'resource', uri: 'tn://growth/goals/long', label: '目标树/脑图' });
  assert.equal(split.unmatchedResources[0]?.uri, 'tn://growth/goals/short');
});
