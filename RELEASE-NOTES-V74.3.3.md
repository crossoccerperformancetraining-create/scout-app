# Scout Intelligence V74.3.3 — Hotfix Jogos & Temporada

## Correção principal
- Corrige o erro `Maximum call stack size exceeded` ao abrir/atualizar **Equipe & Temporada**, especialmente quando a aba **Jogos & Temporada** estava ativa.
- A causa era uma chamada circular no fluxo V73.1.43: `render43() -> ensureUi43() -> setMode43('games') -> render43()`.
- O modo visual da aba agora é restaurado sem chamar novamente o renderizador durante a própria renderização.

## Gestão de elenco
- O seletor de **Equipe acompanhada** usa apenas equipes criadas manualmente no módulo.
- Clubes de origem das fichas deixam de alimentar automaticamente a lista de equipes acompanhadas.
- Elenco passa a considerar o vínculo `squadTeam`; `Clube atual` permanece separado.
- Jogos/temporada utilizam apenas atletas vinculados ao elenco acompanhado e ativos (`Elenco`, `roster` ou `loan`).

## Seletor global de atleta
- Corrige `undefined` e também o fallback persistente `Atleta 1`.
- O seletor compara os rótulos atuais com os nomes reais carregados e se atualiza assim que a base termina de sincronizar.

## Parecer assistido
- Mantidos: seleção múltipla, ✓ verde, Adicionar selecionadas e Montar texto qualificado.
- Mantidos: parecer na ficha, Card/PDF e relatório oficial conforme a avaliação confirmada.
