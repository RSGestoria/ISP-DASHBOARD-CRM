import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OpportunityWorkspaceView } from './components/crm/OpportunityWorkspaceView';
import { CrmFunnelView } from './components/crm/CrmFunnelView';
import { CustomerOperatingSystemView } from './components/customer/CustomerOperatingSystemView';
import { ProcessConsultingView } from './components/consulting/ProcessConsultingView';
import { ImpactDashboardView } from './components/dashboard/ImpactDashboardView';
import { IntegrationsHubView } from './components/integrations/IntegrationsHubView';
import { LeadDetailModal } from './components/crm/LeadDetailModal';
import { NewLeadModal } from './components/crm/NewLeadModal';
import { CommandPaletteModal } from './components/common/CommandPaletteModal';
import { 
  ScheduleMeetingModal, 
  LogCallModal, 
  CreateTaskModal, 
  CheckFeasibilityModal 
} from './components/common/QuickActionModals';
import { 
  INITIAL_LEADS, 
  INITIAL_CUSTOMERS, 
  INITIAL_SALESPEOPLE 
} from './data/mockData';
import { Lead, Customer360, Salesperson, ActiveTab, AppTheme } from './types';
import { Layers, Users, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('crm-funnel');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [customers, setCustomers] = useState<Customer360[]>(INITIAL_CUSTOMERS);
  const [salespeople] = useState<Salesperson[]>(INITIAL_SALESPEOPLE);
  const [activeIspName, setActiveIspName] = useState('Conecta Fibra Telecom (Hernandarias)');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedOpportunityLead, setSelectedOpportunityLead] = useState<Lead>(INITIAL_LEADS[0]);
  
  // Modals state
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCheckFeasibilityOpen, setIsCheckFeasibilityOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateLead = (updated: Lead) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (selectedOpportunityLead.id === updated.id) {
      setSelectedOpportunityLead(updated);
    }
    showToast(`Lead "${updated.name}" atualizado com sucesso!`);
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    setSelectedOpportunityLead(newLead);
    setActiveTab('opportunity-workspace');
    showToast(`Novo lead "${newLead.name}" cadastrado com sucesso!`);
  };

  const handleOpenLeadWorkspace = (lead: Lead) => {
    setSelectedOpportunityLead(lead);
    setActiveTab('opportunity-workspace');
  };

  const mainBgClass = 
    theme === 'light' 
      ? 'bg-[#edf0f5] text-slate-800' 
      : theme === 'dark' 
        ? 'bg-[#0f172a] text-slate-100' 
        : 'bg-[#0a0e27] text-slate-100';

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#f1f4f9]' : theme === 'dark' ? 'bg-[#0b1120]' : 'bg-[#070a1e]'
    }`}>
      
      {/* 1. Global Creatio Deep Purple Header with Quick Actions and Search */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewLeadClick={() => setIsNewLeadModalOpen(true)}
        leadsCount={leads.length}
        activeIspName={activeIspName}
        setActiveIspName={setActiveIspName}
        onOpenScheduleMeeting={() => setIsScheduleMeetingOpen(true)}
        onOpenLogCall={() => setIsLogCallOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onOpenCheckFeasibility={() => setIsCheckFeasibilityOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* 2. Main Flex Layout: Left Sidebar + Center Workspace */}
      <div className="flex-1 flex w-full">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          leadsCount={leads.length}
        />

        {/* Center Main Stage Content */}
        <main className={`flex-1 min-w-0 flex flex-col transition-colors duration-200 ${mainBgClass}`}>
          
          <div className="flex-1">
            {activeTab === 'opportunity-workspace' && (
              <OpportunityWorkspaceView
                lead={selectedOpportunityLead}
                leads={leads}
                onSelectLead={(l) => setSelectedOpportunityLead(l)}
                onUpdateLead={handleUpdateLead}
                onBackToFunnel={() => setActiveTab('crm-funnel')}
                salespeople={salespeople}
                theme={theme === 'light' ? 'light' : 'dark'}
              />
            )}

            {activeTab === 'crm-funnel' && (
              <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
                <CrmFunnelView
                  leads={leads}
                  setLeads={setLeads}
                  salespeople={salespeople}
                  onOpenLeadDetail={(lead) => handleOpenLeadWorkspace(lead)}
                  onNewLeadClick={() => setIsNewLeadModalOpen(true)}
                  theme={theme}
                  onThemeChange={setTheme}
                />
              </div>
            )}

            {activeTab === 'customer-os' && (
              <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
                <CustomerOperatingSystemView
                  customers={customers}
                  setCustomers={setCustomers}
                />
              </div>
            )}

            {activeTab === 'process-consulting' && (
              <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
                <ProcessConsultingView
                  activeIspName={activeIspName}
                />
              </div>
            )}

            {activeTab === 'impact-dashboard' && (
              <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
                <ImpactDashboardView
                  activeIspName={activeIspName}
                />
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full">
                <IntegrationsHubView />
              </div>
            )}
          </div>

          {/* Bottom Open Entity Tabs Dock (Creatio Style) */}
          <div className="bg-[#241244] border-t border-slate-700/40 px-3 py-1 flex items-center gap-1 shrink-0 text-xs select-none">
            <button
              onClick={() => setActiveTab('crm-funnel')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                activeTab === 'crm-funnel'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded bg-[#ee6c23] flex items-center justify-center text-white">
                <Users className="w-2.5 h-2.5" />
              </div>
              <span>Leads ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('opportunity-workspace')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                activeTab === 'opportunity-workspace'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded bg-[#5cb82e] flex items-center justify-center text-white">
                <Layers className="w-2.5 h-2.5" />
              </div>
              <span className="truncate max-w-[200px]">Opportunities ({selectedOpportunityLead.name})</span>
            </button>
          </div>

        </main>

      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs font-medium animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        leads={leads}
        customers={customers}
        onSelectOpportunityLead={(lead) => {
          setSelectedOpportunityLead(lead);
          setActiveTab('opportunity-workspace');
        }}
        onOpenNewLead={() => setIsNewLeadModalOpen(true)}
        onOpenScheduleMeeting={() => setIsScheduleMeetingOpen(true)}
        onOpenLogCall={() => setIsLogCallOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onOpenCheckFeasibility={() => setIsCheckFeasibilityOpen(true)}
      />

      <ScheduleMeetingModal
        isOpen={isScheduleMeetingOpen}
        onClose={() => setIsScheduleMeetingOpen(false)}
        leads={leads}
        salespeople={salespeople}
        onSuccess={showToast}
      />

      <LogCallModal
        isOpen={isLogCallOpen}
        onClose={() => setIsLogCallOpen(false)}
        leads={leads}
        onSuccess={showToast}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        leads={leads}
        salespeople={salespeople}
        onSuccess={showToast}
      />

      <CheckFeasibilityModal
        isOpen={isCheckFeasibilityOpen}
        onClose={() => setIsCheckFeasibilityOpen(false)}
        leads={leads}
      />

      <LeadDetailModal
        lead={selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
        onUpdateLead={handleUpdateLead}
        salespeople={salespeople}
      />

      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onAddLead={handleAddLead}
        salespeople={salespeople}
      />

    </div>
  );
}
