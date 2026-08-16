const MAX_FIELD_LENGTH = 600;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function outputText(data) {
  if (typeof data?.output_text === 'string') return data.output_text.trim();
  const pieces = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') pieces.push(content.text);
    }
  }
  return pieces.join('\n').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Método não permitido.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, { error: 'IA ainda não configurada na Vercel.' });
  }

  const {
    phrase = '',
    meaning = '',
    pronunciation = '',
    transcript = '',
    score = 0
  } = req.body || {};

  const fields = [phrase, meaning, pronunciation, transcript].map(value => String(value).trim());
  if (!fields[0] || !fields[3]) {
    return sendJson(res, 400, { error: 'Frase e tentativa são obrigatórias.' });
  }
  if (fields.some(value => value.length > MAX_FIELD_LENGTH)) {
    return sendJson(res, 400, { error: 'Texto muito longo.' });
  }

  const instructions = `
Você é um professor paciente de inglês para um treinador brasileiro iniciante.
Dê feedback em português do Brasil.
Explique apenas uma ou duas melhorias por vez.
Não ridicularize erros e não diga que a pessoa "falou errado" de forma absoluta,
pois a transcrição automática também pode falhar.
Use linguagem simples, acolhedora e prática.
Não use IPA. Pode usar uma aproximação de pronúncia em português como apoio,
mas sempre recomende ouvir o áudio.
A resposta deve ter no máximo 90 palavras.
`.trim();

  const input = `
Frase-alvo: ${fields[0]}
Significado: ${fields[1]}
Apoio de pronúncia: ${fields[2]}
O navegador transcreveu: ${fields[3]}
Pontuação textual: ${Number(score) || 0}%
Explique o que treinar agora e dê um exercício curto de repetição.
`.trim();

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
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

    const data = await response.json();
    if (!response.ok) {
      console.error('OpenAI English coach error:', data);
      return sendJson(res, 502, { error: data?.error?.message || 'A IA não respondeu.' });
    }

    const feedback = outputText(data);
    if (!feedback) return sendJson(res, 502, { error: 'Resposta vazia.' });
    return sendJson(res, 200, { feedback });
  } catch (error) {
    console.error('English coach route error:', error);
    return sendJson(res, 500, { error: 'Erro ao preparar o feedback.' });
  }
}
