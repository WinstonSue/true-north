import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const wikiRoot = join(appRoot, 'product-wiki');
const schemaPath = join(wikiRoot, 'spec.schema.json');
const fixturesPath = join(appRoot, 'src/fixtures/growth.json');
const generatedReferencesPath = join(appRoot, 'src/product-wiki/references.generated.ts');
const write = process.argv.includes('--write') || process.argv.includes('sync');
const errors = [];
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

function filesIn(directory, name) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(path, name);
    return entry.name === name ? [path] : [];
  });
}

function parseSpecification(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${relative(appRoot, path)} is not valid JSON: ${error.message}`);
    return undefined;
  }
}

function required(object, key, type, path) {
  if (object[key] === undefined || typeof object[key] !== type) {
    errors.push(`${path}: ${key} must be a ${type}`);
    return false;
  }
  return true;
}

function resolveSchema(schemaNode) {
  if (!schemaNode.$ref) return schemaNode;
  const parts = schemaNode.$ref.replace(/^#\//, '').split('/');
  return parts.reduce((current, key) => current?.[key], schema);
}

function validateAgainstSchema(value, schemaNode, path) {
  const definition = resolveSchema(schemaNode);
  if (!definition) {
    errors.push(`${path}: unresolved schema reference ${schemaNode.$ref}`);
    return;
  }
  if (definition.enum && !definition.enum.includes(value)) {
    errors.push(`${path}: expected one of ${definition.enum.join(', ')}`);
    return;
  }
  if (definition.type === 'string') {
    if (typeof value !== 'string') errors.push(`${path}: expected string`);
    else if (definition.minLength && value.length < definition.minLength) errors.push(`${path}: must not be empty`);
    else if (definition.pattern && !new RegExp(definition.pattern).test(value)) errors.push(`${path}: does not match ${definition.pattern}`);
    return;
  }
  if (definition.type === 'boolean') {
    if (typeof value !== 'boolean') errors.push(`${path}: expected boolean`);
    return;
  }
  if (definition.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${path}: expected array`);
      return;
    }
    if (definition.minItems && value.length < definition.minItems) errors.push(`${path}: requires at least ${definition.minItems} items`);
    value.forEach((item, index) => validateAgainstSchema(item, definition.items, `${path}[${index}]`));
    return;
  }
  if (definition.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${path}: expected object`);
      return;
    }
    definition.required?.forEach((key) => {
      if (value[key] === undefined) errors.push(`${path}: missing required property ${key}`);
    });
    Object.entries(value).forEach(([key, item]) => {
      const childSchema = definition.properties?.[key];
      if (!childSchema) {
        if (definition.additionalProperties === false) errors.push(`${path}: unknown property ${key}`);
        return;
      }
      validateAgainstSchema(item, childSchema, `${path}.${key}`);
    });
  }
}

function validateSpecification(specification, path) {
  const label = relative(appRoot, path);
  validateAgainstSchema(specification, schema, label);
  if (!specification || typeof specification !== 'object' || Array.isArray(specification)) {
    errors.push(`${label}: specification must be an object`);
    return;
  }
  for (const key of ['id', 'kind', 'title', 'document']) required(specification, key, 'string', label);
  if (!Array.isArray(specification.references) || specification.references.length === 0) {
    errors.push(`${label}: references must be a non-empty array`);
  } else {
    specification.references.forEach((reference, index) => {
      required(reference, 'id', 'string', `${label}.references[${index}]`);
      required(reference, 'heading', 'string', `${label}.references[${index}]`);
    });
  }
  for (const collection of ['dependencies', 'entities', 'views', 'rules']) {
    if (specification[collection] !== undefined && !Array.isArray(specification[collection])) {
      errors.push(`${label}: ${collection} must be an array when provided`);
    }
  }
}

function validateLifecycle(item, label) {
  const log = item.changeLog || [];
  if (!log.some((entry) => entry.event === 'baseline')) errors.push(`${label}: changeLog must include a baseline entry`);
  for (let index = 1; index < log.length; index += 1) {
    if (log[index - 1].date > log[index].date) errors.push(`${label}: changeLog dates must be chronological`);
  }
  const current = latestLog(item);
  if (current && (current.productStatus !== item.productStatus || current.prototypeCoverage !== item.prototypeCoverage)) {
    errors.push(`${label}: current lifecycle values must match the latest changeLog entry`);
  }
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function marker(reference) {
  return `<!-- product-ref: ${reference} -->`;
}

function statusLabel(status) {
  return ({ roadmap: '路线图', released: '已发布', deprecated: '已废弃' })[status] || status;
}

function coverageLabel(coverage) {
  return ({ none: '未覆盖', partial: '部分覆盖', complete: '完整覆盖' })[coverage] || coverage;
}

function latestLog(item) {
  return item.changeLog?.[item.changeLog.length - 1];
}

function latestLogLabel(item) {
  const log = latestLog(item);
  return log ? `${log.version} ${log.date}: ${log.summary}` : '无记录';
}

function changeLogRows(label, item) {
  return item.changeLog.map((log) => `| ${label} | ${log.version} | ${log.date} | ${log.event} | ${statusLabel(log.productStatus)} | ${coverageLabel(log.prototypeCoverage)} | ${log.summary} |`);
}

function productTable(specification) {
  const lines = [
    '<!-- product-wiki:managed:start -->',
    '## 产品规格（受管）',
    '',
    `- 标识：\`${specification.id}\``,
    `- 类型：${specification.kind}`,
    `- 产品状态：${statusLabel(specification.productStatus)}`,
    `- 原型覆盖：${coverageLabel(specification.prototypeCoverage)}`,
    `- 最近变更：${latestLogLabel(specification)}`,
  ];
  if (specification.route) lines.push(`- 原型入口：\`${specification.route}\``);
  if (specification.positioning) lines.push(`- 产品定位：${specification.positioning}`);
  if (specification.dependencies?.length) lines.push(`- 依赖：${specification.dependencies.map((item) => `\`${item}\``).join('、')}`);

  if (specification.entities?.length) {
    lines.push('', '### 产品对象', '', '| 对象 | 产品状态 | 原型覆盖 | 最近变更 |', '| --- | --- | --- | --- |');
    specification.entities.forEach((entity) => lines.push(`| ${entity.name} | ${statusLabel(entity.productStatus)} | ${coverageLabel(entity.prototypeCoverage)} | ${latestLogLabel(entity)} |`));
    lines.push('', '### 字段与枚举', '', '| 实体 | 字段 | 类型 | 必填 | 可选值 | 产品状态 | 原型覆盖 | 说明 |', '| --- | --- | --- | --- | --- | --- | --- |');
    specification.entities.forEach((entity) => {
      entity.fields.forEach((field, index) => {
        lines.push(`| ${index === 0 ? entity.name : ''} | \`${field.id}\` | ${field.type} | ${field.required ? '是' : '否'} | ${(field.values || []).join(' / ')} | ${statusLabel(field.productStatus)} | ${coverageLabel(field.prototypeCoverage)} | ${field.description} |`);
      });
    });
  }

  if (specification.views?.length) {
    lines.push('', '### 视图矩阵', '', '| 视图 | 原型页 | 场景 | 产品状态 | 原型覆盖 | 产品引用 |', '| --- | --- | --- | --- | --- | --- |');
    specification.views.forEach((view) => lines.push(`| ${view.name} | \`${view.prototypePage}\` | ${view.scenario} | ${statusLabel(view.productStatus)} | ${coverageLabel(view.prototypeCoverage)} | \`${view.reference}\` |`));
  }

  if (specification.rules?.length) {
    lines.push('', '### 规则索引', '', '| 规则 | 实体 | 说明 | 产品状态 | 原型覆盖 | 产品引用 |', '| --- | --- | --- | --- | --- | --- |');
    specification.rules.forEach((rule) => lines.push(`| ${rule.name} | ${rule.entities.join('、')} | ${rule.description} | ${statusLabel(rule.productStatus)} | ${coverageLabel(rule.prototypeCoverage)} | \`${rule.reference}\` |`));
  }

  lines.push('', '### 对象变更记录', '', '| 对象 | 版本 | 日期 | 事件 | 产品状态 | 原型覆盖 | 摘要 |', '| --- | --- | --- | --- | --- | --- |');
  lines.push(...changeLogRows('模块', specification));
  specification.entities?.forEach((entity) => {
    lines.push(...changeLogRows(`实体：${entity.name}`, entity));
    entity.fields.forEach((field) => lines.push(...changeLogRows(`字段：${entity.name}.${field.name}`, field)));
  });
  specification.views?.forEach((view) => lines.push(...changeLogRows(`视图：${view.name}`, view)));
  specification.rules?.forEach((rule) => lines.push(...changeLogRows(`规则：${rule.name}`, rule)));

  lines.push('', '<!-- product-wiki:managed:end -->', '');
  return lines.join('\n');
}

