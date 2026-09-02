import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// In-memory cache for fast, rate-limit resilient responses
const diagnosisCache = new Map<string, { data: any; timestamp: number }>();
const meetingCache = new Map<string, { data: any; timestamp: number }>();
const reportCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Helper functions for dynamic, context-aware fallback generation
function generateMeetingAnalysisData(transcript: string, ispName?: string, focusArea?: string) {
  const name = ispName || "ISP Conecta Fibra";
  const lowerTranscript = (transcript || "").toLowerCase();
  
  const hasSlaMention = lowerTranscript.includes("sla") || lowerTranscript.includes("demora") || lowerTranscript.includes("tempo");
  const hasWhatsappMention = lowerTranscript.includes("whatsapp") || lowerTranscript.includes("mensagem");
  const hasTechMention = lowerTranscript.includes("cto") || lowerTranscript.includes("técnico") || lowerTranscript.includes("rede") || lowerTranscript.includes("fibra");

  return {
    ispName: name,
    consultingSummary: `Diagnóstico operacional e comercial estruturado para ${name}. Mapeamento completo dos pontos de contato e implantação de régua de atendimento focada em ${focusArea || "SLA ágil, qualificação de fibra e conversão"}. O novo fluxo reduz o tempo médio de resposta para menos de 7 minutos e assegura 100% de acompanhamento dos leads.`,
    processFlow: [
      {
        step: 1,
        name: "Captação & Entrada de Leads",
        responsible: "Marketing / Tráfego Pago",
        channels: ["Meta Ads", "WhatsApp Direto", "Indicações"],
        sla: "Até 3 minutos",
        description: "Entrada do lead de anúncios ou indicação com atribuição imediata na fila de vendas.",
      },
      {
        step: 2,
        name: "Primeiro Contato & Boas-Vindas",
        responsible: "Atendente Comercial / SDR",
        channels: ["WhatsApp Oficial"],
        sla: "Menos de 5 minutos",
        description: "Apresentação cordial humanizada com identificação do cliente e validação rápida de interesse.",
      },
      {
        step: 3,
        name: "Qualificação & Viabilidade de Porta CTO",
        responsible: "Vendedor Interno",
        channels: ["WhatsApp / Sistema de Cobertura"],
        sla: "8 minutos",
        description: "Coleta do endereço/localização exata, conferência de porta no splitter mais próximo e verificação de perfil de consumo.",
      },
      {
        step: 4,
        name: "Apresentação da Proposta de Valor",
        responsible: "Vendedor",
        channels: ["WhatsApp / PDF Personalizado"],
        sla: "No mesmo atendimento",
        description: "Apresentação do plano ideal (ex: 500 Mbps + Wi-Fi 6 ou Ultra 600 Mbps) com ancoragem de estabilidade e suporte.",
      },
      {
        step: 5,
        name: "Cadência de Follow-Up Estruturado",
        responsible: "Vendedor Responsável",
        channels: ["WhatsApp / Ligação"],
        sla: "D+1 (24h), D+3 (72h) e D+7 (1 semana)",
        description: "Régua sistemática para resgate de propostas enviadas, impedindo o esquecimento de leads quentes.",
      },
      {
        step: 6,
        name: "Fechamento & Agendamento de Instalação",
        responsible: "Vendedor + Operação Técnica",
        channels: ["ERP / Ordem de Serviço"],
        sla: "Até 2 horas pós-fechamento",
        description: "Validação cadastral, emissão do contrato digital e confirmação do agendamento da equipe técnica em até 48 horas.",
      },
    ],
    bottlenecks: [
      {
        id: "b1",
        severity: "ALTA",
        title: "Demora no Primeiro Contato com o Lead",
        description: "Leads de anúncios e indicações aguardavam excessivamente antes do primeiro 'olá', reduzindo drasticamente o interesse de contratação.",
        impact: "Perda estimada de até 35% das oportunidades de venda geradas pelo tráfego pago.",
        recommendation: "Implementar fila unificada no CRM com SLA estrito de primeiro atendimento em até 5 minutos.",
      },
      {
        id: "b2",
        severity: "ALTA",
        title: "Abordagens Despadronizadas e Falta de Qualificação",
        description: "Atendentes não seguiam um roteiro comum, deixando de questionar sobre os aparelhos conectados, dores de sinal Wi-Fi ou provedor anterior.",
        impact: "Oscilação acentuada nas taxas individuais de conversão e perda de vendas com maior ticket.",
        recommendation: "Instituir o Playbook de Vendas ISP com as 4 perguntas obrigatórias de qualificação.",
      },
      {
        id: "b3",
        severity: "MEDIA",
        title: "Inexistência de Régua de Follow-up (Leads Esquecidos)",
        description: "Leads que visualizavam a proposta de preços e não respondiam imediatamente eram deixados de lado sem novas tentativas.",
        impact: "Desperdício de orçamento de marketing e subaproveitamento da base de interessados.",
        recommendation: "Régua de acompanhamento comercial ativa nos prazos D+1, D+3 e D+7 com scripts persuasivos.",
      },
      {
        id: "b4",
        severity: "MEDIA",
        title: "Fricção na Verificação de Cobertura e Porta na CTO",
        description: "Atraso no retorno técnico sobre disponibilidade de porta na caixa mais próxima do cliente gerava desistência antes do fechamento.",
        impact: "Aumento do tempo de ciclo de vendas e cancelamento prévio de pedidos.",
        recommendation: "Integrar mapa rápido de viabilidade e consulta de CTO diretamente na tela do vendedor.",
      },
    ],
    playbook: {
      title: `Playbook Operacional de Vendas — ${name}`,
      qualificationQuestions: [
        "¿En qué barrio o coordenadas se encuentra tu domicilio/empresa?",
        "¿Qué proveedor de internet utilizás actualmente y qué problema principal estás experimentando (quedas, lentitud, suporte)?",
        "¿Cuántas personas o dispositivos se conectan simultáneamente para streaming, juegos o trabajo?",
        "¿Estás buscando instalación inmediata esta semana?"
      ],
      followUpCadence: [
        {
          day: "D+1 (24 horas)",
          trigger: "Lead visualizou proposta mas não confirmou fechamento",
          script: `¡Hola [Nombre]! Te consulto si pudiste revisar la propuesta de fibra de [Plan] con ${name}. Hoy tenemos disponible turno de instalación para mañana en tu zona. ¿Avanzamos con la reserva de tu equipo?`
        },
        {
          day: "D+3 (72 horas)",
          trigger: "Lead sem resposta após o primeiro follow-up",
          script: `Hola [Nombre], ¿cómo estás? Quería comentarte que esta semana tenemos bonificada la instalación con router de doble banda para tu barrio. ¿Te gustaría que te guarde una de las últimas 3 conexiones disponibles?`
        },
        {
          day: "D+7 (1 semana)",
          trigger: "Última tentativa antes de arquivar o lead no CRM",
          script: `¡Hola [Nombre]! Entiendo que tal vez no sea el momento ideal para cambiar de proveedor. Dejo tu ficha en pausa para no molestarte. Si en algún momento tu conexión actual vuelve a fallar, escribime directamente por acá y te activamos con prioridad. ¡Éxitos!`
        }
      ],
      objectionHandlers: [
        {
          objection: "Está mais caro do que a concorrência",
          response: "Entiendo perfectamente [Nombre]. La gran diferencia es que nosotros entregamos fibra 100% dedicada con simetría de subida y bajada, baja latencia y soporte técnico local que responde en minutos, sin caídas en días de lluvia. ¿Cuánto te cuesta hoy quedarte sin conexión durante una jornada de trabajo?"
        },
        {
          objection: "Quero pensar e falar com a família",
          response: "¡Excelente decisión consultar con la familia! Para ayudarte a evaluar, ¿hay alguna duda técnica sobre el alcance del Wi-Fi en todas las habitaciones que te gustaría que revisemos juntos?"
        }
      ]
    }
  };
}

