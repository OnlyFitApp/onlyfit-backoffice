import {
  Archive,
  Eye,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldAlert,
  Undo2,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import {
  useCommunitiesForModeration,
  useModerateCommunity,
} from "../hooks/useCommunityModeration";
import type {
  CommunityLifecycle,
  CommunityModerationAction,
  ModeratedCommunity,
} from "../lib/communityModeration";

const pageSize = 50;
const states: Array<{ value: CommunityLifecycle | null; label: string }> = [
  { value: null, label: "Todas" },
  { value: "published", label: "Ativas" },
  { value: "read_only", label: "Somente leitura" },
  { value: "suspended", label: "Suspensas" },
  { value: "archived", label: "Arquivadas" },
];

const statusLabel: Record<CommunityLifecycle, string> = {
  draft: "Rascunho",
  published: "Ativa",
  read_only: "Somente leitura",
  suspended: "Suspensa",
  archived: "Arquivada",
};

export function CommunityModerationPage() {
  const [status, setStatus] = useState<CommunityLifecycle | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const communities = useCommunitiesForModeration(
    status,
    query.trim(),
    pageSize,
    page * pageSize,
  );
  const moderation = useModerateCommunity();

  const act = (
    community: ModeratedCommunity,
    action: CommunityModerationAction,
  ) => {
    const reason =
      action === "suspend" || action === "archive"
        ? window.prompt("Motivo da ação (registrado na auditoria):")?.trim()
        : "";
    if ((action === "suspend" || action === "archive") && !reason) return;
    setMessage(null);
    moderation.mutate(
      { communityId: community.id, action, reason },
      {
        onSuccess: () => setMessage("Comunidade atualizada."),
        onError: () => setMessage("Não foi possível atualizar a comunidade."),
      },
    );
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="section-label">Confiança e segurança</p>
          <h1>Comunidades</h1>
          <span>Visão operacional e ações excepcionais de plataforma.</span>
        </div>
        <button
          className="button secondary"
          type="button"
          onClick={() => communities.refetch()}
          disabled={communities.isFetching}
        >
          <RefreshCw
            className={communities.isFetching ? "spin" : ""}
            size={16}
          />{" "}
          Atualizar
        </button>
      </header>

      <section className="content community-moderation-page">
        <div className="community-moderation-toolbar">
          <div
            className="beta-segments"
            role="tablist"
            aria-label="Filtrar comunidades"
          >
            {states.map((item) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={status === item.value}
                className={status === item.value ? "active" : ""}
                onClick={() => {
                  setStatus(item.value);
                  setPage(0);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="community-moderation-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder="Buscar comunidade"
            />
          </label>
        </div>

        {message && (
          <div
            className={`inline-alert ${message.startsWith("Não") ? "danger" : ""}`}
            role="status"
          >
            {message}
          </div>
        )}
        {communities.isLoading ? (
          <div className="beta-empty">
            <RefreshCw className="spin" size={22} /> Carregando…
          </div>
        ) : communities.isError ? (
          <div className="inline-alert danger">
            <ShieldAlert size={18} /> Não foi possível carregar as comunidades.
          </div>
        ) : communities.data?.items.length === 0 ? (
          <div className="beta-empty">
            <UsersRound size={30} />
            <strong>Nenhuma comunidade</strong>
          </div>
        ) : (
          <div className="community-moderation-grid">
            {communities.data?.items.map((community) => (
              <article key={community.id} className="community-moderation-card">
                {community.image_url ? (
                  <img src={community.image_url} alt="" />
                ) : (
                  <div className="community-moderation-cover">
                    <UsersRound size={24} />
                  </div>
                )}
                <div className="community-moderation-body">
                  <div className="community-moderation-title">
                    <div>
                      <span>{community.organization_name || "Negócio"}</span>
                      <h2>{community.name}</h2>
                    </div>
                    <span
                      className={`review-status ${community.lifecycle_status}`}
                    >
                      {statusLabel[community.lifecycle_status]}
                    </span>
                  </div>
                  <div className="community-moderation-stats">
                    <span>
                      <UsersRound size={14} /> {community.member_count}
                    </span>
                    {community.pending_posts > 0 && (
                      <span>
                        <ShieldAlert size={14} /> {community.pending_posts}{" "}
                        pendente{community.pending_posts === 1 ? "" : "s"}
                      </span>
                    )}
                    <span>
                      <Eye size={14} /> {community.discovery_visibility}
                    </span>
                  </div>
                  <div className="review-report-actions">
                    {community.lifecycle_status !== "published" && (
                      <button
                        className="button secondary"
                        type="button"
                        disabled={moderation.isPending}
                        onClick={() => act(community, "restore")}
                      >
                        <Undo2 size={15} /> Restaurar
                      </button>
                    )}
                    {community.lifecycle_status === "published" && (
                      <button
                        className="button secondary"
                        type="button"
                        disabled={moderation.isPending}
                        onClick={() => act(community, "read_only")}
                      >
                        <LockKeyhole size={15} /> Somente leitura
                      </button>
                    )}
                    {community.lifecycle_status !== "suspended" &&
                      community.lifecycle_status !== "archived" && (
                        <button
                          className="button danger"
                          type="button"
                          disabled={moderation.isPending}
                          onClick={() => act(community, "suspend")}
                        >
                          <ShieldAlert size={15} /> Suspender
                        </button>
                      )}
                    {community.lifecycle_status !== "archived" && (
                      <button
                        className="button secondary"
                        type="button"
                        disabled={moderation.isPending}
                        onClick={() => act(community, "archive")}
                      >
                        <Archive size={15} /> Arquivar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {communities.data && communities.data.total > pageSize && (
          <div className="beta-pagination">
            <button
              className="button secondary"
              type="button"
              disabled={page === 0}
              onClick={() => setPage((value) => value - 1)}
            >
              Anterior
            </button>
            <span>
              {page + 1} / {Math.ceil(communities.data.total / pageSize)}
            </span>
            <button
              className="button secondary"
              type="button"
              disabled={(page + 1) * pageSize >= communities.data.total}
              onClick={() => setPage((value) => value + 1)}
            >
              Próxima
            </button>
          </div>
        )}
      </section>
    </>
  );
}
