import { supabase } from './supabase';

export type NetworkHealthKpis = {
  mau: number;
  mau_prev: number;
  dau: number;
  dau_prev: number;
  wau: number;
  wau_prev: number;
  stickiness: number;
  stickiness_prev: number;
  retention_d1: number | null;
  retention_d1_prev: number | null;
  retention_d7: number | null;
  retention_d7_prev: number | null;
  retention_d30: number | null;
  retention_d30_prev: number | null;
  activation_rate: number | null;
  activation_rate_prev: number | null;
  activation_cohort: number;
  creators_active: number;
  creators_share: number;
  posted_share: number;
  interactions_per_mau: number;
  meaningful_per_mau: number;
  posts_with_interaction: number | null;
  publishers_received_interaction: number | null;
  hours_to_first_interaction: number | null;
  new_users: number;
  new_users_prev: number;
  churned: number;
  reactivated: number;
  churn_rate: number | null;
  net_growth: number;
  wmeu: number;
  wmeu_prev: number;
  one_and_done: number;
  profiles_total: number;
  onboarding_completed_share: number;
};

export type NetworkDensity = {
  posts_30: number;
  posts_prev: number;
  comments_30: number;
  follows_30: number;
  messages_30: number;
  avg_follows: number;
  no_connections_share: number;
  no_connections: number;
  posts_without_interaction_share: number | null;
  top1_content_share: number | null;
  top10_content_share: number | null;
  distinct_pairs_week: number;
};

export type NetworkBusiness = {
  gross_30: number;
  gross_prev: number;
  paid_users_30: number;
  paid_users_prev: number;
  paid_conversion: number;
  arpu: number;
  ltv: number;
  cac: number | null;
  paid_ever: number;
  active_subscriptions: number;
};

export type NetworkCohort = {
  week_start: string;
  cohort_n: number;
  d1: number | null;
  d7: number | null;
  d30: number | null;
};

export type DauPoint = {
  date: string;
  dau: number;
};

export type NetworkHealthSnapshot = {
  generatedAt: string;
  notes: string[];
  definitions: {
    active: string;
    activated: string;
    wmeu: string;
    one_and_done: string;
  };
  kpis: NetworkHealthKpis;
  acquisition: {
    new_users: number;
    new_users_prev: number;
    profiles_total: number;
    cac: number | null;
    visitor_conversion: number | null;
  };
  network: NetworkDensity;
  business: NetworkBusiness;
  dauSeries: DauPoint[];
  cohorts: NetworkCohort[];
};

export type NetworkUserSegment =
  | 'one_and_done'
  | 'recurring'
  | 'churned'
  | 'reactivated'
  | 'never_activated'
  | 'no_connections'
  | 'posted_no_interaction'
  | 'wmeu'
  | 'dau'
  | 'mau';

export const DASHBOARD_SECTION_IDS = [
  'health-overview',
  'health-growth',
  'health-engagement',
  'health-business',
  'health-operations',
  'health-users',
] as const;

export type DashboardSectionId = (typeof DASHBOARD_SECTION_IDS)[number];

export function isDashboardSection(section: string): section is DashboardSectionId {
  return (DASHBOARD_SECTION_IDS as readonly string[]).includes(section);
}

export const NETWORK_USER_SEGMENTS: ReadonlyArray<{ id: NetworkUserSegment; label: string }> = [
  { id: 'one_and_done', label: 'Não voltaram' },
  { id: 'recurring', label: 'Recorrentes' },
  { id: 'churned', label: 'Churn do mês' },
  { id: 'reactivated', label: 'Reativados' },
  { id: 'never_activated', label: 'Não ativados' },
  { id: 'no_connections', label: 'Sem conexões' },
  { id: 'posted_no_interaction', label: 'Publicaram sem retorno' },
  { id: 'wmeu', label: 'WMEU' },
  { id: 'dau', label: 'Ativos hoje' },
  { id: 'mau', label: 'MAU' },
];

