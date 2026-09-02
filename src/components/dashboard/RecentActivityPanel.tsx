import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  Wifi, 
  Sparkles, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Plus, 
  Filter, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Lead } from '../../types';

interface ActivityItem {
  id: string;
  type: 'commercial' | 'technical' | 'system_ai' | 'sales';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  actorAvatar?: string;
  badge?: string;
  badgeColor?: string;
  actionableLeadId?: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'sales',
    title: 'Venda Fechada & Instalação Agendada 🎉',
    description: 'Dr. Andrés Villalba fechou contrato Fibra 500 Mbps + Wi-Fi 6 (180.000 Gs./mês) no Barrio San Antonio.',
    timestamp: 'Há 12 minutos',
    actor: 'Camila Benítez',
    actorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    badge: 'Venda Concluída',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'act-2',
    type: 'technical',
    title: 'Liberação de Portas CTO-08 (Hernandarias)',
    description: 'Equipe de campo concluiu fusão e ativou 3 novas portas GPON com atenuação média de -18.4 dBm.',
    timestamp: 'Há 45 minutos',
    actor: 'Equipe de Redes NOC',
    badge: 'Infraestrutura OK',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'act-3',
    type: 'commercial',
    title: 'Mudança de Etapa: Proposta Comercial Enviada',
    description: 'Lead "Clínica Vida" avançou para a fase de Proposta (Link Dedicado 700 Mbps B2B).',
    timestamp: 'Há 1 hora',
    actor: 'Diego Ferreira',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    badge: 'Proposta B2B',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'act-4',
    type: 'system_ai',
    title: 'Diagnóstico IA de Prevenção de Churn Gerado',
    description: 'Cliente "Maria Elena López" analisada: Risco ALTO identificado por 12 quedas ópticas. Script de retenção sugerido.',
    timestamp: 'Há 2 horas',
    actor: 'Gemini AI Advisor',
    badge: 'Alerta de Churn',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'act-5',
    type: 'commercial',
    title: 'Novo Lead Inbound via Meta Ads Qualificado',
    description: 'Carlos Mendoza demonstrou interesse no plano residencial e teve viabilidade óptica aprovada.',
    timestamp: 'Há 3 horas',
    actor: 'Rodrigo Seibel',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    badge: 'Novo Lead',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
  },
];

interface RecentActivityPanelProps {
  onSelectLead?: (leadId: string) => void;
  theme?: 'dark' | 'light';
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  onSelectLead,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [filterType, setFilterType] = useState<'all' | 'commercial' | 'technical' | 'system_ai' | 'sales'>('all');
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [quickNote, setQuickNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  const filtered = activities.filter(a => filterType === 'all' || a.type === filterType);

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;

    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'commercial',
      title: 'Nota Operacional / Atualização de CRM',
      description: quickNote.trim(),
      timestamp: 'Agora mesmo',
      actor: 'Você (Gestor)',
      badge: 'Nota Manual',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    setActivities([newAct, ...activities]);
    setQuickNote('');
    setShowAddNote(false);
  };

  const getIconForType = (type: ActivityItem['type']) => {
    switch (type) {
      case 'sales':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'technical':
        return <Wifi className="w-4 h-4 text-blue-500" />;
      case 'system_ai':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'commercial':
      default:
        return <Users className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className={`rounded-2xl border p-5 transition-all shadow-sm space-y-4 ${
      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border-cyan-200'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Painel de Atividade Recente & Operações do CRM
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Rastreamento em tempo real de mudanças de status de leads, notificações de rede e intervenções IA.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddNote(!showAddNote)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Registrar Atualização
          </button>
        </div>
      </div>

      {/* Quick Add Note Form */}
      {showAddNote && (
        <form onSubmit={handleAddQuickNote} className={`p-3 rounded-xl border space-y-2 animate-in fade-in ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <label className={`text-xs font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Inserir registro rápido no feed de operações:
          </label>
          <textarea
            rows={2}
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Ex: Reunião alinhada com sócios sobre expansão no Bairro San José..."
            className={`w-full p-2 text-xs rounded-lg border focus:outline-none focus:border-cyan-500 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddNote(false)}
              className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              Publicar no Feed
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {[
          { id: 'all', label: 'Todas as Atividades' },
          { id: 'commercial', label: 'Comercial & Leads' },
          { id: 'sales', label: 'Vendas Fechadas' },
          { id: 'technical', label: 'Técnico & CTOs' },
          { id: 'system_ai', label: 'Alertas & IA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              filterType === tab.id
                ? isDark 
                  ? 'bg-cyan-500 text-slate-950 shadow-xs' 
                  : 'bg-cyan-600 text-white shadow-xs'
                : isDark 
                  ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800' 
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-2.5 pt-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark 
                ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950' 
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white shadow-2xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}>
                {getIconForType(item.type)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.timestamp}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-slate-500">
                    Por: {item.actor}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 ${
                isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-600 border-slate-200'
              }`}>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Sincronizado
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
