export const ambassadorRoles = ['principal', 'associate'] as const;

export type AmbassadorRole = (typeof ambassadorRoles)[number];

// These persisted values are an API contract shared by Supabase, Flutter,
// desktop and backoffice. Additive changes require all clients to be updated.
export const ambassadorRoleLabels: Readonly<Record<AmbassadorRole, string>> = {
  principal: 'Embaixador',
  associate: 'Associado',
};

export function parseAmbassadorRole(value: unknown): AmbassadorRole | null {
  return value === 'principal' || value === 'associate' ? value : null;
}

export function ambassadorRoleLabel(role: AmbassadorRole): string {
  return ambassadorRoleLabels[role];
}

export function requireAmbassadorRole(value: unknown): AmbassadorRole {
  const role = parseAmbassadorRole(value);
  if (!role) throw new Error('invalid_ambassador_role_contract');
  return role;
}
