# Testes V75.1.0

## Fluxo principal
1. Criar/selecionar ECUS em Equipe & Temporada.
2. Abrir Clube & Mercado.
3. Confirmar que Página do Clube abre como visão principal.
4. Verificar Elenco atual e Lista de scouting em blocos separados.
5. Abrir Ficha completa de um candidato e voltar ao Hub.
6. Adicionar candidato à shortlist como Opção 1/2/Alternativa.
7. Confirmar sua posição no campinho visual.
8. Avaliar atleta e marcar DNA como Observado / Ainda observar / Não aplicável.
9. Voltar ao clube e conferir a cobertura do DNA.
10. Com dois scouts diferentes, conferir o painel de consenso.
11. Confirmar alerta de recência e destaque de highlights.
12. Selecionar uma necessidade e gerar Relatório de mercado PDF.

## Pool geral
- Confirmar que todos os atletas do Recruitment Board continuam visíveis no Pool Geral.
- Confirmar que o mesmo atleta pode pertencer a projetos de clubes diferentes sem duplicar a ficha.

## Persistência
- Recarregar a página e confirmar clube ativo e shortlist.
- Executar backup completo e conferir que `recruitmentBoardV75` continua presente.

## Firestore
- A sincronização de shortlist em `recruitmentHub/main` depende das regras do workspace e deve ser testada no ambiente real.
