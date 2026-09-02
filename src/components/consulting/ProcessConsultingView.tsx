import React, { useState } from 'react';
import { 
  ConsultingAnalysis, 
  ProcessStep, 
  ProcessBottleneck, 
  SalesPlaybook 
} from '../../types';
import { SAMPLE_MEETING_TRANSCRIPT } from '../../data/mockData';
import { 
  GitBranch, 
  Sparkles, 
  FileText, 
  AlertTriangle, 
  BookOpen, 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Users, 
  MessageSquare, 
  ChevronRight, 
  Check, 
  Copy, 
  Share2,
  HelpCircle,
  Zap,
  Target
} from 'lucide-react';

interface ProcessConsultingViewProps {
  activeIspName: string;
  theme?: 'dark' | 'light';
}

export const ProcessConsultingView: React.FC<ProcessConsultingViewProps> = ({
  activeIspName,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [transcriptText, setTranscriptText] = useState(SAMPLE_MEETING_TRANSCRIPT);
  const [focusArea, setFocusArea] = useState('Processo Comercial, SLA e Qualificação de Fibra');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ConsultingAnalysis | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'process' | 'bottlenecks' | 'playbook' | 'document'>('process');
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);

  // Trigger Gemini AI Process Analysis
  const handleAnalyzeMeeting = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/analyze-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptText,
          ispName: activeIspName,
          focusArea,
        }),
      });

      if (response.ok) {
        const data: ConsultingAnalysis = await response.json();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error('Error analyzing transcript:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Run initial analysis if not yet run
  React.useEffect(() => {
    if (!analysisResult) {
      handleAnalyzeMeeting();
    }
  }, []);

  const handleCopyScript = (script: string, index: number) => {
    navigator.clipboard.writeText(script);
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  const handlePrint = () => {
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
              <GitBranch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Consultoria de Processos & Gerador de Playbooks ISP
                </h1>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  Engine de IA
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Grave a reunião de alinhamento com o provedor, transcreva o áudio e a IA estrutura automaticamente os <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>SOPs</strong>, identifica <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>gargalos</strong> e cria o <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Playbook Operacional de Vendas</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" /> Exportar / Imprimir SOP
          </button>
        </div>
      </div>

      {/* Input Transcription Section */}
      <div className={`rounded-2xl p-4 border space-y-3 shadow-sm ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <label className={`text-xs font-bold flex items-center gap-1.5 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <FileText className="w-4 h-4 text-emerald-500" />
            Transcrição da Reunião de Diagnóstico com o ISP ({activeIspName})
          </label>
          <button
            onClick={() => setTranscriptText(SAMPLE_MEETING_TRANSCRIPT)}
            className="text-[11px] text-emerald-500 hover:underline font-semibold"
          >
            Restaurar Exemplo Real
          </button>
        </div>

        <textarea
          rows={4}
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          placeholder="Cole aqui a transcrição da reunião de alinhamento com o dono ou gerente do ISP..."
          className={`w-full border rounded-xl p-3 text-xs leading-relaxed transition-colors focus:outline-none focus:border-emerald-500 ${
            isDark 
              ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500' 
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
          }`}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className={`flex items-center gap-2 text-xs w-full sm:w-auto ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span className="font-semibold">Foco:</span>
            <input
              type="text"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className={`border rounded-lg px-2.5 py-1 text-xs focus:outline-none w-full sm:w-80 transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>

          <button
            onClick={handleAnalyzeMeeting}
            disabled={isProcessing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Estruturando Processo com Gemini...' : 'Processar Reunião com IA'}
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-4">
          
          {/* Sub-tab Navigation */}
          <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border overflow-x-auto ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setActiveSubTab('process')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSubTab === 'process'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              1. Fluxo Comercial & SLAs ({analysisResult.processFlow?.length || 6} etapas)
            </button>

            <button
              onClick={() => setActiveSubTab('bottlenecks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSubTab === 'bottlenecks'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              2. Gargalos ({analysisResult.bottlenecks?.length || 4})
            </button>

            <button
              onClick={() => setActiveSubTab('playbook')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSubTab === 'playbook'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              3. Playbook de Vendas
            </button>

            <button
              onClick={() => setActiveSubTab('document')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeSubTab === 'document'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              4. Manual Executivo Unificado
            </button>
          </div>

          {/* TAB 1: Process Flow */}
          {activeSubTab === 'process' && (
            <div className={`rounded-2xl p-5 border transition-all shadow-sm space-y-4 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Esteira Comercial Padronizada — {analysisResult.ispName}
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {analysisResult.consultingSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult.processFlow?.map((step) => (
                  <div
                    key={step.step}
                    className={`rounded-xl p-4 space-y-2.5 transition-all border shadow-xs ${
                      isDark 
                        ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-7 h-7 rounded-lg font-extrabold text-xs flex items-center justify-center border ${
                        isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {step.step}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isDark ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40' : 'text-cyan-800 bg-cyan-50 border-cyan-200'
                      }`}>
                        <Clock className="w-3 h-3" /> SLA: {step.sla}
                      </span>
                    </div>

                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {step.name}
                    </div>

                    <div className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {step.description}
                    </div>

                    <div className={`pt-2 border-t flex flex-col gap-1 text-[11px] ${
                      isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}>
                      <div><strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>Responsável:</strong> {step.responsible}</div>
                      <div className="flex items-center gap-1">
                        <strong className={isDark ? 'text-slate-300' : 'text-slate-700'}>Canais:</strong>
                        <div className="flex gap-1 flex-wrap">
                          {step.channels.map((ch, i) => (
                            <span key={i} className={`px-1.5 py-0.5 rounded text-[10px] ${
                              isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Bottlenecks */}
          {activeSubTab === 'bottlenecks' && (
            <div className={`rounded-2xl p-5 border transition-all shadow-sm space-y-4 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Gargalos Críticos Diagnosticados no ISP
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Pontos de fricção que provocam perda de leads, lentidão de resposta e queda na conversão de vendas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.bottlenecks?.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-4 space-y-2.5 shadow-xs border ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        item.severity === 'ALTA'
                          ? isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
                          : isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        Gravidade: {item.severity}
                      </span>
                    </div>

                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.title}
                    </div>

                    <div className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {item.description}
                    </div>

                    <div className={`p-2 rounded-lg text-xs border ${
                      isDark ? 'bg-rose-950/20 border-rose-900/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <strong>Impacto no Negócio:</strong> {item.impact}
                    </div>

                    <div className={`p-2.5 rounded-lg text-xs border flex items-start gap-2 ${
                      isDark ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    }`}>
                      <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong>Recomendação da Consultoria:</strong> {item.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Sales Playbook */}
          {activeSubTab === 'playbook' && analysisResult.playbook && (
            <div className={`rounded-2xl p-5 border transition-all shadow-sm space-y-6 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h2 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                  {analysisResult.playbook.title}
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Scripts e perguntas obrigatórias de qualificação para os vendedores e atendentes de WhatsApp.
                </p>
              </div>

              {/* Qualification Questions */}
              <div className="space-y-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-cyan-400' : 'text-cyan-700'
                }`}>
                  <HelpCircle className="w-4 h-4" /> Perguntas Obrigatórias de Qualificação:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {analysisResult.playbook.qualificationQuestions?.map((q, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border ${
                        isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-100 text-cyan-800 border-cyan-200'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up Cadence */}
              <div className="space-y-3 pt-2">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}>
                  <MessageSquare className="w-4 h-4" /> Régua de Follow-Up Estruturado (D+1, D+3, D+7):
                </h3>
                <div className="space-y-3">
                  {analysisResult.playbook.followUpCadence?.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border space-y-2 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-800 bg-emerald-100 border-emerald-200'
                        }`}>
                          {item.day} — {item.trigger}
                        </span>
                        <button
                          onClick={() => handleCopyScript(item.script, idx)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all border ${
                            isDark 
                              ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700' 
                              : 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {copiedScriptIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copiedScriptIndex === idx ? 'Copiado!' : 'Copiar Script'}
                        </button>
                      </div>
                      <div className={`text-xs p-3 rounded-lg border italic leading-relaxed ${
                        isDark ? 'text-slate-300 bg-slate-900/90 border-slate-800' : 'text-slate-800 bg-white border-slate-200'
                      }`}>
                        "{item.script}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objection Handlers */}
              <div className="space-y-3 pt-2">
                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-purple-400' : 'text-purple-700'
                }`}>
                  <Target className="w-4 h-4" /> Quebra de Objeções Clássicas de Provedor:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisResult.playbook.objectionHandlers?.map((obj, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                        Objeção: "{obj.objection}"
                      </div>
                      <div className={`p-2.5 rounded-lg border leading-relaxed ${
                        isDark ? 'text-slate-300 bg-slate-900 border-slate-800/80' : 'text-slate-800 bg-white border-slate-200'
                      }`}>
                        <strong className="text-emerald-500 block mb-1">Como Responder:</strong>
                        {obj.response}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: Unified Document */}
          {activeSubTab === 'document' && (
            <div className={`rounded-2xl p-8 border shadow-xl space-y-6 max-w-4xl mx-auto print:bg-white print:text-black print:p-0 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              
              <div className={`border-b pb-4 text-center ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
                  Manual de Processos & Consultoria Comercial
                </div>
                <h1 className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Manual Operacional do ISP: {analysisResult.ispName}
                </h1>
                <div className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Documento emitido pela consultoria de gestão de processos para provedores de internet.
                </div>
              </div>

              <div className={`space-y-4 text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <div>
                  <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Sumário Executivo do Diagnóstico</h3>
                  <p>{analysisResult.consultingSummary}</p>
                </div>

                <div>
                  <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Esteira do Processo Comercial e SLAs</h3>
                  <div className="space-y-2">
                    {analysisResult.processFlow?.map((st) => (
                      <div key={st.step} className={`p-2.5 rounded-lg border ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Etapa {st.step}: {st.name} (SLA: {st.sla})</div>
                        <div className={`mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{st.description}</div>
                        <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Responsável: {st.responsible} | Canais: {st.channels.join(', ')}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>3. Plano de Ação para Resolução de Gargalos</h3>
                  <div className="space-y-2">
                    {analysisResult.bottlenecks?.map((b) => (
                      <div key={b.id} className={`p-2.5 rounded-lg border ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className={`font-bold text-amber-500`}>{b.title} ({b.severity})</div>
                        <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>{b.description}</div>
                        <div className="text-emerald-500 font-semibold mt-1">Ação: {b.recommendation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
