import globalWiki from '../../../../doc/ProductWiki/ProductWiki.md?raw';
import growthWiki from '../../../../doc/ProductWiki/growth/ProductWiki.md?raw';
import goalWiki from '../../../../doc/ProductWiki/growth/goal.md?raw';
import taskWiki from '../../../../doc/ProductWiki/growth/task.md?raw';
import todoWiki from '../../../../doc/ProductWiki/growth/todo.md?raw';
import habitWiki from '../../../../doc/ProductWiki/growth/habit.md?raw';

type WikiDocument = { path: string; title: string; markdown: string };
export type ProductWikiTopic = { id: string; title: string; module: string; path: string; markdown: string };

const documents = {
  global: { path: 'doc/ProductWiki/ProductWiki.md', title: 'True North ProductWiki', markdown: globalWiki },
  growth: { path: 'doc/ProductWiki/growth/ProductWiki.md', title: '个人成长系统', markdown: growthWiki },
  goal: { path: 'doc/ProductWiki/growth/goal.md', title: '目标管理', markdown: goalWiki },
  task: { path: 'doc/ProductWiki/growth/task.md', title: '任务管理', markdown: taskWiki },
  todo: { path: 'doc/ProductWiki/growth/todo.md', title: '待办管理', markdown: todoWiki },
  habit: { path: 'doc/ProductWiki/growth/habit.md', title: '习惯管理', markdown: habitWiki },
} satisfies Record<string, WikiDocument>;

function section(document: WikiDocument, id: string, heading: string): ProductWikiTopic {
  const start = document.markdown.indexOf(`## ${heading}`);
  const content = start < 0 ? document.markdown : document.markdown.slice(start);
  const nextHeading = content.slice(3).search(/\n## (?!#)/);
  return { id, title: heading, module: document.title, path: document.path, markdown: nextHeading < 0 ? content : content.slice(0, nextHeading + 3).trim() };
}

export const productWikiTopics = {
  'global-overview': section(documents.global, 'global-overview', '一、产品概览'),
  'growth-overview': section(documents.growth, 'growth-overview', '一、产品概览'),
  'goal-overview': section(documents.goal, 'goal-overview', '1. 模块概览'),
  'goal-structure': section(documents.goal, 'goal-structure', '2. 业务架构'),
  'goal-interaction': section(documents.goal, 'goal-interaction', '4. 设计与交互规范'),
  'goal-rules': section(documents.goal, 'goal-rules', '5. 业务规则'),
  'task-overview': section(documents.task, 'task-overview', '1. 模块概览'),
  'task-interaction': section(documents.task, 'task-interaction', '4. 设计与交互规范'),
  'task-rules': section(documents.task, 'task-rules', '5. 业务规则'),
  'focus-track-time': section(documents.task, 'focus-track-time', '2. 业务架构'),
  'todo-overview': section(documents.todo, 'todo-overview', '1. 模块概览'),
  'todo-interaction': section(documents.todo, 'todo-interaction', '4. 设计与交互规范'),
  'todo-priority': section(documents.todo, 'todo-priority', '5. 业务规则'),
  'todo-metrics': section(documents.todo, 'todo-metrics', '6. 指标体系'),
  'habit-overview': section(documents.habit, 'habit-overview', '1. 模块概览'),
  'habit-interaction': section(documents.habit, 'habit-interaction', '4. 设计与交互规范'),
  'habit-rules': section(documents.habit, 'habit-rules', '5. 业务规则'),
  'habit-metrics': section(documents.habit, 'habit-metrics', '6. 指标体系'),
} satisfies Record<string, ProductWikiTopic>;

export function findProductWikiTopicForElement(element: Element) {
  const topicId = element.closest<HTMLElement>('[data-product-wiki]')?.dataset.productWiki;
  return topicId ? productWikiTopics[topicId as keyof typeof productWikiTopics] : undefined;
}
