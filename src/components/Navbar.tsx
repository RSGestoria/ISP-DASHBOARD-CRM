import React, { useState } from 'react';
import { 
  Grid, 
  Play, 
  Plus, 
  Search, 
  RotateCw, 
  Bell, 
  HelpCircle, 
  Settings, 
  X,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Zap,
  Calendar,
  Phone,
  CheckSquare,
  Wifi,
  Command,
  Sun,
  Moon,
  Radio
} from 'lucide-react';
import { ActiveTab, AppTheme } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewLeadClick: () => void;
  leadsCount: number;
  activeIspName: string;
  setActiveIspName: (name: string) => void;
  onOpenScheduleMeeting: () => void;
  onOpenLogCall: () => void;
  onOpenCreateTask: () => void;
  onOpenCheckFeasibility: () => void;
  onOpenCommandPalette: () => void;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewLeadClick,
  leadsCount,
  activeIspName,
  setActiveIspName,
  onOpenScheduleMeeting,
  onOpenLogCall,
  onOpenCreateTask,
  onOpenCheckFeasibility,
  onOpenCommandPalette,
  theme = 'light',
  onThemeChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const notifications = [
    { id: '1', title: 'Novo lead qualificado: Carlos Mendoza', time: 'Há 5 min', unread: true },
    { id: '2', title: 'Porta CTO-08 liberada (Hernandarias)', time: 'Há 18 min', unread: true },
    { id: '3', title: 'Meta semanal de 15 vendas atingida! 🎉', time: 'Há 1h', unread: false },
    { id: '4', title: 'Alerta de atenuação alta na porta 07 (-24.8 dBm)', time: 'Há 2h', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#351e6d] text-white shadow-md select-none border-b border-[#291456]">
      <div className="w-full px-3 sm:px-4">
        <div className="flex items-center justify-between h-13 gap-2 sm:gap-4">
          
          {/* Left Section: 9-dots Grid + Brand Name + Play + Quick Add + Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 9 Dots Grid Launcher */}
            <button 
              onClick={onOpenCommandPalette}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition-colors"
              title="Abrir Menu & Paleta de Comandos (Ctrl+K)"
            >
              <Grid className="w-5 h-5" />
            </button>

            {/* Logo / Brand */}
            <div 
              className="flex items-center gap-1.5 cursor-pointer group" 
              onClick={() => setActiveTab('opportunity-workspace')}
              title="Ir para a Ficha 360°"
            >
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                <span>Creatio</span>
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded group-hover:bg-emerald-500/30 transition-colors">
                  ISP
                </span>
              </span>
            </div>

            {/* Quick Actions Dropdown ("Ações Rápidas") */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowQuickActions(!showQuickActions);
                  setShowQuickCreate(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition-all"
                title="Menu de Ações Rápidas do Operador"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span className="hidden md:inline">Ações Rápidas</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {showQuickActions && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-2 z-50 text-xs font-medium animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Produtividade & Operação
                  </div>
                  
                  <button 
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenScheduleMeeting();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 flex items-center gap-2.5 text-slate-700 hover:text-emerald-900 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold">Agendar Reunião / Instalação</div>
                      <div className="text-[10px] text-slate-400">Visita técnica ou compromisso comercial</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenLogCall();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-slate-700 hover:text-blue-900 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold">Registrar Chamada</div>
                      <div className="text-[10px] text-slate-400">Histórico de contato telefônico</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenCreateTask();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-orange-50 flex items-center gap-2.5 text-slate-700 hover:text-orange-900 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold">Criar Tarefa / Atividade</div>
                      <div className="text-[10px] text-slate-400">Follow-up comercial ou SLA técnico</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenCheckFeasibility();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-teal-50 flex items-center gap-2.5 text-slate-700 hover:text-teal-900 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <Wifi className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold">Verificar Viabilidade CTO</div>
                      <div className="text-[10px] text-slate-400">Consultar portas livres e sinal GPON</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button 
                    onClick={() => {
                      setShowQuickActions(false);
                      onNewLeadClick();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-purple-50 flex items-center gap-2.5 text-purple-700 font-bold transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Cadastrar Novo Lead</div>
                      <div className="text-[10px] text-purple-500 font-normal">Inserir no funil de vendas</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Add (+) */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowQuickCreate(!showQuickCreate);
                  setShowQuickActions(false);
                }}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors font-bold text-sm"
                title="Criar Novo Registro"
              >
                <Plus className="w-4 h-4" />
              </button>

              {showQuickCreate && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-1.5 z-50 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100">
                  <button 
                    onClick={() => {
                      onNewLeadClick();
                      setShowQuickCreate(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-emerald-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Novo Lead
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('opportunity-workspace');
                      setShowQuickCreate(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2"
                  >
                    Nova Oportunidade 360°
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('customer-os');
                      setShowQuickCreate(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2"
                  >
                    Novo Ticket de Suporte
                  </button>
                </div>
              )}
            </div>

            {/* ISP Multi-unit Selector */}
            <div className="hidden lg:flex items-center gap-1 text-xs text-white/70 pl-2 border-l border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <select 
                value={activeIspName}
                onChange={(e) => setActiveIspName(e.target.value)}
                className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer pr-3"
              >
                <option value="Conecta Fibra Telecom (Hernandarias)" className="bg-[#351e6d] text-white">
                  Conecta Fibra (Hernandarias)
                </option>
                <option value="Frontera Net ISP (CDE & Foz)" className="bg-[#351e6d] text-white">
                  Frontera Net (CDE & Foz)
                </option>
                <option value="UltraNet Provedor de Internet" className="bg-[#351e6d] text-white">
                  UltraNet Telecom
                </option>
              </select>
            </div>
          </div>

          {/* Center Search Input with Keyboard Shortcut Trigger (Ctrl + K) */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-4">
            <button
              onClick={onOpenCommandPalette}
              className="w-full bg-[#271355]/80 hover:bg-[#271355] text-white text-xs rounded-full pl-3.5 pr-2.5 py-1.5 border border-white/15 hover:border-white/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2 text-white/60 group-hover:text-white/80">
                <Search className="w-3.5 h-3.5" />
                <span className="text-xs">Buscar lead, comando ou ação...</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px] bg-white/10 group-hover:bg-white/20 text-white/80 px-2 py-0.5 rounded-full border border-white/10">
                <span>Ctrl + K</span>
              </div>
            </button>
          </div>

          {/* Right Icons: Refresh + Command + Bell + Help + Settings + Profile Avatar */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Quick Command Palette Button */}
            <button 
              onClick={onOpenCommandPalette}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Paleta de Comandos (Ctrl+K)"
            >
              <Command className="w-4 h-4" />
            </button>

            {/* Refresh / Sync Icon */}
            <button 
              onClick={() => {
                const toast = document.createElement('div');
                toast.innerText = 'Sincronizado com MikroTik, OLT e ERP com sucesso!';
                toast.className = 'fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs shadow-2xl z-50 border border-slate-700 animate-in fade-in';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Sincronizar Dados"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Notification Bell with red dot */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                  setShowSettingsMenu(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors relative"
                title="Notificações do Sistema"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 ring-2 ring-[#351e6d]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold">
                    <span className="text-slate-900">Notificações Operacionais</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">2 não lidas</span>
                  </div>
                  <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors">
                        <div className="font-semibold text-slate-900">{n.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Selector Switcher */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowThemeMenu(!showThemeMenu);
                  setShowNotifications(false);
                  setShowProfileMenu(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors flex items-center gap-1 text-xs"
                title="Alternar Tema do Sistema (Claro / Escuro / Telecom)"
              >
                {theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-300" />
                ) : theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Radio className="w-4 h-4 text-cyan-300" />
                )}
                <ChevronDown className="w-3 h-3 opacity-60 hidden sm:inline" />
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Tema da Interface
                  </div>

                  <button
                    onClick={() => {
                      if (onThemeChange) onThemeChange('light');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                      theme === 'light' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Executivo Claro</span>
                    </div>
                    {theme === 'light' && <span className="text-[10px] text-amber-600 font-bold">Ativo</span>}
                  </button>

                  <button
                    onClick={() => {
                      if (onThemeChange) onThemeChange('dark');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                      theme === 'dark' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-emerald-600" />
                      <span>Dark Slate Noturno</span>
                    </div>
                    {theme === 'dark' && <span className="text-[10px] text-emerald-600 font-bold">Ativo</span>}
                  </button>

                  <button
                    onClick={() => {
                      if (onThemeChange) onThemeChange('telecom');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${
                      theme === 'telecom' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-indigo-600" />
                      <span>Telecom Midnight</span>
                    </div>
                    {theme === 'telecom' && <span className="text-[10px] text-indigo-600 font-bold">Ativo</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Help Question */}
            <button 
              onClick={() => setShowHelpModal(true)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Central de Ajuda & Atalhos"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Profile Avatar */}
            <div className="relative pl-1 sm:pl-2">
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 group focus:outline-none"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="User"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white/30 group-hover:ring-white transition-all"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="p-2.5 border-b border-slate-100">
                    <div className="font-bold text-slate-900">Rodrigo Seibel</div>
                    <div className="text-[10px] text-slate-500">Gestor Comercial & Telecom</div>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('opportunity-workspace');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 mt-1 font-medium text-slate-700"
                  >
                    Ficha de Oportunidade 360°
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('crm-funnel');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700 flex justify-between"
                  >
                    <span>Funil Comercial</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">{leadsCount}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab('impact-dashboard');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 font-medium text-slate-700"
                  >
                    Dashboard de Impacto & ROI
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <span>Ajuda & Atalhos de Produtividade</span>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl space-y-1">
                <div className="font-bold text-purple-900">⚡ Paleta de Comandos Rápida</div>
                <p>Pressione <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border text-slate-800 font-bold">Ctrl + K</kbd> em qualquer tela para abrir a busca universal de leads e ferramentas.</p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-slate-800">Principais Recursos:</div>
                <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600">
                  <li><strong>Ações Rápidas:</strong> Use o botão no topo para agendamentos, chamadas e tarefas em 1 clique.</li>
                  <li><strong>Exportação CSV:</strong> Baixe relatórios de leads e clientes nas respectivas abas.</li>
                  <li><strong>Viabilidade CTO:</strong> Verifique sinal óptico e portas livres antes de ofertar planos.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
