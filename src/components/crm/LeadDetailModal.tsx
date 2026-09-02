import React, { useState } from 'react';
import { 
  Lead, 
  LeadStatus, 
  FeasibilityStatus, 
  Salesperson 
} from '../../types';
import { 
  X, 
  Phone, 
  MapPin, 
  DollarSign, 
  Wifi, 
  Calendar, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  MessageSquare, 
  Send, 
  FileText, 
  Copy, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateLead: (updated: Lead) => void;
  salespeople: Salesperson[];
  theme?: 'dark' | 'light';
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdateLead,
  salespeople,
  theme = 'dark',
}) => {
  if (!lead) return null;
  const isDark = theme === 'dark';

  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [feasibility, setFeasibility] = useState<FeasibilityStatus>(lead.technicalFeasibility);
  const [notes, setNotes] = useState(lead.notes);
  const [assignedSalesperson, setAssignedSalesperson] = useState(lead.assignedSalesperson);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleSave = () => {
    if (status === 'venda' && lead.status !== 'venda') {
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}
    }

    onUpdateLead({
      ...lead,
      status,
      technicalFeasibility: feasibility,
      notes,
      assignedSalesperson,
      lastContact: 'Agora mesmo',
    });
    onClose();
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(lead.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className={`border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.name}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}>
                {lead.source}
              </span>
            </div>
            <div className={`text-xs mt-0.5 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{lead.address} — {lead.neighborhood}, {lead.city}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Plan & Value Highlight */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Plano de Interesse</div>
              <div className={`font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.planOfInterest}</div>
            </div>
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Velocidade</div>
              <div className="font-bold text-emerald-500 mt-0.5">{lead.speedMbps} Mbps Fibra</div>
            </div>
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Valor Mensalidade</div>
              <div className={`font-bold mt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {lead.currency} {lead.monthlyValue.toLocaleString()}
              </div>
            </div>
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Telefone / WhatsApp</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{lead.phone}</span>
                <button
                  onClick={handleCopyPhone}
                  className={`hover:opacity-80 transition-opacity ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Copiar número"
                >
                  {copiedPhone ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Funnel Stage & Technical Feasibility Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="space-y-1.5">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Etapa no Funil de Vendas:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className={`w-full border rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="novo">1. Novo Lead</option>
                <option value="contactado">2. Contactado</option>
                <option value="qualificado">3. Qualificado (Viabilidade OK)</option>
                <option value="proposta">4. Proposta Enviada</option>
                <option value="negociacao">5. Em Negociação</option>
                <option value="venda">6. Venda Fechada / Instalação 🎉</option>
                <option value="perdido">7. Perdido / Sem Rede</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Viabilidade Técnica da CTO:</label>
              <select
                value={feasibility}
                onChange={(e) => setFeasibility(e.target.value as FeasibilityStatus)}
                className={`w-full border rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="viavel">🟢 Viável (Porta CTO Livre)</option>
                <option value="cto_lotada">🟡 CTO Lotada (Requer Splitter)</option>
                <option value="sem_cobertura">🔴 Sem Cobertura (&gt; 600m)</option>
                <option value="analisando">⚪ Analisando Engenharia</option>
              </select>
            </div>

          </div>

          {/* Salesperson Assignment */}
          <div className="space-y-1.5">
            <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Vendedor Responsável:</label>
            <select
              value={assignedSalesperson}
              onChange={(e) => setAssignedSalesperson(e.target.value)}
              className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              {salespeople.map((sp) => (
                <option key={sp.id} value={sp.name}>{sp.name} ({sp.role})</option>
              ))}
            </select>
          </div>

          {/* Internal Notes & History */}
          <div className="space-y-1.5">
            <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Anotações do Vendedor / Histórico:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva detalhes da conversa, objeções, data combinada de instalação..."
              className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 leading-relaxed transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tags do Lead:</span>
            <div className="flex flex-wrap gap-1">
              {lead.tags.map((t, i) => (
                <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] border ${
                  isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <a
            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(lead.name)}!%20Te%20escribo%20de%20la%20central%20de%20fibra...`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              isDark 
                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/30' 
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" /> WhatsApp Web
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
