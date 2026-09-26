Scout Intelligence V76.0.0 — Permanent Club OS + Tactical Pitch Engine

Principais adições:
- Clube permanente com Club ID interno, clube inicial e restauração automática.
- IDs externos do clube: API-Football, TheSportsDB, football-data, oGol e Transfermarkt.
- Busca e verificação do clube por Gateway (/api/team-search e /api/team-sync).
- Elenco vivo: compara elenco externo com o elenco acompanhado; novos atletas podem ser criados após seleção humana; possíveis saídas nunca são removidas automaticamente.
- Club Inbox e Data Health.
- Campo tático profissional nos dois campinhos, com linhas externas, meio-campo, círculo, grandes/pequenas áreas, marcas de pênalti, meias-luas, escanteios e gols.
- Preserva V75.9 Smart Sync, Router V2, oGol Assistido, Batch Update, Club Manager, Squad Planner e Analyzer.

Publicação no GitHub/Vercel:
1. Substituir index.html, manifest.json e sw.js na raiz.
2. Substituir lib/data-sync-providers.mjs.
3. Substituir api/health.mjs.
4. Adicionar api/team-search.mjs e api/team-sync.mjs.
5. Commit no main e aguardar Vercel Ready.
6. Testar /api/health; deve exibir V76.0.0 Permanent Club OS + Tactical Pitch Engine.

A API_FOOTBALL_KEY existente continua válida. Não é necessário alterar Firebase ou Environment Variables.
