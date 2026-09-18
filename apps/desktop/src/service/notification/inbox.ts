export function sortInbox<T extends { readAt?: string | Date | null; createdAt: string | Date }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const unreadA = a.readAt ? 1 : 0;
    const unreadB = b.readAt ? 1 : 0;
    if (unreadA !== unreadB) return unreadA - unreadB;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function pickDedupeRow<T extends { dedupeKey?: string | null; createdAt: string | Date }>(
  rows: T[],
  dedupeKey: string,
): T | undefined {
  const matches = rows.filter((row) => row.dedupeKey === dedupeKey);
  if (!matches.length) return undefined;
  return [...matches].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}
