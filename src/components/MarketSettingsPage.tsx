import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Check,
  Megaphone,
  Plus,
  Pencil,
  RefreshCw,
  Save,
  Tags,
} from "lucide-react";
import { FormEvent, useState } from "react";
import {
  useMarketStores,
  useMarketStoreBusinesses,
  useSaveMarketStore,
  useProductCategories,
  useSaveProductCategory,
} from "../hooks/useMarketSettings";
import type {
  MarketStore,
  MarketStoreInput,
  ProductCategory,
} from "../lib/marketSettings";
import { useCurrentStaffRole } from "../hooks/useStaffManagement";
import {
  heroFocusPattern,
  MarketStoreHeroEditor,
  tileBgPattern,
} from "./MarketStoreHeroEditor";
import { formatNumber } from "../lib/format";

const businessStatusLabels: Record<MarketStore["business_status"], string> = {
  draft: "Rascunho",
  pending_review: "Em verificação",
  rejected: "Rejeitado",
  published: "Publicado",
  paused: "Pausado",
  suspended: "Suspenso",
  archived: "Arquivado",
};

function businessStatusLabel(status: MarketStore["business_status"]): string {
  return businessStatusLabels[status] ?? "Estado não reconhecido";
}

const emptyCategory: ProductCategory = {
  slug: "",
  label: "",
  icon: "package",
  sort_order: 100,
  is_active: true,
};

const emptyMarketStore: MarketStoreInput = {
  key: "",
  business_id: "",
  tagline: "",
  category: "",
  cover_image_url: null,
  hero_focus: null,
  tile_bg: null,
  official: true,
  featured: false,
  featured_starts_at: null,
  featured_ends_at: null,
  position: 100,
  expected_version: null,
};

