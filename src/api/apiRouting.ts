import {
  Configuration,
  PlatformApi,
  SystemStatusGetResponseDTOAvailabilityEnum,
  SystemStatusGetResponseDTODomainRoutingEnum,
  type SystemStatusGetResponseDTO,
} from './onlyfit-api.gen';

export const API_DOMAINS = [
  'identity', 'affinity', 'compliance', 'social', 'club', 'community', 'challenge',
  'training', 'nutrition', 'health', 'consulting', 'course', 'product', 'commerce',
] as const;

export type ApiDomain = typeof API_DOMAINS[number];
export type DomainBackend = 'ONLYFIT_API' | 'ONLYFIT_CORE';

export type ApiRoutingSnapshot = {
  availability: 'AVAILABLE' | 'MAINTENANCE';
  retryAfterSeconds: number;
  currentVersion: string;
  minimumVersion: string;
  updateRequired: boolean;
  domainRouting: Readonly<Record<ApiDomain, DomainBackend>>;
};

const productionApiUrl = 'https://api.onlyfitapp.com';
const configuredApiUrl = String(
  import.meta.env.VITE_ONLYFIT_API_URL ?? (import.meta.env.PROD ? productionApiUrl : ''),
).trim().replace(/\/+$/, '');

function coreRoutes(): Record<ApiDomain, DomainBackend> {
  return Object.fromEntries(API_DOMAINS.map((domain) => [domain, 'ONLYFIT_CORE'])) as Record<ApiDomain, DomainBackend>;
}

function fallbackSnapshot(currentVersion = '0.0.0'): ApiRoutingSnapshot {
  return {
    availability: 'AVAILABLE',
    retryAfterSeconds: 0,
    currentVersion,
    minimumVersion: '0.0.0',
    updateRequired: false,
    domainRouting: Object.freeze(coreRoutes()),
  };
}

let currentSnapshot = fallbackSnapshot();

export function getApiRoutingSnapshot(): ApiRoutingSnapshot {
  return currentSnapshot;
}

export function backendFor(domain: ApiDomain): DomainBackend {
  return currentSnapshot.domainRouting[domain] ?? 'ONLYFIT_CORE';
}

export async function routedDomainCall<T>(
  domain: ApiDomain,
  handlers: { api: () => Promise<T>; core: () => Promise<T> },
): Promise<T> {
  return backendFor(domain) === 'ONLYFIT_API' ? handlers.api() : handlers.core();
}

export async function initializeApiRouting(
  currentVersion: string,
  options: { baseUrl?: string; fetchApi?: typeof fetch } = {},
): Promise<ApiRoutingSnapshot> {
  const baseUrl = (options.baseUrl ?? configuredApiUrl).replace(/\/+$/, '');
  if (!baseUrl) return (currentSnapshot = fallbackSnapshot(currentVersion));
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    let response: SystemStatusGetResponseDTO;
    try {
      response = await new PlatformApi(new Configuration({
        basePath: baseUrl,
        fetchApi: options.fetchApi,
      })).platformGetSystemStatus({ signal: controller.signal, cache: 'no-store' });
    } finally {
      window.clearTimeout(timeout);
    }
    const minimumVersion = response.minimumVersions?.backoffice;
    const availabilityValid = response.availability === SystemStatusGetResponseDTOAvailabilityEnum.Available
      || response.availability === SystemStatusGetResponseDTOAvailabilityEnum.Maintenance;
    if (!availabilityValid || !minimumVersion || !validVersion.test(minimumVersion)) {
      return (currentSnapshot = fallbackSnapshot(currentVersion));
    }
    const routes = coreRoutes();
    for (const domain of API_DOMAINS) {
      routes[domain] = response.domainRouting?.[domain] ===
        SystemStatusGetResponseDTODomainRoutingEnum.OnlyfitApi
        ? 'ONLYFIT_API'
        : 'ONLYFIT_CORE';
    }
    currentSnapshot = {
      availability: response.availability === SystemStatusGetResponseDTOAvailabilityEnum.Maintenance
        ? 'MAINTENANCE'
        : 'AVAILABLE',
      retryAfterSeconds: response.retryAfterSeconds ?? 0,
      currentVersion,
      minimumVersion,
      updateRequired: compareVersions(currentVersion, minimumVersion) < 0,
      domainRouting: Object.freeze(routes),
    };
    return currentSnapshot;
  } catch {
    return (currentSnapshot = fallbackSnapshot(currentVersion));
  }
}

const validVersion = /^\d+(?:\.\d+){0,3}(?:[-+][0-9A-Za-z.-]+)?$/;

export function compareVersions(left: string, right: string): number {
  const leftParts = numericVersion(left);
  const rightParts = numericVersion(right);
  const length = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

function numericVersion(value: string): number[] {
  return value.split(/[^0-9]+/).filter(Boolean).map((part) => Number.parseInt(part, 10) || 0);
}
