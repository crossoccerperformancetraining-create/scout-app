# Migração para V74.0.1

1. Faça backup no Scout atual.
2. Substitua `index.html`, `manifest.json` e `sw.js` na raiz estática do frontend.
3. Preserve ícones, logos, modelos e demais assets existentes.
4. Publique no Vercel.
5. No iPad/iPhone, feche e reabra a PWA/aba; se necessário, faça recarga completa.
6. Abra Início e confirme:
   - saudação sem o e-mail de login;
   - seletor de atletas preenchido;
   - adicionar atleta ao plano do dia;
   - progresso correto quando não há fila automática.
7. Abra Video Analyzer / Audit e teste a ponte com o Analyzer Local V2.2.0.

A V74.0.1 não altera dados esportivos existentes nem exige migração de schema.
