# Migração para V75.2.0

1. Faça um backup completo na versão atual.
2. Substitua o `index.html` pelo arquivo V75.2.0.
3. Publique normalmente no frontend estático.
4. No Windows, use `Ctrl+Shift+R`; em PWA/mobile, feche e reabra o aplicativo.
5. Abra **Clube & Mercado → Página do clube**.
6. Crie uma temporada, por exemplo `Mercado 2027`.
7. Sincronize a lista atual do clube e confirme os contadores.
8. Crie uma Reunião de Mercado, salve decisões e aplique ao Board somente depois de conferir.

A V75.2.0 preserva a chave local `scout_v750_recruitment_<workspace>`, portanto os dados da V75.0/V75.1 permanecem compatíveis. Os novos campos são adicionados ao mesmo objeto de estado.

A sincronização de `recruitmentMarket/main` depende das regras reais do Firestore. Se não houver permissão, a função permanece local e o restante do app continua operacional.
