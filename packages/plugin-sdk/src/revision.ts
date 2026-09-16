export function nextRevision(current?: number | null): number {
  return Math.max(1, Number(current || 1)) + 1;
}

export function revisionOf(current?: number | null): string {
  return String(Math.max(1, Number(current || 1)));
}
