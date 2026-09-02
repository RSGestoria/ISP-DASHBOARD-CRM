import React, { useState, useEffect } from 'react';
import { 
  Customer360, 
  DiagnosticResult, 
  AIAgentType 
} from '../../types';
import { 
  Bot, 
  Wifi, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Phone, 
  Clock, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  Radio, 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  User, 
  MessageSquare,
  Zap,
  HelpCircle,
  FileText,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { exportCustomersToCSV } from '../../utils/csvExport';

interface CustomerOperatingSystemViewProps {
  customers: Customer360[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer360[]>>;
  theme?: 'dark' | 'light';
}

export const CustomerOperatingSystemView: React.FC<CustomerOperatingSystemViewProps> = ({
  customers,
  setCustomers,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [activeAgent, setActiveAgent] = useState<AIAgentType>('suporte');
  const [customerMessageInput, setCustomerMessageInput] = useState('');
  const [operatorReplyInput, setOperatorReplyInput] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isRunningTechnicalTest, setIsRunningTechnicalTest] = useState(false);
  const clientDiagCache = React.useRef<Record<string, DiagnosticResult>>({});

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Auto trigger AI Diagnosis when customer changes (with client caching)
  useEffect(() => {
    if (selectedCustomer) {
      if (clientDiagCache.current[selectedCustomer.id]) {
        const cached = clientDiagCache.current[selectedCustomer.id];
        setDiagnosticResult(cached);
        setOperatorReplyInput(cached.suggestedWhatsAppReply || '');
      } else {
        handleRunAiDiagnosis(selectedCustomer);
      }
    }
  }, [selectedCustomerId]);

  const handleRunAiDiagnosis = async (cust: Customer360, customMsg?: string) => {
    setIsDiagnosing(true);
    try {
      const response = await fetch('/api/ai/diagnose-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            id: cust.id,
            name: cust.name,
            plan: cust.plan,
            speedMbps: cust.speedMbps,
            seniorityYears: cust.seniorityYears,
            complaintsCount: cust.complaintsCount,
            npsScore: cust.npsScore,
          },
          customerMessage: customMsg || cust.recentMessages[0]?.text || "Minha conexão está instável.",
          technicalMetrics: cust.technical,
          erpStatus: cust.erp,
        }),
      });

      if (response.ok) {
        const data: DiagnosticResult = await response.json();
        clientDiagCache.current[cust.id] = data;
        setDiagnosticResult(data);
        setOperatorReplyInput(data.suggestedWhatsAppReply || '');
      }
    } catch (err) {
      console.error('Error fetching diagnosis:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Run Real-time Technical Test (API do Uesley / Zabbix)
  const handleTriggerNetworkProbe = () => {
    setIsRunningTechnicalTest(true);
    setTimeout(() => {
      setIsRunningTechnicalTest(false);
      // simulate refresh of telemetry
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === selectedCustomer.id) {
            return {
              ...c,
              technical: {
                ...c.technical,
                opticalSignalDbm: Number((c.technical.opticalSignalDbm + (Math.random() * 0.4 - 0.2)).toFixed(1)),
                latencyMs: Math.max(8, Math.round(c.technical.latencyMs + (Math.random() * 4 - 2))),
                lastRebootHoursAgo: c.technical.lastRebootHoursAgo,
              },
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  const handleSendOperatorMessage = () => {
    if (!operatorReplyInput.trim() || !selectedCustomer) return;

    const newMsg = {
      sender: 'agent' as const,
      text: operatorReplyInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === selectedCustomer.id) {
          return {
            ...c,
            recentMessages: [...c.recentMessages, newMsg],
          };
        }
        return c;
      })
    );

    setOperatorReplyInput('');
  };

  const handleSendCustomerSimulatedMessage = () => {
    if (!customerMessageInput.trim() || !selectedCustomer) return;

    const newMsg = {
      sender: 'customer' as const,
      text: customerMessageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === selectedCustomer.id) {
          return {
            ...c,
            recentMessages: [...c.recentMessages, newMsg],
          };
        }
        return c;
      })
    );

    const sentText = customerMessageInput;
    setCustomerMessageInput('');
    handleRunAiDiagnosis(selectedCustomer, sentText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  if (!selectedCustomer) return null;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner explaining Customer OS */}
      <div className={`rounded-2xl p-5 border transition-all shadow-sm ${
        isDark ? 'bg-slate-900/90 border-slate-800/80 shadow-black/40' : 'bg-white border-slate-200/90 shadow-slate-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Atendimento Inteligente & Diagnóstico 360 ISP
                </h1>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                }`}>
                  Customer OS
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Conecta <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>CRM</strong> + <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>ERP Financeiro</strong> + <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Telemetria Zabbix/API</strong> sob uma camada de IA preditiva para o operador.
              </p>
            </div>
          </div>

          {/* 4 Agent Switcher */}
          <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border shrink-0 ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveAgent('suporte')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeAgent === 'suporte' 
                  ? 'bg-cyan-500 text-slate-950 shadow-xs' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Suporte & Rede
            </button>
            <button
              onClick={() => setActiveAgent('comercial')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeAgent === 'comercial' 
                  ? 'bg-emerald-500 text-slate-950 shadow-xs' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Upgrade Comercial
            </button>
            <button
              onClick={() => setActiveAgent('retencao')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeAgent === 'retencao' 
                  ? 'bg-rose-500 text-white shadow-xs' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Retenção Churn
            </button>
            <button
              onClick={() => setActiveAgent('cobranca')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeAgent === 'cobranca' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Cobrança
            </button>
          </div>
        </div>

        {/* Customer Quick Selector Bar */}
        <div className={`flex items-center gap-2 mt-4 pt-3 border-t overflow-x-auto ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <span className={`text-[11px] font-bold shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Clientes em Atendimento:
          </span>
          {customers.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCustomerId(c.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 border transition-all ${
                selectedCustomerId === c.id
                  ? isDark 
                    ? 'bg-slate-800 text-white border-emerald-500 ring-1 ring-emerald-500 shadow-xs' 
                    : 'bg-emerald-50 text-emerald-950 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                  : isDark 
                    ? 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                c.technical.routerStatus === 'Online' ? 'bg-emerald-400' : (c.technical.routerStatus === 'Instável' ? 'bg-amber-400 animate-pulse' : 'bg-red-500')
              }`} />
              <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{c.name}</span>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>({c.plan})</span>
              {c.erp.paymentStatus === 'Atrasado' && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                }`}>
                  Fatura Pendente
                </span>
              )}
            </button>
          ))}

          {/* Export to CSV Button */}
          <button
            onClick={() => exportCustomersToCSV(customers, `clientes_provedor_${new Date().toISOString().split('T')[0]}.csv`)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all shadow-xs ml-auto ${
              isDark 
                ? 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border-cyan-500/30' 
                : 'bg-white hover:bg-cyan-50 text-cyan-700 border-cyan-200'
            }`}
            title="Exportar base de clientes completa para CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar Clientes CSV</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Diagnostic & Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Customer 360 Profile (CRM + ERP + Network Hardware) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: CRM & Cadastro */}
          <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <User className="w-4 h-4 text-emerald-500" />
                <span>1. Dados de Relacionamento (CRM)</span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {selectedCustomer.erp.contractStatus}
              </span>
            </div>

            <div>
              <div className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedCustomer.name}
              </div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedCustomer.address}
              </div>
              <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedCustomer.neighborhood}, {selectedCustomer.city}
              </div>
              <div className="text-xs text-emerald-500 font-mono mt-1 flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> {selectedCustomer.phone}
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-2 pt-2 border-t text-center text-xs ${
              isDark ? 'border-slate-800/60' : 'border-slate-200'
            }`}>
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Antiguidade</div>
                <div className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{selectedCustomer.seniorityYears} anos</div>
              </div>
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Reclamações</div>
                <div className={`font-bold ${selectedCustomer.complaintsCount > 1 ? 'text-amber-500' : isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {selectedCustomer.complaintsCount} reg.
                </div>
              </div>
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>NPS</div>
                <div className="font-bold text-cyan-500">{selectedCustomer.npsScore}/10</div>
              </div>
            </div>
          </div>

          {/* Card 2: ERP & Situação Financeira */}
          <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span>2. Situação Financeira (ERP)</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                selectedCustomer.erp.paymentStatus === 'Em Dia'
                  ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {selectedCustomer.erp.paymentStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className={`flex justify-between items-center p-2 rounded-lg border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Plano Contratado:</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedCustomer.plan}</span>
              </div>

              <div className={`flex justify-between items-center p-2 rounded-lg border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Mensalidade:</span>
                <span className="font-bold text-emerald-500">
                  {selectedCustomer.currency} {selectedCustomer.monthlyFee.toLocaleString()}
                </span>
              </div>

              {selectedCustomer.erp.paymentStatus === 'Atrasado' && (
                <div className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                  isDark ? 'bg-red-950/40 border-red-900/50 text-red-300' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Atraso de {selectedCustomer.erp.overdueDays} dias</div>
                    <div className={`text-[11px] ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      Valor em aberto: {selectedCustomer.currency} {selectedCustomer.erp.overdueAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              <div className={`flex justify-between text-[11px] px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>Último pagamento: {selectedCustomer.erp.lastInvoiceDate}</span>
                <span>Próx. venc: {selectedCustomer.erp.nextDueDate}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Telemetria Técnica / Zabbix / API */}
          <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Radio className="w-4 h-4 text-cyan-500" />
                <span>3. Telemetria Técnica (Zabbix / API)</span>
              </div>
              <button
                onClick={handleTriggerNetworkProbe}
                disabled={isRunningTechnicalTest}
                className={`text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 transition-all ${
                  isDark 
                    ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border-cyan-800/50' 
                    : 'text-cyan-700 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border-cyan-200'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${isRunningTechnicalTest ? 'animate-spin' : ''}`} />
                Testar Agora
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sinal Óptico (RX)</div>
                <div className={`font-mono font-bold mt-0.5 ${
                  selectedCustomer.technical.opticalSignalDbm < -25 ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {selectedCustomer.technical.opticalSignalDbm} dBm
                </div>
                <div className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ideal: -15 a -24 dBm</div>
              </div>

              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Perda de Pacotes</div>
                <div className={`font-mono font-bold mt-0.5 ${
                  selectedCustomer.technical.packetLossPct > 2 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {selectedCustomer.technical.packetLossPct}%
                </div>
                <div className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ping: {selectedCustomer.technical.latencyMs} ms</div>
              </div>

              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status do Roteador</div>
                <div className={`font-bold mt-0.5 ${
                  selectedCustomer.technical.routerStatus === 'Online' ? 'text-emerald-500' : 'text-amber-500'
                }`}>
                  {selectedCustomer.technical.routerStatus}
                </div>
                <div className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ligado há {selectedCustomer.technical.lastRebootHoursAgo}h</div>
              </div>

              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quedas (15 dias)</div>
                <div className={`font-bold mt-0.5 ${
                  selectedCustomer.technical.dropsLast15Days > 1 ? 'text-rose-500' : isDark ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {selectedCustomer.technical.dropsLast15Days} eventos
                </div>
                <div className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{selectedCustomer.technical.lastDropDate || 'Nenhuma'}</div>
              </div>
            </div>

            <div className={`text-[11px] p-2 rounded-lg border font-mono ${
              isDark ? 'bg-slate-950/60 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              <span className="opacity-70">Porta:</span> {selectedCustomer.technical.ctoPort} | <span className="opacity-70">OLT:</span> {selectedCustomer.technical.oltName}
            </div>
          </div>

        </div>

        {/* Center & Right Column: AI Diagnostic Copilot & WhatsApp Live Simulator */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* AI Copilot Preliminary Diagnostic Card */}
          <div className={`rounded-2xl p-5 border transition-all shadow-sm relative overflow-hidden ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`p-2 rounded-xl border ${
                  isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Diagnóstico Preliminar Gerado pela IA
                  </h2>
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Análise em tempo real cruzando CRM, ERP e Telemetria de Conexão
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {diagnosticResult?.churnRisk && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    diagnosticResult.churnRisk.level === 'ALTO'
                      ? isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
                      : (diagnosticResult.churnRisk.level === 'MÉDIO' 
                          ? isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
                          : isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                  }`}>
                    Risco Churn: {diagnosticResult.churnRisk.level} ({diagnosticResult.churnRisk.score}%)
                  </span>
                )}
              </div>
            </div>

            {isDiagnosing ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Cruzando dados do cliente com telemetria de rede...
                </span>
              </div>
            ) : diagnosticResult ? (
              <div className="mt-4 space-y-4">
                
                {/* Preliminary Diagnostic Statement */}
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-slate-950/80 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <strong className="text-emerald-500 font-bold block mb-1">
                    🔍 Parecer Técnico & Operacional:
                  </strong>
                  {diagnosticResult.preliminaryDiagnosis}
                </div>

                {/* Grid: Action Recommendation + Upgrade Opportunity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Action */}
                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="font-bold text-cyan-500 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Ação Recomendada ao Operador:
                    </div>
                    <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {diagnosticResult.recommendedAction}
                    </p>
                  </div>

                  {/* Upgrade / Commercial */}
                  <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                    isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="font-bold text-emerald-500 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Oportunidade Comercial ({diagnosticResult.upgradeOpportunity.potential}):
                    </div>
                    <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <strong className={isDark ? 'text-white' : 'text-slate-900'}>{diagnosticResult.upgradeOpportunity.suggestedPlan}:</strong> {diagnosticResult.upgradeOpportunity.reason}
                    </p>
                  </div>

                </div>

                {/* Suggested One-Click WhatsApp Response */}
                <div className={`border rounded-xl p-3.5 space-y-2 ${
                  isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-emerald-300' : 'text-emerald-800'
                    }`}>
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      Resposta Sugerida Pronta (Sem perguntas clichês de reinício):
                    </span>
                    <button
                      onClick={() => copyToClipboard(diagnosticResult.suggestedWhatsAppReply)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                        isDark 
                          ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-900/40 hover:bg-emerald-900/60 border-emerald-700/50' 
                          : 'text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-100 border-emerald-300'
                      }`}
                    >
                      {copiedResponse ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedResponse ? 'Copiado!' : 'Copiar Texto'}
                    </button>
                  </div>

                  <div className={`text-xs p-3 rounded-lg border italic leading-relaxed ${
                    isDark ? 'text-slate-200 bg-slate-950/80 border-slate-800' : 'text-slate-800 bg-white border-slate-200'
                  }`}>
                    "{diagnosticResult.suggestedWhatsAppReply}"
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        setOperatorReplyInput(diagnosticResult.suggestedWhatsAppReply);
                      }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        isDark 
                          ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700' 
                          : 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      Editar no Chat Abaixo
                    </button>
                    <button
                      onClick={() => {
                        setOperatorReplyInput(diagnosticResult.suggestedWhatsAppReply);
                        setTimeout(() => handleSendOperatorMessage(), 50);
                      }}
                      className="text-xs font-bold text-white px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Aprovar & Enviar ao Cliente
                    </button>
                  </div>
                </div>

              </div>
            ) : null}

          </div>

          {/* Interactive WhatsApp Live Chat Simulation */}
          <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Simulador de Conversa do WhatsApp ({selectedCustomer.name})
                </span>
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                API WhatsApp Business Oficial
              </span>
            </div>

            {/* Chat Messages Feed */}
            <div className={`h-56 overflow-y-auto space-y-3 p-3 rounded-xl border ${
              isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              {selectedCustomer.recentMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                      msg.sender === 'customer'
                        ? isDark 
                          ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' 
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs'
                        : 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-xs'
                    }`}
                  >
                    <div className="text-[10px] opacity-80 font-semibold">
                      {msg.sender === 'customer' ? `👤 ${selectedCustomer.name}` : '🤖 Atendente / ISP Copilot'}
                    </div>
                    <div>{msg.text}</div>
                    <div className="text-[9px] opacity-70 text-right">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulator Inputs: 1 for simulating customer msg, 1 for operator response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              
              {/* Customer Simulation Input */}
              <div className={`space-y-1.5 p-2.5 rounded-xl border ${
                isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <label className={`text-[10px] font-bold uppercase flex items-center gap-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <User className="w-3 h-3" />
                  Simular Mensagem do Cliente:
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Ex: Minha internet caiu de novo..."
                    value={customerMessageInput}
                    onChange={(e) => setCustomerMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCustomerSimulatedMessage()}
                    className={`flex-1 border rounded-lg px-2.5 py-1.5 text-xs transition-colors focus:outline-none ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-slate-600' 
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
                    }`}
                  />
                  <button
                    onClick={handleSendCustomerSimulatedMessage}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 border transition-all ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                    }`}
                  >
                    Simular
                  </button>
                </div>
              </div>

              {/* Operator Response Input */}
              <div className={`space-y-1.5 p-2.5 rounded-xl border ${
                isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <label className="text-[10px] font-bold uppercase text-emerald-500 flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  Resposta do Atendente / Copiloto:
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Digite ou aprove a sugestão da IA..."
                    value={operatorReplyInput}
                    onChange={(e) => setOperatorReplyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOperatorMessage()}
                    className={`flex-1 border rounded-lg px-2.5 py-1.5 text-xs transition-colors focus:outline-none focus:border-emerald-500 ${
                      isDark 
                        ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' 
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    onClick={handleSendOperatorMessage}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs transition-all"
                  >
                    <Send className="w-3 h-3" /> Enviar
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
