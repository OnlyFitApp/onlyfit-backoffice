import { coreApi } from '../api/core';
import type {
  StaffDashboardAppActivity,
  StaffDashboardFinance,
  StaffDashboardOutbox,
  StaffDashboardOverview,
  StaffDashboardWeeklyActivity,
  StaffDashboardWeeklyFinance,
  StaffDashboardMetric,
  StaffDashboardTotals,
} from '../api/core.gen';

export type OverviewStats = StaffDashboardOverview;
export type AppActivityStats = StaffDashboardAppActivity;
export type FinanceSnapshot = StaffDashboardFinance;
export type OutboxHealth = StaffDashboardOutbox;
export type WeeklyActivity = StaffDashboardWeeklyActivity;
export type WeeklyFinance = StaffDashboardWeeklyFinance;

export type DashboardSnapshot = {
  overview: OverviewStats;
  appActivity: AppActivityStats;
  finance: FinanceSnapshot;
  outbox: OutboxHealth;
  weeklyActivity: WeeklyActivity[];
  weeklyFinance: WeeklyFinance[];
  notes: string[];
  generatedAt: string;
  metrics: StaffDashboardMetric[];
  totals: StaffDashboardTotals;
};

export async function fetchDashboardSnapshot(section?: 'overview' | 'acquisition' | 'engagement' | 'business' | 'accounts'): Promise<DashboardSnapshot> {
  const snapshot = await coreApi.staff.dashboard({ section });
  return {
    overview: snapshot.overview,
    appActivity: snapshot.app_activity,
    finance: snapshot.finance,
    outbox: snapshot.outbox,
    weeklyActivity: snapshot.weekly_activity,
    weeklyFinance: snapshot.weekly_finance,
    notes: snapshot.notes,
    generatedAt: snapshot.generated_at,
    metrics: snapshot.metrics,
    totals: snapshot.totals,
  };
}
