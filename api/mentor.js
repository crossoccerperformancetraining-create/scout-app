const MAX_SITUATION_LENGTH = 3000;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function extractOutputText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const pieces = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') pieces.push(content.text);
    }
  }
  return pieces.join('\n').trim();
}

function parseMentorJson(raw) {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned);
  const required = ['analysis', 'answer', 'pauseAnswer', 'avoid', 'followup'];

  for (const key of required) {
    if (typeof parsed[key] !== 'string' || !parsed[key].trim()) {
      throw new Error(`Resposta sem o campo ${key}.`);
    }
  }

  return Object.fromEntries(required.map(key => [key, parsed[key].trim()]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Método não permitido.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, {
      error: 'A variável OPENAI_API_KEY ainda não foi configurada na Vercel.'
    });
  }

  const {
    situation = '',
    audience = 'Imprensa',
    tone = 'Sereno',
    duration = '30 segundos',
    language = 'Português'
  } = req.body || {};

  const normalizedSituation = String(situation).trim();
  if (!normalizedSituation) {
    return sendJson(res, 400, { error: 'Descreva uma situação.' });
  }
  if (normalizedSituation.length > MAX_SITUATION_LENGTH) {
    return sendJson(res, 400, { error: 'A situação está muito longa.' });
  }

  const instructions = `
Você é o Coach Mentor AI, assistente de comunicação para treinadores de futebol.
Ajude a preparar falas éticas, respeitosas, profissionais e aplicáveis à situação.
Não invente fatos sobre clubes, jogadores ou partidas.
Não imite pessoas reais nem reproduza bordões de treinadores conhecidos.
Adapte a resposta ao público, tom, duração e idioma pedidos.
A marcação de pausas deve usar "/" para pausa curta e "//" para pausa longa.
Responda SOMENTE com JSON válido, sem markdown, neste formato:
{
  "analysis": "leitura breve da situação",
  "answer": "resposta pronta para o treinador falar",
  "pauseAnswer": "a mesma resposta com marcações / e //",
  "avoid": "o que deve ser evitado",
  "followup": "uma pergunta provável de acompanhamento"
}`.trim();

  const input = `
Situação: ${normalizedSituation}
Público: ${String(audience)}
Tom: ${String(tone)}
Duração desejada: ${String(duration)}
Idioma: ${String(language)}
`.trim();

  try {
    const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions,
        input
      })
    });

    const data = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error('OpenAI error:', data);
      return sendJson(res, 502, {
        error: data?.error?.message || 'A inteligência artificial não respondeu.'
      });
    }

    const rawText = extractOutputText(data);
    if (!rawText) {
      return sendJson(res, 502, { error: 'A IA retornou uma resposta vazia.' });
    }

    const result = parseMentorJson(rawText);
    return sendJson(res, 200, result);
  } catch (error) {
    console.error('Mentor route error:', error);
    return sendJson(res, 500, {
      error: 'O Coach Mentor encontrou um erro ao preparar a orientação.'
    });
  }
}
