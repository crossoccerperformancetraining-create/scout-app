import express from "express";
import cors from "cors";
import helmet from "helmet";
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { GoogleGenAI } from "@google/genai";

const app = express();

const PORT = Number(process.env.PORT || 8080);
const BACKEND_VERSION = "73.2.0";
const MODEL = process.env.GEMINI_MODEL || "gemini-3.7-flash";
const REQUIRE_AUTH = String(process.env.REQUIRE_FIREBASE_AUTH || "true").toLowerCase() !== "false";
const FIREBASE_PROJECT_ID = String(process.env.FIREBASE_PROJECT_ID || "").trim();

const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(v => v.trim())
  .filter(Boolean);

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    projectId: FIREBASE_PROJECT_ID || undefined
  });
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin(origin, cb) {
    if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Origin não permitida pelo CORS."));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"]
}));
app.use(express.json({ limit: "1mb" }));

const requestBuckets = new Map();

function rateLimitFor(kind, limit, windowMs = 60_000) {
  return (req, res, next) => {
    const key = `${kind}:${req.user?.uid || req.ip || "anon"}`;
    const now = Date.now();
    const bucket = (requestBuckets.get(key) || []).filter(ts => now - ts < windowMs);
    if (bucket.length >= limit) {
      return res.status(429).json({
        error: "Muitas solicitações em pouco tempo. Aguarde e tente novamente."
      });
    }
    bucket.push(now);
    requestBuckets.set(key, bucket);
    next();
  };
}

async function authGuard(req, res, next) {
  if (!REQUIRE_AUTH) return next();

  const token = String(req.headers.authorization || "")
    .replace(/^Bearer\s+/i, "")
    .trim();

  if (!token) {
    return res.status(401).json({ error: "Token Firebase ausente." });
  }

  try {
    req.user = await getAuth().verifyIdToken(token);
    next();
  } catch (error) {
    console.warn("Firebase token inválido:", error?.message);
    res.status(401).json({ error: "Sessão Firebase inválida ou expirada." });
  }
}

