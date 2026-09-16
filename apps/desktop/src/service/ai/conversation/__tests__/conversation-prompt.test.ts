import assert from 'node:assert/strict';
import test from 'node:test';
import { formatAttachments, textFromParts } from '../conversation-prompt.ts';

test('resource links persist into the agent prompt as uri plus label', () => {
  const prompt = textFromParts([
    {
      type: 'text',
      text: '帮我看看这个目标',
      resourceLinks: [{ uri: 'tn://growth/goals/g1', label: '完成产品化' }],
    },
  ]);
  assert.equal(
    prompt,
    '帮我看看这个目标\n[引用:\n- 完成产品化 (tn://growth/goals/g1)]',
  );
});

test('text parts without resource links stay unchanged', () => {
  assert.equal(textFromParts([{ type: 'text', text: '你好' }]), '你好');
});

test('legacy entity links are not written into the prompt', () => {
  const prompt = textFromParts([
    {
      type: 'text',
      text: '旧消息',
    },
  ]);
  assert.equal(prompt, '旧消息');
});

test('resource attachments keep the uri and point at the canonical skill path', () => {
  assert.equal(
    formatAttachments([{ uri: 'tn://workflow/conflicts/t1', label: '冲突排查', skill: 'conflictAssist' }]),
    [
      '- 冲突排查 (tn://workflow/conflicts/t1)',
      '',
      '指定 Skill：workflow.conflictAssist',
      '执行前读取：skills/workflow/conflictAssist/SKILL.md',
    ].join('\n'),
  );
});

test('attachments without a skill stay as a uri list', () => {
  assert.equal(
    formatAttachments([{ uri: 'tn://growth/goals/g1', label: '完成产品化' }]),
    '- 完成产品化 (tn://growth/goals/g1)',
  );
});