function insertMarkers(markdown, specification) {
  const referencesByHeading = new Map();
  specification.references.forEach((reference) => {
    const items = referencesByHeading.get(reference.heading) || [];
    items.push(reference.id);
    referencesByHeading.set(reference.heading, items);
  });

  let output = markdown;
  for (const [heading, references] of referencesByHeading) {
    const missing = references.filter((reference) => !output.includes(marker(reference)));
    if (!missing.length) continue;
    const match = new RegExp(`^${escapePattern(heading)}\\s*$`, 'm').exec(output);
    if (!match || match.index === undefined) {
      errors.push(`${specification.document}: cannot insert references for missing heading "${heading}"`);
      continue;
    }
    output = `${output.slice(0, match.index)}${missing.map(marker).join('\n')}\n${output.slice(match.index)}`;
  }
  return output;
}

function syncDocument(markdown, specification) {
  let output = insertMarkers(markdown, specification);
  const generated = productTable(specification);
  const managed = /<!-- product-wiki:managed:start -->[\s\S]*?<!-- product-wiki:managed:end -->\n?/;
  if (managed.test(output)) return output.replace(managed, generated);
  const title = /^# .+\n?/m.exec(output);
  if (!title || title.index === undefined) {
    errors.push(`${specification.document}: document needs one level-one title`);
    return output;
  }
  const position = title.index + title[0].length;
  return `${output.slice(0, position)}\n${generated}\n${output.slice(position)}`;
}