function cleanText(value, max = 500) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function isYoutubeUrl(value) {
  try {
    const url = new URL(value);
    return ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]
      .includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function parseJsonOutput(raw) {
  const text = String(raw || "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
  if (!text) throw new Error("O modelo não retornou conteúdo.");
  return JSON.parse(text);
}

function positionCriteria(position) {
  const map = {
    GR: [
      "defesas e reação", "gols sofridos no contexto do lance", "1x1",
      "saídas aéreas", "controle da profundidade", "jogo com os pés",
      "reposição curta e longa", "goleiro-líbero", "decisão sob pressão"
    ],
    ZAG: [
      "posicionamento defensivo", "cobertura", "controle da profundidade",
      "duelos aéreos", "duelos no chão", "antecipação", "pressão",
      "saída de bola", "passe vertical", "condução",
      "transição defensiva", "decisão em zona de risco"
    ],
    LAT: [
      "1x1 defensivo", "cobertura", "ataque à profundidade",
      "apoio por fora e por dentro", "progressão", "cruzamento",
      "pressão", "recomposição", "transições", "tomada de decisão"
    ],
    VOL: [
      "recepção sob pressão", "saída de bola", "passe vertical",
      "mudança de corredor", "cobertura", "interceptação", "duelos",
      "pressão", "posicionamento", "transições", "tomada de decisão"
    ],
    MEI: [
      "recepção entrelinhas", "criação", "passe vertical", "último passe",
      "condução", "finalização", "movimento sem bola", "pressão",
      "reação pós-perda", "tomada de decisão"
    ],
    EXT: [
      "1x1 ofensivo", "progressão", "ataque à profundidade", "cruzamento",
      "passe-chave", "finalização", "pressão", "recomposição",
      "movimento sem bola", "tomada de decisão"
    ],
    CA: [
      "apoio frontal", "ataque à profundidade", "finalização", "jogo aéreo",
      "proteção da bola", "assistência/último passe", "pressão",
      "movimento na área", "movimento sem bola", "tomada de decisão"
    ]
  };
  return map[position] || map.VOL;
}

const analysisSchema = {
  type: "object",
  properties: {
    analysisVersion: { type: "string" },
    model: { type: "string" },
    overallScore: { type: "number" },
    overallConfidence: { type: "number" },
    recommendation: {
      type: "string",
      enum: ["advance", "monitor", "reobserve", "discard"]
    },
    coverage: {
      type: "string",
      enum: ["full", "partial", "uncertain"]
    },
    targetVisibility: { type: "string" },
    summary: { type: "string" },
    tacticalFitNotes: { type: "string" },
    strengths: {
      type: "array",
      items: { type: "string" }
    },
    concerns: {
      type: "array",
      items: { type: "string" }
    },
    dimensions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            enum: ["technical", "tactical", "physical", "mental"]
          },
          label: { type: "string" },
          score: { type: "number" },
          confidence: { type: "number" },
          summary: { type: "string" },
          evidenceEventIds: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: [
          "key", "label", "score", "confidence", "summary", "evidenceEventIds"
        ]
      }
    },
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          timestampSeconds: { type: "number" },
          timestamp: { type: "string" },
          phase: { type: "string" },
          category: { type: "string" },
          outcome: {
            type: "string",
            enum: ["positive", "neutral", "attention"]
          },
          confidence: { type: "number" },
          description: { type: "string" },
          evaluable: { type: "boolean" },
          evidenceType: {
            type: "string",
            enum: ["direct", "contextual", "uncertain"]
          }
        },
        required: [
          "id", "timestampSeconds", "timestamp", "phase", "category",
          "outcome", "confidence", "description", "evaluable", "evidenceType"
        ]
      }
    },
    nonEvaluableNotes: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: [
    "analysisVersion", "model", "overallScore", "overallConfidence",
    "recommendation", "coverage", "targetVisibility", "summary",
    "tacticalFitNotes", "strengths", "concerns", "dimensions",
    "events", "nonEvaluableNotes"
  ]
};

