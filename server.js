import express from "express";
import cors from "cors";
import helmet from "helmet";
import admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = Number(process.env.PORT || 8080);
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const REQUIRE_AUTH = String(process.env.REQUIRE_FIREBASE_AUTH || "true").toLowerCase() !== "false";
const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "")
  .split(",").map(v => v.trim()).filter(Boolean);

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY ausente. /health funcionará, mas a análise falhará.");
}
if (!admin.apps.length) {
  admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || undefined });
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin(origin, cb) {
    if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Origin não permitida pelo CORS."));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "1mb" }));

const requestBuckets = new Map();
function rateLimit(req, res, next) {
  const key = req.user?.uid || req.ip || "anon";
  const now = Date.now(), windowMs = 60_000, limit = 8;
  const bucket = (requestBuckets.get(key) || []).filter(ts => now - ts < windowMs);
  if (bucket.length >= limit) return res.status(429).json({ error: "Muitas análises em pouco tempo. Aguarde um minuto." });
  bucket.push(now); requestBuckets.set(key, bucket); next();
}
async function authGuard(req, res, next) {
  if (!REQUIRE_AUTH) return next();
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return res.status(401).json({ error: "Token Firebase ausente." });
  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    console.warn("Firebase token inválido:", error?.message);
    res.status(401).json({ error: "Sessão Firebase inválida ou expirada." });
  }
}
function isYoutubePublicUrl(value) {
  try {
    const u = new URL(value);
    return ["youtube.com","www.youtube.com","m.youtube.com","youtu.be"].includes(u.hostname.toLowerCase());
  } catch { return false; }
}
function cleanText(value, max = 500) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}
function positionCriteria(position) {
  const map = {
    GR: ["defesas", "gols sofridos", "1x1", "saídas aéreas", "cruzamentos", "controle da profundidade", "jogo com os pés", "reposição curta e longa", "goleiro-líbero", "decisão sob pressão"],
    ZAG: ["posicionamento defensivo", "cobertura", "defesa da profundidade", "duelos aéreos", "duelos no chão", "antecipação", "pressão", "saída de bola", "passe vertical", "condução", "transição defensiva", "erros em zona de risco"],
    LAT: ["1x1 defensivo", "cobertura", "profundidade", "apoio por fora e por dentro", "progressão", "cruzamento", "pressão", "recomposição", "transições", "tomada de decisão"],
    VOL: ["recepção sob pressão", "saída de bola", "passe vertical", "mudança de corredor", "cobertura", "interceptação", "duelos", "pressão", "posicionamento", "transições", "tomada de decisão"],
    MEI: ["recepção entrelinhas", "criação", "passe vertical", "último passe", "condução", "finalização", "movimento sem bola", "pressão", "reação pós-perda", "tomada de decisão"],
    EXT: ["1x1 ofensivo", "progressão", "ataque à profundidade", "cruzamento", "passe-chave", "finalização", "pressão", "recomposição", "movimento sem bola", "tomada de decisão"],
    CA: ["apoio frontal", "ataque à profundidade", "finalização", "jogo aéreo", "proteção da bola", "assistência/último passe", "pressão", "movimento na área", "movimento sem bola", "tomada de decisão"]
  };
  return map[position] || map.VOL;
}

const analysisSchema = {
  type: "object",
  properties: {
    analysisVersion: { type: "string" },
    model: { type: "string" },
    overallScore: { type: "number", description: "Nota sugerida de 0 a 10." },
    overallConfidence: { type: "number", description: "Confiança geral de 0 a 100." },
    recommendation: { type: "string", enum: ["advance", "monitor", "reobserve", "discard"] },
    coverage: { type: "string", enum: ["full", "partial", "uncertain"] },
    targetVisibility: { type: "string" },
    summary: { type: "string" },
    tacticalFitNotes: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    concerns: { type: "array", items: { type: "string" } },
    dimensions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string", enum: ["technical", "tactical", "physical", "mental"] },
          label: { type: "string" },
          score: { type: "number" },
          confidence: { type: "number" },
          summary: { type: "string" }
        },
        required: ["key", "label", "score", "confidence", "summary"]
      }
    },
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          timestampSeconds: { type: "number" },
          timestamp: { type: "string" },
          category: { type: "string" },
          outcome: { type: "string", enum: ["positive", "neutral", "attention"] },
          confidence: { type: "number" },
          description: { type: "string" },
          evaluable: { type: "boolean" }
        },
        required: ["timestampSeconds", "timestamp", "category", "outcome", "confidence", "description", "evaluable"]
      }
    },
    nonEvaluableNotes: { type: "array", items: { type: "string" } }
  },
  required: ["analysisVersion","model","overallScore","overallConfidence","recommendation","coverage","targetVisibility","summary","tacticalFitNotes","strengths","concerns","dimensions","events","nonEvaluableNotes"]
};

