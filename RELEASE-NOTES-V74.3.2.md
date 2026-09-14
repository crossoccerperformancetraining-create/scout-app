# Scout Intelligence V74.3.2 — Hotfix de estabilidade

Correção emergencial sobre a V74.3.1.

## Corrigido
- Proteção contra reentrada/recursão no render da tela **Equipe & Temporada**, evitando o erro `Maximum call stack size exceeded` observado após a sincronização da equipe acompanhada.
- Removido o repintamento recursivo usado para forçar a equipe selecionada.
- Seletor superior de atleta agora repara opções vazias ou com texto `undefined` e preserva a seleção válida quando possível.
- Branding final prioriza **V74.3.2 / Scout Intelligence 1.4.3.2**, evitando que rotinas antigas voltem a exibir V74.3.0.

## Preservado
- Gestão de elenco separada do clube de origem.
- Seleção de frases com ✓ verde, seleção em lote e montagem de texto qualificado.
- Parecer técnico na ficha/área imprimível e uso do parecer confirmado em Card/relatório oficial.
- Video Analyzer/Audit e ponte com Analyzer Local V2.3.0 sem alteração de contrato.