const rewriteSchema = {
  type: "object",
  properties: {
    humanized: { type: "string" },
    warnings: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["humanized", "warnings"]
};

function buildVideoPrompt(body) {
  const player = body.player || {};
  const match = body.match || {};
  const gameModel = body.gameModel || null;
  const criteria = positionCriteria(cleanText(player.position, 10));

  return `
Você é um analista profissional de futebol fazendo uma PRÉ-ANÁLISE de vídeo para um departamento de scouting.

ATLETA-ALVO INFORMADO PELO USUÁRIO
- Nome: ${cleanText(player.name, 120)}
- Posição: ${cleanText(player.positionLabel || player.position, 80)}
- Clube: ${cleanText(player.club, 120)}
- Camisa: ${cleanText(player.shirtNumber, 20) || "não informada"}
- Adversário: ${cleanText(match.opponent, 120) || "não informado"}
- Competição: ${cleanText(match.competition, 120) || "não informada"}
- Minutos esperados: ${Number(match.expectedMinutes) || "não informado"}

CRITÉRIOS PRIORITÁRIOS DA POSIÇÃO
${criteria.map(value => `- ${value}`).join("\n")}

${gameModel ? `MODELO DE JOGO DO CLUBE
- Formação: ${cleanText(gameModel.formation, 40)}
- Formação alternativa: ${cleanText(gameModel.alternativeFormation, 40)}
- Pressão: ${cleanText(gameModel.pressure, 80)}
- Linha defensiva: ${cleanText(gameModel.line, 80)}
- Construção: ${cleanText(gameModel.build, 80)}
- Ataque: ${cleanText(gameModel.attack, 80)}
- Intensidade: ${cleanText(gameModel.intensity, 80)}
- Tolerância a risco: ${cleanText(gameModel.risk, 80)}
- Princípios: ${cleanText(gameModel.principles, 700)}

Use o modelo de jogo apenas para comentar encaixe. Não force uma conclusão se o vídeo não permitir.
` : "Não foi fornecido Modelo de Jogo."}

REGRAS OBRIGATÓRIAS
1. Não use reconhecimento facial para identificar o atleta.
2. Atribua uma ação ao alvo somente quando houver continuidade visual/contextual suficiente: equipe, camisa, posição e sequência do lance.
3. Se não houver segurança de que uma ação pertence ao atleta, não atribua a ação. Registre a limitação.
4. Se o alvo estiver fora do enquadramento, não conclua posicionamento, erro ou comportamento sem evidência visível.
5. Diferencie observação direta de leitura contextual.
6. Não invente estatísticas, contagens, minutos, duelos, passes, distância percorrida ou velocidade.
7. Cada evento precisa de timestamp localizável e descrição curta do que realmente está visível.
8. Se o vídeo estiver editado, incompleto ou for melhores momentos, reduza a confiança e não conclua consistência.
9. Notas são sugestões para revisão humana. Escala 0–10; confiança 0–100.
10. As dimensões obrigatórias são Técnica, Tática, Física e Mental.
11. A recomendação é preliminar: advance, monitor, reobserve ou discard.
12. Use de 8 a 40 eventos quando houver evidência suficiente. Menos eventos é correto quando o alvo não está suficientemente visível.
13. Strengths e concerns devem ser sustentados pelos eventos ou por contexto visual claro.
14. evidenceEventIds deve referenciar IDs existentes em events.
15. Responda em português do Brasil.
16. Não invente uma fragilidade apenas para equilibrar o relatório.
17. Quando um critério não puder ser avaliado, declare isso em nonEvaluableNotes.

OBJETIVO
Entregar uma pré-análise que economize tempo do scout sem substituir a revisão humana:
- resumo;
- forças;
- pontos de atenção;
- notas sugeridas por dimensão;
- encaixe tático;
- linha do tempo;
- confiança;
- limitações;
- rastreabilidade por event IDs.
`;
}

function buildRewritePrompt(body) {
  const raw = cleanText(body.text, 8000);
  const position = cleanText(body.position, 80);
  const playerName = cleanText(body.playerName, 120);

  return `
Reescreva o relato abaixo como um texto profissional de scouting de futebol em português do Brasil.

ATLETA
- Nome: ${playerName || "não informado"}
- Posição: ${position || "não informada"}

RELATO ORIGINAL DO SCOUT
${raw}

REGRAS
1. Preserve os fatos e a opinião realmente presentes no relato.
2. Não invente ação, atributo, nota, métrica, contexto, fragilidade ou força.
3. Use 2 a 4 frases.
4. Prefira até 110 palavras.
5. Remova repetições de palavras e ideias.
6. Una informações redundantes.
7. Use terminologia profissional, mas natural.
8. Não transforme "busca/ataque à profundidade" em fragilidade.
9. Só crie ponto a desenvolver se o relato contiver crítica explícita.
10. Preserve nomes, clubes, competições e fatos biográficos.
11. Não inclua título, bullet points, introduções genéricas ou frases de preenchimento.
12. Se o relato estiver ambíguo, preserve a ambiguidade em vez de inventar uma conclusão.

Retorne apenas uma versão humanizada concisa e uma lista de warnings caso alguma parte do original seja ambígua.
`;
}

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "Scout Video Intelligence",
    backendVersion: BACKEND_VERSION,
    frontendCompatibleFrom: "73.1.26",
    model: MODEL,
    firebaseAuth: REQUIRE_AUTH,
    videoInput: "youtube-url-preview",
    features: [
      "video-analysis",
      "structured-events",
      "evidence-traceability",
      "rewrite-scout-text"
    ]
  });
});

app.get("/v1/capabilities", (req, res) => {
  res.json({
    ok: true,
    backendVersion: BACKEND_VERSION,
    model: MODEL,
    endpoints: {
      health: "/health",
      analyzeYoutube: "/v1/analyze-youtube",
      rewriteScoutText: "/v1/rewrite-scout-text"
    }
  });
});

