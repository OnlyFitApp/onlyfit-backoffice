import { coreApi } from "../api/core";
import type {
  StaffAmbassadorMembership,
  StaffAmbassadorNetwork,
  StaffAmbassadorNetworkActionData,
  StaffAmbassadorNetworkActionResult,
  StaffAmbassadorPolicy,
  StaffAmbassadorRegion,
} from "../api/core.gen";

export type AmbassadorNetwork = StaffAmbassadorNetwork;
export type AmbassadorAssignment = StaffAmbassadorMembership;
export type AmbassadorRegion = StaffAmbassadorRegion;
export type AmbassadorNetworkPolicy = StaffAmbassadorPolicy;
export type AmbassadorNetworkActionData = StaffAmbassadorNetworkActionData;

export type AmbassadorNetworkFilters = {
  search?: string;
  affinityGroupKey?: string;
  regionId?: string | null;
  status?: "draft" | "pending" | "active" | "suspended" | "ended";
  cursor?: string;
  limit?: number;
};

export type AmbassadorNetworkAction =
  | "saveRegion"
  | "setRegionActive"
  | "savePolicy"
  | "setProgram"
  | "saveAssignment"
  | "transitionAssignment"
  | "transferAssociate"
  | "decideRequest"
  | "transferRequest";

export function fetchAmbassadorNetwork(
  filters: AmbassadorNetworkFilters = {},
): Promise<StaffAmbassadorNetwork> {
  return coreApi.staff.ambassadorNetwork(filters);
}

export function actOnAmbassadorNetwork(input: {
  id?: string | null;
  action: AmbassadorNetworkAction;
  data?: StaffAmbassadorNetworkActionData;
}): Promise<StaffAmbassadorNetworkActionResult> {
  return coreApi.staff.ambassadorNetworkAct(input);
}

export function ambassadorErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("network_changed"))
    return "A rede mudou em outra sessão. Atualize antes de tentar novamente.";
  if (message.includes("network_conflict"))
    return "Já existe um vínculo incompatível nesse escopo.";
  if (message.includes("network_region_in_use"))
    return "A região ainda possui vínculos ou políticas publicados.";
  if (message.includes("invalid_network_principal"))
    return "O Principal escolhido não está ativo no mesmo escopo.";
  if (message.includes("network_scope_inactive"))
    return "Ative a região antes de ativar essa atribuição.";
  if (message.includes("mfa_required"))
    return "Confirme o segundo fator para administrar a rede.";
  return "Não foi possível concluir a operação da rede.";
}
