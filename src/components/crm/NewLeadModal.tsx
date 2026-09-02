import React, { useState } from 'react';
import { Lead, Salesperson } from '../../types';
import { X, Plus, Sparkles, MapPin, Wifi, Phone, User, DollarSign } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (newLead: Lead) => void;
  salespeople: Salesperson[];
  theme?: 'dark' | 'light';
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  salespeople,
  theme = 'dark',
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('San Antonio');
  const [city, setCity] = useState('Hernandarias');
  const [planOfInterest, setPlanOfInterest] = useState('Fibra 500 Mbps + Wi-Fi 6');
  const [monthlyValue, setMonthlyValue] = useState(150000);
  const [currency, setCurrency] = useState('Gs.');
  const [source, setSource] = useState<'Meta Ads' | 'WhatsApp Direto' | 'Indicação' | 'Google Ads' | 'Site'>('Meta Ads');
  const [assignedSalesperson, setAssignedSalesperson] = useState(salespeople[0]?.name || 'Camila Benítez');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const speed = planOfInterest.includes('700') ? 700 : (planOfInterest.includes('500') ? 500 : (planOfInterest.includes('600') ? 600 : 300));

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || 'Avenida Principal, s/n',
      neighborhood,
      city,
      planOfInterest,
      speedMbps: speed,
      monthlyValue: Number(monthlyValue) || 150000,
      currency,
      status: 'novo',
      assignedSalesperson,
      source,
      createdAt: 'Hoje, agora',
      lastContact: 'Pendente',
      technicalFeasibility: 'viavel',
      notes: notes.trim() || 'Lead cadastrado diretamente pela central.',
      tags: ['Novo Lead', source, planOfInterest.includes('Wi-Fi 6') ? 'Wi-Fi 6' : 'Fibra'],
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className={`border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg border ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              <Plus className="w-4 h-4" />
            </span>
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Cadastrar Novo Lead Comercial</h2>
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

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
          
          <div className="space-y-1">
            <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nome do Lead / Empresa:</label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Mendoza ou Clínica Vida"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Telefone / WhatsApp:</label>
              <input
                type="text"
                required
                placeholder="+595 983 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono transition-colors ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Canal de Origem:</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="Meta Ads">Meta Ads (Instagram / FB)</option>
                <option value="WhatsApp Direto">WhatsApp Direto</option>
                <option value="Indicação">Indicação de Cliente</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Site">Site Oficial</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Endereço Completo:</label>
            <input
              type="text"
              placeholder="Rua, número, ponto de referência..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Bairro:</label>
              <input
                type="text"
                placeholder="Ex: San Antonio, Centro..."
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Cidade:</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="Hernandarias">Hernandarias (PY)</option>
                <option value="Ciudad del Este">Ciudad del Este (PY)</option>
                <option value="Foz do Iguaçu">Foz do Iguaçu (BR)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Plano de Interesse:</label>
              <select
                value={planOfInterest}
                onChange={(e) => setPlanOfInterest(e.target.value)}
                className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="Fibra 300 Mbps Básico">Fibra 300 Mbps Básico</option>
                <option value="Fibra 500 Mbps + Wi-Fi 6">Fibra 500 Mbps + Wi-Fi 6</option>
                <option value="Ultra Fibra 600 Mbps">Ultra Fibra 600 Mbps</option>
                <option value="Fibra Dedicada 700 Mbps B2B">Fibra Dedicada 700 Mbps B2B</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Mensalidade Estimada:</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={monthlyValue}
                  onChange={(e) => setMonthlyValue(Number(e.target.value))}
                  className={`w-full border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'
                  }`}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`border rounded-xl px-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="Gs.">Gs.</option>
                  <option value="R$">R$</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Vendedor / Atendente Atribuído:</label>
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

          <div className="space-y-1">
            <label className={`font-bold block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Observações Iniciais:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Cliente com pressa para trocar de provedor..."
              className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <div className={`p-3 rounded-xl text-[11px] flex items-center gap-2 border ${
            isDark ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>O lead entrará automaticamente na etapa <strong>1. Novos Leads</strong> com SLA de 5 minutos acionado.</span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
            >
              Cadastrar Lead
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
