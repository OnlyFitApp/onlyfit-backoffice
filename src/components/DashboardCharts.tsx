import { BarChart3, ReceiptText } from 'lucide-react';
import { formatCurrency, formatNumber, parseSnapshotDay } from '../lib/format';
import type { WeeklyActivity, WeeklyFinance } from '../lib/dashboard';
import type { DauPoint } from '../lib/networkHealth';

const CHART_WIDTH = 720;
const CHART_HEIGHT = 220;

function weekdayLabel(date: string): string {
  const day = parseSnapshotDay(date);
  if (!day) return '—';
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(day).replace('.', '');
}

function dayMonthLabel(date: string): string {
  const day = parseSnapshotDay(date);
  if (!day) return '—';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(day);
}

function GridLines() {
  return (
    <>
      {[0, 1, 2, 3].map((line) => {
        const y = 28 + line * 44;
        return <line key={line} x1="24" x2={CHART_WIDTH - 24} y1={y} y2={y} className="grid-line" />;
      })}
    </>
  );
}

export function AppActivityChart({ activity }: { activity: WeeklyActivity[] }) {
  const max = Math.max(
    1,
    ...activity.flatMap((point) => [
      point.completed_sessions,
      point.posts_created,
      point.saves_created,
      point.comments_created,
    ]),
  );
  const denominator = Math.max(1, activity.length - 1);
  const points = activity.map((point, index) => ({
    ...point,
    label: weekdayLabel(point.date),
    x: 24 + (index * (CHART_WIDTH - 48)) / denominator,
    sessionsY: CHART_HEIGHT - 28 - (point.completed_sessions / max) * (CHART_HEIGHT - 56),
    postsY: CHART_HEIGHT - 28 - (point.posts_created / max) * (CHART_HEIGHT - 56),
    savesY: CHART_HEIGHT - 28 - (point.saves_created / max) * (CHART_HEIGHT - 56),
    commentsY: CHART_HEIGHT - 28 - (point.comments_created / max) * (CHART_HEIGHT - 56),
  }));
  const pathFor = (key: 'sessionsY' | 'postsY' | 'savesY' | 'commentsY') => (
    points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point[key]}`).join(' ')
  );
  const total = activity.reduce(
    (sum, point) => sum + point.completed_sessions + point.posts_created + point.saves_created + point.comments_created,
    0,
  );

  return (
    <figure className="chart-panel">
      <figcaption>
        <div>
          <strong>Atividade dos últimos 7 dias</strong>
          <span>Treinos, posts, comentários e salvamentos por dia</span>
        </div>
        <div className="chart-total">
          <BarChart3 size={16} />
          <strong>{formatNumber(total)}</strong>
          <span>ações no período</span>
        </div>
      </figcaption>

      {total === 0 ? (
        <p className="empty-copy">Nenhuma ação registrada no app nos últimos 7 dias.</p>
      ) : (
        <>
          <div className="chart-legend" aria-label="Legenda do gráfico de atividade">
            <span><i className="legend-workouts" />Treinos</span>
            <span><i className="legend-posts" />Posts</span>
            <span><i className="legend-comments" />Comentários</span>
            <span><i className="legend-saves" />Salvos</span>
          </div>
          <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="Ações do app nos últimos sete dias">
            <GridLines />
            <path d={pathFor('sessionsY')} className="chart-line chart-line-workouts" />
            <path d={pathFor('postsY')} className="chart-line chart-line-posts" />
            <path d={pathFor('commentsY')} className="chart-line chart-line-comments" />
            <path d={pathFor('savesY')} className="chart-line chart-line-saves" />
            {points.map((point) => (
              <g key={point.date}>
                <circle cx={point.x} cy={point.sessionsY} r="4" className="chart-dot chart-dot-workouts" />
                <text x={point.x} y={CHART_HEIGHT - 8} textAnchor="middle">{point.label}</text>
              </g>
            ))}
          </svg>
          <div className="chart-values" aria-label="Valores diários">
            {points.map((point) => (
              <span key={point.date}>
                <small>{point.label}</small>
                <strong>{formatNumber(point.completed_sessions + point.posts_created + point.comments_created + point.saves_created)}</strong>
              </span>
            ))}
          </div>
        </>
      )}
    </figure>
  );
}

export function FinanceChart({ finance }: { finance: WeeklyFinance[] }) {
  const max = Math.max(1, ...finance.map((point) => point.gross_value));
  const availableWidth = CHART_WIDTH - 48;
  const slot = availableWidth / Math.max(1, finance.length);
  const bars = finance.map((point, index) => {
    const barWidth = Math.max(18, slot * 0.5);
    const barHeight = (point.gross_value / max) * (CHART_HEIGHT - 64);
    return {
      ...point,
      label: weekdayLabel(point.date),
      x: 24 + index * slot + (slot - barWidth) / 2,
      y: CHART_HEIGHT - 28 - barHeight,
      barWidth,
      barHeight,
    };
  });
  const total = finance.reduce((sum, point) => sum + point.gross_value, 0);
  const commission = finance.reduce((sum, point) => sum + point.platform_commission, 0);

  return (
    <figure className="chart-panel">
      <figcaption>
        <div>
          <strong>Receita confirmada nos últimos 7 dias</strong>
          <span>Valor bruto por data de confirmação · {formatCurrency(commission)} de comissão OnlyFit</span>
        </div>
        <div className="chart-total">
          <ReceiptText size={16} />
          <strong>{formatCurrency(total)}</strong>
          <span>no período</span>
        </div>
      </figcaption>
      {total === 0 ? (
        <p className="empty-copy">Nenhuma transação financeira confirmada neste período.</p>
      ) : (
        <>
          <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="Receita confirmada nos últimos sete dias">
            <GridLines />
            {bars.map((bar) => (
              <g key={bar.date}>
                <rect
                  className="finance-bar"
                  x={bar.x}
                  y={bar.y}
                  width={bar.barWidth}
                  height={Math.max(2, bar.barHeight)}
                  rx="6"
                />
                <text x={bar.x + bar.barWidth / 2} y={CHART_HEIGHT - 8} textAnchor="middle">{bar.label}</text>
              </g>
            ))}
          </svg>
          <div className="chart-values" aria-label="Valores financeiros diários">
            {bars.map((bar) => (
              <span key={bar.date}>
                <small>{bar.label}</small>
                <strong>{formatCurrency(bar.gross_value)}</strong>
              </span>
            ))}
          </div>
        </>
      )}
    </figure>
  );
}

export function DauChart({ series }: { series: DauPoint[] }) {
  const max = Math.max(1, ...series.map((point) => point.dau));
  const denominator = Math.max(1, series.length - 1);
  const points = series.map((point, index) => ({
    ...point,
    x: 24 + (index * (CHART_WIDTH - 48)) / denominator,
    y: CHART_HEIGHT - 28 - (point.dau / max) * (CHART_HEIGHT - 56),
    label: dayMonthLabel(point.date),
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const ticks = points.filter((_, index) => index % 5 === 0 || index === points.length - 1);
  const peak = series.reduce((highest, point) => Math.max(highest, point.dau), 0);

  return (
    <figure className="chart-panel">
      <figcaption>
        <div>
          <strong>DAU dos últimos 30 dias</strong>
          <span>Usuários distintos com ação naquele dia</span>
        </div>
        <div className="chart-total">
          <BarChart3 size={16} />
          <strong>{formatNumber(peak)}</strong>
          <span>no melhor dia</span>
        </div>
      </figcaption>
      {points.length === 0 ? (
        <p className="empty-copy">Ainda não há atividade diária suficiente para desenhar a série.</p>
      ) : (
        <>
          <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="DAU diário">
            <GridLines />
            <path d={path} className="chart-line chart-line-workouts" />
            {ticks.map((point) => (
              <text key={point.date} x={point.x} y={CHART_HEIGHT - 8} textAnchor="middle">{point.label}</text>
            ))}
          </svg>
          <div className="chart-values" aria-label="DAU diário">
            {ticks.map((point) => (
              <span key={point.date}>
                <small>{point.label}</small>
                <strong>{formatNumber(point.dau)}</strong>
              </span>
            ))}
          </div>
        </>
      )}
    </figure>
  );
}

export function SystemEventsPanel({ outbox }: { outbox: Record<string, number> }) {
  const statuses = Object.entries(outbox).sort((left, right) => right[1] - left[1]);
  const total = statuses.reduce((sum, [, count]) => sum + count, 0);

  return (
    <aside className="ops-panel">
      <div>
        <strong>Eventos do sistema</strong>
        <span>{total === 0 ? 'Fila operacional por status' : `${formatNumber(total)} evento(s) na fila`}</span>
      </div>
      {statuses.length === 0 ? (
        <p className="empty-copy">Nenhum evento na fila.</p>
      ) : (
        <dl className="status-list">
          {statuses.map(([status, count]) => (
            <div key={status}>
              <dt>{status}</dt>
              <dd>{formatNumber(count)}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}
