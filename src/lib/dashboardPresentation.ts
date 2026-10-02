import type { StaffDashboard } from '../api/core.gen';
import type { DashboardSectionId } from './networkHealth';

export type DashboardMetricCard = { label: string; value: number; format: 'count' | 'money' };
export function dashboardMetricCards(data: Pick<StaffDashboard, 'totals' | 'overview' | 'app_activity' | 'finance' | 'outbox'>, section: DashboardSectionId): DashboardMetricCard[] {
  const count = (label: string, value: number): DashboardMetricCard => ({ label, value, format: 'count' });
  const money = (label: string, value: number): DashboardMetricCard => ({ label, value, format: 'money' });
  switch (section) {
    case 'health-growth': return [count('Contas cadastradas', data.totals.accounts), count('Contas criadas hoje', data.overview.profiles_created_today)];
    case 'health-engagement': return [count('Publicações', data.app_activity.posts_total), count('Publicações hoje', data.app_activity.posts_published_today), count('Autores com publicações', data.app_activity.active_authors_total), count('Curtidas', data.app_activity.post_likes_total), count('Comentários', data.app_activity.post_comments_total), count('Sessões concluídas', data.app_activity.workout_sessions_total)];
    case 'health-business': return [money('Receita bruta acumulada', data.finance.gross_revenue_total), money('Receita líquida acumulada', data.finance.net_revenue_total), money('Comissão OnlyFit acumulada', data.finance.platform_commission_total), money('Pagamentos recebidos hoje', data.finance.transactions_paid_today_value), money('Pagamentos recebidos no mês', data.finance.transactions_paid_month_value), count('Assinaturas ativas ou em atraso', data.finance.active_subscriptions_total)];
    case 'health-operations': return [count('Itens abertos na fila', data.totals.open_queue), count('Denúncias pendentes', data.overview.pending_content_reports), count('Tarefas pendentes', data.outbox.pending), count('Tarefas em execução', data.outbox.running), count('Tarefas concluídas', data.outbox.done), count('Tarefas com falha', data.outbox.failed)];
    case 'health-users': return [count('Contas', data.totals.accounts), count('Contas criadas hoje', data.overview.profiles_created_today), count('Negócios', data.totals.businesses)];
    case 'health-overview': return [count('Contas', data.totals.accounts), count('Negócios', data.totals.businesses), count('Itens abertos na fila', data.totals.open_queue), money('Receita bruta acumulada', data.finance.gross_revenue_total), money('Comissão OnlyFit acumulada', data.finance.platform_commission_total), count('Sessões concluídas hoje', data.overview.workout_sessions_completed_today), count('Autores com publicações', data.app_activity.active_authors_total), count('Tarefas com falha', data.outbox.failed)];
  }
}
