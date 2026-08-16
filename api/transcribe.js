export const config = { api: { bodyParser: false } };

const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (req.body instanceof Uint8Array) return Buffer.from(req.body);
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_AUDIO_BYTES) throw new Error('AUDIO_TOO_LARGE');
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

function extensionFor(contentType) {
  const type = String(contentType || '').toLowerCase();
  if (type.includes('mp4') || type.includes('m4a')) return 'mp4';
  if (type.includes('ogg')) return 'ogg';
  if (type.includes('wav')) return 'wav';
  if (type.includes('mpeg') || type.includes('mp3')) return 'mp3';
  return 'webm';
}

export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (req.method === 'GET') {
    return sendJson(res, 200, { configured: Boolean(apiKey) });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Método não permitido.' });
  }
  if (!apiKey) {
    return sendJson(res, 503, {
      error: 'A transcrição por IA ainda não foi configurada. A gravação local continua disponível.'
    });
  }

  try {
    const audio = await readBody(req);
    if (!audio.length) return sendJson(res, 400, { error: 'O áudio recebido está vazio.' });
    if (audio.length > MAX_AUDIO_BYTES) return sendJson(res, 413, { error: 'O áudio está muito grande.' });

    const contentType = String(req.headers['content-type'] || 'audio/webm').split(';')[0];
    const extension = extensionFor(contentType);
    const language = String(req.query?.lang || '').split('-')[0].toLowerCase();

    const form = new FormData();
    form.append('file', new Blob([audio], { type: contentType }), `coachvoice-audio.${extension}`);
    form.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe');
    if (language === 'pt' || language === 'en') form.append('language', language);
    form.append('prompt', 'Futebol, treinador, coletiva, pressão, transição, compactação, arbitragem, vestiário, diretoria. Preserve vícios de linguagem quando forem falados.');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('OpenAI transcription error:', payload);
      return sendJson(res, 502, { error: payload?.error?.message || 'A transcrição não respondeu.' });
    }
    const text = String(payload.text || '').trim();
    if (!text) return sendJson(res, 502, { error: 'A transcrição retornou um texto vazio.' });
    return sendJson(res, 200, { text });
  } catch (error) {
    console.error('Transcription route error:', error);
    if (error?.message === 'AUDIO_TOO_LARGE') return sendJson(res, 413, { error: 'O áudio ultrapassou o limite desta versão.' });
    return sendJson(res, 500, { error: 'Não foi possível processar o áudio.' });
  }
}
