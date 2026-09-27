export function catalogKeyFromLabel(label: string): string {
  const key = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60);
  if (key.length >= 2) return key;
  throw new Error('staff.invalid_catalog_key');
}
