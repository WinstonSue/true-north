import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addAgentRules,
  formatAgentRulesSection,
  listAgentRules,
  resetAgentRules,
} from '../agent-rules.ts';

test('formats plugin rules in stable id order with tools', () => {
  resetAgentRules();
  addAgentRules('growth', [
    {
      id: 'growth.task.time-inheritance',
      tools: ['decompose_task'],
      description: '子任务重要度不得超过当前任务。',
    },
    {
      id: 'growth.goal.priority-inheritance',
      tools: ['get_goal', 'decompose_goal'],
      description: '子目标重要度不得超过当前目标。',
    },
  ]);
  const section = formatAgentRulesSection(listAgentRules());
  assert.match(section, /^插件规则：/);
  const goalIndex = section.indexOf('growth.goal.priority-inheritance');
  const taskIndex = section.indexOf('growth.task.time-inheritance');
  assert.ok(goalIndex >= 0 && taskIndex > goalIndex);
  assert.match(section, /适用于 get_goal、decompose_goal：子目标重要度不得超过当前目标。/);
});

test('rejects duplicate rule ids', () => {
  resetAgentRules();
  addAgentRules('growth', [{ id: 'growth.goal.priority-inheritance', description: 'one' }]);
  assert.throws(
    () => addAgentRules('other', [{ id: 'growth.goal.priority-inheritance', description: 'two' }]),
    /Duplicate agent rule/,
  );
});
