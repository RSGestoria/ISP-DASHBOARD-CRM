export type LeadStatus =
  | 'novo'
  | 'contactado'
  | 'qualificado'
  | 'proposta'
  | 'negociacao'
  | 'venda'
  | 'perdido';

export type FeasibilityStatus = 'viavel' | 'cto_lotada' | 'sem_cobertura' | 'analisando';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
  city: string;
  planOfInterest: string;
  speedMbps: number;
  monthlyValue: number;
  currency: string;
  status: LeadStatus;
  lossReason?: string;
  assignedSalesperson: string;
  source: 'Meta Ads' | 'WhatsApp Direto' | 'Indicação' | 'Google Ads' | 'Site';
  createdAt: string;
  lastContact: string;
  technicalFeasibility: FeasibilityStatus;
  notes: string;
  tags: string[];
}

export interface Salesperson {
  id: string;
  name: string;
  avatar: string;
  role: string;
  leadsCount: number;
  salesCount: number;
  conversionRate: number;
  targetSales: number;
  revenueGenerated: number;
}

export interface Customer360 {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  city: string;
  plan: string;
  speedMbps: number;
  monthlyFee: number;
  currency: string;
  seniorityYears: number;
  contractDate: string;
  
  // ERP / Billing Data
  erp: {
    paymentStatus: 'Em Dia' | 'Atrasado' | 'Bloqueado';
    overdueDays: number;
    overdueAmount: number;
    lastInvoiceDate: string;
    nextDueDate: string;
    contractStatus: 'Ativo' | 'Suspenso' | 'Cancelado';
  };
  
  // Technical / Zabbix / Diagnostic Telemetry
  technical: {
    routerStatus: 'Online' | 'Instável' | 'Offline';
    routerModel: string;
    opticalSignalDbm: number; // e.g. -19.4 (ideal between -15 and -25)
    latencyMs: number; // e.g. 14ms
    packetLossPct: number; // e.g. 0.2%
    dropsLast15Days: number;
    lastDropDate?: string;
    lastRebootHoursAgo: number;
    ctoPort: string;
    oltName: string;
    bandwidthUsagePct: number;
  };
  
  // Relationship & History
  complaintsCount: number;
  openTicketsCount: number;
  npsScore: number;
  lastInteraction: string;
  recentMessages: {
    sender: 'customer' | 'agent' | 'bot';
    text: string;
    timestamp: string;
  }[];
}

export type AIAgentType = 'comercial' | 'suporte' | 'retencao' | 'cobranca';

export interface DiagnosticResult {
  preliminaryDiagnosis: string;
  churnRisk: {
    score: number;
    level: 'ALTO' | 'MÉDIO' | 'BAIXO';
    reasons: string[];
  };
  upgradeOpportunity: {
    potential: 'ALTA' | 'MÉDIA' | 'BAIXA';
    suggestedPlan: string;
    reason: string;
  };
  recommendedAction: string;
  suggestedWhatsAppReply: string;
}

export interface ProcessStep {
  step: number;
  name: string;
  responsible: string;
  channels: string[];
  sla: string;
  description: string;
}

export interface ProcessBottleneck {
  id: string;
  severity: 'ALTA' | 'MEDIA' | 'BAIXA';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
}

export interface FollowUpItem {
  day: string;
  trigger: string;
  script: string;
}

export interface ObjectionHandler {
  objection: string;
  response: string;
}

export interface SalesPlaybook {
  title: string;
  qualificationQuestions: string[];
  followUpCadence: FollowUpItem[];
  objectionHandlers: ObjectionHandler[];
}

export interface ConsultingAnalysis {
  ispName: string;
  consultingSummary: string;
  processFlow: ProcessStep[];
  bottlenecks: ProcessBottleneck[];
  playbook: SalesPlaybook;
}

export interface BeforeAfterMetrics {
  period: string;
  leadsBefore: number;
  leadsAfter: number;
  responseTimeBeforeMin: number;
  responseTimeAfterMin: number;
  conversionBeforePct: number;
  conversionAfterPct: number;
  salesBefore: number;
  salesAfter: number;
  revenueBefore: number;
  revenueAfter: number;
}

export interface ExecutiveReport {
  ispName: string;
  period: string;
  executiveSummary: string;
  highlights: string[];
  identifiedWeaknesses: string[];
  strategicRoadmap: string[];
}

export type ActiveTab = 
  | 'crm-funnel'
  | 'opportunity-workspace'
  | 'customer-os'
  | 'process-consulting'
  | 'impact-dashboard'
  | 'integrations';

export type AppTheme = 'light' | 'dark' | 'telecom';
export type DisplayDensity = 'completo' | 'simplificado';
