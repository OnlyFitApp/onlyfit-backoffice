import { Component, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { trendLabel, trendOf, type TrendDirection } from '../lib/networkHealth';
import { extractAcronym } from '../lib/metricDefinitions';

export type MetricIcon = ComponentType<{ size?: number | string }>;

export type MetricComparison = {
  label: string;
  current: number | null | undefined;
  previous: number | null | undefined;
  /** Marca alta como sinal ruim (churn, fila, inadimplência). */
  invert?: boolean;
};

export function TrendMark({ current, previous, invert = false }: Omit<MetricComparison, 'label'>) {
  const direction = trendOf(current, previous);
  const visual: TrendDirection = invert
    ? (direction === 'up' ? 'down' : direction === 'down' ? 'up' : 'flat')
    : direction;
  return (
    <span className={`health-trend health-trend-${visual}`} aria-hidden="true">{trendLabel(direction)}</span>
  );
}

function MetricTitle({ title, icon: Icon }: { title: string; icon: MetricIcon }) {
  const acronymData = extractAcronym(title);

  if (!acronymData) {
    return (
      <div className="metric-title">
        <span>{title}</span>
        <Icon size={18} />
      </div>
    );
  }

  return (
    <div className="metric-title">
      <span className="metric-title-with-tooltip">
        {title}
        <span className="metric-tooltip-trigger" data-tooltip={acronymData.definition}>
          <Info size={14} aria-label={`Informação: ${acronymData.definition}`} />
        </span>
      </span>
      <Icon size={18} />
    </div>
  );
}

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = 'neutral',
  comparison,
  onOpen,
}: {
  title: string;
  value: string;
  detail?: string;
  icon: MetricIcon;
  tone?: 'neutral' | 'finance' | 'attention';
  comparison?: MetricComparison;
  onOpen?: () => void;
}) {
  // Sem valor anterior não existe tendência: mostrar seta e traço só polui o cartão.
  const showComparison = comparison != null && comparison.current != null && comparison.previous != null;

  const body = (
    <>
      <MetricTitle title={title} icon={Icon} />
      <strong>{value}</strong>
      {(showComparison || detail) && (
        <p className="metric-foot">
          {showComparison && (
            <span className="metric-compare">
              <TrendMark current={comparison.current} previous={comparison.previous} invert={comparison.invert} />
              {comparison.label}
            </span>
          )}
          {detail && <span>{detail}</span>}
        </p>
      )}
    </>
  );

  if (onOpen) {
    return (
      <button className={`metric-card metric-${tone} metric-card-button`} type="button" onClick={onOpen}>
        {body}
      </button>
    );
  }

  return <article className={`metric-card metric-${tone}`}>{body}</article>;
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="dashboard-grid">{children}</div>;
}

export function DashboardSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-head">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function MetricSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="dashboard-grid" aria-label="Carregando indicadores">
      {Array.from({ length: count }, (_, index) => <div className="skeleton" key={index} />)}
    </div>
  );
}

/**
 * Um bloco com dado inesperado não pode derrubar o backoffice inteiro: isola a falha
 * e mantém o resto do painel navegável.
 */
export class DashboardBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Falha ao montar um bloco do dashboard', error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="inline-alert soft" role="alert">
          <AlertTriangle size={18} />
          Este bloco não pôde ser montado com os dados que o banco devolveu. O restante do painel continua disponível.
        </div>
      );
    }
    return this.props.children;
  }
}
