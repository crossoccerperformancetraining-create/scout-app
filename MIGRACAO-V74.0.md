# Migração para V74.0

1. Preserve uma cópia da V73.1.50 e faça backup completo do workspace.
2. Publique `index.html`, `manifest.json` e `sw.js` desta pasta.
3. Preserve logos, ícones, planilhas e demais arquivos já existentes no frontend.
4. Faça recarga forçada no Windows (`Ctrl+Shift+R`) e feche/reabra o PWA em iPad/celular.
5. Confirme no menu **Video Analyzer / Audit** a versão V74.0.
6. Para o primeiro teste, importe `EXEMPLO-scout-analysis-v3-joao.json`.
7. Revise as evidências e leituras da IA; finalize a revisão e, se o atleta estiver vinculado, crie o rascunho de avaliação.

A coleção Firestore `videoAnalyses` é usada apenas em tentativa de sincronização. Se as regras não permitirem, o módulo mantém a cópia local e informa a indisponibilidade.
