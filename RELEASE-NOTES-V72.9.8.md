# Scout Intelligence V72.9.8 — Hotfix de apresentação e Relatórios

## Erro corrigido
A V72.9.7 continha um bloco de JavaScript da prontidão inserido acidentalmente dentro do HTML usado para abrir a segunda tela/TV da apresentação.

Como consequência, o navegador interpretava um `</script>` antes da hora e o restante do JavaScript passava a aparecer como texto na tela. Funções posteriores, como `renderReportCenter`, deixavam de ser registradas, produzindo o erro `renderReportCenter is not defined`.

## Correção
- O bloco `v7296-guided-readiness-script` foi removido do template da TV.
- O mesmo bloco foi recolocado no documento principal, em uma tag `<script>` independente.
- A apresentação volta a abrir sem exibir código-fonte.
- `renderReportCenter` volta a existir normalmente.
- O acesso a Relatórios recebeu uma proteção adicional para não derrubar a navegação caso um renderer opcional falhe.
- Nenhuma regra de prontidão, encaixe automático ou relatório da V72.9.7 foi removida.

## Escopo
Esta é uma correção de estabilidade. Não adiciona novos módulos.