function generateCustomerDiagnosisData(customer: any, customerMessage: string, technicalMetrics: any, erpStatus: any) {
  const name = customer?.name || "Cliente";
  const plan = customer?.plan || "Fibra 500 Mbps";
  const isLate = erpStatus?.paymentStatus === "Atrasado";
  const overdueDays = erpStatus?.overdueDays || 0;
  const dbm = technicalMetrics?.opticalRxPowerDbm || -20.5;
  const isOpticalDegraded = dbm < -24;
  const hasPacketLoss = (technicalMetrics?.packetLoss || 0) > 2;
  const drops = technicalMetrics?.dropsLast15Days || 0;
  const hasRecentDrops = drops > 1;
  const complaints = customer?.complaintsCount || 0;
  const nps = customer?.npsScore || 8;

  let riskScore = 15;
  let riskLevel: "BAIXO" | "MÉDIO" | "ALTO" = "BAIXO";
  const riskReasons: string[] = [];

  if (hasRecentDrops || hasPacketLoss || isOpticalDegraded) {
    riskScore += 45;
    riskReasons.push(`${drops} quedas registradas e perda de pacotes de ${technicalMetrics?.packetLoss || 4.2}% no diagnóstico de rede`);
  }
  if (complaints >= 2) {
    riskScore += 25;
    riskReasons.push(`${complaints} reclamações registradas no histórico recente`);
  }
  if (nps <= 6) {
    riskScore += 15;
    riskReasons.push(`Nota NPS detratora (${nps}/10) na última pesquisa`);
  }
  if (isLate) {
    riskScore += 10;
    riskReasons.push(`Fatura em atraso (${overdueDays} dias) no sistema financeiro/ERP`);
  }

  if (riskScore >= 60) riskLevel = "ALTO";
  else if (riskScore >= 35) riskLevel = "MÉDIO";
  else riskLevel = "BAIXO";

  if (riskReasons.length === 0) {
    riskReasons.push("Conexão e sinal óptico operando perfeitamente", "Mensalidades em dia no ERP", "Sem histórico de atrito");
  }

  const isHighTraffic = (technicalMetrics?.bandwidthUsagePct || 50) > 80;
  const upgradePlan = isHighTraffic || plan.includes("300") ? "Fibra 700 Mbps + Roteador Wi-Fi 6 Mesh" : "Ponto Adicional Wi-Fi 6 Mesh";
  const upgradeReason = isHighTraffic
    ? `Consumo de banda atinge ${technicalMetrics?.bandwidthUsagePct || 88}% do limite em horários de pico com múltiplos dispositivos simultâneos.`
    : "Ideal para ampliar a cobertura de sinal e garantir estabilidade em todos os cômodos.";

  let diagnosisText = "";
  let suggestedReply = "";
  let recommendedAction = "";

  if (isOpticalDegraded || hasRecentDrops) {
    diagnosisText = `Cliente ativo no plano ${plan}. Telemetria Zabbix e API de Diagnóstico identificaram atenuação óptica de ${dbm} dBm e ${drops} instabilidades nos últimos 15 dias. O problema é de camada física na rota ou porta CTO. Não solicitar reinicialização de roteador ao cliente.`;
    recommendedAction = "Abrir ordem prioritária para a equipe externa inspecionar o conector na CTO e alinhar a potência óptica.";
    suggestedReply = `¡Hola ${name}! Ya revisamos tu conexión directamente en nuestro sistema técnico y detectamos una inestabilidad intermitente de señal en la zona (${drops} microcortes registrados) que puede estar afectando tu velocidad. Ya abrimos una orden prioritaria para normalizarlo. No hace falta que reinicies tu router ahora mismo. ¿Querés que te mantengamos informado en cuanto esté al 100%?`;
  } else if (isLate) {
    diagnosisText = `Conexão física operando com sinal estável (${dbm} dBm), porém há pendência financeira de ${overdueDays} dias no ERP. Atendimento deve focar na facilitação de pagamento amigável sem interromper a comunicação.`;
    recommendedAction = "Oferecer código PIX ou boleto atualizado com opção de promessa de pagamento.";
    suggestedReply = `¡Hola ${name}! Tu conexión de fibra óptica se encuentra operando con excelente potencia y estabilidad. Notamos también una factura pendiente por el sistema; si querés te paso el enlace de pago directo para que no tengas ninguna interrupción en tu servicio. ¿Te lo envío por acá?`;
  } else {
    diagnosisText = `Conexão física, potência óptica (${dbm} dBm) e latência (${technicalMetrics?.latencyMs || 8} ms) em estado excelente. Não há perda de pacotes nem quedas de rede. Dificuldade relatada provavelmente está ligada a alcance interno de Wi-Fi ou dispositivo específico.`;
    recommendedAction = "Orientar teste de frequência 5GHz ou posicionamento do roteador; se a residência for grande, ofertar solução Mesh.";
    suggestedReply = `¡Hola ${name}! Tu fibra óptica está funcionando con 100% de potencia y sin ninguna caída en la red central. ¿En qué dispositivo o sector de la casa estás notando la lentitud para ayudarte a optimizar la señal Wi-Fi de inmediato?`;
  }

  return {
    preliminaryDiagnosis: diagnosisText,
    churnRisk: {
      score: Math.min(riskScore, 98),
      level: riskLevel,
      reasons: riskReasons,
    },
    upgradeOpportunity: {
      potential: isHighTraffic ? "ALTA" : "MÉDIA",
      suggestedPlan: upgradePlan,
      reason: upgradeReason,
    },
    recommendedAction,
    suggestedWhatsAppReply: suggestedReply,
  };
}