function buildPrompt(body) {
  const p = body.player || {}, match = body.match || {}, gm = body.gameModel || null;
  const criteria = positionCriteria(cleanText(p.position, 10));
  return `
Você é um analista profissional de futebol assistindo a uma partida completa para pré-análise de scouting.

ALVO INFORMADO PELO USUÁRIO
- Atleta: ${cleanText(p.name, 120)}
- Posição: ${cleanText(p.positionLabel || p.position, 80)}
- Equipe: ${cleanText(p.club, 120)}
- Número/camisa: ${cleanText(p.shirtNumber, 20) || "não informado"}
- Adversário: ${cleanText(match.opponent, 120) || "não informado"}
- Competição: ${cleanText(match.competition, 120) || "não informada"}
- Minutos esperados: ${Number(match.expectedMinutes) || "não informado"}

CRITÉRIOS PRIORITÁRIOS DA POSIÇÃO
${criteria.map(v => `- ${v}`).join("\n")}

${gm ? `MODELO DE JOGO DO CLUBE
- Formação: ${cleanText(gm.formation, 40)}
- Formação alternativa: ${cleanText(gm.alternativeFormation, 40)}
- Pressão: ${cleanText(gm.pressure, 80)}
- Linha defensiva: ${cleanText(gm.line, 80)}
- Construção: ${cleanText(gm.build, 80)}
- Ataque: ${cleanText(gm.attack, 80)}
- Intensidade: ${cleanText(gm.intensity, 80)}
- Tolerância a risco: ${cleanText(gm.risk, 80)}
- Princípios: ${cleanText(gm.principles, 600)}
Use isso apenas para comentar encaixe; não force conclusões se o vídeo não permitir.` : "Não foi fornecido Modelo de Jogo."}

REGRAS DE SEGURANÇA E QUALIDADE DA ANÁLISE
1. NÃO identifique o atleta por reconhecimento facial. Use somente equipe, número da camisa quando visível, posição/contexto de jogo e continuidade visual.
2. Se você não conseguir ter segurança de que uma ação pertence ao atleta-alvo, NÃO atribua a ação a ele. Marque limitação/não avaliável.
3. Se o atleta estiver fora do enquadramento ou a câmera não mostrar o contexto necessário, não conclua posicionamento ou erro. Explique em nonEvaluableNotes.
4. Diferencie claramente observação visual de inferência.
5. Não invente estatísticas, quantidade de duelos, passes ou minutos. Só reporte eventos que você consiga localizar com timestamp.
6. Para cada evento, dê timestamp e descrição curta do que é realmente visível.
7. Se o vídeo for melhores momentos ou estiver editado, reduza a confiança e não faça inferências sobre consistência ao longo da partida.
8. Produza de 12 a 45 eventos relevantes se houver evidência suficiente; menos é aceitável quando o alvo não estiver visível.
9. As notas são sugestões para revisão humana. Use 0-10 e confiança 0-100.
10. As quatro dimensões obrigatórias são technical, tactical, physical e mental.
11. A recomendação é apenas preliminar: advance, monitor, reobserve ou discard.
12. Responda em português do Brasil.

OBJETIVO
Entregue uma pré-análise automática que economize tempo do scout: resumo executivo, forças, pontos de atenção, notas por dimensão, confiança, limitações e uma linha do tempo dos lances mais relevantes.`;
}

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "Scout Video Intelligence",
    version: "73.0.0",
    model: MODEL,
    firebaseAuth: REQUIRE_AUTH,
    youtube: "public-only"
  });
});

app.post("/v1/analyze-youtube", authGuard, rateLimit, async (req, res) => {
  const requestId = crypto.randomUUID();
  const videoUrl = cleanText(req.body?.videoUrl, 1000);
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: "GEMINI_API_KEY não configurada no servidor.", requestId });
  if (!isYoutubePublicUrl(videoUrl)) return res.status(400).json({ error: "Informe um URL público do YouTube.", requestId });
  const player = req.body?.player || {};
  if (!cleanText(player.name,120) || !cleanText(player.position,20)) return res.status(400).json({ error: "Nome e posição do atleta são obrigatórios.", requestId });

  try {
    const interaction = await ai.interactions.create({
      model: MODEL,
      input: [
        { type: "video", uri: videoUrl },
        { type: "text", text: buildPrompt(req.body || {}) }
      ],
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: analysisSchema
      }
    });

    const raw = String(interaction.output_text || "").trim();
    if (!raw) throw new Error("O modelo não retornou análise.");
    const analysis = JSON.parse(raw);
    analysis.analysisVersion = "v73.0";
    analysis.model = MODEL;
    analysis.generatedAt = Date.now();

    // Limites adicionais antes de devolver ao navegador.
    analysis.events = Array.isArray(analysis.events) ? analysis.events.slice(0, 60) : [];
    analysis.strengths = Array.isArray(analysis.strengths) ? analysis.strengths.slice(0, 8) : [];
    analysis.concerns = Array.isArray(analysis.concerns) ? analysis.concerns.slice(0, 8) : [];
    analysis.nonEvaluableNotes = Array.isArray(analysis.nonEvaluableNotes) ? analysis.nonEvaluableNotes.slice(0, 20) : [];

    res.json({ ok: true, requestId, analysis });
  } catch (error) {
    console.error(`[${requestId}] Gemini error`, error);
    const msg = String(error?.message || "Falha ao analisar o vídeo.");
    const status = /youtube|public|not found|permission/i.test(msg) ? 422 : 502;
    res.status(status).json({
      error: status === 422
        ? "O vídeo não pôde ser processado. Confirme que é um vídeo público do YouTube."
        : "O serviço de IA não concluiu a análise.",
      detail: msg.slice(0, 800),
      requestId
    });
  }
});

app.use((error, req, res, next) => {
  console.error("Unhandled:", error);
  res.status(500).json({ error: "Erro interno do Video Intelligence." });
});

app.listen(PORT, () => {
  console.log(`Scout Video Intelligence v73.0 em :${PORT} • modelo ${MODEL}`);
});
