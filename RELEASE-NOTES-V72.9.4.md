# Scout Intelligence V72.9.4 — Monitoramento final e goleiros

## Objetivo
Fechar a última rodada funcional antes da fase de testes, com foco em pesquisa/seleção no Monitoramento e estatísticas específicas para goleiros.

## Monitoramento
- Filtros visuais por nível: Série A, Série B, Série C, Série D e Base.
- Subfiltros da Base: Sub-23, Sub-20, Sub-17 e Sub-15.
- Filtros combináveis por posição, clube, idade, nota mínima, prioridade e status.
- Combinações como `Série D + ZAG`, `Base + EXT` e `Série A + GR`.
- Contadores por nível e posição.
- Filtros rápidos: sem avaliação, sem vídeo, sem jogo completo, sem fonte, contrato em até 6 meses e pronto para diretoria.
- Seleção de todos os atletas filtrados e criação de lista executiva.
- Exportação de todos, filtrados ou selecionados em CSV e PDF.
- Menu compacto de ações por atleta.
- Filtros salvos passam a preservar também os novos critérios.

## Estatísticas de goleiro
- Novo campo estruturado `goalsConceded` / Gols sofridos.
- Ao selecionar posição GR, o resumo principal passa a exibir Gols sofridos.
- O formulário rápido calcula Gols sofridos por jogo.
- Temporadas passam a aceitar Gols sofridos separadamente de Gols marcados.
- Painel de temporada do goleiro prioriza total de gols sofridos, gols sofridos/jogo e gols sofridos/90.
- Tabela de temporadas altera G para GS e G/90 para GS/90 quando o atleta é goleiro.
- CSV aceita a coluna `gols_sofridos`.
- Importação assistida reconhece `gols sofridos`, `goals conceded`, `goals against`, `GA` e `GS`.

## Compatibilidade
Não há migração obrigatória do Firestore. Registros antigos continuam válidos. Para goleiros antigos, o campo novo será preenchido quando o scout salvar/atualizar os números.