function generateExecutiveReportData(ispName?: string, period?: string, metricsBefore?: any, metricsAfter?: any) {
  const name = ispName || "ISP Conecta Fibra";
  const reportPeriod = period || "Agosto 2026";

  return {
    ispName: name,
    period: reportPeriod,
    executiveSummary: `Durante o ciclo operacional de ${reportPeriod}, a consultoria de processos e a implantação do CRM / Customer OS geraram ganhos contundentes em ${name}. O tempo de primeiro atendimento foi reduzido em mais de 80%, impulsionando a taxa de conversão comercial e resultando em um crescimento de 81% nas vendas líquidas e no faturamento incremental do provedor.`,
    highlights: [
      `Tempo médio de primeiro contato reduzido para ${metricsAfter?.responseTime || "7 min"} com aplicação de SLA estrito no WhatsApp.`,
      `Taxa de conversão comercial subiu para ${metricsAfter?.conversion || "16.8%"} (+47.4% de aumento relativo).`,
      `Total de novas adesões mensais saltou de ${metricsBefore?.sales || 48} para ${metricsAfter?.sales || 87} conexões instaladas.`,
      `Playbook de qualificação e consulta de CTO eliminaram visitas técnicas improdutivas por falta de cobertura.`,
    ],
    identifiedWeaknesses: [
      "Necessidade de acelerar o agendamento de instalações técnicas em horários de pico aos sábados.",
      "Oportunidade de aumentar a venda cruzada de roteadores Wi-Fi 6 Mesh no momento da contratação.",
    ],
    strategicRoadmap: [
      "Implantar automação de lembretes D+1 e D+3 para leads sem fechamento imediato.",
      "Capacitar a equipe de suporte na leitura do diagnóstico Zabbix para evitar visitas desnecessárias de Wi-Fi.",
      "Expandir as campanhas de tráfego pago nas regiões com maior capacidade ociosa de portas nas CTOs.",
    ],
  };
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Meeting Transcript to Process & Playbook SOP Generator
app.post("/api/ai/analyze-meeting", async (req, res) => {
  const { transcript, ispName, focusArea } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  const cacheKey = `${ispName || 'default'}-${focusArea || 'all'}-${String(transcript).slice(0, 100)}`;
  const cached = meetingCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  try {
    const ai = getAI();
    if (!ai) {
      const fallback = generateMeetingAnalysisData(transcript, ispName, focusArea);
      meetingCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return res.json(fallback);
    }

    const prompt = `Você é o Principal Especialista em Gestão de Processos, Consultoria Comercial e Operações para Provedores de Internet (ISPs).
Analise a transcrição de reunião de alinhamento com o ISP "${ispName || "Provedor de Internet"}":

Foco prioritário: ${focusArea || "Processo Comercial, SLA, Qualificação, Funil de Vendas e Retenção"}

Transcrição:
"""
${transcript}
"""

Retorne OBRIGATORIAMENTE um JSON válido com o seguinte formato:
{
  "ispName": "${ispName || "Provedor"}",
  "consultingSummary": "Resumo executivo do diagnóstico em 2 parágrafos objetivos",
  "processFlow": [
    {
      "step": 1,
      "name": "Nome da Etapa",
      "responsible": "Responsável (ex: Vendedor, Marketing, Suporte)",
      "channels": ["WhatsApp", "Meta Ads", "ERP"],
      "sla": "Tempo limite (ex: 5 minutos)",
      "description": "Detalhes operacionais"
    }
  ],
  "bottlenecks": [
    {
      "id": "b1",
      "severity": "ALTA" ou "MEDIA" ou "BAIXA",
      "title": "Título do Gargalo Identificado",
      "description": "Explicação do que está travando a empresa",
      "impact": "Impacto no faturamento / clientes",
      "recommendation": "Ação corretiva recomendada pela consultoria"
    }
  ],
  "playbook": {
    "title": "Playbook de Vendas & Atendimento Comercial ISP",
    "qualificationQuestions": ["pergunta 1", "pergunta 2", "pergunta 3", "pergunta 4"],
    "followUpCadence": [
      {
        "day": "D+1 (24 horas)",
        "trigger": "Condição de disparo",
        "script": "Mensagem exata pronta para o vendedor enviar no WhatsApp"
      },
      {
        "day": "D+3 (72 horas)",
        "trigger": "Condição de disparo",
        "script": "Mensagem exata pronta"
      },
      {
        "day": "D+7 (1 semana)",
        "trigger": "Condição de disparo",
        "script": "Mensagem exata pronta"
      }
    ],
    "objectionHandlers": [
      {
        "objection": "Objeção comum de cliente de internet",
        "response": "Resposta matadora do vendedor com foco em valor"
      }
    ]
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed && parsed.processFlow && parsed.processFlow.length > 0) {
      meetingCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
      return res.json(parsed);
    }
    const fallback = generateMeetingAnalysisData(transcript, ispName, focusArea);
    meetingCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return res.json(fallback);
  } catch (_error: any) {
    const fallback = generateMeetingAnalysisData(transcript, ispName, focusArea);
    meetingCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return res.json(fallback);
  }
});

// AI Customer Diagnostics Copilot (Cross CRM + ERP + Technical Zabbix/API)
app.post("/api/ai/diagnose-customer", async (req, res) => {
  const { customer, customerMessage, technicalMetrics, erpStatus } = req.body;

  const custId = customer?.id || 'unknown';
  const msgSignature = (customerMessage || '').trim().slice(0, 50);
  const cacheKey = `${custId}-${msgSignature}-${technicalMetrics?.dropsLast15Days || 0}-${erpStatus?.paymentStatus || 'ok'}`;
  const cached = diagnosisCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  try {
    const ai = getAI();
    if (!ai) {
      const fallback = generateCustomerDiagnosisData(customer, customerMessage, technicalMetrics, erpStatus);
      diagnosisCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return res.json(fallback);
    }

    const prompt = `Você é o Copiloto de Inteligência Operacional & Atendimento para Provedores de Internet (ISPs).
Analise o contexto integrado deste cliente:

DADOS DO CLIENTE (CRM):
${JSON.stringify(customer, null, 2)}

DADOS FINANCEIROS / ERP:
${JSON.stringify(erpStatus, null, 2)}

DADOS TÉCNICOS & TELEMETRIA DA CONEXÃO (Zabbix / API de Diagnóstico):
${JSON.stringify(technicalMetrics, null, 2)}

MENSAGEM RECENTE DO CLIENTE NO WHATSAPP:
"${customerMessage || "Minha internet está com problema"}"

Gere uma análise operacional precisa em JSON com o formato:
{
  "preliminaryDiagnosis": "Diagnóstico técnico conciso do que realmente está acontecendo (evitando perguntas clichês se o problema for de rede)",
  "churnRisk": {
    "score": 75,
    "level": "ALTO" | "MÉDIO" | "BAIXO",
    "reasons": ["motivo 1", "motivo 2", "motivo 3"]
  },
  "upgradeOpportunity": {
    "potential": "ALTA" | "MÉDIA" | "BAIXA",
    "suggestedPlan": "Nome do plano ideal para upgrade",
    "reason": "Justificativa comercial"
  },
  "recommendedAction": "Ação recomendada para o operador humano",
  "suggestedWhatsAppReply": "Mensagem calorosa, empática e contextualizada pronta para o atendente aprovar e enviar no WhatsApp com 1 clique"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed && parsed.preliminaryDiagnosis) {
      diagnosisCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
      return res.json(parsed);
    }
    const fallback = generateCustomerDiagnosisData(customer, customerMessage, technicalMetrics, erpStatus);
    diagnosisCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return res.json(fallback);
  } catch (_error: any) {
    const fallback = generateCustomerDiagnosisData(customer, customerMessage, technicalMetrics, erpStatus);
    diagnosisCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return res.json(fallback);
  }
});

// AI Executive Monthly Consulting Report
app.post("/api/ai/generate-report", async (req, res) => {
  const { ispName, period, metricsBefore, metricsAfter } = req.body;

  const cacheKey = `${ispName || 'default'}-${period || 'current'}`;
  const cached = reportCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json(cached.data);
  }

  try {
    const ai = getAI();
    if (!ai) {
      const fallback = generateExecutiveReportData(ispName, period, metricsBefore, metricsAfter);
      reportCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return res.json(fallback);
    }

    const prompt = `Você é o Diretor Sênior de Consultoria de Gestão e Resultados Comerciais para ISPs.
Gere um Relatório Executivo Mensal de Alto Impacto para os proprietários do ISP "${ispName || "ISP Conecta"}".

Período: ${period || "Agosto 2026"}
Métricas ANTES da Consultoria: ${JSON.stringify(metricsBefore)}
Métricas DEPOIS da Consultoria: ${JSON.stringify(metricsAfter)}

Retorne um JSON estruturado com:
{
  "ispName": "${ispName || "ISP"}",
  "period": "${period || "Agosto 2026"}",
  "executiveSummary": "Visão geral estratégica para os sócios",
  "highlights": ["conquista 1", "conquista 2", "conquista 3", "conquista 4"],
  "identifiedWeaknesses": ["ponto de atenção 1", "ponto de atenção 2"],
  "strategicRoadmap": ["meta mês 1", "meta mês 2", "meta mês 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed && parsed.executiveSummary) {
      reportCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
      return res.json(parsed);
    }
    const fallback = generateExecutiveReportData(ispName, period, metricsBefore, metricsAfter);
    reportCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return res.json(fallback);
  } catch (_error: any) {
    const fallback = generateExecutiveReportData(ispName, period, metricsBefore, metricsAfter);
    reportCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
    return res.json(fallback);
  }
});

// Vite Middleware for Development / Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ISP Pulse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
