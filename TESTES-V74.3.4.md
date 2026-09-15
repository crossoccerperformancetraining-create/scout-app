# Testes V74.3.4

## Gestão de elenco
- Abrir ECUS em Equipe & Temporada.
- Registrar empréstimo de um atleta e confirmar que ele sai do elenco ativo e permanece no histórico.
- Reintegrar o atleta e confirmar retorno ao elenco.
- Mover atleta para outra equipe criada e confirmar histórico origem → destino.

## Próxima ação
- Abrir atleta, clicar Editar próxima ação, salvar responsável/prazo/ação.
- Voltar para Visão geral e confirmar atualização do card.
- Testar os atalhos sem salvar e confirmar que eles apenas preenchem o modal.

## Gate do relatório
- Com parecer/decisão ausentes, confirmar bloqueio do PDF.
- Com requisitos mínimos preenchidos, confirmar liberação.
- Se houver avisos, confirmar que o sistema pede revisão humana antes de continuar.
- Testar PDF Completo, PDF executivo e criação de versão oficial.

## Analyzer
- Com Analyzer V2.3.0 aberto no Windows, testar Saúde do Analyzer.
- Conferir versão, fila, em andamento e resultados prontos.
- Com Analyzer fechado, confirmar estado Offline / Manual e disponibilidade do fluxo JSON.

## Regressão
- Alternar Visão geral/Elenco ↔ Jogos & Temporada várias vezes.
- Confirmar que não volta o erro Maximum call stack size exceeded.
- Confirmar seleção verde das frases, texto qualificado, Card/PDF e seletor global de atleta.
