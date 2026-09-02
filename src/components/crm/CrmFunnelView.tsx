import React, { useState } from 'react';
import { 
  Lead, 
  LeadStatus, 
  Salesperson, 
  FeasibilityStatus,
  AppTheme,
  DisplayDensity
} from '../../types';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Zap, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  MessageSquare, 
  Wifi, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  X,
  LayoutGrid,
  Columns3,
  FileText,
  Table,
  Download,
  FileSpreadsheet,
  Plus,
  GripVertical,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Radio,
  ChevronDown,
  ChevronUp,
  Move
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OpportunityWorkspaceView } from './OpportunityWorkspaceView';
import { exportLeadsToCSV } from '../../utils/csvExport';

interface CrmFunnelViewProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  salespeople: Salesperson[];
  onOpenLeadDetail: (lead: Lead) => void;
  onNewLeadClick: () => void;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
}

const STAGES: { 
  id: LeadStatus; 
  label: string; 
  color: string; 
  bgDark: string; 
  bgLight: string; 
  bgTelecom: string;
  borderDark: string; 
  borderLight: string; 
  borderTelecom: string;
  badgeDark: string; 
  badgeLight: string;
  badgeTelecom: string;
  accentColor: string;
}[] = [
  { 
    id: 'novo', 
    label: '1. Novos Leads', 
    color: 'text-amber-500', 
    bgDark: 'bg-amber-950/15', 
    bgLight: 'bg-amber-50/60', 
    bgTelecom: 'bg-[#1a1c36]/60',
    borderDark: 'border-amber-500/30', 
    borderLight: 'border-amber-200', 
    borderTelecom: 'border-amber-500/40',
    badgeDark: 'bg-amber-500/20 text-amber-300', 
    badgeLight: 'bg-amber-100 text-amber-800',
    badgeTelecom: 'bg-amber-500/20 text-amber-300',
    accentColor: '#f59e0b'
  },
  { 
    id: 'contactado', 
    label: '2. Contactados', 
    color: 'text-sky-500', 
    bgDark: 'bg-sky-950/15', 
    bgLight: 'bg-sky-50/60', 
    bgTelecom: 'bg-[#152044]/60',
    borderDark: 'border-sky-500/30', 
    borderLight: 'border-sky-200', 
    borderTelecom: 'border-sky-500/40',
    badgeDark: 'bg-sky-500/20 text-sky-300', 
    badgeLight: 'bg-sky-100 text-sky-800',
    badgeTelecom: 'bg-sky-500/20 text-sky-300',
    accentColor: '#0ea5e9'
  },
  { 
    id: 'qualificado', 
    label: '3. Qualificados', 
    color: 'text-indigo-500', 
    bgDark: 'bg-indigo-950/15', 
    bgLight: 'bg-indigo-50/60', 
    bgTelecom: 'bg-[#1c1844]/60',
    borderDark: 'border-indigo-500/30', 
    borderLight: 'border-indigo-200', 
    borderTelecom: 'border-indigo-500/40',
    badgeDark: 'bg-indigo-500/20 text-indigo-300', 
    badgeLight: 'bg-indigo-100 text-indigo-800',
    badgeTelecom: 'bg-indigo-500/20 text-indigo-300',
    accentColor: '#6366f1'
  },
  { 
    id: 'proposta', 
    label: '4. Proposta Enviada', 
    color: 'text-purple-500', 
    bgDark: 'bg-purple-950/15', 
    bgLight: 'bg-purple-50/60', 
    bgTelecom: 'bg-[#221644]/60',
    borderDark: 'border-purple-500/30', 
    borderLight: 'border-purple-200', 
    borderTelecom: 'border-purple-500/40',
    badgeDark: 'bg-purple-500/20 text-purple-300', 
    badgeLight: 'bg-purple-100 text-purple-800',
    badgeTelecom: 'bg-purple-500/20 text-purple-300',
    accentColor: '#a855f7'
  },
  { 
    id: 'negociacao', 
    label: '5. Em Negociação', 
    color: 'text-pink-500', 
    bgDark: 'bg-pink-950/15', 
    bgLight: 'bg-pink-50/60', 
    bgTelecom: 'bg-[#2a1438]/60',
    borderDark: 'border-pink-500/30', 
    borderLight: 'border-pink-200', 
    borderTelecom: 'border-pink-500/40',
    badgeDark: 'bg-pink-500/20 text-pink-300', 
    badgeLight: 'bg-pink-100 text-pink-800',
    badgeTelecom: 'bg-pink-500/20 text-pink-300',
    accentColor: '#ec4899'
  },
  { 
    id: 'venda', 
    label: '6. Venda / Instalação 🎉', 
    color: 'text-emerald-500', 
    bgDark: 'bg-emerald-950/15', 
    bgLight: 'bg-emerald-50/60', 
    bgTelecom: 'bg-[#0f2a24]/60',
    borderDark: 'border-emerald-500/30', 
    borderLight: 'border-emerald-200', 
    borderTelecom: 'border-emerald-500/40',
    badgeDark: 'bg-emerald-500/20 text-emerald-300', 
    badgeLight: 'bg-emerald-100 text-emerald-800',
    badgeTelecom: 'bg-emerald-500/20 text-emerald-300',
    accentColor: '#10b981'
  },
  { 
    id: 'perdido', 
    label: '7. Perdidos / Sem Rede', 
    color: 'text-slate-500', 
    bgDark: 'bg-slate-900/40', 
    bgLight: 'bg-slate-100/60', 
    bgTelecom: 'bg-[#0f1424]/60',
    borderDark: 'border-slate-800/80', 
    borderLight: 'border-slate-200', 
    borderTelecom: 'border-slate-800/80',
    badgeDark: 'bg-slate-800 text-slate-400', 
    badgeLight: 'bg-slate-200 text-slate-600',
    badgeTelecom: 'bg-slate-800 text-slate-400',
    accentColor: '#64748b'
  },
];

