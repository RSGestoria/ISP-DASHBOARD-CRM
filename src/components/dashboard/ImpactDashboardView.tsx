import React, { useState } from 'react';
import { 
  BeforeAfterMetrics, 
  ExecutiveReport 
} from '../../types';
import { 
  CONSULTING_BENCHMARK, 
  SUPPORT_REASONS_BREAKDOWN 
} from '../../data/mockData';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Zap, 
  DollarSign, 
  Users, 
  Sparkles, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Activity, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { RecentActivityPanel } from './RecentActivityPanel';

interface ImpactDashboardViewProps {
  activeIspName: string;
  theme?: 'dark' | 'light';
}

export const ImpactDashboardView: React.FC<ImpactDashboardViewProps> = ({
  activeIspName,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [metrics, setMetrics] = useState<BeforeAfterMetrics>(CONSULTING_BENCHMARK);
  const [executiveReport, setExecutiveReport] = useState<ExecutiveReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [period, setPeriod] = useState('Agosto 2026');

  // Trigger AI Executive Report Generation
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ispName: activeIspName,
          period,
          metricsBefore: {
            leads: metrics.leadsBefore,
            responseTime: `${metrics.responseTimeBeforeMin} min`,
            conversion: `${metrics.conversionBeforePct}%`,
            sales: metrics.salesBefore,
            revenue: metrics.revenueBefore,
          },
          metricsAfter: {
            leads: metrics.leadsAfter,
            responseTime: `${metrics.responseTimeAfterMin} min`,
            conversion: `${metrics.conversionAfterPct}%`,
            sales: metrics.salesAfter,
            revenue: metrics.revenueAfter,
          },
        }),
      });

      if (response.ok) {
        const data: ExecutiveReport = await response.json();
        setExecutiveReport(data);
      }
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className={`rounded-2xl p-5 border transition-all shadow-sm ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Dashboard de Resultados da Consultoria & Gestão
                </h1>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  Prova Visual de ROI
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Demonstração visual do impacto antes vs depois da padronização de processos e implantação do funil comercial para o sócio do provedor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              {isGeneratingReport ? 'Gerando Relatório...' : 'Gerar Relatório Executivo IA'}
            </button>
            <button
              onClick={handlePrintReport}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <Printer className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Before vs After Big Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Response Time */}
        <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-500" /> Tempo Médio de Resposta
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <ArrowDownRight className="w-3 h-3" /> -81.6%
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Antes da Consultoria</div>
              <div className={`text-sm font-bold line-through ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{metrics.responseTimeBeforeMin} min</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-500 font-bold">Com o Novo Processo</div>
              <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{metrics.responseTimeAfterMin} min ⚡</div>
            </div>
          </div>
        </div>

        {/* Card 2: Conversion Rate */}
        <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Conversão Comercial
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <ArrowUpRight className="w-3 h-3" /> +47.4%
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Antes da Consultoria</div>
              <div className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{metrics.conversionBeforePct}%</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-500 font-bold">Com o Novo Processo</div>
              <div className="text-2xl font-black text-emerald-500">{metrics.conversionAfterPct}%</div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Sales / Installations */}
        <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="font-semibold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-500" /> Vendas & Instalações
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <ArrowUpRight className="w-3 h-3" /> +81.2%
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Antes da Consultoria</div>
              <div className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{metrics.salesBefore} assinantes</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-500 font-bold">Com o Novo Processo</div>
              <div className={`text-2xl font-black ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{metrics.salesAfter} assinantes 🎉</div>
            </div>
          </div>
        </div>

        {/* Card 4: Monthly Revenue Growth */}
        <div className={`rounded-2xl p-4 border transition-all shadow-sm space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="font-semibold flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-500" /> Faturamento
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-0.5 ${
              isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <ArrowUpRight className="w-3 h-3" /> +81.2%
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Receita Antes</div>
              <div className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Gs. 7.2M</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-500 font-bold">Receita Atual</div>
              <div className={`text-2xl font-black ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>Gs. 13.05M</div>
            </div>
          </div>
        </div>

      </div>

      {/* Support Breakdown & Contact Reasons Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className={`lg:col-span-6 rounded-2xl p-5 border transition-all shadow-sm space-y-4 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Inteligência Operacional: Principais Motivos de Contato
              </h2>
            </div>
            <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>1.000 chamados analisados</span>
          </div>

          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Comprova ao gestor que 34% dos chamados são apenas alcance de Wi-Fi e não problema de fibra, abrindo venda de repetidores Mesh e suporte qualificado.
          </p>

          <div className="space-y-3 pt-2">
            {SUPPORT_REASONS_BREAKDOWN.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.name}</span>
                  <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.count} chamados ({item.pct}%)</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden border ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Report Card */}
        <div className={`lg:col-span-6 rounded-2xl p-5 border transition-all shadow-sm space-y-4 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Relatório Executivo Mensal da Consultoria
              </h2>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              {period}
            </span>
          </div>

          {executiveReport ? (
            <div className={`space-y-3.5 text-xs max-h-[380px] overflow-y-auto pr-1 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <div className={`p-3 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <strong className="text-emerald-500 block mb-1">Resumo Executivo para os Sócios:</strong>
                {executiveReport.executiveSummary}
              </div>

              <div>
                <strong className={`block mb-1.5 font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                  Principais Conquistas do Período:
                </strong>
                <ul className="space-y-1">
                  {executiveReport.highlights.map((h, i) => (
                    <li key={i} className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] ${
                      isDark ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className={`block mb-1.5 font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  Pontos de Atenção para o Próximo Mês:
                </strong>
                <ul className="space-y-1">
                  {executiveReport.identifiedWeaknesses.map((w, i) => (
                    <li key={i} className={`flex items-start gap-2 p-2 rounded-lg border text-[11px] ${
                      isDark ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={`py-12 flex flex-col items-center justify-center text-center space-y-3 rounded-xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Sparkles className="w-8 h-8 text-emerald-500 animate-pulse" />
              <div className={`max-w-xs text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Clique no botão acima para gerar um parecer estratégico completo com IA para apresentar ao dono do ISP.
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
              >
                Gerar Relatório de {period}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Recent Activity & CRM Operations Panel */}
      <RecentActivityPanel theme={theme} />

    </div>
  );
};
