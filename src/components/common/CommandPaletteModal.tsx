import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Layers, 
  Users, 
  Activity, 
  GitBranch, 
  BarChart3, 
  Network, 
  Plus, 
  Calendar, 
  Phone, 
  CheckSquare, 
  Wifi, 
  Download, 
  ArrowRight, 
  Command, 
  X,
  FileSpreadsheet,
  Zap,
  Sparkles
} from 'lucide-react';
import { ActiveTab, Lead, Customer360 } from '../../types';
import { exportLeadsToCSV, exportCustomersToCSV } from '../../utils/csvExport';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  leads: Lead[];
  customers: Customer360[];
  onSelectOpportunityLead: (lead: Lead) => void;
  onOpenNewLead: () => void;
  onOpenScheduleMeeting: () => void;
  onOpenLogCall: () => void;
  onOpenCreateTask: () => void;
  onOpenCheckFeasibility: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  leads,
  customers,
  onSelectOpportunityLead,
  onOpenNewLead,
  onOpenScheduleMeeting,
  onOpenLogCall,
  onOpenCreateTask,
  onOpenCheckFeasibility,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Static Views / Actions items
  const mainNavigationItems = [
    {
      id: 'nav-opportunity',
      type: 'view',
      title: 'Ficha de Oportunidade 360°',
      subtitle: 'Visão completa com esteira em chevrons, KPIs e contatos',
      icon: <Layers className="w-4 h-4 text-[#5cb82e]" />,
      action: () => {
        setActiveTab('opportunity-workspace');
        onClose();
      },
    },
    {
      id: 'nav-funnel',
      type: 'view',
      title: 'Funil Comercial CRM (Leads & Kanban)',
      subtitle: 'Quadro de negociação, metas de vendas e esteira comercial',
      icon: <Users className="w-4 h-4 text-[#ee6c23]" />,
      action: () => {
        setActiveTab('crm-funnel');
        onClose();
      },
    },
    {
      id: 'nav-customer',
      type: 'view',
      title: 'Clientes 360° & Diagnóstico IA',
      subtitle: 'Monitoramento técnico, sinal óptico, ERP e prevenção de churn',
      icon: <Activity className="w-4 h-4 text-[#1e73be]" />,
      action: () => {
        setActiveTab('customer-os');
        onClose();
      },
    },
    {
      id: 'nav-consulting',
      type: 'view',
      title: 'Consultoria de Processos & Playbook Comercial',
      subtitle: 'Mapeamento de gargalos, roteiros de vendas e SLAs operacionais',
      icon: <GitBranch className="w-4 h-4 text-[#e24438]" />,
      action: () => {
        setActiveTab('process-consulting');
        onClose();
      },
    },
    {
      id: 'nav-dashboard',
      type: 'view',
      title: 'Dashboard de Resultados & Prova de ROI',
      subtitle: 'Métricas Antes vs Depois da consultoria e relatório executivo',
      icon: <BarChart3 className="w-4 h-4 text-[#98227b]" />,
      action: () => {
        setActiveTab('impact-dashboard');
        onClose();
      },
    },
    {
      id: 'nav-integrations',
      type: 'view',
      title: 'Central de Integrações & Redes (MikroTik, OLT, IXC)',
      subtitle: 'Status de conexão com concentradores, roteadores e billing',
      icon: <Network className="w-4 h-4 text-[#00897b]" />,
      action: () => {
        setActiveTab('integrations');
        onClose();
      },
    },
  ];

  const quickActionItems = [
    {
      id: 'act-new-lead',
      type: 'action',
      title: 'Cadastrar Novo Lead Comercial',
      subtitle: 'Adicionar oportunidade no funil de vendas',
      icon: <Plus className="w-4 h-4 text-emerald-600" />,
      action: () => {
        onClose();
        onOpenNewLead();
      },
    },
    {
      id: 'act-schedule',
      type: 'action',
      title: 'Agendar Reunião / Instalação',
      subtitle: 'Compromisso de fechamento ou visita técnica',
      icon: <Calendar className="w-4 h-4 text-blue-600" />,
      action: () => {
        onClose();
        onOpenScheduleMeeting();
      },
    },
    {
      id: 'act-call',
      type: 'action',
      title: 'Registrar Chamada Telefônica',
      subtitle: 'Gravar histórico de contato e próximos passos',
      icon: <Phone className="w-4 h-4 text-cyan-600" />,
      action: () => {
        onClose();
        onOpenLogCall();
      },
    },
    {
      id: 'act-task',
      type: 'action',
      title: 'Criar Tarefa / Atividade',
      subtitle: 'Atribuir follow-up para vendedor ou técnico',
      icon: <CheckSquare className="w-4 h-4 text-orange-600" />,
      action: () => {
        onClose();
        onOpenCreateTask();
      },
    },
    {
      id: 'act-feasibility',
      type: 'action',
      title: 'Verificar Viabilidade Óptica CTO',
      subtitle: 'Checar disponibilidade de portas GPON e atenuação',
      icon: <Wifi className="w-4 h-4 text-teal-600" />,
      action: () => {
        onClose();
        onOpenCheckFeasibility();
      },
    },
    {
      id: 'act-export-leads',
      type: 'action',
      title: 'Exportar Todos os Leads para CSV',
      subtitle: `Download da base de ${leads.length} leads em formato planilha`,
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" />,
      action: () => {
        onClose();
        exportLeadsToCSV(leads);
      },
    },
    {
      id: 'act-export-customers',
      type: 'action',
      title: 'Exportar Lista de Clientes para CSV',
      subtitle: `Download dos dados cadastrais e técnicos dos clientes`,
      icon: <FileSpreadsheet className="w-4 h-4 text-indigo-600" />,
      action: () => {
        onClose();
        exportCustomersToCSV(customers);
      },
    },
  ];

  // Lead search items
  const matchingLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    l.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
    l.planOfInterest.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 4).map(lead => ({
    id: `lead-${lead.id}`,
    type: 'lead',
    title: `${lead.name} (${lead.neighborhood})`,
    subtitle: `${lead.planOfInterest} • ${lead.phone} • Status: ${lead.status}`,
    icon: <Users className="w-4 h-4 text-emerald-600" />,
    action: () => {
      onSelectOpportunityLead(lead);
      setActiveTab('opportunity-workspace');
      onClose();
    }
  }));

  const allFilteredItems = [
    ...mainNavigationItems.filter(i => 
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(search.toLowerCase())
    ),
    ...quickActionItems.filter(i => 
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(search.toLowerCase())
    ),
    ...(search.trim().length > 0 ? matchingLeads : []),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allFilteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allFilteredItems.length) % (allFilteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allFilteredItems[selectedIndex]) {
        allFilteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 animate-in zoom-in-95 duration-150">
        
        {/* Command Search Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite para navegar, buscar lead ou executar ação... (Ex: 'Vendas', 'Lead', 'Exportar')"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded bg-white shrink-0">
            ESC
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {allFilteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhum comando ou lead encontrado para "{search}".
            </div>
          ) : (
            allFilteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 border border-blue-200 shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-white shadow-xs' : 'bg-slate-100'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.type === 'lead' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Abrir Ficha 360°
                      </span>
                    )}
                    {item.type === 'action' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Ação Rápida
                      </span>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-2xs">↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono shadow-2xs">ENTER</kbd>
              Executar
            </span>
          </div>
          <div className="text-[10px] text-slate-400">
            Dica: Pressione <strong>Ctrl + K</strong> a qualquer momento
          </div>
        </div>

      </div>
    </div>
  );
};
