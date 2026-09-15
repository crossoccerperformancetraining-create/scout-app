# Scout Intelligence V74.3.4 — FINAL OPERACIONAL

Entrega de fechamento da linha V74.3 com quatro melhorias operacionais sem alterar o princípio de decisão humana.

## 1. Histórico de movimentações do elenco
- Painel em Equipe & Temporada com entradas, saídas, empréstimos e mudanças de equipe/categoria.
- Nova ação "Registrar movimentação" por atleta.
- A ficha continua única; `squadTeam` controla o elenco acompanhado e `club` permanece separado.
- Histórico é salvo em `squadMembershipHistory` no próprio atleta.

## 2. Próxima ação do atleta
- Card visível na Visão geral com próxima ação, responsável, prazo, prioridade e etapa.
- Usa os campos já existentes do funil: `funnelNextAction`, `funnelOwner`, `funnelDeadline`, `funnelPriority`, `funnelStage`.
- Atalhos para jogo completo, reavaliação e atualização de dados apenas preenchem o modal; o scout confirma antes de salvar.

## 3. Gate do relatório / PDF
- Nova checagem visual antes do PDF Completo, PDF executivo e criação de versão oficial.
- Bloqueios: parecer não confirmado, ausência de avaliação incluída, decisão não definida e URLs com formato inválido.
- Avisos: falta de fonte, vídeo, confiança documental abaixo de 60% e próxima ação ainda não definida.
- O gate não cria fatos nem decisões; somente impede publicação incompleta.

## 4. Saúde do Analyzer Local
- Painel na aba Video Analyzer / Audit com estado online/offline, versão, fila, jobs e token.
- Teste direto do endpoint local e acesso rápido à coleta de resultados.
- JSON manual permanece como fallback, especialmente em iPad/celular.

Analyzer Local permanece V2.3.0; o contrato `scout.analysis.v3` não mudou.
