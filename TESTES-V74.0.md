# Homologação V74.0

## Teste A — JSON V3
1. Abra **Video Analyzer / Audit**.
2. Selecione um atleta compatível.
3. Importe `EXEMPLO-scout-analysis-v3-joao.json`.
4. Confirme que aparecem 8 evidências com timestamps e confiança separada.
5. Confira que Highlights exibe o alerta de amostra selecionada.
6. Use **Confirmar observáveis**; revise qualquer item sem evidência separadamente.
7. Finalize a revisão humana.
8. Crie o rascunho de avaliação e confirme que nota técnica/tática/física/mental não é preenchida pela IA.
9. Salve a avaliação manualmente e confirme o vínculo auditável ao `analysis_id`.

## Teste B — JSON V2
Importe `EXEMPLO-scout-video-analysis-v2-joao.json` e confirme que o adaptador converte eventos, strengths, tactical behavior e non-evaluable items.

## Teste C — Preparar tarefa
Teste os quatro modos, escolhendo atleta/equipe e jogo cadastrado. Exporte o JSON e confirme `schema_version: scout.analyzer.job.v1` e `output_contract.schema_version: scout.analysis.v3`.

## Teste D — Mobile/iPad
Abra revisão, role evidências, ajuste um texto, finalize e feche o modal. Verifique que o scroll da página não trava.

## Teste E — Nuvem
Clique **↻ Nuvem**. Se as regras permitirem `videoAnalyses`, confirme leitura/escrita em outro dispositivo. Se não permitirem, confirme que a cópia local continua funcionando e que o erro não bloqueia revisão/exportação.