export function MarketSettingsPage() {
  const { data: role } = useCurrentStaffRole();
  const canEdit = role === "super_admin" || role === "admin";
  const categories = useProductCategories();
  const marketStores = useMarketStores();

  const refreshAll = () => {
    void categories.refetch();
    void marketStores.refetch();
  };

  const refreshing =
    categories.isFetching || marketStores.isFetching;

  return (
    <>
      <header className="page-header">
        <div>
          <p className="section-label">Configuração</p>
          <h1>Mercado</h1>
          <span>
            Contratos de lojas oficiais, destaques do topo e categorias do
            catálogo canônico.
          </span>
        </div>
        <div className="header-actions">
          <button
            className="button secondary"
            type="button"
            onClick={refreshAll}
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? "spin" : ""} size={16} />{" "}
            Atualizar
          </button>
        </div>
      </header>

      <section className="content market-page">
        <MarketStoresSection
          stores={marketStores.data ?? []}
          loading={marketStores.isLoading}
          error={marketStores.isError}
          canEdit={canEdit}
        />
        <CategoriesSection
          categories={categories.data ?? []}
          loading={categories.isLoading}
          error={categories.isError}
          canEdit={canEdit}
        />
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Lojas oficiais e lojas em destaque                                 */
/* ------------------------------------------------------------------ */

function MarketStoresSection({
  stores,
  loading,
  error,
  canEdit,
}: {
  stores: MarketStore[];
  loading: boolean;
  error: boolean;
  canEdit: boolean;
}) {
  const saveStore = useSaveMarketStore();
  const [editing, setEditing] = useState<MarketStoreInput | null>(null);
  const [businessQuery, setBusinessQuery] = useState("");
  const businesses = useMarketStoreBusinesses(businessQuery);
  const editingStore = stores.find((store) => store.business_id === editing?.business_id);
  const editingBusiness = businesses.data?.find(
    (business) => business.id === editing?.business_id,
  );
  const editingName = editingBusiness?.name ?? editingStore?.name ?? "";
  const editingLogo = editingBusiness?.logo_url ?? editingStore?.logo_url ?? null;
  const [feedback, setFeedback] = useState<Feedback>(null);

  const startCreate = () => {
    setEditing({ ...emptyMarketStore });
    setBusinessQuery("");
    setFeedback(null);
  };

  const startEdit = (store: MarketStore) => {
    setEditing({
      key: store.key,
      business_id: store.business_id,
      tagline: store.tagline,
      category: store.category,
      cover_image_url: store.cover_image_url,
      hero_focus: store.hero_focus,
      tile_bg: store.tile_bg,
      official: store.official,
      featured: store.featured,
      featured_starts_at: store.featured_starts_at,
      featured_ends_at: store.featured_ends_at,
      position: store.position,
      expected_version: store.version,
    });
    setBusinessQuery(store.name);
    setFeedback(null);
  };

  const update = <K extends keyof MarketStoreInput>(
    key: K,
    value: MarketStoreInput[K],
  ) =>
    setEditing((current) => (current ? { ...current, [key]: value } : current));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    if (!editing.business_id || !/^[a-z0-9_]{2,40}$/.test(editing.key)) {
      setFeedback({ tone: "danger", text: "Selecione um negócio válido." });
      return;
    }
    if (editing.hero_focus && !heroFocusPattern.test(editing.hero_focus)) {
      setFeedback({
        tone: "danger",
        text: "Foco da foto deve ser horizontal e vertical em %, ex.: 50% 25%.",
      });
      return;
    }
    if (editing.tile_bg && !tileBgPattern.test(editing.tile_bg)) {
      setFeedback({
        tone: "danger",
        text: "Fundo do tile deve ser uma cor hexadecimal, ex.: #FFFFFF.",
      });
      return;
    }
    if (editing.featured && !editing.official) {
      setFeedback({
        tone: "danger",
        text: "Somente uma loja oficial pode ficar em destaque.",
      });
      return;
    }
    setFeedback(null);
    saveStore.mutate(editing, {
      onSuccess: (saved) => {
        setFeedback({
          tone: saved.business_status === "published" ? "ok" : "warning",
          text: saved.business_status === "published"
            ? "Configuração da loja salva. Negócio publicado."
            : `Configuração da loja salva. ${businessStatusLabel(saved.business_status)}: a loja não está publicada e não é exibida no Mercado.`,
        });
        setEditing(null);
      },
      onError: (saveError) =>
        setFeedback({
          tone: "danger",
          text:
            saveError instanceof Error
              ? saveError.message
              : "Não foi possível salvar.",
        }),
    });
  };

  return (
    <MarketPanel
      icon={Building2}
      title="Lojas oficiais e destaque"
      meta={`${stores.length} marca(s)`}
    >
      <div className="official-store-toolbar">
        <p>
          Oficial confirma o contrato com a marca. Destaque promove uma loja
          oficial no topo do Mercado, dentro do período configurado. Salvar a
          configuração não publica o negócio: lojas em rascunho permanecem
          salvas, mas não são exibidas no Mercado.
        </p>
        {canEdit && (
          <button
            className="button primary"
            type="button"
            onClick={startCreate}
          >
            <Plus size={16} /> Configurar marca
          </button>
        )}
      </div>

      {error ? (
        <div className="inline-alert danger" role="alert">
          <AlertTriangle size={18} /> Não foi possível carregar as lojas.
        </div>
      ) : loading ? (
        <div className="skeleton market-skeleton" />
      ) : stores.length === 0 ? (
        <p className="market-empty">
          <Building2 size={20} aria-hidden="true" /> Nenhuma marca configurada
        </p>
      ) : (
        <div className="official-store-grid">
          {stores.map((store) => (
            <article className="official-store-card" key={store.key}>
              <div className="official-store-logo">
                {store.logo_url ? (
                  <img src={store.logo_url} alt="" />
                ) : (
                  <span>{store.name.charAt(0)}</span>
                )}
              </div>
              <div className="official-store-copy">
                <span>
                  <BadgeCheck size={13} />{" "}
                  {store.official ? "Loja oficial" : "Sem contrato oficial"}
                </span>
                <strong>{store.name}</strong>
                <small>{store.category || "Sem categoria"}</small>
              </div>
              <div className="official-store-states">
                <span
                  className={`market-pill ${store.business_status === "published" ? "ok" : "warning"}`}
                >
                  {businessStatusLabel(store.business_status)}
                </span>
                <span className="market-pill muted">
                  {store.featured ? "Destaque configurado" : "Sem destaque no topo"}
                </span>
              </div>
              <p className="official-store-publication-note">
                {store.business_status === "published"
                  ? "Configuração salva. Negócio publicado."
                  : "Configuração salva. Loja não publicada; não é exibida no Mercado."}
              </p>
              {canEdit && (
                <div className="official-store-actions">
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={`Editar ${store.name}`}
                    onClick={() => startEdit(store)}
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {editing && canEdit && (
        <form className="official-store-editor" onSubmit={submit}>
          <header className="official-store-editor-head">
            <div>
              <span>
                {editing.expected_version ? "Editar marca" : "Nova marca"}
              </span>
              <h3>Contrato e destaque</h3>
            </div>
            <button
              className="button ghost"
              type="button"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
          </header>
          <p className="market-empty">
            Salvar mantém a configuração da loja. A publicação do negócio é
            independente do contrato oficial e do destaque.
          </p>
          <div className="official-store-form-grid">
            <label className="market-field wide">
              <span>Buscar negócio</span>
              <input
                value={businessQuery}
                onChange={(event) => setBusinessQuery(event.target.value)}
                placeholder="Nome da marca"
              />
            </label>
            <label className="market-field wide">
              <span>Negócio</span>
              <select
                required
                disabled={editing.expected_version != null}
                value={editing.business_id}
                onChange={(event) => {
                  const business = businesses.data?.find(
                    (item) => item.id === event.target.value,
                  );
                  update("business_id", event.target.value);
                  if (business)
                    update(
                      "key",
                      business.name
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "_")
                        .replace(/^_|_$/g, "")
                        .slice(0, 40),
                    );
                }}
              >
                <option value="">Selecione</option>
                {businesses.data?.map((business) => (
                  <option
                    key={business.id}
                    value={business.id}
                    disabled={
                      business.already_configured &&
                      business.id !== editing.business_id
                    }
                  >
                    {business.name} · {businessStatusLabel(business.status)}
                    {business.already_configured ? " · já configurada" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="market-field">
              <span>Categoria</span>
              <input
                maxLength={80}
                value={editing.category ?? ""}
                onChange={(event) => update("category", event.target.value)}
              />
            </label>
            <label className="market-field">
              <span>Ordem no destaque</span>
              <input
                type="number"
                min="0"
                value={editing.position}
                onChange={(event) =>
                  update("position", Number(event.target.value))
                }
              />
            </label>
            <label className="market-field wide">
              <span>Frase curta</span>
              <input
                maxLength={160}
                value={editing.tagline ?? ""}
                onChange={(event) => update("tagline", event.target.value)}
              />
            </label>
            <div className="market-field wide">
              <MarketStoreHeroEditor
                value={editing}
                name={editingName}
                category={editing.category}
                tagline={editing.tagline}
                logoUrl={editingLogo}
                onChange={(patch) =>
                  setEditing((current) => (current ? { ...current, ...patch } : current))
                }
              />
            </div>
            <SwitchField
              label="Contrato verificado · loja oficial"
              checked={editing.official}
              disabled={false}
              onChange={(value) =>
                setEditing((current) =>
                  current
                    ? {
                        ...current,
                        official: value,
                        featured: value ? current.featured : false,
                      }
                    : current,
                )
              }
            />
            <SwitchField
              label="Exibir como loja destaque"
              checked={editing.featured}
              disabled={!editing.official}
              onChange={(value) => update("featured", value)}
            />
          </div>
          <footer className="market-form-actions">
            <FeedbackLine feedback={feedback} />
            <button
              className="button primary"
              type="submit"
              disabled={saveStore.isPending}
            >
              {saveStore.isPending ? (
                <RefreshCw className="spin" size={16} />
              ) : (
                <Save size={16} />
              )}{" "}
              Salvar configuração
            </button>
          </footer>
        </form>
      )}
      {!editing && <FeedbackLine feedback={feedback} />}
    </MarketPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Categorias                                                          */
/* ------------------------------------------------------------------ */

function CategoriesSection({
  categories,
  loading,
  error,
  canEdit,
}: {
  categories: ProductCategory[];
  loading: boolean;
  error: boolean;
  canEdit: boolean;
}) {
  const saveCategory = useSaveProductCategory();
  const [draft, setDraft] = useState<ProductCategory>(emptyCategory);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const slugTaken = categories.some(
    (category) => category.slug === draft.slug.trim(),
  );
  const draftValid =
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug.trim()) &&
    draft.label.trim().length > 0 &&
    !slugTaken;

  const create = (event: FormEvent) => {
    event.preventDefault();
    setFeedback(null);
    saveCategory.mutate(
      {
        ...draft,
        slug: draft.slug.trim(),
        label: draft.label.trim(),
        icon: draft.icon.trim() || "package",
      },
      {
        onSuccess: () => {
          setDraft(emptyCategory);
          setFeedback({ tone: "ok", text: "Categoria criada." });
        },
        onError: (error) =>
          setFeedback({
            tone: "danger",
            text:
              error instanceof Error
                ? error.message
                : "Não foi possível criar a categoria.",
          }),
      },
    );
  };

  return (
    <MarketPanel
      icon={Tags}
      title="Categorias"
      meta={`${formatNumber(categories.length)} cadastrada(s)`}
    >
      {error ? (
        <div className="inline-alert danger" role="alert">
          <AlertTriangle size={18} /> Não foi possível carregar as categorias.
        </div>
      ) : loading ? (
        <div className="skeleton market-skeleton" />
      ) : categories.length === 0 ? (
        <p className="market-empty">
          <Tags size={20} aria-hidden="true" /> Nenhuma categoria cadastrada
        </p>
      ) : (
        <div className="market-table-wrap">
          <table className="market-table market-category-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Chave</th>
                <th>Ícone</th>
                <th>Ordem</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <CategoryRow
                  key={`${category.slug}-${category.label}-${category.icon}-${category.sort_order}-${category.is_active}`}
                  category={category}
                  canEdit={canEdit}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canEdit && (
        <form className="market-category-form" onSubmit={create}>
          <label className="market-field">
            <span>Nome</span>
            <input
              required
              value={draft.label}
              onChange={(event) =>
                setDraft((value) => ({ ...value, label: event.target.value }))
              }
            />
          </label>
          <label className="market-field">
            <span>Chave</span>
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={draft.slug}
              aria-invalid={slugTaken || undefined}
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  slug: event.target.value.toLowerCase(),
                }))
              }
            />
          </label>
          <label className="market-field">
            <span>Ícone</span>
            <input
              required
              value={draft.icon}
              onChange={(event) =>
                setDraft((value) => ({ ...value, icon: event.target.value }))
              }
            />
          </label>
          <label className="market-field compact">
            <span>Ordem</span>
            <input
              type="number"
              value={draft.sort_order}
              onChange={(event) =>
                setDraft((value) => ({
                  ...value,
                  sort_order: Number(event.target.value),
                }))
              }
            />
          </label>
          <button
            className="button secondary"
            type="submit"
            disabled={saveCategory.isPending || !draftValid}
          >
            {saveCategory.isPending ? (
              <RefreshCw className="spin" size={16} />
            ) : (
              <Plus size={16} />
            )}{" "}
            Adicionar
          </button>
          <FeedbackLine
            feedback={
              slugTaken ? { tone: "danger", text: "Chave já usada." } : feedback
            }
          />
        </form>
      )}
    </MarketPanel>
  );
}

function CategoryRow({
  category,
  canEdit,
}: {
  category: ProductCategory;
  canEdit: boolean;
}) {
  const saveCategory = useSaveProductCategory();
  const [value, setValue] = useState(category);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const dirty =
    value.label !== category.label ||
    value.icon !== category.icon ||
    value.sort_order !== category.sort_order ||
    value.is_active !== category.is_active;
  const valid = value.label.trim().length > 0 && value.icon.trim().length > 0;

  const submit = () => {
    setFeedback(null);
    saveCategory.mutate(value, {
      onSuccess: () => setFeedback({ tone: "ok", text: "Categoria salva." }),
      onError: (error) =>
        setFeedback({
          tone: "danger",
          text:
            error instanceof Error ? error.message : "Não foi possível salvar.",
        }),
    });
  };

  return (
    <tr>
      <td>
        <input
          className="of-field"
          value={value.label}
          disabled={!canEdit}
          aria-label={`Nome de ${category.label}`}
          onChange={(event) =>
            setValue((current) => ({ ...current, label: event.target.value }))
          }
        />
      </td>
      <td>
        <code>{value.slug}</code>
      </td>
      <td>
        <input
          className="of-field"
          value={value.icon}
          disabled={!canEdit}
          aria-label={`Ícone de ${category.label}`}
          onChange={(event) =>
            setValue((current) => ({ ...current, icon: event.target.value }))
          }
        />
      </td>
      <td>
        <input
          className="of-field market-numeric-input"
          type="number"
          value={value.sort_order}
          disabled={!canEdit}
          aria-label={`Ordem de ${category.label}`}
          onChange={(event) =>
            setValue((current) => ({
              ...current,
              sort_order: Number(event.target.value),
            }))
          }
        />
      </td>
      <td>
        <SwitchField
          label={`Categoria ${category.label} ativa`}
          hideLabel
          checked={value.is_active}
          disabled={!canEdit}
          onChange={(next) =>
            setValue((current) => ({ ...current, is_active: next }))
          }
        />
      </td>
      <td>
        {canEdit && (
          <button
            className="icon-button"
            type="button"
            disabled={saveCategory.isPending || !dirty || !valid}
            aria-label={`Salvar ${category.label}`}
            title={feedback?.text ?? "Salvar categoria"}
            onClick={submit}
          >
            {saveCategory.isPending ? (
              <RefreshCw className="spin" size={16} />
            ) : (
              <Save size={16} />
            )}
          </button>
        )}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Peças compartilhadas                                                */
/* ------------------------------------------------------------------ */

type Feedback = { tone: "ok" | "warning" | "danger"; text: string } | null;

function FeedbackLine({ feedback }: { feedback: Feedback }) {
  if (!feedback) return <span className="market-feedback" aria-hidden="true" />;
  return (
    <p
      className={`market-feedback ${feedback.tone}`}
      role={feedback.tone === "danger" ? "alert" : "status"}
    >
      {feedback.tone === "ok" ? (
        <Check size={14} />
      ) : (
        <AlertTriangle size={14} />
      )}
      {feedback.text}
    </p>
  );
}

function MarketPanel({
  icon: Icon,
  title,
  meta,
  children,
}: {
  icon: typeof Megaphone;
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="market-panel">
      <header className="market-panel-head">
        <span className="market-panel-icon" aria-hidden="true">
          <Icon size={17} />
        </span>
        <h2>{title}</h2>
        {meta && <p>{meta}</p>}
      </header>
      {children}
    </section>
  );
}

function SwitchField({
  label,
  checked,
  disabled,
  hideLabel,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled: boolean;
  hideLabel?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className={`market-switch ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={hideLabel ? label : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="market-switch-track" aria-hidden="true">
        <span className="market-switch-thumb" />
      </span>
      {!hideLabel && <span className="market-switch-label">{label}</span>}
    </label>
  );
}
