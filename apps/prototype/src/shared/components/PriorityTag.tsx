import { Tag } from '@sue/design-web-react';

export function PriorityTag({ importance, urgency }: { importance: number; urgency?: number }) {
  const label = urgency ? `重要 ${importance} · 紧急 ${urgency}` : `重要 ${importance}`;
  return <Tag color={importance >= 4 ? 'red' : importance === 3 ? 'gold' : 'blue'}>{label}</Tag>;
}