app.post(
  "/v1/rewrite-scout-text",
  authGuard,
  rateLimitFor("rewrite", 20),
  async (req, res) => {
    const requestId = crypto.randomUUID();
    const text = cleanText(req.body?.text, 8000);

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "GEMINI_API_KEY não configurada no servidor.",
        requestId
      });
    }

    if (text.length < 10) {
      return res.status(400).json({
        error: "Relato muito curto para qualificação.",
        requestId
      });
    }

    try {
      const interaction = await ai.interactions.create({
        model: MODEL,
        input: buildRewritePrompt(req.body || {}),
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: rewriteSchema
        }
      });

      const data = parseJsonOutput(interaction.output_text);

      return res.json({
        ok: true,
        requestId,
        model: MODEL,
        humanized: cleanText(data.humanized, 8000),
        warnings: Array.isArray(data.warnings)
          ? data.warnings.map(v => cleanText(v, 500)).slice(0, 8)
          : []
      });
    } catch (error) {
      console.error(`[${requestId}] rewrite error`, error);
      return res.status(502).json({
        error: "O serviço de IA não concluiu a qualificação do relato.",
        detail: cleanText(error?.message, 800),
        requestId
      });
    }
  }
);

app.post(
  "/v1/analyze-youtube",
  authGuard,
  rateLimitFor("video", 4),
  async (req, res) => {
    const requestId = crypto.randomUUID();
    const videoUrl = cleanText(req.body?.videoUrl, 1000);
    const player = req.body?.player || {};

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "GEMINI_API_KEY não configurada no servidor.",
        requestId
      });
    }

    if (!isYoutubeUrl(videoUrl)) {
      return res.status(400).json({
        error: "Informe um URL do YouTube.",
        requestId
      });
    }

    if (!cleanText(player.name, 120) || !cleanText(player.position, 20)) {
      return res.status(400).json({
        error: "Nome e posição do atleta são obrigatórios.",
        requestId
      });
    }

    try {
      const interaction = await ai.interactions.create({
        model: MODEL,
        input: [
          { type: "text", text: buildVideoPrompt(req.body || {}) },
          { type: "video", uri: videoUrl }
        ],
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: analysisSchema
        }
      });

      const analysis = parseJsonOutput(interaction.output_text);

      analysis.analysisVersion = "v73.2.0";
      analysis.model = MODEL;
      analysis.generatedAt = Date.now();

      analysis.events = Array.isArray(analysis.events)
        ? analysis.events.slice(0, 60)
        : [];
      analysis.strengths = Array.isArray(analysis.strengths)
        ? analysis.strengths.slice(0, 8)
        : [];
      analysis.concerns = Array.isArray(analysis.concerns)
        ? analysis.concerns.slice(0, 8)
        : [];
      analysis.nonEvaluableNotes = Array.isArray(analysis.nonEvaluableNotes)
        ? analysis.nonEvaluableNotes.slice(0, 20)
        : [];

      return res.json({
        ok: true,
        requestId,
        analysis
      });
    } catch (error) {
      console.error(`[${requestId}] video error`, error);

      const detail = cleanText(error?.message, 800);
      const likelyVideoAccessIssue =
        /youtube|video|public|not found|permission|fetch|uri/i.test(detail);

      return res.status(likelyVideoAccessIssue ? 422 : 502).json({
        error: likelyVideoAccessIssue
          ? "O vídeo não pôde ser processado. Confirme a URL e a disponibilidade do vídeo."
          : "O serviço de IA não concluiu a análise do jogo.",
        detail,
        requestId
      });
    }
  }
);

app.use((error, req, res, next) => {
  console.error("Unhandled:", error);
  res.status(500).json({
    error: "Erro interno do Scout Video Intelligence."
  });
});

app.listen(PORT, () => {
  console.log(
    `Scout Video Intelligence v${BACKEND_VERSION} em :${PORT} • ${MODEL}`
  );
});
