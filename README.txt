Scout Intelligence V75.9.0 — Club Manager + Smart Automation

Publicação no GitHub/Vercel:
1. Substituir index.html, manifest.json e sw.js na raiz.
2. Substituir api/health.mjs.
3. Manter/substituir api/player-*.mjs e lib/data-sync-*.mjs pelo pacote para alinhar o ecossistema.
4. Não alterar API_FOOTBALL_KEY nem Firebase.

Novidades:
- Centro do Clube em visão Club Manager (inspirado em gestores de futebol, sem copiar UI proprietária).
- Staff/estrutura, objetivos, forma, jogos, profundidade de elenco, radar contratual e saúde dos dados.
- Smart Sync: roda ao abrir/usar o Scout quando vencido, com limite por ciclo, rota gratuita e fallback oGol assistido.
- Revisão rápida ignora automaticamente campos em que Atual = Novo.
- Automação só aplica dados objetivos de vínculos em modo AUTO; DNA, avaliação, parecer, decisão e System Fit permanecem protegidos.
- Automação 24/7 com app fechado NÃO está habilitada nesta versão; exigiria credenciais/worker de servidor para escrever com segurança no workspace.
