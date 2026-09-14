# Testes V74.3.3

## Validação estática executada
- 57 scripts inline verificados com `node --check`.
- 0 erros de sintaxe JavaScript.
- 0 IDs HTML duplicados.

## Homologação funcional recomendada
1. Abrir Equipe & Temporada com ECUS SUZANO selecionado.
2. Alternar 10 vezes entre `Visão geral / Elenco` e `Jogos & Temporada`.
3. Clicar `Atualizar` em ambas as abas.
4. Confirmar que não aparece `Maximum call stack size exceeded`.
5. Criar/abrir um jogo e conferir o elenco.
6. Confirmar que clubes de origem não aparecem como equipes acompanhadas sem terem sido criados manualmente.
7. Confirmar que o seletor superior mostra o nome real do atleta após a sincronização.
8. Abrir uma avaliação e conferir os ✓ verdes das frases selecionadas.
