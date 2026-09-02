import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Phone, 
  CheckSquare, 
  MapPin, 
  Wifi, 
  User, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Send,
  Building2,
  FileText
} from 'lucide-react';
import { Lead, Salesperson } from '../../types';

// ==========================================
// 1. SCHEDULE MEETING / INSTALLATION MODAL
// ==========================================
interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  salespeople: Salesperson[];
  onSuccess?: (msg: string) => void;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
  leads,
  salespeople,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [meetingType, setMeetingType] = useState('Instalação de Fibra Óptica');
  const [date, setDate] = useState('2026-09-03');
  const [time, setTime] = useState('14:30');
  const [technician, setTechnician] = useState('Equipe Técnica Hernandarias 01');
  const [address, setAddress] = useState(leads[0]?.address || 'Av. Principal, Hernandarias');
  const [notes, setNotes] = useState('Levar ONU Wi-Fi 6 Gigabit e 80m de cabo drop.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLead = leads.find((l) => l.id === leadId) || leads[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess(`Agendamento confirmado para ${selectedLead?.name || 'Cliente'} em ${date} às ${time}!`);
      }
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-[#351e6d] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Agendar Reunião / Instalação</h3>
              <p className="text-[10px] text-white/70">Compromisso comercial ou visita técnica de campo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Lead / Cliente:</label>
            <select
              value={leadId}
              onChange={(e) => {
                setLeadId(e.target.value);
                const found = leads.find(l => l.id === e.target.value);
                if (found) setAddress(`${found.address}, ${found.neighborhood}`);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.neighborhood} ({l.planOfInterest})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipo de Evento:</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="Instalação de Fibra Óptica">Instalação de Fibra Óptica</option>
                <option value="Visita Técnica Prévia (Viabilidade)">Visita Técnica Prévia (Viabilidade)</option>
                <option value="Reunião Comercial B2B (Dedicado)">Reunião Comercial B2B (Dedicado)</option>
                <option value="Demonstração Wi-Fi 6">Demonstração Wi-Fi 6</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Responsável / Equipe:</label>
              <select
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="Equipe Técnica Hernandarias 01">Equipe Técnica Hernandarias 01</option>
                <option value="Equipe Fibra CDE Leste">Equipe Fibra CDE Leste</option>
                {salespeople.map(s => (
                  <option key={s.id} value={s.name}>{s.name} (Vendas)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Data:</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Horário:</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Endereço de Atendimento:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              placeholder="Rua, número, bairro..."
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Instruções / Observações:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              placeholder="Equipamentos necessários, ponto de referência..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5cb82e] hover:bg-[#4ea226] text-white font-bold transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar Agendamento'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


// ==========================================
// 2. LOG CALL MODAL
// ==========================================
interface LogCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onSuccess?: (msg: string) => void;
}

export const LogCallModal: React.FC<LogCallModalProps> = ({
  isOpen,
  onClose,
  leads,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [callOutcome, setCallOutcome] = useState('Atendeu - Interessado no plano 500M');
  const [durationMinutes, setDurationMinutes] = useState('4');
  const [nextStep, setNextStep] = useState('Enviar proposta detalhada com contrato via WhatsApp');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLead = leads.find((l) => l.id === leadId) || leads[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess(`Chamada registrada com sucesso para ${selectedLead?.name}!`);
      }
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-[#1e73be] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Registrar Ligação Comercial</h3>
              <p className="text-[10px] text-white/80">Histórico de contato telefônico ou chamada de voz</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Contato / Lead:</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.phone} ({l.neighborhood})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Resultado da Ligação:</label>
              <select
                value={callOutcome}
                onChange={(e) => setCallOutcome(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="Atendeu - Interessado no plano 500M">Atendeu - Interessado</option>
                <option value="Atendeu - Pediu para retornar mais tarde">Atendeu - Retornar depois</option>
                <option value="Atendeu - Achou valor alto (objeção)">Atendeu - Objeção de Preço</option>
                <option value="Não atendeu / Caixa postal">Não atendeu / Ocupado</option>
                <option value="Fechamento confirmado!">Fechamento / Venda 🎉</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Duração (Minutos):</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Resumo & Próximo Passo:</label>
            <textarea
              rows={3}
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              placeholder="O que foi acordado com o cliente..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1e73be] hover:bg-[#0093d8] text-white font-bold transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Gravando...' : 'Salvar Registro de Chamada'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


// ==========================================
// 3. CREATE TASK MODAL
// ==========================================
interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  salespeople: Salesperson[];
  onSuccess?: (msg: string) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  leads,
  salespeople,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [taskTitle, setTaskTitle] = useState('Qualificar e enviar proposta comercial');
  const [priority, setPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Alta');
  const [assignedTo, setAssignedTo] = useState(salespeople[0]?.name || 'Camila Benítez');
  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-09-02');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess(`Tarefa "${taskTitle}" criada e atribuída a ${assignedTo}!`);
      }
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-[#ee6c23] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Criar Tarefa / Atividade</h3>
              <p className="text-[10px] text-white/80">Follow-up comercial ou pendência operacional</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          
          <div>
            <label className="block font-bold text-slate-700 mb-1">Título da Atividade:</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              placeholder="Ex: Ligar para confirmar assinatura de contrato..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lead / Oportunidade Vinculada:</label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.neighborhood})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Prioridade:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="Alta">🔴 Alta Prioridade</option>
                <option value="Média">🟡 Média Prioridade</option>
                <option value="Baixa">🟢 Baixa Prioridade</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Atribuído para:</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              >
                {salespeople.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Data Limite (SLA):</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ee6c23] hover:bg-[#e24438] text-white font-bold transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Criando...' : 'Salvar Tarefa'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


// ==========================================
// 4. CHECK CTO FEASIBILITY MODAL
// ==========================================
interface CheckFeasibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
}

export const CheckFeasibilityModal: React.FC<CheckFeasibilityModalProps> = ({
  isOpen,
  onClose,
  leads,
}) => {
  if (!isOpen) return null;

  const [addressInput, setAddressInput] = useState('Av. Juan E. O’Leary, Barrio San Antonio, Hernandarias');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    status: 'viavel' | 'lotada' | 'sem_rede';
    ctoName: string;
    distanceMeters: number;
    freePorts: number;
    totalPorts: number;
    estimatedSignalDbm: number;
    oltName: string;
  } | null>({
    status: 'viavel',
    ctoName: 'CTO-08_Hernandarias_Central',
    distanceMeters: 65,
    freePorts: 4,
    totalPorts: 16,
    estimatedSignalDbm: -18.4,
    oltName: 'OLT-Huawei-5800-Porta-GPON-03',
  });

  const handleSimulateCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setResult({
        status: 'viavel',
        ctoName: `CTO-0${Math.floor(Math.random() * 8) + 1}_Hernandarias_Leste`,
        distanceMeters: Math.floor(Math.random() * 80) + 40,
        freePorts: Math.floor(Math.random() * 5) + 2,
        totalPorts: 16,
        estimatedSignalDbm: -(Math.floor(Math.random() * 5) + 17),
        oltName: 'OLT-Huawei-5800-Slot2',
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-[#00897b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Consulta Rápida de Viabilidade Óptica (CTO)</h3>
              <p className="text-[10px] text-white/80">Integração com Geoprocessamento e Portas GPON</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          
          <form onSubmit={handleSimulateCheck} className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Endereço / Ponto no Mapa:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:border-emerald-500"
                  placeholder="Digite o endereço ou coordenadas..."
                />
                <button
                  type="submit"
                  disabled={isChecking}
                  className="px-4 py-2 bg-[#00897b] hover:bg-[#00796b] text-white font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isChecking ? 'Consultando...' : 'Verificar'}
                </button>
              </div>
            </div>
          </form>

          {/* Result Card */}
          {result && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-sm text-emerald-900">100% VIÁVEL PARA INSTALAÇÃO</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Porta Imediata
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200/60 text-slate-700">
                <div>
                  <div className="text-[10px] text-slate-500">Caixa de Atendimento (CTO):</div>
                  <div className="font-bold text-slate-900">{result.ctoName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Distância até o poste:</div>
                  <div className="font-bold text-slate-900">{result.distanceMeters} metros (Ideal &lt; 150m)</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Portas Livres / Capacidade:</div>
                  <div className="font-bold text-emerald-700">{result.freePorts} de {result.totalPorts} disponíveis</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Atenuação Estimada (dBm):</div>
                  <div className="font-bold text-slate-900 font-mono">{result.estimatedSignalDbm} dBm (Excelente)</div>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-100">
                ✅ <strong>Recomendação Comercial:</strong> Agendamento autorizado com prazo de entrega de até 24h.
              </div>
            </div>
          )}

          {/* Close button */}
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
