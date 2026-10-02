import type { SystemStatus } from './core.gen';

/** Public health check: never wait for session refresh or send a staff token. */
export async function requestPublicSystemStatus(
  coreUrl: string,
  publishableKey: string,
  fetcher: typeof fetch = fetch,
): Promise<SystemStatus> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetcher(`${coreUrl.replace(/\/$/u, '')}/functions/v1/worker/app/status`, {
      method: 'POST',
      headers: { apikey: publishableKey, 'Content-Type': 'application/json' },
      credentials: 'omit',
      cache: 'no-store',
      body: '{}',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('platform.maintenance_state_unavailable');
    const value: unknown = await response.json();
    if (!value || typeof value !== 'object') throw new Error('platform.maintenance_state_unavailable');
    const status = value as Record<string, unknown>;
    if (typeof status.maintenance !== 'boolean'
      || !(status.message_key === null || typeof status.message_key === 'string')
      || !(status.started_at === null || (typeof status.started_at === 'string' && Number.isFinite(Date.parse(status.started_at))))
      || !Number.isInteger(status.retry_after_seconds) || Number(status.retry_after_seconds) < 1) {
      throw new Error('platform.maintenance_state_unavailable');
    }
    return value as SystemStatus;
  } finally {
    clearTimeout(timeout);
  }
}
