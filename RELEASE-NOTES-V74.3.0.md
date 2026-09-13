# Scout Intelligence V74.3.0 — Operação Total de Vídeo & Evidência

Esta versão consolida as três etapas planejadas da V74 em uma única entrega operacional, mantendo o princípio: **a IA localiza evidências e sugere leitura; o scout confirma, ajusta ou rejeita**.

## V74.1 — ponte + timeline + cobertura
- Ponte local opcional com Scout Video Analyzer Local V2.3.0 em `127.0.0.1:8765`, protegida por token.
- Envio direto de `scout.analyzer.job.v1` no Windows e busca automática do `scout.analysis.v3` quando pronto.
- JSON manual preservado como fallback, principalmente em iPad/celular.
- Linha do tempo clicável de evidências por timestamp.
- Cobertura observacional por domínio. Cobertura mede o que foi observado no material, **não qualidade esportiva**.
- Gate do relatório antes de transformar a revisão em avaliação oficial.

## V74.2 — lacunas + comparação + evolução
- “O que ainda preciso observar?” por posição.
- Próxima observação recomendada e opção de mandar o atleta para o plano do dia seguinte.
- Comparação de até 3 atletas por função/subperfil baseada em evidências, sem ranking automático.
- Evolução longitudinal por evidências revisadas.
- Controle humano explícito de identidade: Confirmada / Provável / Incerta.

## V74.3 — coordenação + equipe em lote + projetos
- Dashboard de coordenação com revisões pendentes, gate pronto, identidade incerta, ponte e atletas sem avaliação em 30 dias.
- Análise de equipe em lote: quando o Analyzer identifica um atleta do elenco com confiança, o Scout pode derivar uma revisão individual; nada vira avaliação oficial automaticamente.
- Dossiês de mercado/projeto que referenciam fichas existentes sem duplicar jogadores.
- Tarefa manual exportada pelo Scout passa a incluir o elenco do jogo quando disponível, permitindo atribuição individual conservadora no Analyzer.
