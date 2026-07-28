import { Flex } from '@sue/design-web-react';
import { Goal as GoalIcon } from 'lucide-react';
import { PageHeader } from '../../shared/components';
import type { Goal, Task } from '../../shared/types';
import styles from './index.module.css';

export function MindMapPage({ goals, tasks }: { goals: Goal[]; tasks: Task[] }) { return <><PageHeader wikiId="goal-structure" title="目标脑图" detail="查看从愿景、目标到本周任务的关系。" /><Flex className={styles.mindmap} align="center" justify="center" gap={72} data-product-wiki="goal-structure"><Flex className={styles.mapRoot} align="center" gap={10}><GoalIcon size={20} /><b>{goals[0]?.title}</b></Flex><Flex vertical className={styles.mapBranches} gap={18}>{goals.filter((goal) => goal.parentId === goals[0]?.id).map((goal) => <Flex vertical className={styles.mapBranch} gap={6} key={goal.id}><b>{goal.title}</b><small>进度 {goal.progress}%</small>{tasks.filter((task) => task.goalId === goal.id).map((task) => <span key={task.id}>{task.title}</span>)}</Flex>)}</Flex></Flex></>; }
