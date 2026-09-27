import {
  AlertTriangle,
  Check,
  MapPin,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { FormEvent, useState } from "react";
import {
  useAmbassadorNetwork,
  useAmbassadorNetworkAction,
} from "../hooks/useAmbassadorNetwork";
import { useCurrentStaffRole } from "../hooks/useStaffManagement";
import {
  ambassadorErrorMessage,
  type AmbassadorAssignment,
  type AmbassadorNetwork,
  type AmbassadorNetworkAction,
  type AmbassadorNetworkActionData,
  type AmbassadorNetworkPolicy,
  type AmbassadorRegion,
} from "../lib/ambassadorNetwork";
import { formatDateTime, formatNumber } from "../lib/format";
import { AmbassadorTabPanel, AmbassadorTabs } from "./AmbassadorUi";

type Tab = "network" | "regions" | "policies" | "requests" | "audit";
type Status = "draft" | "pending" | "active" | "suspended" | "ended";
type Run = (
  input: {
    id?: string | null;
    action: AmbassadorNetworkAction;
    data?: AmbassadorNetworkActionData;
  },
  success: string,
) => Promise<boolean>;

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  pending: "Pendente",
  active: "Ativo",
  suspended: "Suspenso",
  ended: "Encerrado",
  requested: "Aguardando análise",
  archived: "Arquivado",
};

