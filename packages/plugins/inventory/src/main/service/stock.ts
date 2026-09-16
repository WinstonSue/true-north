export type MovementType = 'inbound' | 'outbound' | 'adjust';

export function restockQuantity(total: number, targetStock?: number | null): number {
  if (targetStock == null) return 0;
  return Math.max(0, targetStock - total);
}

export function isLowStock(total: number, minStock?: number | null): boolean {
  return minStock != null && total < minStock;
}

export function applyQuantityDelta(
  current: number,
  type: MovementType,
  quantity?: number,
  targetQuantity?: number,
): { delta: number; next: number } | { error: string } {
  if (type === 'inbound') {
    if (!(quantity != null && quantity > 0)) return { error: 'inbound quantity must be positive' };
    return { delta: quantity, next: current + quantity };
  }
  if (type === 'outbound') {
    if (!(quantity != null && quantity > 0)) return { error: 'outbound quantity must be positive' };
    const next = current - quantity;
    if (next < 0) return { error: 'insufficient stock' };
    return { delta: -quantity, next };
  }
  if (targetQuantity == null || targetQuantity < 0) return { error: 'adjust target must be >= 0' };
  return { delta: targetQuantity - current, next: targetQuantity };
}