export const CrmFunnelView: React.FC<CrmFunnelViewProps> = ({
  leads,
  setLeads,
  salespeople,
  onOpenLeadDetail,
  onNewLeadClick,
  theme = 'light',
  onThemeChange,
}) => {
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(theme);
  const isDark = currentTheme === 'dark';
  const isTelecom = currentTheme === 'telecom';
  const isLight = currentTheme === 'light';

  // Synchronize when parent prop changes
  React.useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const handleSelectTheme = (newTheme: AppTheme) => {
    setCurrentTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  const [crmViewMode, setCrmViewMode] = useState<'kanban' | 'opportunity-360' | 'table'>('kanban');
  const [displayDensity, setDisplayDensity] = useState<DisplayDensity>('completo');
  const [selectedOpportunityLead, setSelectedOpportunityLead] = useState<Lead>(leads[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('todos');
  const [selectedCity, setSelectedCity] = useState<string>('todas');
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(false);

  // Drag & Drop State
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStatus | null>(null);

  const handleUpdateOpportunityLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedOpportunityLead(updated);
  };

  // If in Opportunity 360 Workspace mode, render the Creatio style layout
  if (crmViewMode === 'opportunity-360' && selectedOpportunityLead) {
    return (
      <OpportunityWorkspaceView
        lead={selectedOpportunityLead}
        leads={leads}
        onSelectLead={(l) => setSelectedOpportunityLead(l)}
        onUpdateLead={handleUpdateOpportunityLead}
        onBackToFunnel={() => setCrmViewMode('kanban')}
        salespeople={salespeople}
        theme={isLight ? 'light' : 'dark'}
      />
    );
  }

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.planOfInterest.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSalesperson = 
      selectedSalesperson === 'todos' || lead.assignedSalesperson === selectedSalesperson;

    const matchesCity = 
      selectedCity === 'todas' || lead.city === selectedCity;

    return matchesSearch && matchesSalesperson && matchesCity;
  });

  // Calculate KPIs
  const totalLeads = leads.length;
  const salesCount = leads.filter((l) => l.status === 'venda').length;
  const targetMonthlySales = 100;
  const targetPct = Math.round((salesCount / targetMonthlySales) * 100);
  const conversionRate = totalLeads > 0 ? ((salesCount / totalLeads) * 100).toFixed(1) : '0';
  const totalRevenue = leads
    .filter((l) => l.status === 'venda')
    .reduce((acc, curr) => acc + curr.monthlyValue, 0);

  // Move lead stage
  const handleMoveLead = (leadId: string, newStatus: LeadStatus) => {
    const currentLead = leads.find((l) => l.id === leadId);
    if (currentLead && currentLead.status === newStatus) return;

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          if (newStatus === 'venda' && l.status !== 'venda') {
            try {
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
              });
            } catch (e) {}
          }
          return {
            ...l,
            status: newStatus,
            lastContact: 'Agora mesmo',
          };
        }
        return l;
      })
    );

    // Toast notification
    const stageObj = STAGES.find(s => s.id === newStatus);
    const toast = document.createElement('div');
    toast.innerHTML = `<span class="text-emerald-400 font-bold">✓</span> <span>Lead movido para <strong>${stageObj?.label || newStatus}</strong></span>`;
    toast.className = 'fixed bottom-12 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs font-medium animate-in slide-in-from-bottom-3 duration-200';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDragLeaveColumn = (e: React.DragEvent, stageId: LeadStatus) => {
    if (dragOverStage === stageId) {
      setDragOverStage(null);
    }
  };

  const handleDropOnColumn = (e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      handleMoveLead(leadId, stageId);
    }
    setDragOverStage(null);
    setDraggedLeadId(null);
  };

  const getFeasibilityBadge = (status: FeasibilityStatus, isSimplified = false) => {
    if (isSimplified) {
      switch (status) {
        case 'viavel':
          return <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Porta CTO Viável" />;
        case 'cto_lotada':
          return <span className="inline-block w-2 h-2 rounded-full bg-amber-500" title="CTO Lotada" />;
        case 'sem_cobertura':
          return <span className="inline-block w-2 h-2 rounded-full bg-red-500" title="Sem Cobertura" />;
        default:
          return <span className="inline-block w-2 h-2 rounded-full bg-slate-400" title="Em Análise" />;
      }
    }

    switch (status) {
      case 'viavel':
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
            isDark || isTelecom ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
          }`}>
            <CheckCircle2 className="w-3 h-3" /> Porta OK
          </span>
        );
      case 'cto_lotada':
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
            isDark || isTelecom ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-amber-700 bg-amber-50 border-amber-200'
          }`}>
            <AlertCircle className="w-3 h-3" /> Lotada
          </span>
        );
      case 'sem_cobertura':
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
            isDark || isTelecom ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-red-700 bg-red-50 border-red-200'
          }`}>
            <X className="w-3 h-3" /> Sem Rede
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
            isDark || isTelecom ? 'text-slate-400 bg-slate-800' : 'text-slate-600 bg-slate-200'
          }`}>
            Analisando
          </span>
        );
    }
  };

  // Helper theme classes
  const containerBgClass = isLight 
    ? 'bg-white border-slate-200/90 shadow-slate-200/50 text-slate-800' 
    : isDark 
      ? 'bg-slate-900/90 border-slate-800/80 shadow-black/40 text-slate-100' 
      : 'bg-[#111836]/90 border-indigo-950 shadow-black/60 text-slate-100';

  const subBoxBgClass = isLight 
    ? 'bg-slate-50 border-slate-200' 
    : isDark 
      ? 'bg-slate-950/70 border-slate-800/90' 
      : 'bg-[#0b1026]/80 border-indigo-900/60';

  const inputBgClass = isLight
    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
    : isDark
      ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500'
      : 'bg-[#0b1026] border-indigo-900/80 text-slate-200 placeholder-slate-400';

  return (
    <div className="space-y-4 pb-12">
      
      {/* 1. TOP HEADER & THEME/DENSITY TOOLBAR */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-all shadow-sm ${containerBgClass}`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Title and Badge */}
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${
              isLight 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Funil Comercial & Pipeline de Vendas
                </h1>
                <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                  isLight 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  Tempo Real
                </span>
                
                {/* Drag & Drop badge indicator */}
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border ${
                  isLight 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                }`}>
                  <Move className="w-2.5 h-2.5" /> Arraste e Solte Ativo
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Gestão ágil da esteira comercial com movimentação manual ou arrastar e soltar (Drag & Drop).
              </p>
            </div>
          </div>

          {/* Quick Toolbar: Density Toggle (Completo vs Simplificado) + Theme Options Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            
            {/* Display Density Switcher: Completo vs Simplificado */}
            <div className={`flex items-center p-1 rounded-xl border ${subBoxBgClass}`}>
              <button
                onClick={() => setDisplayDensity('completo')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  displayDensity === 'completo'
                    ? isLight 
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                      : 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isLight 
                      ? 'text-slate-600 hover:text-slate-900' 
                      : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Painel Completo com todos os detalhes, métricas e tags"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Painel Completo</span>
              </button>

              <button
                onClick={() => setDisplayDensity('simplificado')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  displayDensity === 'simplificado'
                    ? isLight 
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                      : 'bg-emerald-500 text-slate-950 shadow-sm'
                    : isLight 
                      ? 'text-slate-600 hover:text-slate-900' 
                      : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Painel Simplificado: cartões compactos e visual limpo com foco no essencial"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Painel Simplificado</span>
              </button>
            </div>

            {/* Theme Switcher Options (Light / Dark / Telecom Midnight) */}
            <div className={`flex items-center p-1 rounded-xl border ${subBoxBgClass}`}>
              <button
                onClick={() => handleSelectTheme('light')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  isLight 
                    ? 'bg-white text-amber-600 shadow-xs border border-slate-200' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tema Executivo Claro (Light)"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Claro</span>
              </button>

              <button
                onClick={() => handleSelectTheme('dark')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  isDark 
                    ? 'bg-slate-800 text-emerald-400 shadow-xs border border-slate-700' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tema Noturno (Dark Slate)"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Escuro</span>
              </button>

              <button
                onClick={() => handleSelectTheme('telecom')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  isTelecom 
                    ? 'bg-indigo-900 text-cyan-300 shadow-xs border border-indigo-700' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tema Telecom Midnight (Azul Fibra)"
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Telecom</span>
              </button>
            </div>

          </div>

        </div>

        {/* METRICS DISPLAY: COMPACT vs FULL */}
        {displayDensity === 'completo' ? (
          <>
            {/* Detailed Monthly Target & Goal Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
              
              <div className={`lg:col-span-6 p-3.5 rounded-xl border ${subBoxBgClass}`}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Meta Mensal de Vendas:
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm">
                    <span className="text-emerald-500">{salesCount}</span>
                    <span className={isLight ? 'text-slate-500' : 'text-slate-400'}> / {targetMonthlySales} instalações ({targetPct}%)</span>
                  </span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(targetPct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px]">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                    Faltam <strong>{Math.max(0, targetMonthlySales - salesCount)}</strong> para a meta
                  </span>
                  <span className="text-emerald-500 font-bold">Ritmo ideal: +3.2 vendas/dia</span>
                </div>
              </div>

              {/* 3 Metric Mini-Blocks */}
              <div className="lg:col-span-6 grid grid-cols-3 gap-2.5">
                <div className={`p-3 rounded-xl border ${subBoxBgClass}`}>
                  <div className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Total Leads
                  </div>
                  <div className={`text-lg font-extrabold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {totalLeads}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-bold mt-0.5">+22% mês</div>
                </div>

                <div className={`p-3 rounded-xl border ${subBoxBgClass}`}>
                  <div className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Conversão
                  </div>
                  <div className="text-lg font-extrabold text-emerald-500 mt-0.5">
                    {conversionRate}%
                  </div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'} mt-0.5`}>Meta: 20%</div>
                </div>

                <div className={`p-3 rounded-xl border ${subBoxBgClass}`}>
                  <div className={`text-[10px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    SLA 1º Contato
                  </div>
                  <div className="text-lg font-extrabold text-cyan-500 mt-0.5 flex items-center gap-1">
                    6.5m <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-[10px] text-emerald-500 font-bold mt-0.5">Excelente</div>
                </div>
              </div>

            </div>
          </>
        ) : (
          /* SIMPLIFIED / COMPACT KPI TICKER BAR */
          <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Meta:</span>
                <span className="font-bold text-emerald-500">{salesCount}/{targetMonthlySales} ({targetPct}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Leads Ativos:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{totalLeads}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Conversão:</span>
                <span className="font-bold text-emerald-500">{conversionRate}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>SLA Médio:</span>
                <span className="font-bold text-cyan-500">6.5 min</span>
              </div>
            </div>

            <div className={`text-[11px] px-2 py-0.5 rounded-md ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'}`}>
              ⚡ Modo Compacto Ativado
            </div>
          </div>
        )}

      </div>

      {/* 2. SALESPEOPLE LEADERBOARD (Full vs Compact Toggle) */}
      <div className={`rounded-2xl p-3 sm:p-4 border transition-all shadow-sm ${containerBgClass}`}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <h2 className={`text-xs uppercase font-bold tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Desempenho da Equipe Comercial (Vendedores & SDRs)
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {displayDensity === 'simplificado' && (
              <button
                onClick={() => setIsLeaderboardExpanded(!isLeaderboardExpanded)}
                className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg border ${subBoxBgClass} hover:opacity-80 transition-opacity`}
              >
                <span>{isLeaderboardExpanded ? 'Ocultar Equipe' : 'Expandir Equipe'}</span>
                {isLeaderboardExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
            <span className={`text-[11px] hidden sm:inline ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Clique para filtrar
            </span>
          </div>
        </div>

        {/* If in full mode OR if expanded in simplified mode */}
        {(displayDensity === 'completo' || isLeaderboardExpanded) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-200">
            {salespeople.map((person) => {
              const isSelected = selectedSalesperson === person.name;
              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedSalesperson(isSelected ? 'todos' : person.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? isLight 
                        ? 'bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-500 shadow-md' 
                        : 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                      : isLight 
                        ? 'bg-slate-50 border-slate-200 hover:border-slate-300' 
                        : isDark 
                          ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' 
                          : 'bg-[#0b1026]/70 border-indigo-900 hover:border-indigo-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className={`font-bold text-sm truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {person.name}
                      </div>
                      <div className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {person.role}
                      </div>
                    </div>
                  </div>
                  <div className={`grid grid-cols-3 gap-1 mt-3 pt-2 border-t text-center text-xs ${
                    isLight ? 'border-slate-200' : 'border-slate-800/80'
                  }`}>
                    <div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Leads</div>
                      <div className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{person.leadsCount}</div>
                    </div>
                    <div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Vendas</div>
                      <div className="font-extrabold text-emerald-500">{person.salesCount}</div>
                    </div>
                    <div>
                      <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Conversão</div>
                      <div className="font-extrabold text-cyan-500">{person.conversionRate}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT HORIZONTAL SALESPEOPLE BAR (Simplified Mode) */
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedSalesperson('todos')}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedSalesperson === 'todos'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todos ({leads.length})
            </button>
            {salespeople.map((person) => {
              const isSelected = selectedSalesperson === person.name;
              return (
                <button
                  key={person.id}
                  onClick={() => setSelectedSalesperson(isSelected ? 'todos' : person.name)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <img src={person.avatar} alt={person.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="truncate max-w-[110px]">{person.name.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-500'
                  }`}>
                    {person.salesCount}v
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl border transition-all ${containerBgClass}`}>
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por lead, bairro, telefone, plano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border rounded-lg pl-9 pr-3 py-1.5 text-xs transition-colors focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
          />
        </div>

        {/* View Switchers & Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          
          {/* Layout View Switcher Buttons */}
          <div className={`flex items-center p-1 rounded-lg border ${subBoxBgClass}`}>
            <button
              onClick={() => setCrmViewMode('kanban')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                crmViewMode === 'kanban'
                  ? isLight ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Quadro Kanban com Arrastar e Soltar"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kanban</span>
            </button>

            <button
              onClick={() => {
                if (!selectedOpportunityLead && leads.length > 0) {
                  setSelectedOpportunityLead(leads[0]);
                }
                setCrmViewMode('opportunity-360');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                crmViewMode === 'opportunity-360'
                  ? isLight ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visão Oportunidade 360° (Creatio)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ficha 360°</span>
            </button>

            <button
              onClick={() => setCrmViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                crmViewMode === 'table'
                  ? isLight ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'bg-emerald-500 text-slate-950 shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualização em Tabela"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tabela</span>
            </button>
          </div>

          <div className={`hidden sm:flex items-center gap-1 text-xs shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <Filter className="w-3.5 h-3.5" />
          </div>

          <select
            value={selectedSalesperson}
            onChange={(e) => setSelectedSalesperson(e.target.value)}
            className={`border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
          >
            <option value="todos">Todos Vendedores</option>
            {salespeople.map((sp) => (
              <option key={sp.id} value={sp.name}>{sp.name}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={`border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 ${inputBgClass}`}
          >
            <option value="todas">Todas Cidades</option>
            <option value="Hernandarias">Hernandarias</option>
            <option value="Ciudad del Este">Ciudad del Este</option>
            <option value="Foz do Iguaçu">Foz do Iguaçu</option>
          </select>

          {(selectedSalesperson !== 'todos' || selectedCity !== 'todas' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedSalesperson('todos');
                setSelectedCity('todas');
                setSearchTerm('');
              }}
              className="text-xs text-emerald-500 hover:underline px-2 py-1 font-semibold"
            >
              Limpar
            </button>
          )}

          {/* Export to CSV Button */}
          <button
            onClick={() => exportLeadsToCSV(filteredLeads, `leads_crm_${new Date().toISOString().split('T')[0]}.csv`)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs border ${
              isLight 
                ? 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-950 hover:bg-slate-800 text-emerald-400 border-emerald-500/30'
            }`}
            title="Exportar base de leads filtrada para planilha CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar CSV ({filteredLeads.length})</span>
          </button>

          {/* New Lead Quick Button */}
          <button
            onClick={onNewLeadClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Lead</span>
          </button>
        </div>

      </div>

      {/* 4. DRAG & DROP HINT BANNER */}
      {crmViewMode === 'kanban' && (
        <div className={`px-4 py-2 rounded-xl text-xs flex items-center justify-between border ${
          isLight ? 'bg-blue-50/80 border-blue-200 text-blue-900' : 'bg-blue-950/30 border-blue-800/60 text-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              <strong>Dica de Produtividade:</strong> Você pode <strong>arrastar e soltar</strong> os cartões diretamente entre as colunas para atualizar a etapa, ou usar o seletor rápido no cartão.
            </span>
          </div>
          {draggedLeadId && (
            <span className="font-bold text-amber-500 animate-pulse flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Arrastando lead...
            </span>
          )}
        </div>
      )}

      {/* 5. TABLE VIEW MODE */}
      {crmViewMode === 'table' && (
        <div className={`rounded-2xl border overflow-x-auto shadow-xs ${containerBgClass}`}>
          <table className="w-full text-left text-xs">
            <thead className={`text-[10px] uppercase font-bold border-b ${
              isLight ? 'border-slate-200 text-slate-500 bg-slate-50' : 'border-slate-800 text-slate-400 bg-slate-950'
            }`}>
              <tr>
                <th className="p-3">Lead / Cliente</th>
                <th className="p-3">Localização</th>
                <th className="p-3">Plano & Valor</th>
                <th className="p-3">Viabilidade Óptica</th>
                <th className="p-3">Etapa Atual</th>
                <th className="p-3">Vendedor</th>
                <th className="p-3">Último Contato</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'}>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedOpportunityLead(lead);
                        setCrmViewMode('opportunity-360');
                      }}
                      className="font-bold text-left hover:text-emerald-500 transition-colors"
                    >
                      {lead.name}
                    </button>
                    <div className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{lead.phone}</div>
                  </td>
                  <td className="p-3">
                    <div>{lead.neighborhood}</div>
                    <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{lead.city}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold">{lead.planOfInterest}</div>
                    <div className="font-extrabold text-emerald-500">{lead.currency} {lead.monthlyValue.toLocaleString()}</div>
                  </td>
                  <td className="p-3">{getFeasibilityBadge(lead.technicalFeasibility)}</td>
                  <td className="p-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleMoveLead(lead.id, e.target.value as LeadStatus)}
                      className={`border text-[11px] font-bold rounded-lg px-2 py-1 focus:outline-none ${
                        isLight ? 'bg-white border-slate-300 text-emerald-700' : 'bg-slate-950 border-slate-700 text-emerald-400'
                      }`}
                    >
                      <option value="novo">1. Novo</option>
                      <option value="contactado">2. Contactado</option>
                      <option value="qualificado">3. Qualificado</option>
                      <option value="proposta">4. Proposta</option>
                      <option value="negociacao">5. Negociação</option>
                      <option value="venda">6. Venda 🎉</option>
                      <option value="perdido">7. Perdido</option>
                    </select>
                  </td>
                  <td className="p-3">{lead.assignedSalesperson}</td>
                  <td className={`p-3 text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{lead.lastContact}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedOpportunityLead(lead);
                          setCrmViewMode('opportunity-360');
                        }}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          isLight ? 'bg-slate-100 hover:bg-slate-200 text-emerald-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
                        }`}
                        title="Abrir Ficha Creatio 360°"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                        title="WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. KANBAN BOARD WITH DRAG & DROP SUPPORT */}
      {crmViewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3.5 items-start">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            const isColumnHovered = dragOverStage === stage.id;

            const stageBgClass = isLight 
              ? stage.bgLight 
              : isTelecom 
                ? stage.bgTelecom 
                : stage.bgDark;

            const stageBorderClass = isLight 
              ? stage.borderLight 
              : isTelecom 
                ? stage.borderTelecom 
                : stage.borderDark;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => handleDragOverColumn(e, stage.id)}
                onDragLeave={(e) => handleDragLeaveColumn(e, stage.id)}
                onDrop={(e) => handleDropOnColumn(e, stage.id)}
                className={`rounded-2xl border p-3 min-h-[520px] flex flex-col transition-all duration-150 ${stageBorderClass} ${stageBgClass} ${
                  isColumnHovered ? 'ring-2 ring-offset-2 ring-emerald-500 scale-[1.01] shadow-lg' : ''
                }`}
              >
                {/* Stage Header */}
                <div className={`flex items-center justify-between pb-2.5 mb-2.5 border-b ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span className={stage.color}>{stage.label}</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    isLight ? stage.badgeLight : isTelecom ? stage.badgeTelecom : stage.badgeDark
                  }`}>
                    {stageLeads.length}
                  </span>
                </div>

                {/* Drop Zone Indicator when Dragging */}
                {isColumnHovered && draggedLeadId && (
                  <div className="mb-2 p-2.5 border-2 border-dashed border-emerald-500 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-center text-[11px] font-bold animate-pulse">
                    📥 Soltar lead em {stage.label.split('.')[1] || stage.label}
                  </div>
                )}

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1">
                  {stageLeads.length === 0 ? (
                    <div className={`h-32 flex flex-col items-center justify-center text-center text-xs border border-dashed rounded-xl p-3 ${
                      isLight ? 'text-slate-400 border-slate-200' : 'text-slate-500 border-slate-800'
                    }`}>
                      <span className="opacity-70">Nenhum lead nesta etapa</span>
                      <span className="text-[10px] mt-1 opacity-50">Arraste um cartão para cá</span>
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const isBeingDragged = draggedLeadId === lead.id;

                      /* ===================== A. PAINEL SIMPLIFICADO CARD ===================== */
                      if (displayDensity === 'simplificado') {
                        return (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            onDragEnd={handleDragEnd}
                            className={`border rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative ${
                              isLight 
                                ? 'bg-white border-slate-200 hover:border-slate-300' 
                                : isDark 
                                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                                  : 'bg-[#151c3d] border-indigo-950 hover:border-indigo-800'
                            } ${isBeingDragged ? 'opacity-40 scale-95 ring-2 ring-emerald-500' : ''}`}
                          >
                            {/* Grip & Name Header */}
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <GripVertical className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0" />
                                <div 
                                  onClick={() => onOpenLeadDetail(lead)}
                                  className={`font-bold text-xs cursor-pointer transition-colors truncate ${
                                    isLight ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-400'
                                  }`}
                                  title={lead.name}
                                >
                                  {lead.name}
                                </div>
                              </div>
                              {getFeasibilityBadge(lead.technicalFeasibility, true)}
                            </div>

                            {/* Plan & Price + Neighborhood */}
                            <div className="flex items-center justify-between text-[11px] mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                              <span className="text-emerald-500 font-extrabold truncate">
                                {lead.currency} {lead.monthlyValue.toLocaleString()}
                              </span>
                              <span className={`truncate text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                                {lead.neighborhood}
                              </span>
                            </div>

                            {/* Action Row */}
                            <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(lead.name)}!%20Te%20escribo%20de%20la%20central%20de%20fibra...`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-2xs transition-all"
                                title="Abrir WhatsApp"
                              >
                                <Phone className="w-2.5 h-2.5" /> WhatsApp
                              </a>

                              <select
                                value={lead.status}
                                onChange={(e) => handleMoveLead(lead.id, e.target.value as LeadStatus)}
                                className={`border text-[10px] font-medium rounded-md px-1 py-1 focus:outline-none ${
                                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-slate-200'
                                }`}
                                title="Mudar etapa"
                              >
                                <option value="novo">Novo</option>
                                <option value="contactado">Contactado</option>
                                <option value="qualificado">Qualificado</option>
                                <option value="proposta">Proposta</option>
                                <option value="negociacao">Negociação</option>
                                <option value="venda">Venda 🎉</option>
                                <option value="perdido">Perdido</option>
                              </select>
                            </div>
                          </div>
                        );
                      }

                      /* ===================== B. PAINEL COMPLETO CARD (DETALHADO) ===================== */
                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onDragEnd={handleDragEnd}
                          className={`border rounded-xl p-3 shadow-sm hover:shadow-md transition-all space-y-2 group cursor-grab active:cursor-grabbing relative ${
                            isLight 
                              ? 'bg-white border-slate-200 hover:border-slate-300' 
                              : isDark 
                                ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                                : 'bg-[#151c3d] border-indigo-950 hover:border-indigo-800'
                          } ${isBeingDragged ? 'opacity-40 scale-95 ring-2 ring-emerald-500' : ''}`}
                        >
                          {/* Top Info & Feasibility */}
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1">
                                <GripVertical className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0" />
                                <div 
                                  onClick={() => onOpenLeadDetail(lead)}
                                  className={`font-bold text-xs cursor-pointer transition-colors truncate ${
                                    isLight ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-400'
                                  }`}
                                >
                                  {lead.name}
                                </div>
                              </div>
                              <div className={`text-[11px] flex items-center gap-1 mt-0.5 pl-4 ${
                                isLight ? 'text-slate-500' : 'text-slate-400'
                              }`}>
                                <MapPin className="w-3 h-3 shrink-0 opacity-70" />
                                <span className="truncate">{lead.neighborhood}, {lead.city}</span>
                              </div>
                            </div>

                            {getFeasibilityBadge(lead.technicalFeasibility)}
                          </div>

                          {/* Plan and Value */}
                          <div className={`p-2 rounded-lg border flex items-center justify-between text-xs ${subBoxBgClass}`}>
                            <div className={`flex items-center gap-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="truncate">{lead.planOfInterest}</span>
                            </div>
                            <div className={`font-extrabold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                              {lead.currency} {lead.monthlyValue.toLocaleString()}
                            </div>
                          </div>

                          {/* Tags & Source */}
                          <div className="flex flex-wrap gap-1">
                            {lead.tags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                                  isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                              isLight ? 'bg-slate-100/80 text-slate-500' : 'bg-slate-800/50 text-slate-400'
                            }`}>
                              {lead.source}
                            </span>
                          </div>

                          {/* Salesperson & Last contact */}
                          <div className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                            isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/80 text-slate-400'
                          }`}>
                            <span className="truncate">👤 {lead.assignedSalesperson.split(' ')[0]}</span>
                            <span>{lead.lastContact}</span>
                          </div>

                          {/* Quick Actions Row */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(lead.name)}!%20Te%20escribo%20de%20la%20central%20de%20fibra%20óptica...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-xs transition-all"
                            >
                              <Phone className="w-3 h-3" /> WhatsApp
                            </a>

                            <button
                              onClick={() => onOpenLeadDetail(lead)}
                              className={`p-1.5 rounded-lg border text-[10px] transition-colors ${
                                isLight 
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                              }`}
                              title="Ver Detalhes do Lead"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>

                            {/* Stage Mover Selector */}
                            <select
                              value={lead.status}
                              onChange={(e) => handleMoveLead(lead.id, e.target.value as LeadStatus)}
                              className={`border text-[10px] font-semibold rounded-lg px-1.5 py-1.5 focus:outline-none ${
                                isLight 
                                  ? 'bg-slate-100 border-slate-200 text-slate-800' 
                                  : 'bg-slate-800 border-slate-700 text-slate-200'
                              }`}
                            >
                              <option value="novo">Novo</option>
                              <option value="contactado">Contactado</option>
                              <option value="qualificado">Qualificado</option>
                              <option value="proposta">Proposta</option>
                              <option value="negociacao">Negociação</option>
                              <option value="venda">Venda 🎉</option>
                              <option value="perdido">Perdido</option>
                            </select>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
