import React, { useState } from 'react';
import { 
  Network, 
  Database, 
  MessageSquare, 
  Radio, 
  Cpu, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Send, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Code
} from 'lucide-react';

interface IntegrationsHubViewProps {
  theme?: 'dark' | 'light';
}

export const IntegrationsHubView: React.FC<IntegrationsHubViewProps> = ({
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [testLog, setTestLog] = useState<string[]>([
    '[09:40:12] Sistema iniciado. Módulo de IA Gemini 3.7 Flash ativo.',
    '[09:41:05] Webhook WhatsApp Meta conectado com sucesso.',
    '[09:42:00] Zabbix SNMP Poller: 12 OLTs e 1.480 ONTs sincronizadas.',
    '[09:42:15] API de Diagnóstico do Uesley: Endpoint autorizado respondendo em 42ms.',
  ]);

  const [testingService, setTestingService] = useState<string | null>(null);

  const handleTestIntegration = (serviceName: string) => {
    setTestingService(serviceName);
    setTimeout(() => {
      setTestingService(null);
      const time = new Date().toLocaleTimeString();
      setTestLog((prev) => [
        `[${time}] Teste manual de integração com [${serviceName}] concluído: Status 200 OK (Latência 38ms).`,
        ...prev,
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className={`rounded-2xl p-5 border transition-all shadow-sm ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border ${
            isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}>
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Hub de Integrações & Arquitetura de Conexões ISP
              </h1>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
              }`}>
                Camada de Dados
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Não substitui o ERP legado do provedor: conecta o <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>ERP/Billing</strong>, <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>WhatsApp/Meta</strong>, <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Zabbix/SNMP</strong> e a <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>API de Diagnóstico de Rede</strong> sob o Copiloto de IA.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Architecture Diagram */}
      <div className={`rounded-2xl p-6 border transition-all shadow-sm ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="text-center max-w-lg mx-auto mb-6">
          <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            Fluxo de Inteligência Unificada
          </span>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Como o ISP Pulse conecta os dados espalhados do provedor
          </h2>
        </div>

        {/* 4 Data Sources Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          
          <div className={`p-4 rounded-xl border space-y-2 text-center transition-all ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto border ${
              isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>1. ERP / Billing</div>
            <div className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Status financeiro, inadimplência, plano contratado e faturas.
            </div>
            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded border ${
              isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-100 border-emerald-200'
            }`}>
              Conectado (REST API)
            </span>
          </div>

          <div className={`p-4 rounded-xl border space-y-2 text-center transition-all ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto border ${
              isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-100 text-cyan-700 border-cyan-200'
            }`}>
              <Radio className="w-5 h-5" />
            </div>
            <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Zabbix & Telemetria</div>
            <div className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Potência óptica (dBm), latência, perda de pacotes e alarmes de OLT.
            </div>
            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded border ${
              isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-100 border-emerald-200'
            }`}>
              Conectado (SNMP / API)
            </span>
          </div>

          <div className={`p-4 rounded-xl border space-y-2 text-center transition-all ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto border ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>3. WhatsApp & Meta</div>
            <div className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Captação de leads de anúncios, chat direto e histórico de mensagens.
            </div>
            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded border ${
              isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-100 border-emerald-200'
            }`}>
              Conectado (Cloud API)
            </span>
          </div>

          <div className={`p-4 rounded-xl border space-y-2 text-center transition-all ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto border ${
              isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-100 text-purple-700 border-purple-200'
            }`}>
              <Cpu className="w-5 h-5" />
            </div>
            <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>4. API de Diagnóstico</div>
            <div className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Motor de análise de conexão automática e teste preventivo.
            </div>
            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded border ${
              isDark ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-700 bg-purple-100 border-purple-200'
            }`}>
              API Uesley & Guilherme
            </span>
          </div>

        </div>

        {/* Central Intelligence Layer */}
        <div className="my-4 flex items-center justify-center">
          <div className={`w-0.5 h-8 ${isDark ? 'bg-emerald-500/50' : 'bg-emerald-500'}`} />
        </div>

        <div className={`max-w-2xl mx-auto border rounded-2xl p-5 text-center shadow-sm ${
          isDark 
            ? 'bg-slate-950 border-emerald-500/40 text-slate-300' 
            : 'bg-emerald-50/50 border-emerald-200 text-slate-700'
        }`}>
          <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold text-sm mb-1">
            <Bot className="w-5 h-5" />
            <span>Camada de Inteligência Operacional & IA (Gemini 3.7 Flash)</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Cruza o contexto financeiro + reclamações + sinal óptico antes de iniciar o atendimento, evitando perguntas desnecessárias do atendente e detectando risco de cancelamento antes de acontecer.
          </p>
        </div>
      </div>

      {/* Integration Services Grid & Live Test Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Connectors with Test Buttons */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Conectores Ativos & Testes de Latência:
          </h3>

          <div className="space-y-2.5">
            {[
              {
                name: 'Sistema ERP / Billing (MK-Auth, IXC, SGP, Voalle)',
                desc: 'Sincronização bidirecional de clientes, faturas e desbloqueio em confiança.',
                type: 'ERP',
              },
              {
                name: 'Zabbix / Prometheus / SNMP Telemetry',
                desc: 'Monitoramento de dBm de porta PON, tráfego de interface e status de ONT.',
                type: 'Rede',
              },
              {
                name: 'Meta Ads & WhatsApp Cloud API',
                desc: 'Entrada automática de leads no funil e envio de mensagens pelo operador.',
                type: 'Mensageria',
              },
              {
                name: 'API do Software de Diagnóstico de Conexão',
                desc: 'Provocação de testes internos sem abuso e retorno de estabilidade.',
                type: 'Diagnóstico',
              },
            ].map((conn, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-3.5 flex items-center justify-between gap-3 border shadow-xs transition-all ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{conn.name}</div>
                  <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{conn.desc}</div>
                </div>
                <button
                  onClick={() => handleTestIntegration(conn.name)}
                  disabled={testingService === conn.name}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 transition-all border ${
                    isDark 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${testingService === conn.name ? 'animate-spin text-amber-500' : 'text-emerald-500'}`} />
                  Testar API
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Log Console */}
        <div className={`lg:col-span-6 rounded-2xl p-4 border shadow-sm space-y-3 font-mono ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Log de Eventos & Telemetria em Tempo Real</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="h-64 overflow-y-auto space-y-1.5 text-[11px] text-slate-400 pr-1">
            {testLog.map((log, i) => (
              <div key={i} className="text-slate-300 leading-normal">
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
