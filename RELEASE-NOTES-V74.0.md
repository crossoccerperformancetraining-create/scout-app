# Scout Intelligence V74.0 — Video Analyzer + Audit Scout

Base: V73.1.50 Planejamento Diário.

## Entregue
- Nova aba **Video Analyzer / Audit**.
- Quatro modos: Atleta + jogo completo, Atleta + highlights, Equipe + jogo completo e Equipe + highlights.
- Exportação de tarefa `scout.analyzer.job.v1` para o Scout Video Analyzer Local.
- Importação compatível com `scout.video_analysis.v2` e `scout.analysis.v3`.
- Normalização de evidências/timestamps, confiança de identificação/ação/contexto, limitações e leitura sugerida.
- Revisão humana item a item: **Confirmar / Ajustar / Rejeitar**.
- Itens sem evidência vinculada ficam sinalizados; confirmação exige ação explícita do scout.
- Proteção específica para highlights: sem consistência de 90 minutos, ausência de erros ou nota definitiva.
- Rascunho de avaliação somente após revisão humana; notas técnicas, confiança e decisão continuam humanas.
- Vínculo auditável da avaliação ao `analysis_id` e IDs de evidência após o scout salvar a avaliação.
- Exportação de revisão `scout.analysis.review.v1`.
- Persistência local e tentativa opcional de sincronização Firestore em `videoAnalyses`; falha de permissão não bloqueia o uso local.
- Botão de acesso ao V74 no painel Video Intelligence do atleta.

## Limite intencional
O frontend não tenta executar automaticamente um aplicativo local nem envia um MP4 do computador ao navegador. O handoff com o Analyzer Local é feito por JSON. A sincronização Firestore depende das regras reais do workspace e deve ser homologada em produção.
