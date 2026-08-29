/**
 * Dicionário centralizado de definições de métricas e siglas do dashboard.
 * Cada entrada fornece o significado completo para tooltips.
 */

export const METRIC_DEFINITIONS: Record<string, string> = {
  'WMEU': 'Weekly Meaningful Engaged Users — usuários que tiveram engajamento significativo na semana (interações de relacionamento, treinos ou conteúdo)',
  'DAU': 'Daily Active Users — usuários únicos que usaram o app hoje',
  'WAU': 'Weekly Active Users — usuários únicos que usaram o app nos últimos 7 dias',
  'MAU': 'Monthly Active Users — usuários únicos que usaram o app nos últimos 30 dias',
  'CAC': 'Customer Acquisition Cost — custo médio para adquirir um novo cadastro',
  'ARPU': 'Average Revenue Per User — receita bruta do período dividida pelo MAU',
  'LTV': 'Lifetime Value — receita média observada por pessoa que já pagou alguma vez',
  'Stickiness': 'DAU ÷ MAU — frequência de retorno: quanto maior, mais os usuários voltam',
  'D1': 'Day 1 — usuários que voltaram no dia seguinte ao cadastro',
  'D7': 'Day 7 — usuários que voltaram 7 dias após o cadastro',
  'D30': 'Day 30 — usuários que voltaram 30 dias após o cadastro',
};

/**
 * Extrai siglas conhecidas de um título de métrica.
 * Retorna a sigla e sua definição, ou null se não houver sigla.
 */
export function extractAcronym(title: string): { acronym: string; definition: string } | null {
  // Ordem importa: testa siglas maiores primeiro para evitar falsos positivos
  const acronyms = ['WMEU', 'ARPU', 'Stickiness', 'LTV', 'CAC', 'DAU', 'WAU', 'MAU', 'D30', 'D7', 'D1'];
  
  for (const acronym of acronyms) {
    if (title.includes(acronym)) {
      const definition = METRIC_DEFINITIONS[acronym];
      if (definition) {
        return { acronym, definition };
      }
    }
  }
  
  return null;
}
