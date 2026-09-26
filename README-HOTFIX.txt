Scout Intelligence V75.8.1 — Hotfix Gateway Permanente + Busca de Atletas

Substituir apenas:
1) /index.html
2) /lib/data-sync-providers.mjs

O que muda:
- O Data Sync Gateway usa automaticamente o mesmo domínio do Scout + /api quando não houver URL salva.
- A busca API-Football tenta o índice global Players/Profiles antes do fallback por temporada.
- Mantém as demais funções V75.8.1 intactas.

Depois do commit, aguarde o deployment Vercel ficar Ready e teste novamente o Aislan.