export type NetworkHealthUser = {
  id: string;
  username: string | null;
  full_name: string | null;
  preferred_display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  created_at: string | null;
  last_activity_at: string | null;
  last_sign_in_at: string | null;
  activity_days: number;
  onboarding_completed: boolean;
};

export type NetworkHealthUserPage = {
  segment: NetworkUserSegment;
  total: number;
  limit: number;
  offset: number;
  generatedAt: string;
  items: NetworkHealthUser[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function numberFrom(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;
  return 0;
}

function nullableNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function stringFrom(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function parseKpis(value: unknown): NetworkHealthKpis {
  const row = asRecord(value);
  return {
    mau: numberFrom(row.mau),
    mau_prev: numberFrom(row.mau_prev),
    dau: numberFrom(row.dau),
    dau_prev: numberFrom(row.dau_prev),
    wau: numberFrom(row.wau),
    wau_prev: numberFrom(row.wau_prev),
    stickiness: numberFrom(row.stickiness),
    stickiness_prev: numberFrom(row.stickiness_prev),
    retention_d1: nullableNumber(row.retention_d1),
    retention_d1_prev: nullableNumber(row.retention_d1_prev),
    retention_d7: nullableNumber(row.retention_d7),
    retention_d7_prev: nullableNumber(row.retention_d7_prev),
    retention_d30: nullableNumber(row.retention_d30),
    retention_d30_prev: nullableNumber(row.retention_d30_prev),
    activation_rate: nullableNumber(row.activation_rate),
    activation_rate_prev: nullableNumber(row.activation_rate_prev),
    activation_cohort: numberFrom(row.activation_cohort),
    creators_active: numberFrom(row.creators_active),
    creators_share: numberFrom(row.creators_share),
    posted_share: numberFrom(row.posted_share),
    interactions_per_mau: numberFrom(row.interactions_per_mau),
    meaningful_per_mau: numberFrom(row.meaningful_per_mau),
    posts_with_interaction: nullableNumber(row.posts_with_interaction),
    publishers_received_interaction: nullableNumber(row.publishers_received_interaction),
    hours_to_first_interaction: nullableNumber(row.hours_to_first_interaction),
    new_users: numberFrom(row.new_users),
    new_users_prev: numberFrom(row.new_users_prev),
    churned: numberFrom(row.churned),
    reactivated: numberFrom(row.reactivated),
    churn_rate: nullableNumber(row.churn_rate),
    net_growth: numberFrom(row.net_growth),
    wmeu: numberFrom(row.wmeu),
    wmeu_prev: numberFrom(row.wmeu_prev),
    one_and_done: numberFrom(row.one_and_done),
    profiles_total: numberFrom(row.profiles_total),
    onboarding_completed_share: numberFrom(row.onboarding_completed_share),
  };
}

export async function fetchNetworkHealthSnapshot(): Promise<NetworkHealthSnapshot> {
  const { data, error } = await supabase.rpc('control_network_health_snapshot');
  if (error) throw error;
  const snapshot = asRecord(data);
  const generatedAt = typeof snapshot.generated_at === 'string' ? snapshot.generated_at : null;
  if (!generatedAt) throw new Error('O banco retornou um snapshot inválido.');

  const definitions = asRecord(snapshot.definitions);
  const acquisition = asRecord(snapshot.acquisition);
  const network = asRecord(snapshot.network);
  const business = asRecord(snapshot.business);

  return {
    generatedAt,
    notes: Array.isArray(snapshot.notes) ? snapshot.notes.filter((note): note is string => typeof note === 'string') : [],
    definitions: {
      active: stringFrom(definitions.active),
      activated: stringFrom(definitions.activated),
      wmeu: stringFrom(definitions.wmeu),
      one_and_done: stringFrom(definitions.one_and_done),
    },
    kpis: parseKpis(snapshot.kpis),
    acquisition: {
      new_users: numberFrom(acquisition.new_users),
      new_users_prev: numberFrom(acquisition.new_users_prev),
      profiles_total: numberFrom(acquisition.profiles_total),
      cac: nullableNumber(acquisition.cac),
      visitor_conversion: nullableNumber(acquisition.visitor_conversion),
    },
    network: {
      posts_30: numberFrom(network.posts_30),
      posts_prev: numberFrom(network.posts_prev),
      comments_30: numberFrom(network.comments_30),
      follows_30: numberFrom(network.follows_30),
      messages_30: numberFrom(network.messages_30),
      avg_follows: numberFrom(network.avg_follows),
      no_connections_share: numberFrom(network.no_connections_share),
      no_connections: numberFrom(network.no_connections),
      posts_without_interaction_share: nullableNumber(network.posts_without_interaction_share),
      top1_content_share: nullableNumber(network.top1_content_share),
      top10_content_share: nullableNumber(network.top10_content_share),
      distinct_pairs_week: numberFrom(network.distinct_pairs_week),
    },
    business: {
      gross_30: numberFrom(business.gross_30),
      gross_prev: numberFrom(business.gross_prev),
      paid_users_30: numberFrom(business.paid_users_30),
      paid_users_prev: numberFrom(business.paid_users_prev),
      paid_conversion: numberFrom(business.paid_conversion),
      arpu: numberFrom(business.arpu),
      ltv: numberFrom(business.ltv),
      cac: nullableNumber(business.cac),
      paid_ever: numberFrom(business.paid_ever),
      active_subscriptions: numberFrom(business.active_subscriptions),
    },
    dauSeries: Array.isArray(snapshot.dau_series)
      ? snapshot.dau_series.map((raw) => {
          const row = asRecord(raw);
          return { date: stringFrom(row.date), dau: numberFrom(row.dau) };
        }).filter((row) => row.date.length > 0)
      : [],
    cohorts: Array.isArray(snapshot.cohorts)
      ? snapshot.cohorts.map((raw) => {
          const row = asRecord(raw);
          return {
            week_start: stringFrom(row.week_start),
            cohort_n: numberFrom(row.cohort_n),
            d1: nullableNumber(row.d1),
            d7: nullableNumber(row.d7),
            d30: nullableNumber(row.d30),
          };
        }).filter((row) => row.week_start.length > 0)
      : [],
  };
}

export async function fetchNetworkHealthUsers(
  segment: NetworkUserSegment,
  limit: number,
  offset: number,
): Promise<NetworkHealthUserPage> {
  const { data, error } = await supabase.rpc('control_network_health_users', {
    p_segment: segment,
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;
  const page = asRecord(data);
  const items = Array.isArray(page.items) ? page.items.map((raw) => {
    const row = asRecord(raw);
    return {
      id: stringFrom(row.id),
      username: typeof row.username === 'string' ? row.username : null,
      full_name: typeof row.full_name === 'string' ? row.full_name : null,
      preferred_display_name: typeof row.preferred_display_name === 'string' ? row.preferred_display_name : null,
      avatar_url: typeof row.avatar_url === 'string' ? row.avatar_url : null,
      email: typeof row.email === 'string' ? row.email : null,
      created_at: typeof row.created_at === 'string' ? row.created_at : null,
      last_activity_at: typeof row.last_activity_at === 'string' ? row.last_activity_at : null,
      last_sign_in_at: typeof row.last_sign_in_at === 'string' ? row.last_sign_in_at : null,
      activity_days: numberFrom(row.activity_days),
      onboarding_completed: Boolean(row.onboarding_completed),
    };
  }).filter((item) => item.id.length > 0) : [];

  return {
    segment,
    total: numberFrom(page.total),
    limit: numberFrom(page.limit) || limit,
    offset: numberFrom(page.offset),
    generatedAt: typeof page.generated_at === 'string' ? page.generated_at : '',
    items,
  };
}

export type TrendDirection = 'up' | 'down' | 'flat';

export function trendOf(current: number | null | undefined, previous: number | null | undefined): TrendDirection {
  if (current == null || previous == null) return 'flat';
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'flat';
}

export function trendLabel(direction: TrendDirection): string {
  if (direction === 'up') return '↑';
  if (direction === 'down') return '↓';
  return '→';
}
