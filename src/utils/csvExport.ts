import { Lead, Customer360 } from '../types';

export function exportLeadsToCSV(leads: Lead[], filename = 'leads_crm_funnel.csv') {
  if (!leads || leads.length === 0) {
    alert('Nenhum lead encontrado para exportar.');
    return;
  }

  const headers = [
    'ID',
    'Nome',
    'Telefone',
    'Endereço',
    'Bairro',
    'Cidade',
    'Plano de Interesse',
    'Velocidade (Mbps)',
    'Valor Mensal',
    'Moeda',
    'Status',
    'Viabilidade Técnica',
    'Vendedor Responsável',
    'Origem / Canal',
    'Data de Cadastro',
    'Último Contato',
    'Tags',
    'Observações'
  ];

  const rows = leads.map(lead => [
    `"${lead.id || ''}"`,
    `"${(lead.name || '').replace(/"/g, '""')}"`,
    `"${(lead.phone || '').replace(/"/g, '""')}"`,
    `"${(lead.address || '').replace(/"/g, '""')}"`,
    `"${(lead.neighborhood || '').replace(/"/g, '""')}"`,
    `"${(lead.city || '').replace(/"/g, '""')}"`,
    `"${(lead.planOfInterest || '').replace(/"/g, '""')}"`,
    lead.speedMbps || 0,
    lead.monthlyValue || 0,
    `"${lead.currency || 'USD'}"`,
    `"${lead.status || ''}"`,
    `"${lead.technicalFeasibility || ''}"`,
    `"${(lead.assignedSalesperson || '').replace(/"/g, '""')}"`,
    `"${(lead.source || '').replace(/"/g, '""')}"`,
    `"${lead.createdAt || ''}"`,
    `"${lead.lastContact || ''}"`,
    `"${(lead.tags || []).join('; ')}"`,
    `"${(lead.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCustomersToCSV(customers: Customer360[], filename = 'clientes_provedor_360.csv') {
  if (!customers || customers.length === 0) {
    alert('Nenhum cliente encontrado para exportar.');
    return;
  }

  const headers = [
    'ID',
    'Nome Completo',
    'Telefone',
    'E-mail',
    'Endereço',
    'Bairro',
    'Cidade',
    'Plano',
    'Velocidade (Mbps)',
    'Mensalidade',
    'Moeda',
    'Status Financeiro',
    'Dias Atraso',
    'Valor em Aberto',
    'Status Contrato',
    'Sinal Óptico (dBm)',
    'Status Roteador',
    'Porta CTO',
    'OLT',
    'Reclamações Registradas',
    'NPS',
    'Última Interação'
  ];

  const rows = customers.map(c => [
    `"${c.id || ''}"`,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.phone || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    `"${(c.neighborhood || '').replace(/"/g, '""')}"`,
    `"${(c.city || '').replace(/"/g, '""')}"`,
    `"${(c.plan || '').replace(/"/g, '""')}"`,
    c.speedMbps || 0,
    c.monthlyFee || 0,
    `"${c.currency || 'USD'}"`,
    `"${c.erp?.paymentStatus || ''}"`,
    c.erp?.overdueDays || 0,
    c.erp?.overdueAmount || 0,
    `"${c.erp?.contractStatus || ''}"`,
    c.technical?.opticalSignalDbm || 0,
    `"${c.technical?.routerStatus || ''}"`,
    `"${c.technical?.ctoPort || ''}"`,
    `"${c.technical?.oltName || ''}"`,
    c.complaintsCount || 0,
    c.npsScore || 0,
    `"${c.lastInteraction || ''}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
