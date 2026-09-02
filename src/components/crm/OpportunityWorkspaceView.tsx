import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Lock, 
  Unlock,
  MoreHorizontal, 
  Plus, 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  DollarSign, 
  Radio, 
  Sliders, 
  FileText, 
  RotateCw, 
  Search, 
  Sparkles, 
  Tag, 
  Layers, 
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Wifi,
  ChevronDown,
  Check,
  CheckSquare,
  Linkedin,
  Paperclip,
  BookOpen,
  Share2,
  Copy,
  Trash2,
  Edit3,
  UploadCloud,
  Download,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Lead, Salesperson, LeadStatus } from '../../types';

interface OpportunityWorkspaceViewProps {
  lead: Lead;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
  onBackToFunnel: () => void;
  salespeople: Salesperson[];
  theme?: 'dark' | 'light';
}

export const OpportunityWorkspaceView: React.FC<OpportunityWorkspaceViewProps> = ({
  lead,
  leads,
  onSelectLead,
  onUpdateLead,
  onBackToFunnel,
  salespeople,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'PROCESSING' | 'OPPORTUNITY INSIGHTS' | 'PRODUCTS' | 'HISTORY' | 'NEWS'>('OVERVIEW');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(85);
  const [commitToForecast, setCommitToForecast] = useState<boolean>(true);
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>(['AI', 'Hot_leads', 'Webinar_2023', 'Fibra_500M', 'Hernandarias']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [showNextSteps, setShowNextSteps] = useState(true);
  const [taskCompleted, setTaskCompleted] = useState(false);

  // Modals & Drawers state
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showAddCompetitorModal, setShowAddCompetitorModal] = useState(false);
  const [showAddNextStepModal, setShowAddNextStepModal] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Contact Person Editable State
  const [contactName, setContactName] = useState(lead.name);
  const [contactJobTitle, setContactJobTitle] = useState('Marketing Coordinator / Titular');
  const [contactPhone, setContactPhone] = useState(lead.phone);
  const [contactEmail, setContactEmail] = useState(`${lead.name.toLowerCase().replace(/\s+/g, '.')}@email.com`);
  const [contactLinkedin, setContactLinkedin] = useState(`/in/${lead.name.toLowerCase().replace(/\s+/g, '-')}`);

  // Contact roles state
  const [contactRoles, setContactRoles] = useState([
    { id: '1', name: lead.name, primary: true, role: 'Decision maker', influence: 'High', factors: 'Price & Estabilidade', loyalty: 'Positive' },
    { id: '2', name: 'Ana Benítez (Financeiro)', primary: false, role: 'Economic buyer', influence: 'Medium', factors: 'Forma de Pagamento QR', loyalty: 'Neutral' },
  ]);
  const [roleSearch, setRoleSearch] = useState('');

  // Opportunity team state
  const [opportunityTeam, setOpportunityTeam] = useState([
    { id: '1', name: lead.assignedSalesperson, role: 'Opportunity Owner (SDR / Vendas)' },
    { id: '2', name: 'Rodrigo Seibel', role: 'Sales Manager / Consultor' },
    { id: '3', name: 'Equipe Técnica Hernandarias 01', role: 'Field Engineering / Instalação' },
  ]);
  const [teamSearch, setTeamSearch] = useState('');

  // Competitors state
  const [competitors, setCompetitors] = useState([
    { id: '1', name: 'Provedor Concorrente Local', weakness: 'Roteador antigo 2.4GHz, instável', advantage: 'Wi-Fi 6 Gigabit + Atendimento em 5 min' },
    { id: '2', name: 'Operadora Móvel 4G/LTE', weakness: 'Franquia de dados limitada, alta latência', advantage: 'Fibra Pura 100% Ilimitada com Ping < 10ms' },
  ]);
  const [competitorSearch, setCompetitorSearch] = useState('');

  // Feed items state
  const [feedItems, setFeedItems] = useState([
    { id: '1', author: 'Rodrigo Seibel', time: 'Hoje às 10:15', text: 'Lead demonstrou grande interesse no plano de 500M com Wi-Fi 6. CTO-08 confirmada com 3 portas livres.' },
    { id: '2', author: lead.assignedSalesperson, time: 'Hoje às 09:30', text: 'Primeiro contato realizado via WhatsApp. Cliente solicitou proposta formal com taxa de instalação isenta no contrato de 12 meses.' },
  ]);
  const [newFeedText, setNewFeedText] = useState('');

  // Attachments state
  const [attachments, setAttachments] = useState([
    { id: '1', name: 'Proposta_Comercial_Fibra500M.pdf', size: '1.2 MB', date: 'Hoje', type: 'PDF' },
    { id: '2', name: 'Contrato_Adesao_Telecom_Padrao.pdf', size: '850 KB', date: 'Hoje', type: 'PDF' },
    { id: '3', name: 'Comprovante_Residencia_Hernandarias.jpg', size: '2.4 MB', date: 'Ontem', type: 'IMG' },
  ]);

  // Products & CPQ Quotation items state
  const [quoteProducts, setQuoteProducts] = useState([
    { id: '1', name: lead.planOfInterest || 'Fibra 500 Mbps + Wi-Fi 6', qty: 1, price: lead.monthlyValue || 150000, discount: 0, isRecurring: true },
    { id: '2', name: 'Roteador Mesh Wi-Fi 6 Adicional', qty: 1, price: 35000, discount: 0, isRecurring: true },
    { id: '3', name: 'Taxa de Instalação e Fusão Drop Óptico', qty: 1, price: 80000, discount: 80000, isRecurring: false },
  ]);

  // Next Steps list
  const [nextStepTasks, setNextStepTasks] = useState([
    { id: '1', title: 'Confirmar horário da visita técnica', date: '15/09/2026', assignee: lead.assignedSalesperson, done: false },
    { id: '2', title: 'Enviar link de assinatura digital do contrato', date: '16/09/2026', assignee: 'Rodrigo Seibel', done: false },
  ]);

  // Processing checklist items state
  const [processChecklist, setProcessChecklist] = useState([
    { id: 'c1', label: '1. Qualificação Comercial e Dados Cadastrais', done: true, stage: 'Qualificação' },
    { id: 'c2', label: '2. Viabilidade Óptica CTO-08 (< -22 dBm)', done: true, stage: 'Engenharia' },
    { id: 'c3', label: '3. Envio e Assinatura Digital do Contrato', done: false, stage: 'Proposta' },
    { id: 'c4', label: '4. Ordem de Serviço de Instalação & Fusão Drop', done: false, stage: 'Técnico' },
    { id: 'c5', label: '5. Provisionamento na OLT e Ativação Wi-Fi 6', done: false, stage: 'Ativação' },
  ]);

  // Toast Helper
  const showToast = (msg: string) => {
    const toast = document.createElement('div');
    toast.innerHTML = `<span class="font-bold text-emerald-400">✓</span> <span>${msg}</span>`;
    toast.className = 'fixed bottom-12 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs font-medium animate-in slide-in-from-bottom-3 duration-200';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
    showToast('Copiado para a área de transferência!');
  };

  // Stages matching Creatio Workflow
  const CREATIO_STAGES = [
    { id: 'novo', label: 'Qualification' },
    { id: 'contactado', label: 'Presentation' },
    { id: 'qualificado', label: 'Proposal' },
    { id: 'proposta', label: 'Contracting' },
    { id: 'venda', label: 'Closed won' },
  ];

  const currentStageIndex = () => {
    switch (lead.status) {
      case 'novo': return 0;
      case 'contactado': return 1;
      case 'qualificado': return 2;
      case 'proposta': 
      case 'negociacao': return 3;
      case 'venda': return 4;
      default: return 0;
    }
  };

  const handleStageClick = (targetStageId: string) => {
    if (isLocked) {
      showToast('Oportunidade está bloqueada para edição!');
      return;
    }
    let newStatus: LeadStatus = 'novo';
    if (targetStageId === 'novo') newStatus = 'novo';
    else if (targetStageId === 'contactado') newStatus = 'contactado';
    else if (targetStageId === 'qualificado') newStatus = 'qualificado';
    else if (targetStageId === 'proposta') newStatus = 'proposta';
    else if (targetStageId === 'venda') newStatus = 'venda';

    onUpdateLead({
      ...lead,
      status: newStatus,
    });
    showToast(`Etapa alterada para: ${targetStageId.toUpperCase()}`);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
      setShowAddTag(false);
      showToast(`Tag "${newTagInput.trim()}" adicionada!`);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    showToast(`Tag "${tagToRemove}" removida.`);
  };

  const handleSaveWorkspace = () => {
    onUpdateLead({
      ...lead,
      name: contactName,
      phone: contactPhone,
      tags,
    });
    showToast('Oportunidade salva com sucesso no Creatio CRM!');
  };

  const handleSaveContactPerson = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLead({
      ...lead,
      name: contactName,
      phone: contactPhone,
    });
    setShowEditContactModal(false);
    showToast(`Contato "${contactName}" atualizado com sucesso!`);
  };

  const handleAddFeedComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedText.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      author: 'Rodrigo Seibel',
      time: 'Agora mesmo',
      text: newFeedText.trim(),
    };
    setFeedItems([newComment, ...feedItems]);
    setNewFeedText('');
    showToast('Comentário publicado no Feed da Oportunidade!');
  };

  const totalMonthlyQuote = quoteProducts
    .filter(p => p.isRecurring)
    .reduce((sum, p) => sum + (p.price * p.qty) - p.discount, 0);

  const totalOneTimeQuote = quoteProducts
    .filter(p => !p.isRecurring)
    .reduce((sum, p) => sum + (p.price * p.qty) - p.discount, 0);

  return (
    <div className="w-full bg-[#edf0f5] text-slate-800 text-xs min-h-screen pb-12 font-sans">
      
      {/* 1. TOP RECORD HEADER (Creatio Style) */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left Title & Tag Pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onBackToFunnel}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Voltar ao Funil"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Lead Selector / Title */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {lead.name}, {lead.neighborhood || 'Accom'}
              </h1>
              {isLocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <Lock className="w-3 h-3" /> Bloqueado
                </span>
              )}
            </div>

            {/* Tags Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]"
                >
                  <span>{tag}</span>
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                    title="Remover tag"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {showAddTag ? (
                <form onSubmit={handleAddTag} className="inline-flex items-center">
                  <input
                    type="text"
                    placeholder="Tag..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    autoFocus
                    className="px-2 py-0.5 text-xs rounded-full border border-blue-400 focus:outline-none w-20 bg-white"
                  />
                  <button type="submit" className="ml-1 text-xs text-blue-600 font-bold">OK</button>
                  <button type="button" onClick={() => setShowAddTag(false)} className="ml-1 text-xs text-slate-400">✕</button>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddTag(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-0.5 rounded-full border border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  + Add tag
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Blue Pill: Next Steps Toggle */}
            <button
              onClick={() => setShowNextSteps(!showNextSteps)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                showNextSteps 
                  ? 'bg-[#0284c7] text-white' 
                  : 'bg-[#e0f2fe] text-[#0284c7] hover:bg-[#bae6fd]'
              }`}
            >
              Next steps
            </button>

            {/* Playbook Button */}
            <button 
              onClick={() => setShowPlaybookModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Abrir Playbook de Vendas ISP"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Playbook
            </button>

            {/* Feed Button */}
            <button 
              onClick={() => setShowFeedModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors relative"
              title="Feed e Discussões"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> Feed
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1" />
            </button>

            {/* Attachments Button */}
            <button 
              onClick={() => setShowAttachmentsModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Documentos & Anexos"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-500" /> Attachments ({attachments.length})
            </button>

            {/* Blue Primary Button: Save */}
            <button
              onClick={handleSaveWorkspace}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>

            {/* Lock Button */}
            <button 
              onClick={() => {
                setIsLocked(!isLocked);
                showToast(isLocked ? 'Registro desbloqueado!' : 'Registro bloqueado contra alterações acidentais.');
              }}
              className={`p-1.5 rounded-md transition-colors ${
                isLocked ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isLocked ? 'Desbloquear Oportunidade' : 'Bloquear Oportunidade'}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>

            {/* More Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Mais opções"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-xs font-semibold animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      showToast(`Oportunidade duplicada como cópia de "${lead.name}"!`);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600" /> Clonar Oportunidade
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      showToast('Proposta Comercial PDF gerada e pronta para download!');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" /> Gerar Proposta PDF
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      showToast('Link de compartilhamento copiado!');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                  >
                    <Share2 className="w-3.5 h-3.5 text-purple-600" /> Compartilhar Link
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onUpdateLead({ ...lead, status: 'perdido' });
                      showToast('Oportunidade marcada como Perdida.');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600"
                  >
                    <X className="w-3.5 h-3.5" /> Marcar como Perdida
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 2. CREATIO CHEVRON STAGES PIPELINE BAR */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 py-1">
          {CREATIO_STAGES.map((stage, idx) => {
            const activeIdx = currentStageIndex();
            const isActive = idx === activeIdx;
            const isCompleted = idx < activeIdx;

            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage.id)}
                className={`relative flex items-center justify-center px-6 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  idx === 0 ? 'chevron-stage-first' : idx === CREATIO_STAGES.length - 1 ? 'chevron-stage-last' : 'chevron-stage'
                } ${
                  isActive || isCompleted
                    ? 'bg-[#5cb82e] text-white hover:bg-[#4ea226]'
                    : 'bg-[#e2e8f0] text-slate-600 hover:bg-[#cbd5e1]'
                }`}
                style={{ minWidth: '140px' }}
              >
                <div className="flex items-center gap-1.5 pl-2 pr-3">
                  {(isActive || isCompleted) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{stage.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE 3-COLUMN GRID */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* ================= LEFT COLUMN (Col 1-3) ================= */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Opportunity Parameters Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
              
              {/* Confidence Level Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Confidence level</span>
                  <span className="text-blue-600 font-extrabold">{confidenceLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Info Rows */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <div className="text-[11px] text-slate-500">Last activity - Task</div>
                  <div className="font-semibold text-slate-800">14/03/2026 3:11 PM</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Decision maker</div>
                  <div 
                    onClick={() => setShowEditContactModal(true)}
                    className="font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{contactName}</span>
                    <Edit3 className="w-3 h-3 opacity-60" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[11px] text-slate-500">Total contract value</div>
                    <div className="font-bold text-slate-900">
                      {lead.monthlyValue.toLocaleString()} {lead.currency}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Expected close date</div>
                    <div className="font-semibold text-slate-800">12/09/2026</div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-2 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 font-medium">Commit to forecast</span>
                    <input
                      type="checkbox"
                      checked={commitToForecast}
                      onChange={(e) => {
                        setCommitToForecast(e.target.checked);
                        showToast(`Forecast ${e.target.checked ? 'ativado' : 'desativado'}`);
                      }}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-700 font-medium">New customer</span>
                    <input
                      type="checkbox"
                      checked={isNewCustomer}
                      onChange={(e) => {
                        setIsNewCustomer(e.target.checked);
                        showToast(`Status: ${e.target.checked ? 'Novo Cliente' : 'Base Existente'}`);
                      }}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                  </label>
                </div>

                {/* Predictive Scoring */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Predictive scoring (AI)</span>
                    <span className="text-blue-600 flex items-center gap-0.5 font-extrabold">
                      87% <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '87%' }} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Alta probabilidade de fechamento por sinal CTO excelente</div>
                </div>

              </div>

            </div>

            {/* Contact Person Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between font-bold text-slate-800 text-xs border-b border-slate-100 pb-2">
                <span>Contact person</span>
                <button 
                  onClick={() => setShowEditContactModal(true)}
                  className="text-blue-600 hover:underline cursor-pointer text-[11px] font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              {/* Photo & Name */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt={contactName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <div 
                    onClick={() => setShowEditContactModal(true)}
                    className="font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer"
                  >
                    {contactName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Hernandarias, Paraguay | Fuso Local
                  </div>
                </div>
              </div>

              {/* Contact Data Rows */}
              <div className="space-y-2 text-xs pt-1">
                <div>
                  <div className="text-[10px] text-slate-400">Full job title</div>
                  <div className="font-semibold text-slate-800">{contactJobTitle}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">Mobile phone - primary</div>
                  <div className="flex items-center justify-between">
                    <a 
                      href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(contactName)}!%20Te%20escribo%20de%20la%20central%20de%20fibra...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" /> {contactPhone}
                    </a>
                    <button 
                      onClick={() => copyText(contactPhone, 'phone')}
                      className="text-slate-400 hover:text-slate-700"
                      title="Copiar telefone"
                    >
                      {copiedItem === 'phone' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">Email - primary</div>
                  <div className="flex items-center justify-between">
                    <a href={`mailto:${contactEmail}`} className="font-medium text-blue-600 hover:underline flex items-center gap-1 truncate max-w-[180px]">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" /> {contactEmail}
                    </a>
                    <button 
                      onClick={() => copyText(contactEmail, 'email')}
                      className="text-slate-400 hover:text-slate-700"
                      title="Copiar email"
                    >
                      {copiedItem === 'email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">Business phone</div>
                  <div className="text-slate-700 font-medium">+595 971 882 119</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">LinkedIn</div>
                  <a 
                    href={`https://linkedin.com${contactLinkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Linkedin className="w-3 h-3" /> {contactLinkedin}
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* ================= CENTER COLUMN (Col 4-9) ================= */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* White Container with Sub-tabs and Dynamic View Body */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
              
              {/* Sub-Tabs Nav */}
              <div className="flex items-center gap-4 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
                {(['OVERVIEW', 'PROCESSING', 'OPPORTUNITY INSIGHTS', 'PRODUCTS', 'HISTORY', 'NEWS'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`pb-1 transition-colors whitespace-nowrap cursor-pointer ${
                      activeSubTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* 4 VIBRANT SOLID KPI TILES (Creatio style) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* 1. Days in funnel */}
                <div className="bg-[#1e73be] text-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">Days in funnel</div>
                  <div className="text-2xl font-black mt-1">16</div>
                </div>

                {/* 2. Days at current stage */}
                <div className="bg-[#0093d8] text-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">Days at stage</div>
                  <div className="text-2xl font-black mt-1">14</div>
                </div>

                {/* 3. Emails sent */}
                <div className="bg-[#ee6c23] text-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">Emails / WhatsApp</div>
                  <div className="text-2xl font-black mt-1">6</div>
                </div>

                {/* 4. Outgoing calls */}
                <div className="bg-[#5cb82e] text-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-90">Outgoing calls</div>
                  <div className="text-2xl font-black mt-1">4</div>
                </div>

              </div>

              {/* DYNAMIC CONTENT PER SUB-TAB */}
              
              {/* TAB 1: OVERVIEW */}
              {activeSubTab === 'OVERVIEW' && (
                <div className="space-y-4 pt-1">
                  
                  {/* Structured Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Customer need</label>
                      <select 
                        value={lead.planOfInterest}
                        onChange={(e) => onUpdateLead({ ...lead, planOfInterest: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Fibra 500 Mbps + Wi-Fi 6">Fibra 500 Mbps + Wi-Fi 6 (Residencial)</option>
                        <option value="Fibra Dedicada 700 Mbps B2B">Fibra Dedicada 700 Mbps B2B</option>
                        <option value="Ultra Fibra 600 Mbps">Ultra Fibra 600 Mbps Gamer</option>
                        <option value="Fibra Comercial 400 Mbps">Fibra Comercial 400 Mbps</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Contact</label>
                      <div 
                        onClick={() => setShowEditContactModal(true)}
                        className="font-bold text-blue-600 hover:underline cursor-pointer bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 truncate"
                      >
                        {contactName}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Account</label>
                      <div className="font-bold text-blue-600 hover:underline cursor-pointer bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 truncate">
                        {lead.neighborhood} Accom / Residencial
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Created on</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 font-medium text-slate-700">
                        {lead.createdAt}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Opportunity Name</label>
                      <input
                        type="text"
                        value={`Proposta Fibra 500M / ${contactName}`}
                        readOnly
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Assignees group</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 font-medium text-slate-700">
                        Comercial Fibra & SDRs
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Owner</label>
                      <select 
                        value={lead.assignedSalesperson}
                        onChange={(e) => onUpdateLead({ ...lead, assignedSalesperson: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        {salespeople.map((sp) => (
                          <option key={sp.id} value={sp.name}>{sp.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Sales channel</label>
                      <div className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 font-medium text-slate-700">
                        Direct sale ({lead.source})
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Viabilidade CTO</label>
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md px-2 py-1.5 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        CTO-08 (3 portas livres, -18.4 dBm)
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">Comment</label>
                      <textarea
                        rows={2}
                        value={lead.notes}
                        onChange={(e) => onUpdateLead({ ...lead, notes: e.target.value })}
                        placeholder="Insira detalhes sobre as necessidades do cliente..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: PROCESSING (SLA & Engineering Workflow) */}
              {activeSubTab === 'PROCESSING' && (
                <div className="space-y-4 pt-1">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Esteira Operacional & Checklist de Ativação ISP</span>
                    </div>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Monitore o SLA de ponta a ponta desde a captação até a fusão da fibra na casa do cliente.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {processChecklist.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setProcessChecklist(prev => prev.map(c => c.id === item.id ? { ...c, done: !c.done } : c));
                          showToast(`Item "${item.label}" atualizado!`);
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          item.done ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={item.done}
                            onChange={() => {}}
                            className="w-4 h-4 accent-emerald-600 rounded"
                          />
                          <span className={`font-semibold ${item.done ? 'line-through opacity-80' : ''}`}>
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                          {item.stage}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold">SLA Restante para Instalação:</div>
                      <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-4 h-4 text-emerald-600" /> 18h 40min (Dentro da Meta)
                      </div>
                    </div>
                    <button 
                      onClick={() => showToast('Ordem de Serviço enviada para a equipe de campo!')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-xs"
                    >
                      Despachar Ordem Técnica
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: OPPORTUNITY INSIGHTS (AI Scoring & Deal Analysis) */}
              {activeSubTab === 'OPPORTUNITY INSIGHTS' && (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>Fatores Positivos (IA Deal Score 87%)</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                        <li>Porta CTO-08 com sinal ótimo (-18.4 dBm)</li>
                        <li>Cliente insatisfeito com concorrente atual (alta latência)</li>
                        <li>Decisor econômico direto presente no WhatsApp</li>
                      </ul>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Pontos de Atenção</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                        <li>Exigência de taxa de instalação 100% isenta</li>
                        <li>Desejo de roteador Wi-Fi 6 sem custo de locação</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-900">Recomendação do Playbook IA:</div>
                      <div className="text-[11px] text-emerald-800 mt-0.5">
                        Ofereça o plano de 500M com fidelidade 12m concedendo a instalação grátis. A margem líquida permanece em 72%.
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPlaybookModal(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shrink-0 ml-2"
                    >
                      Ver Script Completo
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: PRODUCTS (CPQ Cart & Quotation) */}
              {activeSubTab === 'PRODUCTS' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Itens da Proposta Comercial (CPQ):</span>
                    <button 
                      onClick={() => {
                        const newProd = {
                          id: Date.now().toString(),
                          name: 'Ponto Adicional Wi-Fi 6',
                          qty: 1,
                          price: 25000,
                          discount: 0,
                          isRecurring: true,
                        };
                        setQuoteProducts([...quoteProducts, newProd]);
                        showToast('Novo item adicionado à proposta!');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Produto/Serviço
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] text-slate-400 uppercase font-semibold bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Item / Serviço</th>
                          <th className="p-2.5 text-center">Qtd</th>
                          <th className="p-2.5">Preço Unit.</th>
                          <th className="p-2.5">Desconto</th>
                          <th className="p-2.5">Total</th>
                          <th className="p-2.5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {quoteProducts.map((p) => {
                          const itemTotal = (p.price * p.qty) - p.discount;
                          return (
                            <tr key={p.id}>
                              <td className="p-2.5 font-bold text-slate-900">{p.name}</td>
                              <td className="p-2.5 text-center">
                                <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded">
                                  <button 
                                    onClick={() => setQuoteProducts(prev => prev.map(x => x.id === p.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}
                                    className="hover:text-blue-600 font-bold"
                                  >-</button>
                                  <span className="font-bold">{p.qty}</span>
                                  <button 
                                    onClick={() => setQuoteProducts(prev => prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x))}
                                    className="hover:text-blue-600 font-bold"
                                  >+</button>
                                </div>
                              </td>
                              <td className="p-2.5 font-mono">{p.price.toLocaleString()} {lead.currency}</td>
                              <td className="p-2.5 text-emerald-600 font-mono">
                                {p.discount > 0 ? `-${p.discount.toLocaleString()} ${lead.currency}` : '0'}
                              </td>
                              <td className="p-2.5 font-bold font-mono text-slate-900">{itemTotal.toLocaleString()} {lead.currency}</td>
                              <td className="p-2.5 text-right">
                                <button 
                                  onClick={() => setQuoteProducts(prev => prev.filter(x => x.id !== p.id))}
                                  className="text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-500">Mensalidade Recorrente: <strong className="text-slate-900 font-mono">{totalMonthlyQuote.toLocaleString()} {lead.currency}/mês</strong></div>
                      <div className="text-slate-500 text-[11px]">Taxa Única de Instalação: <strong className="text-slate-900 font-mono">{totalOneTimeQuote.toLocaleString()} {lead.currency}</strong></div>
                    </div>
                    <button 
                      onClick={() => showToast('Proposta Comercial PDF gerada com sucesso!')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Baixar Proposta em PDF
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: HISTORY (Audit Trail) */}
              {activeSubTab === 'HISTORY' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Histórico de Atividades & Interações:</span>
                    <button 
                      onClick={() => {
                        const newActivity = {
                          id: Date.now().toString(),
                          author: 'Rodrigo Seibel',
                          time: 'Agora mesmo',
                          text: 'Registro de interação adicionado manualmente pelo operador.',
                        };
                        setFeedItems([newActivity, ...feedItems]);
                        showToast('Novo evento registrado no histórico!');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Nota
                    </button>
                  </div>

                  <div className="space-y-2">
                    {feedItems.map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{item.author}</span>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: NEWS (Market Updates) */}
              {activeSubTab === 'NEWS' && (
                <div className="space-y-3 pt-1">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Notícias e Atualizações do Setor Telecom (Hernandarias / CDE)</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Expansão da rede FTTH no bairro {lead.neighborhood} concluída com 96 novas portas GPON.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-slate-800">Concorrente aumentou mensalidade de 300M</div>
                    <div className="text-[11px] text-slate-500">
                      Oportunidade de captação de clientes insatisfeitos com aumento recente de tarifas na região.
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Collapsible Section 1: Contact roles */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#ee6c23]">▲</span>
                  <span>Contact roles</span>
                  <button 
                    onClick={() => setShowAddRoleModal(true)}
                    className="text-blue-600 hover:text-blue-800 p-0.5"
                    title="Adicionar papel de contato"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <RotateCw 
                    onClick={() => showToast('Lista de contatos atualizada!')}
                    className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600 transition-colors" 
                    title="Atualizar lista"
                  />
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    className="px-2 py-0.5 text-[11px] border border-slate-200 rounded-md w-24 bg-slate-50"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] text-slate-400 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-1 px-2">Contact</th>
                      <th className="py-1 px-2 text-center">Primary</th>
                      <th className="py-1 px-2">Role</th>
                      <th className="py-1 px-2">Influence</th>
                      <th className="py-1 px-2">Decision factors</th>
                      <th className="py-1 px-2">Loyalty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {contactRoles
                      .filter(r => r.name.toLowerCase().includes(roleSearch.toLowerCase()) || r.role.toLowerCase().includes(roleSearch.toLowerCase()))
                      .map((r) => (
                        <tr key={r.id}>
                          <td 
                            onClick={() => setShowEditContactModal(true)}
                            className="py-2 px-2 font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            {r.name}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {r.primary ? <CheckSquare className="w-3.5 h-3.5 text-blue-600 inline" /> : <span className="text-slate-300">□</span>}
                          </td>
                          <td className="py-2 px-2 font-medium">{r.role}</td>
                          <td className="py-2 px-2">{r.influence}</td>
                          <td className="py-2 px-2">{r.factors}</td>
                          <td className={`py-2 px-2 font-semibold ${r.loyalty === 'Positive' ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {r.loyalty}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Collapsible Section 2: Opportunity team */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#ee6c23]">▲</span>
                  <span>Opportunity team</span>
                  <button 
                    onClick={() => setShowAddTeamModal(true)}
                    className="text-blue-600 hover:text-blue-800 p-0.5"
                    title="Adicionar membro da equipe"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <RotateCw 
                    onClick={() => showToast('Membros sincronizados!')}
                    className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600 transition-colors" 
                    title="Sincronizar"
                  />
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="px-2 py-0.5 text-[11px] border border-slate-200 rounded-md w-24 bg-slate-50"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] text-slate-400 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-1 px-2">Contact / Membro</th>
                      <th className="py-1 px-2">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {opportunityTeam
                      .filter(m => m.name.toLowerCase().includes(teamSearch.toLowerCase()) || m.role.toLowerCase().includes(teamSearch.toLowerCase()))
                      .map((m) => (
                        <tr key={m.id}>
                          <td className="py-2 px-2 font-bold text-blue-600">{m.name}</td>
                          <td className="py-2 px-2">{m.role}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Collapsible Section 3: Competitors */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#ee6c23]">▲</span>
                  <span>Competitors</span>
                  <button 
                    onClick={() => setShowAddCompetitorModal(true)}
                    className="text-blue-600 hover:text-blue-800 p-0.5"
                    title="Adicionar concorrente"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <RotateCw 
                    onClick={() => showToast('Concorrentes atualizados!')}
                    className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600 transition-colors" 
                    title="Atualizar"
                  />
                  <input
                    type="text"
                    placeholder="Filtrar..."
                    value={competitorSearch}
                    onChange={(e) => setCompetitorSearch(e.target.value)}
                    className="px-2 py-0.5 text-[11px] border border-slate-200 rounded-md w-24 bg-slate-50"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] text-slate-400 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-1 px-2">Competitor</th>
                      <th className="py-1 px-2">Weakness</th>
                      <th className="py-1 px-2">Our Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {competitors
                      .filter(c => c.name.toLowerCase().includes(competitorSearch.toLowerCase()))
                      .map((c) => (
                        <tr key={c.id}>
                          <td className="py-2 px-2 font-bold text-slate-800">{c.name}</td>
                          <td className="py-2 px-2 text-red-600">{c.weakness}</td>
                          <td className="py-2 px-2 text-emerald-600 font-semibold">{c.advantage}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN / NEXT STEPS PANEL (Col 10-12) ================= */}
          {showNextSteps && (
            <div className="lg:col-span-3 space-y-4">
              
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between font-bold text-xs text-slate-900 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1">
                    <span>Next steps</span>
                    <button 
                      onClick={() => setShowAddNextStepModal(true)}
                      className="text-blue-600 hover:text-blue-800 p-0.5"
                      title="Adicionar próxima atividade"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => setShowNextSteps(false)} className="text-slate-400 hover:text-slate-600" title="Fechar painel">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Next Steps List */}
                <div className="space-y-2">
                  {nextStepTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{task.title}</span>
                        <span className="text-[10px] text-slate-400">{task.date}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                            alt="Owner"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-[11px] font-semibold text-slate-700">{task.assignee}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setNextStepTasks(prev => prev.filter(t => t.id !== task.id));
                            showToast(`Tarefa "${task.title}" concluída!`);
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-bold text-[10px] flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" /> Feito
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Activity Action Card (Exact Creatio modal/box) */}
                <div className="p-4 rounded-xl border-2 border-blue-500 bg-white shadow-lg space-y-3">
                  
                  <div>
                    <div className="font-bold text-sm text-slate-900">Assign opportunity owner</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        taskCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-[#fef3c7] text-[#b45309]'
                      }`}>
                        {taskCompleted ? 'Activity completed' : 'Activity in progress'}
                      </span>
                      <span className="text-[10px] text-slate-400">Feb 9 9:50 PM - 10:20 PM</span>
                    </div>
                  </div>

                  {/* Connections Details */}
                  <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Account:</span>
                      <span className="font-semibold text-blue-600">{lead.neighborhood} Accom</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Contact:</span>
                      <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                        <span>{contactName}</span>
                        <a 
                          href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="WhatsApp"
                        >
                          <Phone className="w-3 h-3 text-emerald-600 hover:opacity-80" />
                        </a>
                        <a 
                          href={`mailto:${contactEmail}`} 
                          title="E-mail"
                        >
                          <Mail className="w-3 h-3 text-slate-400 hover:text-blue-600" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Opportunity:</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[140px]">Fibra 500M / {contactName}</span>
                    </div>
                  </div>

                  {/* Buttons: Cancel & Complete Activity */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        setTaskCompleted(false);
                        showToast('Atividade cancelada/adiada.');
                      }}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      ✕ Cancel activity
                    </button>

                    <button
                      onClick={() => {
                        setTaskCompleted(true);
                        handleStageClick('qualificado');
                        showToast('Atividade concluída com sucesso! Proposta enviada.');
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#5cb82e] hover:bg-[#4ea226] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Complete activity
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODALS & DRAWERS */}
      {/* ======================================================== */}

      {/* 1. PLAYBOOK MODAL */}
      {showPlaybookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 text-xs">
            <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Playbook Comercial de Vendas (ISP Fibra)</span>
              </div>
              <button onClick={() => setShowPlaybookModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <div className="font-bold text-blue-900">Script de Abordagem WhatsApp:</div>
                <p className="text-slate-700 italic leading-relaxed">
                  "Olá {contactName}, tudo bem? Sou o {lead.assignedSalesperson} da central de fibra. Verifiquei que a caixa CTO em frente ao seu endereço no bairro {lead.neighborhood} possui porta Gigabit liberada com sinal de -18 dBm. Conseguimos agendar sua instalação do plano 500M Wi-Fi 6 para amanhã com taxa 100% isenta!"
                </p>
                <button 
                  onClick={() => copyText(`Olá ${contactName}, tudo bem? Sou o ${lead.assignedSalesperson} da central de fibra. Verifiquei que a caixa CTO em frente ao seu endereço no bairro ${lead.neighborhood} possui porta Gigabit liberada com sinal de -18 dBm. Conseguimos agendar sua instalação do plano 500M Wi-Fi 6 para amanhã com taxa 100% isenta!`, 'script1')}
                  className="mt-2 text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copiar Mensagem Pronta
                </button>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="font-bold text-emerald-900">Quebra de Objeção: "Achei caro / Concorrente cobra menos"</div>
                <p className="text-slate-700 leading-relaxed">
                  "Entendo perfeitamente! A diferença é que entregamos roteador Wi-Fi 6 com tecnologia Mesh e suporte em menos de 5 minutos, sem travar o streaming ou jogos. Você tem 7 dias de garantia total sem custo de cancelamento."
                </p>
              </div>
            </div>

            <div className="p-3 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowPlaybookModal(false)}
                className="px-4 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEED & CHATTER MODAL */}
      {showFeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 text-xs">
            <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm">Feed da Oportunidade ({contactName})</span>
              </div>
              <button onClick={() => setShowFeedModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <form onSubmit={handleAddFeedComment} className="space-y-2">
                <textarea
                  rows={2}
                  placeholder="Escreva uma mensagem interna para a equipe..."
                  value={newFeedText}
                  onChange={(e) => setNewFeedText(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 bg-slate-50"
                />
                <div className="flex justify-end">
                  <button type="submit" className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-xs">
                    Publicar Comentário
                  </button>
                </div>
              </form>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {feedItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{item.author}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{item.time}</span>
                    </div>
                    <p className="text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ATTACHMENTS MODAL */}
      {showAttachmentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 text-xs">
            <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">Documentos & Anexos ({attachments.length})</span>
              </div>
              <button onClick={() => setShowAttachmentsModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50">
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <div className="font-bold text-slate-800">Clique ou arraste arquivos para anexar</div>
                <div className="text-[10px] text-slate-400 mt-0.5">PDF de Proposta, Documento de Identidade, Comprovante de Residência</div>
              </div>

              <div className="space-y-2">
                {attachments.map((att) => (
                  <div key={att.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-bold text-slate-900">{att.name}</div>
                        <div className="text-[10px] text-slate-400">{att.size} • {att.date}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => showToast(`Baixando ${att.name}...`)}
                      className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. EDIT CONTACT PERSON MODAL */}
      {showEditContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 text-xs">
            <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm">Editar Dados do Contato Principal</span>
              </div>
              <button onClick={() => setShowEditContactModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContactPerson} className="p-4 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo:</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cargo / Função:</label>
                <input
                  type="text"
                  value={contactJobTitle}
                  onChange={(e) => setContactJobTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp:</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail Principal:</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Perfil LinkedIn:</label>
                <input
                  type="text"
                  value={contactLinkedin}
                  onChange={(e) => setContactLinkedin(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditContactModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-xs"
                >
                  Salvar Contato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADD NEXT STEP TASK MODAL */}
      {showAddNextStepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 text-xs">
            <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">Criar Nova Próxima Atividade</span>
              </div>
              <button onClick={() => setShowAddNextStepModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('taskTitle') as HTMLInputElement).value;
                const date = (form.elements.namedItem('taskDate') as HTMLInputElement).value;
                const assignee = (form.elements.namedItem('taskAssignee') as HTMLSelectElement).value;
                
                setNextStepTasks([...nextStepTasks, { id: Date.now().toString(), title, date, assignee, done: false }]);
                setShowAddNextStepModal(false);
                showToast(`Nova atividade "${title}" adicionada!`);
              }}
              className="p-4 space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Atividade:</label>
                <input
                  name="taskTitle"
                  type="text"
                  placeholder="Ex: Realizar vistoria técnica de posteamento"
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data Limite (SLA):</label>
                  <input
                    name="taskDate"
                    type="date"
                    defaultValue="2026-09-05"
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Responsável:</label>
                  <select 
                    name="taskAssignee"
                    className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  >
                    {salespeople.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Equipe Técnica Hernandarias 01">Equipe Técnica</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddNextStepModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-xs"
                >
                  Adicionar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADD ROLE MODAL */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 text-xs">
            <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm">Adicionar Papel de Contato</span>
              </div>
              <button onClick={() => setShowAddRoleModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('roleName') as HTMLInputElement).value;
                const role = (form.elements.namedItem('roleTitle') as HTMLInputElement).value;
                setContactRoles([...contactRoles, { id: Date.now().toString(), name, primary: false, role, influence: 'Medium', factors: 'Qualidade', loyalty: 'Positive' }]);
                setShowAddRoleModal(false);
                showToast(`Papel para "${name}" adicionado!`);
              }}
              className="p-4 space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Contato:</label>
                <input
                  name="roleName"
                  type="text"
                  placeholder="Ex: Carlos Benítez (Técnico TI)"
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Papel na Decisão:</label>
                <input
                  name="roleTitle"
                  type="text"
                  placeholder="Ex: Technical Influencer / Administrador"
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-xs"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ADD TEAM MEMBER MODAL */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 text-xs">
            <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-sm">Adicionar Membro da Equipe</span>
              </div>
              <button onClick={() => setShowAddTeamModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('memberName') as HTMLInputElement).value;
                const role = (form.elements.namedItem('memberRole') as HTMLInputElement).value;
                setOpportunityTeam([...opportunityTeam, { id: Date.now().toString(), name, role }]);
                setShowAddTeamModal(false);
                showToast(`Membro "${name}" adicionado à oportunidade!`);
              }}
              className="p-4 space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Membro / Especialista:</label>
                <input
                  name="memberName"
                  type="text"
                  placeholder="Ex: Engenheiro de Redes GPON"
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Função:</label>
                <input
                  name="memberRole"
                  type="text"
                  placeholder="Ex: Suporte Técnico de Campo / Fusão"
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-xs"
                >
                  Salvar Membro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. ADD COMPETITOR MODAL */}
      {showAddCompetitorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-800 text-xs">
            <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span className="font-bold text-sm">Adicionar Concorrente Mapeado</span>
              </div>
              <button onClick={() => setShowAddCompetitorModal(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('compName') as HTMLInputElement).value;
                const weakness = (form.elements.namedItem('compWeakness') as HTMLInputElement).value;
                const advantage = (form.elements.namedItem('compAdvantage') as HTMLInputElement).value;
                setCompetitors([...competitors, { id: Date.now().toString(), name, weakness, advantage }]);
                setShowAddCompetitorModal(false);
                showToast(`Concorrente "${name}" adicionado!`);
              }}
              className="p-4 space-y-3"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Provedor Concorrente:</label>
                <input
                  name="compName"
                  type="text"
                  placeholder="Ex: Provedor XYZ Fibra"
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ponto Fraco Deles:</label>
                <input
                  name="compWeakness"
                  type="text"
                  placeholder="Ex: Roteador antigo, sem suporte no fim de semana"
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nossa Vantagem Competitiva:</label>
                <input
                  name="compAdvantage"
                  type="text"
                  placeholder="Ex: Wi-Fi 6 Mesh + Atendimento 24/7"
                  className="w-full border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCompetitorModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg shadow-xs"
                >
                  Salvar Concorrente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
