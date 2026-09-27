export type DashboardSectionId =
  | 'health-overview'
  | 'health-growth'
  | 'health-engagement'
  | 'health-business'
  | 'health-operations'
  | 'health-users';

const DASHBOARD_SECTIONS: ReadonlySet<string> = new Set<DashboardSectionId>([
  'health-overview', 'health-growth', 'health-engagement',
  'health-business', 'health-operations', 'health-users',
]);

export function isDashboardSection(value: string): value is DashboardSectionId {
  return DASHBOARD_SECTIONS.has(value);
}
