export async function createMain() {
  const { createInventoryMain } = await import('./contribution');
  return createInventoryMain();
}