export function AmbassadorNetworkPage() {
  const [tab, setTab] = useState<Tab>("network");
  const [search, setSearch] = useState("");
  const [affinity, setAffinity] = useState("");
  const [regionId, setRegionId] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const query = useAmbassadorNetwork({
    search: search.trim() || undefined,
    affinityGroupKey: affinity || undefined,
    regionId: regionId || undefined,
    status: status || undefined,
    limit: 50,
  });
  const mutation = useAmbassadorNetworkAction();
  const role = useCurrentStaffRole();
  const canEdit = role.data === "admin" || role.data === "super_admin";
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run: Run = async (input, success) => {
    setMessage(null);
    setError(null);
    try {
      await mutation.mutateAsync(input);
      setMessage(success);
      return true;
    } catch (caught) {
      setError(ambassadorErrorMessage(caught));
      return false;
    }
  };
  const data = query.data;
  const tabs = [
    { id: "network" as const, label: "Rede", icon: <UsersRound size={16} /> },
    {
      id: "regions" as const,
      label: "Países e regiões",
      icon: <MapPin size={16} />,
    },
    {
      id: "policies" as const,
      label: "Regras",
      icon: <SlidersHorizontal size={16} />,
    },
    {
      id: "requests" as const,
      label: `Solicitações${data?.requests.length ? ` (${data.requests.length})` : ""}`,
      icon: <UserRoundCheck size={16} />,
    },
    {
      id: "audit" as const,
      label: "Histórico",
      icon: <ShieldCheck size={16} />,
    },
  ];

  return (
    <>
      <header className="page-header ambassador-header">
        <div>
          <p className="section-label">Comercial</p>
          <h1>Rede de Embaixadores</h1>
          <span>
            Principais, Associados e profissionais por vertical e região.
          </span>
        </div>
        <button
          className="button secondary"
          type="button"
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
        >
          <RefreshCw className={query.isFetching ? "spin" : ""} size={16} />
          Atualizar
        </button>
      </header>
      <section className="content ambassador-page">
        {data ? (
          <div className="ambassador-summary">
            <span>
              <strong>{formatNumber(data.total)}</strong> atribuições
            </span>
            <span>
              <strong>
                {formatNumber(
                  data.assignments.filter((item) => item.status === "active")
                    .length,
                )}
              </strong>{" "}
              ativas na página
            </span>
            <span>
              <strong>{formatNumber(data.requests.length)}</strong> solicitações
            </span>
            <span>
              <strong>
                {formatNumber(
                  data.regions.filter((item) => item.active).length,
                )}
              </strong>{" "}
              regiões ativas
            </span>
          </div>
        ) : null}
        {data && !data.program.network_enabled ? (
          <div className="inline-alert ambassador-safe-mode">
            <ShieldCheck size={18} />A entrada na rede está pausada no Core.
          </div>
        ) : null}
        {error ? (
          <div className="inline-alert danger">
            <AlertTriangle size={18} />
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="inline-alert success">
            <Check size={18} />
            {message}
          </div>
        ) : null}
        <AmbassadorTabs
          label="Áreas da rede de embaixadores"
          items={tabs}
          value={tab}
          onChange={setTab}
        />
        {query.isLoading ? (
          <div className="ambassador-loading">
            <RefreshCw className="spin" size={24} />
            Carregando rede…
          </div>
        ) : null}
        {query.isError ? (
          <div className="inline-alert danger">
            <AlertTriangle size={18} />
            Não foi possível carregar a rede.
          </div>
        ) : null}
        {data ? (
          <>
            <AmbassadorTabPanel id="network" activeTab={tab}>
              <NetworkTab
                data={data}
                canEdit={canEdit}
                filters={{ search, affinity, regionId, status }}
                setters={{ setSearch, setAffinity, setRegionId, setStatus }}
                run={run}
              />
            </AmbassadorTabPanel>
            <AmbassadorTabPanel id="regions" activeTab={tab}>
              <RegionsTab regions={data.regions} canEdit={canEdit} run={run} />
            </AmbassadorTabPanel>
            <AmbassadorTabPanel id="policies" activeTab={tab}>
              <PoliciesTab data={data} canEdit={canEdit} run={run} />
            </AmbassadorTabPanel>
            <AmbassadorTabPanel id="requests" activeTab={tab}>
              <RequestsTab data={data} canEdit={canEdit} run={run} />
            </AmbassadorTabPanel>
            <AmbassadorTabPanel id="audit" activeTab={tab}>
              <div className="ambassador-list-panel">
                <h2>Histórico administrativo</h2>
                {data.audit.length ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Quando</th>
                        <th>Ação</th>
                        <th>Alvo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.audit.map((item) => (
                        <tr key={item.id}>
                          <td>{formatDateTime(new Date(item.at))}</td>
                          <td>
                            {item.action.replace("staff.ambassador_", "")}
                          </td>
                          <td>
                            {item.target_type} · {item.target_id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="ambassador-muted">
                    Nenhuma alteração registrada.
                  </p>
                )}
              </div>
            </AmbassadorTabPanel>
          </>
        ) : null}
      </section>
    </>
  );
}

function NetworkTab({
  data,
  canEdit,
  filters,
  setters,
  run,
}: {
  data: AmbassadorNetwork;
  canEdit: boolean;
  filters: {
    search: string;
    affinity: string;
    regionId: string;
    status: Status | "";
  };
  setters: {
    setSearch: (v: string) => void;
    setAffinity: (v: string) => void;
    setRegionId: (v: string) => void;
    setStatus: (v: Status | "") => void;
  };
  run: Run;
}) {
  const [editing, setEditing] = useState<AmbassadorAssignment | null>(null);
  const [accountId, setAccountId] = useState("");
  const [classification, setClassification] = useState<
    "principal" | "associate"
  >("principal");
  const [draftRegion, setDraftRegion] = useState("");
  const [principalId, setPrincipalId] = useState("");
  const [headline, setHeadline] = useState("");
  const [contractReference, setContractReference] = useState("");
  const [publicVisible, setPublicVisible] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const principals = data.assignments.filter(
    (item) => item.classification === "principal" && item.status === "active",
  );

  function edit(item: AmbassadorAssignment) {
    setEditing(item);
    setAccountId(item.account_id);
    setClassification(
      item.classification === "principal" ? "principal" : "associate",
    );
    setDraftRegion(item.region_id ?? "");
    setPrincipalId(item.principal_membership_id ?? "");
    setHeadline(item.headline ?? "");
    setContractReference(item.contract_reference ?? "");
    setPublicVisible(item.public_visible);
    setDisplayOrder(String(item.display_order));
    setStartsAt(item.starts_at?.slice(0, 16) ?? "");
    setEndsAt(item.ends_at?.slice(0, 16) ?? "");
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    const candidate = data.candidates.find((item) => item.id === accountId);
    const ok = await run(
      {
        id: editing?.id,
        action: "saveAssignment",
        data: {
          account_id: accountId,
          classification,
          affinity_group_key:
            editing?.affinity_group_key ?? candidate?.professional_vertical,
          region_id: draftRegion,
          principal_membership_id:
            classification === "associate" ? principalId || null : null,
          public_visible: publicVisible,
          display_order: Number(displayOrder),
          headline: headline || null,
          contract_reference: contractReference || null,
          starts_at: startsAt ? new Date(startsAt).toISOString() : null,
          ends_at: endsAt ? new Date(endsAt).toISOString() : null,
          expected_version: editing?.version,
        },
      },
      editing ? "Atribuição atualizada." : "Atribuição criada.",
    );
    if (ok) {
      setEditing(null);
      setAccountId("");
      setHeadline("");
      setContractReference("");
    }
  }
  return (
    <div className="ambassador-network-layout">
      <div className="ambassador-list-panel">
        <div className="ambassador-section-head">
          <div>
            <h2>Atribuições</h2>
            <p>Classificação comercial não concede acesso administrativo.</p>
          </div>
        </div>
        <div className="ambassador-filter-grid">
          <label>
            <span>Busca</span>
            <div className="search-box">
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(event) => setters.setSearch(event.target.value)}
                placeholder="Nome ou usuário"
              />
            </div>
          </label>
          <label>
            <span>Vertical</span>
            <select
              value={filters.affinity}
              onChange={(event) => setters.setAffinity(event.target.value)}
            >
              <option value="">Todas</option>
              {data.affinity_groups.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Região</span>
            <select
              value={filters.regionId}
              onChange={(event) => setters.setRegionId(event.target.value)}
            >
              <option value="">Todas</option>
              {data.regions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select
              value={filters.status}
              onChange={(event) =>
                setters.setStatus(event.target.value as Status | "")
              }
            >
              <option value="">Todos</option>
              {(
                ["draft", "pending", "active", "suspended", "ended"] as const
              ).map((value) => (
                <option key={value} value={value}>
                  {statusLabels[value]}
                </option>
              ))}
            </select>
          </label>
        </div>
        {data.assignments.length ? (
          <div className="ambassador-card-list">
            {data.assignments.map((item) => (
              <article className="ambassador-card" key={item.id}>
                <div>
                  <strong>{item.display_name}</strong>
                  <span>
                    @{item.username} ·{" "}
                    {item.classification === "principal"
                      ? "Principal"
                      : "Associado"}
                  </span>
                  <small>
                    {item.affinity_group_label} ·{" "}
                    {item.region_name ?? "Sem região"} ·{" "}
                    {statusLabels[item.status] ?? item.status}
                  </small>
                </div>
                {canEdit ? (
                  <div className="ambassador-card-actions">
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => edit(item)}
                    >
                      Editar
                    </button>
                    {item.classification === "associate" &&
                    item.status !== "ended" ? (
                      <select
                        aria-label={`Supervisão de ${item.display_name}`}
                        value={item.principal_membership_id ?? ""}
                        onChange={(event) =>
                          void run(
                            {
                              id: item.id,
                              action: "transferAssociate",
                              data: {
                                principal_membership_id:
                                  event.target.value || null,
                                expected_version: item.version,
                              },
                            },
                            "Supervisão transferida.",
                          )
                        }
                      >
                        <option value="">Direto com a plataforma</option>
                        {principals
                          .filter(
                            (principal) =>
                              principal.region_id === item.region_id &&
                              principal.affinity_group_key ===
                                item.affinity_group_key,
                          )
                          .map((principal) => (
                            <option key={principal.id} value={principal.id}>
                              {principal.display_name}
                            </option>
                          ))}
                      </select>
                    ) : null}
                    {item.status === "draft" ? (
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() =>
                          void run(
                            {
                              id: item.id,
                              action: "transitionAssignment",
                              data: {
                                transition: "submit",
                                public_visible: false,
                                expected_version: item.version,
                              },
                            },
                            "Atribuição enviada para revisão.",
                          )
                        }
                      >
                        Enviar para revisão
                      </button>
                    ) : null}
                    {item.status === "draft" || item.status === "pending" ? (
                      <button
                        className="button"
                        type="button"
                        onClick={() =>
                          void run(
                            {
                              id: item.id,
                              action: "transitionAssignment",
                              data: {
                                transition: "activate",
                                public_visible: true,
                                expected_version: item.version,
                              },
                            },
                            "Atribuição ativada.",
                          )
                        }
                      >
                        Ativar
                      </button>
                    ) : null}
                    {item.status === "active" ? (
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() =>
                          void run(
                            {
                              id: item.id,
                              action: "transitionAssignment",
                              data: {
                                transition: "suspend",
                                public_visible: false,
                                expected_version: item.version,
                              },
                            },
                            "Atribuição suspensa.",
                          )
                        }
                      >
                        Suspender
                      </button>
                    ) : null}
                    {item.status === "suspended" ? (
                      <button
                        className="button"
                        type="button"
                        onClick={() =>
                          void run(
                            {
                              id: item.id,
                              action: "transitionAssignment",
                              data: {
                                transition: "reactivate",
                                public_visible: true,
                                expected_version: item.version,
                              },
                            },
                            "Atribuição reativada.",
                          )
                        }
                      >
                        Reativar
                      </button>
                    ) : null}
                    {item.status !== "ended" ? (
                      <button
                        className="button danger"
                        type="button"
                        onClick={() =>
                          void run(
                            {
                              id: item.id,
                              action: "transitionAssignment",
                              data: {
                                transition: "end",
                                public_visible: false,
                                expected_version: item.version,
                              },
                            },
                            "Atribuição encerrada.",
                          )
                        }
                      >
                        Encerrar
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="ambassador-muted">Nenhuma atribuição encontrada.</p>
        )}
      </div>
      {canEdit ? (
        <form className="ambassador-editor" onSubmit={save}>
          <h2>{editing ? "Editar atribuição" : "Nova atribuição"}</h2>
          <label className="ambassador-field">
            <span>Profissional</span>
            <select
              required
              value={accountId}
              disabled={Boolean(editing)}
              onChange={(event) => setAccountId(event.target.value)}
            >
              <option value="">Selecione</option>
              {editing ? (
                <option value={editing.account_id}>
                  {editing.display_name}
                </option>
              ) : (
                data.candidates
                  .filter((item) => !item.has_open_membership)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.display_name} · {item.professional_vertical}
                    </option>
                  ))
              )}
            </select>
          </label>
          <label className="ambassador-field">
            <span>Classificação</span>
            <select
              value={classification}
              onChange={(event) =>
                setClassification(
                  event.target.value as "principal" | "associate",
                )
              }
            >
              <option value="principal">Principal</option>
              <option value="associate">Associado</option>
            </select>
          </label>
          <label className="ambassador-field">
            <span>Região</span>
            <select
              required
              value={draftRegion}
              onChange={(event) => setDraftRegion(event.target.value)}
            >
              <option value="">Selecione</option>
              {data.regions
                .filter((item) => item.active && item.country_code)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          {classification === "associate" ? (
            <label className="ambassador-field">
              <span>Principal</span>
              <select
                value={principalId}
                onChange={(event) => setPrincipalId(event.target.value)}
              >
                <option value="">Supervisão da plataforma</option>
                {principals
                  .filter((item) => item.region_id === draftRegion)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.display_name}
                    </option>
                  ))}
              </select>
            </label>
          ) : null}
          <label className="ambassador-field">
            <span>Apresentação</span>
            <input
              maxLength={160}
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Referência contratual</span>
            <input
              maxLength={160}
              value={contractReference}
              onChange={(event) => setContractReference(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Ordem de exibição</span>
            <input
              type="number"
              min="0"
              max="100000"
              required
              value={displayOrder}
              onChange={(event) => setDisplayOrder(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Início</span>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Fim</span>
            <input
              type="datetime-local"
              value={endsAt}
              min={startsAt || undefined}
              onChange={(event) => setEndsAt(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <input
              type="checkbox"
              checked={publicVisible}
              onChange={(event) => setPublicVisible(event.target.checked)}
            />
            <span>Visível publicamente quando ativa</span>
          </label>
          <button className="button primary" type="submit">
            <Save size={16} />
            Salvar
          </button>
          {editing ? (
            <button
              className="button secondary"
              type="button"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}

function RegionsTab({
  regions,
  canEdit,
  run,
}: {
  regions: AmbassadorRegion[];
  canEdit: boolean;
  run: Run;
}) {
  const [editing, setEditing] = useState<AmbassadorRegion | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [scope, setScope] = useState<AmbassadorRegion["scope_type"]>("country");
  const [country, setCountry] = useState("BR");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [parentId, setParentId] = useState("");
  const [specificity, setSpecificity] = useState("10");
  const [priority, setPriority] = useState("0");
  function edit(region: AmbassadorRegion) {
    setEditing(region);
    setName(region.name);
    setSlug(region.slug);
    setScope(region.scope_type);
    setCountry(region.country_code ?? "");
    setState(region.state_code ?? "");
    setCity(region.city_name ?? "");
    setParentId(region.parent_id ?? "");
    setSpecificity(String(region.specificity));
    setPriority(String(region.priority));
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    const ok = await run(
      {
        id: editing?.id,
        action: "saveRegion",
        data: {
          name,
          slug,
          scope_type: scope,
          country_code: country || null,
          state_code: state || null,
          city_name: city || null,
          parent_id: parentId || null,
          specificity: Number(specificity),
          priority: Number(priority),
          expected_version: editing?.version,
        },
      },
      editing ? "Região atualizada." : "Região criada.",
    );
    if (ok) {
      setEditing(null);
      setName("");
      setSlug("");
      setState("");
      setCity("");
      setParentId("");
    }
  }
  return (
    <div className="ambassador-network-layout">
      <div className="ambassador-list-panel">
        <h2>Regiões comerciais</h2>
        {regions.map((region) => (
          <article className="ambassador-card" key={region.id}>
            <div>
              <strong>{region.name}</strong>
              <span>
                {region.scope_type} · {region.country_code ?? "global"}
                {region.state_code ? ` · ${region.state_code}` : ""}
                {region.city_name ? ` · ${region.city_name}` : ""}
              </span>
              <small>
                Especificidade {region.specificity} · prioridade{" "}
                {region.priority} · {formatNumber(region.assignment_count)}{" "}
                atribuições · v{region.version}
              </small>
            </div>
            {canEdit ? (
              <div className="ambassador-card-actions">
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => edit(region)}
                >
                  Editar
                </button>
                {region.slug !== "global" ? (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() =>
                      void run(
                        {
                          id: region.id,
                          action: "setRegionActive",
                          data: {
                            active: !region.active,
                            expected_version: region.version,
                          },
                        },
                        region.active
                          ? "Região desativada."
                          : "Região ativada.",
                      )
                    }
                  >
                    {region.active ? "Desativar" : "Ativar"}
                  </button>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
      {canEdit ? (
        <form className="ambassador-editor" onSubmit={save}>
          <h2>{editing ? "Editar região" : "Nova região"}</h2>
          <label className="ambassador-field">
            <span>Nome</span>
            <input
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Slug</span>
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Escopo</span>
            <select
              value={scope}
              onChange={(event) =>
                setScope(event.target.value as AmbassadorRegion["scope_type"])
              }
            >
              {(["global", "country", "state", "city", "custom"] as const).map(
                (value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="ambassador-field">
            <span>País ISO</span>
            <input
              pattern="[A-Z]{2}"
              maxLength={2}
              value={country}
              onChange={(event) => setCountry(event.target.value.toUpperCase())}
            />
          </label>
          <label className="ambassador-field">
            <span>Estado</span>
            <input
              maxLength={10}
              value={state}
              onChange={(event) => setState(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Cidade</span>
            <input
              maxLength={100}
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Região superior</span>
            <select
              value={parentId}
              onChange={(event) => setParentId(event.target.value)}
            >
              <option value="">Nenhuma</option>
              {regions
                .filter((item) => item.id !== editing?.id)
                .map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="ambassador-field">
            <span>Especificidade</span>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={specificity}
              onChange={(event) => setSpecificity(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <span>Prioridade</span>
            <input
              type="number"
              min="-1000"
              max="1000"
              required
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            />
          </label>
          <button className="button primary">
            <Save size={16} />
            {editing ? "Salvar região" : "Criar região"}
          </button>
          {editing ? (
            <button
              className="button secondary"
              type="button"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}

function PoliciesTab({
  data,
  canEdit,
  run,
}: {
  data: AmbassadorNetwork;
  canEdit: boolean;
  run: Run;
}) {
  const [editing, setEditing] = useState<AmbassadorNetworkPolicy | null>(null);
  const [affinity, setAffinity] = useState("");
  const [region, setRegion] = useState("");
  const [threshold, setThreshold] = useState("50000");
  const [manualChoice, setManualChoice] = useState(true);
  const [automaticPrincipal, setAutomaticPrincipal] = useState(false);
  const [published, setPublished] = useState(false);
  function edit(policy: AmbassadorNetworkPolicy) {
    setEditing(policy);
    setAffinity(policy.affinity_group_key);
    setRegion(policy.region_id ?? "");
    setThreshold(String(policy.follower_threshold));
    setManualChoice(policy.manual_choice_enabled);
    setAutomaticPrincipal(policy.automatic_principal_enabled);
    setPublished(policy.published);
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    const ok = await run(
      {
        id: editing?.id,
        action: "savePolicy",
        data: {
          affinity_group_key: affinity,
          region_id: region || null,
          follower_threshold: Number(threshold),
          manual_choice_enabled: manualChoice,
          automatic_principal_enabled: automaticPrincipal,
          published,
          expected_version: editing?.version,
        },
      },
      editing ? "Regra atualizada." : "Regra criada.",
    );
    if (ok) {
      setEditing(null);
      setAffinity("");
      setRegion("");
    }
  }
  return (
    <div className="ambassador-network-layout">
      <div className="ambassador-list-panel">
        <div className="ambassador-section-head">
          <div>
            <h2>Regras versionadas</h2>
            <p>O Core aplica a regra publicada mais específica.</p>
          </div>
        </div>
        <ProgramControls
          key={data.program.version}
          data={data}
          canEdit={canEdit}
          run={run}
        />
        {data.policies.map((policy) => (
          <article className="ambassador-card" key={policy.id}>
            <div>
              <strong>
                {data.affinity_groups.find(
                  (item) => item.key === policy.affinity_group_key,
                )?.label ?? policy.affinity_group_key}
              </strong>
              <span>
                {data.regions.find((item) => item.id === policy.region_id)
                  ?.name ?? "Regra global"}{" "}
                · mínimo {formatNumber(policy.follower_threshold)} seguidores
              </span>
              <small>
                Escolha manual {policy.manual_choice_enabled ? "sim" : "não"} ·
                vínculo automático ao ativar Principal{" "}
                {policy.automatic_principal_enabled ? "sim" : "não"} · v
                {policy.version} · {policy.published ? "Publicada" : "Rascunho"}
              </small>
            </div>
            {canEdit ? (
              <button
                className="button secondary"
                type="button"
                onClick={() => edit(policy)}
              >
                Editar
              </button>
            ) : null}
          </article>
        ))}
      </div>
      {canEdit ? (
        <form className="ambassador-editor" onSubmit={save}>
          <h2>{editing ? "Editar regra" : "Nova regra"}</h2>
          <label className="ambassador-field">
            <span>Vertical</span>
            <select
              required
              value={affinity}
              onChange={(event) => setAffinity(event.target.value)}
            >
              <option value="">Selecione</option>
              {data.affinity_groups
                .filter((item) => item.active)
                .map((item) => (
                  <option value={item.key} key={item.key}>
                    {item.label}
                  </option>
                ))}
            </select>
          </label>
          <label className="ambassador-field">
            <span>Região</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              <option value="">Global</option>
              {data.regions.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="ambassador-field">
            <span>Mínimo de seguidores</span>
            <input
              type="number"
              min="0"
              required
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
            />
          </label>
          <label className="ambassador-field">
            <input
              type="checkbox"
              checked={manualChoice}
              onChange={(event) => setManualChoice(event.target.checked)}
            />
            <span>Permitir escolha manual</span>
          </label>
          <label className="ambassador-field">
            <input
              type="checkbox"
              checked={automaticPrincipal}
              onChange={(event) => setAutomaticPrincipal(event.target.checked)}
            />
            <span>Vincular associados sem Principal ao ativá-lo</span>
          </label>
          <label className="ambassador-field">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            <span>Regra publicada</span>
          </label>
          <button className="button primary">
            <Save size={16} />
            {editing ? "Salvar regra" : "Criar regra"}
          </button>
          {editing ? (
            <button
              className="button secondary"
              type="button"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}

function ProgramControls({
  data,
  canEdit,
  run,
}: {
  data: AmbassadorNetwork;
  canEdit: boolean;
  run: Run;
}) {
  const [networkEnabled, setNetworkEnabled] = useState(
    data.program.network_enabled,
  );
  const [onboardingEnabled, setOnboardingEnabled] = useState(
    data.program.onboarding_enabled,
  );
  const [allowDirect, setAllowDirect] = useState(data.program.allow_direct);
  return (
    <form
      className="ambassador-editor"
      onSubmit={(event) => {
        event.preventDefault();
        void run(
          {
            action: "setProgram",
            data: {
              network_enabled: networkEnabled,
              onboarding_enabled: onboardingEnabled,
              allow_direct: allowDirect,
              expected_version: data.program.version,
            },
          },
          "Configuração do programa atualizada.",
        );
      }}
    >
      <h3>Configuração do programa</h3>
      <label className="ambassador-field">
        <input
          type="checkbox"
          checked={networkEnabled}
          disabled={!canEdit}
          onChange={(event) => setNetworkEnabled(event.target.checked)}
        />
        <span>Rede habilitada</span>
      </label>
      <label className="ambassador-field">
        <input
          type="checkbox"
          checked={onboardingEnabled}
          disabled={!canEdit}
          onChange={(event) => setOnboardingEnabled(event.target.checked)}
        />
        <span>Entrada de novos participantes</span>
      </label>
      <label className="ambassador-field">
        <input
          type="checkbox"
          checked={allowDirect}
          disabled={!canEdit}
          onChange={(event) => setAllowDirect(event.target.checked)}
        />
        <span>Associados diretamente à plataforma</span>
      </label>
      {canEdit ? (
        <button className="button primary" type="submit">
          <Save size={16} />
          Salvar programa
        </button>
      ) : null}
    </form>
  );
}

function RequestsTab({
  data,
  canEdit,
  run,
}: {
  data: AmbassadorNetwork;
  canEdit: boolean;
  run: Run;
}) {
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const principals = data.assignments.filter(
    (item) => item.status === "active",
  );
  return (
    <div className="ambassador-list-panel">
      <h2>Solicitações de entrada</h2>
      {data.requests.length ? (
        data.requests.map((request) => (
          <article className="ambassador-card" key={request.id}>
            <div>
              <strong>{request.display_name}</strong>
              <span>
                @{request.username} · {request.affinity_group_label}
              </span>
              <small>
                {request.country_code}
                {request.state_code ? ` · ${request.state_code}` : ""}
              </small>
            </div>
            {canEdit ? (
              <div className="ambassador-card-actions">
                <select
                  aria-label={`Principal de ${request.display_name}`}
                  value={request.principal_membership_id ?? ""}
                  onChange={(event) =>
                    void run(
                      {
                        id: request.id,
                        action: "transferRequest",
                        data: {
                          principal_membership_id: event.target.value || null,
                          reason: "Seleção administrativa",
                          expected_version: request.version,
                        },
                      },
                      "Destino atualizado.",
                    )
                  }
                >
                  <option value="">Sem Principal</option>
                  {principals
                    .filter(
                      (item) =>
                        item.affinity_group_key === request.affinity_group_key,
                    )
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.display_name}
                      </option>
                    ))}
                </select>
                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    void run(
                      {
                        id: request.id,
                        action: "decideRequest",
                        data: {
                          decision: "approve",
                          principal_membership_id:
                            request.principal_membership_id,
                          expected_version: request.version,
                        },
                      },
                      "Solicitação aprovada.",
                    )
                  }
                >
                  Aprovar
                </button>
                <input
                  aria-label={`Motivo para rejeitar ${request.display_name}`}
                  placeholder="Motivo da rejeição"
                  minLength={3}
                  value={reasons[request.id] ?? ""}
                  onChange={(event) =>
                    setReasons((current) => ({
                      ...current,
                      [request.id]: event.target.value,
                    }))
                  }
                />
                <button
                  className="button danger"
                  type="button"
                  disabled={(reasons[request.id]?.trim().length ?? 0) < 3}
                  onClick={() =>
                    void run(
                      {
                        id: request.id,
                        action: "decideRequest",
                        data: {
                          decision: "reject",
                          reason: reasons[request.id],
                          expected_version: request.version,
                        },
                      },
                      "Solicitação rejeitada.",
                    )
                  }
                >
                  Rejeitar
                </button>
              </div>
            ) : null}
          </article>
        ))
      ) : (
        <p className="ambassador-muted">Nenhuma solicitação pendente.</p>
      )}
    </div>
  );
}
