/** Administrative purchase state; this label does not assert delivery or access. */
export function purchaseStatusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'confirmed': return 'Confirmada';
    case 'failed': return 'Falhou';
    case 'cancelled': return 'Cancelada';
    case 'refunded': return 'Reembolsada';
    default: return 'Estado não identificado';
  }
}
