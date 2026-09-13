# Testes recomendados — V74.0.1

## Dashboard / iPad

- Entrar com conta cujo e-mail não tenha nome humano e confirmar que o e-mail não aparece na saudação.
- Configurar assinatura/nome do responsável e conferir a saudação.
- Configurar escudo e conferir a exibição no cabeçalho.
- Confirmar que, com fila 0, o painel mostra 0% e “Montar plano”.

## Plano do dia

- Após sincronização dos atletas, abrir o seletor em “Todas” e confirmar opções.
- Filtrar por 3 posições diferentes.
- Adicionar um atleta, salvar uma avaliação e conferir conclusão.
- Testar “Amanhã” e “Remover”.

## Analyzer

- Exportar tarefa `scout.analyzer.job.v1`.
- Abrir no Analyzer Local V2.2.0.
- Processar um highlights curto e exportar `scout.analysis.v3`.
- Importar no Scout, revisar evidências e criar rascunho de avaliação.
- Confirmar que highlights não recebe nota automática.

## Validação estática executada

- 52 scripts inline verificados com `node --check`: 0 erros.
- IDs HTML duplicados: 0.
- `manifest.json`: JSON válido.
- `sw.js`: sintaxe JavaScript válida.

Não foi executado teste E2E real de Firestore nem processamento Gemini neste ambiente.