function checkDocument(markdown, specification) {
  const knownReferences = new Set(specification.references.map((reference) => reference.id));
  const foundReferences = [...markdown.matchAll(/<!--\s*product-ref:\s*([a-z][a-z0-9.-]*)\s*-->/g)].map((match) => match[1]);
  specification.references.forEach((reference) => {
    const count = foundReferences.filter((item) => item === reference.id).length;
    if (count !== 1) errors.push(`${specification.document}: ${reference.id} must have exactly one marker (found ${count})`);
  });
  foundReferences.forEach((reference) => {
    if (!knownReferences.has(reference)) errors.push(`${specification.document}: ${reference} has no specification entry`);
  });
  const headings = new Set();
  specification.references.forEach((reference) => {
    if (headings.has(reference.heading)) errors.push(`${specification.document}: references must not share heading ${reference.heading}`);
    headings.add(reference.heading);
    const expected = `${marker(reference.id)}\n${reference.heading}`;
    if (!markdown.includes(expected)) errors.push(`${specification.document}: ${reference.id} marker must immediately precede ${reference.heading}`);
  });
  const managedless = markdown.replace(/<!-- product-wiki:managed:start -->[\s\S]*?<!-- product-wiki:managed:end -->/g, '');
  const forbidden = [/^#{1,6}\s*.*(?:API|接口契约|技术架构|数据模型|核心字段|视图矩阵（当前状态）)/m, /^---\s*$/m];
  forbidden.forEach((pattern) => {
    if (pattern.test(managedless)) errors.push(`${specification.document}: contains legacy technical or YAML content outside the managed block`);
  });
  const expectedManaged = productTable(specification);
  const existingManaged = markdown.match(/<!-- product-wiki:managed:start -->[\s\S]*?<!-- product-wiki:managed:end -->\n?/);
  if (!existingManaged || existingManaged[0].trim() !== expectedManaged.trim()) {
    errors.push(`${specification.document}: managed product block is stale; run product-wiki:sync`);
  }
}

function generatedReferences(references) {
  const list = references.map((reference) => `  '${reference}',`).join('\n');
  return `// This file is generated by scripts/product-wiki.mjs. Do not edit by hand.\nexport const productReferenceIds = [\n${list}\n] as const;\n\nexport type ProductReferenceId = (typeof productReferenceIds)[number];\n`;
}

function fixtureError(message) {
  errors.push(`src/fixtures/growth.json: ${message}`);
}

function validateFixtures(specifications) {
  if (!existsSync(fixturesPath)) {
    fixtureError('fixture file is missing');
    return;
  }
  const fixtures = parseSpecification(fixturesPath);
  if (!fixtures) return;
  const collections = ['goals', 'tasks', 'todos', 'habits'];
  collections.forEach((name) => {
    if (!Array.isArray(fixtures[name])) fixtureError(`${name} must be an array`);
  });
  if (errors.length || !collections.every((name) => Array.isArray(fixtures[name]))) return;

  const entitySpec = (moduleId, entityId) => specifications.find((item) => item.id === moduleId)?.entities?.find((item) => item.id === entityId);
  const validateValues = (items, moduleId, entityId) => {
    const spec = entitySpec(moduleId, entityId);
    if (!spec) return;
    items.forEach((item) => {
      if (!item.id) fixtureError(`${entityId} is missing id`);
      spec.fields.forEach((field) => {
        if (!field.values?.length || item[field.id] === undefined) return;
        if (!field.values.includes(item[field.id])) fixtureError(`${entityId} ${item.id} has invalid ${field.id}: ${item[field.id]}`);
      });
    });
  };
  validateValues(fixtures.goals, 'growth.goal', 'goal');
  validateValues(fixtures.tasks, 'growth.task', 'task');
  validateValues(fixtures.todos, 'growth.todo', 'todo');
  validateValues(fixtures.habits, 'growth.habit', 'habit');

  const ids = new Set();
  collections.forEach((name) => fixtures[name].forEach((item) => {
    if (ids.has(item.id)) fixtureError(`duplicate fixture id ${item.id}`);
    ids.add(item.id);
  }));
  const goalIds = new Set(fixtures.goals.map((item) => item.id));
  const taskIds = new Set(fixtures.tasks.map((item) => item.id));
  fixtures.goals.forEach((goal) => {
    if (goal.parentId && !goalIds.has(goal.parentId)) fixtureError(`goal ${goal.id} references missing parent ${goal.parentId}`);
  });
  fixtures.tasks.forEach((task) => {
    if (task.goalId && !goalIds.has(task.goalId)) fixtureError(`task ${task.id} references missing goal ${task.goalId}`);
    if (task.parentId && !taskIds.has(task.parentId)) fixtureError(`task ${task.id} references missing parent ${task.parentId}`);
  });
  fixtures.todos.forEach((todo) => {
    if (todo.goalId && !goalIds.has(todo.goalId)) fixtureError(`todo ${todo.id} references missing goal ${todo.goalId}`);
    if (todo.taskId && !taskIds.has(todo.taskId)) fixtureError(`todo ${todo.id} references missing task ${todo.taskId}`);
  });
  fixtures.habits.forEach((habit) => {
    if (!habit.goalIds?.length) fixtureError(`habit ${habit.id} must reference a goal`);
    habit.goalIds?.forEach((goalId) => {
      if (!goalIds.has(goalId)) fixtureError(`habit ${habit.id} references missing goal ${goalId}`);
    });
  });
}

const specifications = filesIn(wikiRoot, 'spec.json').map((path) => ({ path, specification: parseSpecification(path) })).filter((item) => item.specification);
specifications.forEach(({ path, specification }) => validateSpecification(specification, path));
const allSpecificationIds = new Set();
const allReferences = [];
const allEntityIds = new Set();

specifications.forEach(({ path, specification }) => {
  if (allSpecificationIds.has(specification.id)) errors.push(`${relative(appRoot, path)}: duplicate specification id ${specification.id}`);
  allSpecificationIds.add(specification.id);
  specification.references.forEach((reference) => allReferences.push(reference.id));
  specification.entities?.forEach((entity) => allEntityIds.add(entity.id));
});

specifications.forEach(({ path, specification }) => {
  const label = relative(appRoot, path);
  validateLifecycle(specification, label);
  specification.entities?.forEach((entity) => {
    validateLifecycle(entity, `${label}.entities.${entity.id}`);
    entity.fields.forEach((field) => validateLifecycle(field, `${label}.entities.${entity.id}.fields.${field.id}`));
  });
  specification.views?.forEach((view) => validateLifecycle(view, `${label}.views.${view.id}`));
  specification.rules?.forEach((rule) => validateLifecycle(rule, `${label}.rules.${rule.id}`));
});

const seenReferences = new Set();
allReferences.forEach((reference) => {
  if (seenReferences.has(reference)) errors.push(`duplicate product reference ${reference}`);
  seenReferences.add(reference);
});

specifications.forEach(({ specification }) => {
  if (specification.parentId && !allSpecificationIds.has(specification.parentId)) errors.push(`${specification.id}: missing parent specification ${specification.parentId}`);
  specification.dependencies?.forEach((dependency) => {
    if (!allSpecificationIds.has(dependency)) errors.push(`${specification.id}: missing dependency ${dependency}`);
  });
  const references = new Set(specification.references.map((item) => item.id));
  const entityIds = new Set(specification.entities?.map((item) => item.id) || []);
  const viewIds = new Set(specification.views?.map((item) => item.id) || []);
  specification.views?.forEach((view) => {
    if (!references.has(view.reference)) errors.push(`${specification.id}: view ${view.id} references undefined product reference ${view.reference}`);
  });
  specification.rules?.forEach((rule) => {
    if (!references.has(rule.reference)) errors.push(`${specification.id}: rule ${rule.id} references undefined product reference ${rule.reference}`);
    rule.entities.forEach((entity) => {
      if (!entityIds.has(entity) && !allEntityIds.has(entity)) errors.push(`${specification.id}: rule ${rule.id} references undefined entity ${entity}`);
    });
    rule.views?.forEach((view) => {
      if (!viewIds.has(view)) errors.push(`${specification.id}: rule ${rule.id} references undefined local view ${view}`);
    });
  });
  const documentPath = join(wikiRoot, specification.document);
  if (!existsSync(documentPath)) {
    errors.push(`${specification.id}: document ${specification.document} does not exist`);
    return;
  }
  const current = readFileSync(documentPath, 'utf8');
  const synced = syncDocument(current, specification);
  if (write && synced !== current) writeFileSync(documentPath, synced, 'utf8');
  if (!write) checkDocument(current, specification);
});

const expectedReferences = generatedReferences(allReferences);
if (write) writeFileSync(generatedReferencesPath, expectedReferences, 'utf8');
else if (!existsSync(generatedReferencesPath) || readFileSync(generatedReferencesPath, 'utf8') !== expectedReferences) {
  errors.push('src/product-wiki/references.generated.ts is stale; run product-wiki:sync');
}

validateFixtures(specifications.map(({ specification }) => specification));

if (errors.length) {
  console.error(`ProductWiki check failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(write ? 'ProductWiki synchronized successfully.' : 'ProductWiki check passed.');
}
