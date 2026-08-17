# Scout Intelligence V73.1.24 — Texto Fiel no PDF

## Regra principal
O **Relato Técnico do Scout** passa a ser impresso usando exatamente o conteúdo de `scoutNarrativeSelected`.

O PDF não:
- resume;
- reformula;
- troca palavras;
- seleciona apenas a primeira frase;
- gera uma nova versão.

Se o scout escolheu:
- **Original** → PDF mostra o Original;
- **Corrigido** → PDF mostra exatamente o Corrigido;
- **IA humanizada** → PDF mostra exatamente a versão IA escolhida.

## Identificação da versão
O PDF mostra a origem do texto:
- RELATO DO SCOUT • ORIGINAL;
- RELATO DO SCOUT • CORRIGIDO;
- RELATO DO SCOUT • IA HUMANIZADA.

## Texto do sistema
O campo **Texto que o sistema pode usar** também passa a usar o valor completo salvo na avaliação, sem reduzir à primeira frase.

## Ajuste automático de tipografia
Para manter o texto integral no mesmo card, o PDF reduz a fonte apenas quando necessário.

Isso vale para:
- 2 por página;
- 3 por página;
- Automático;
- 4 em 1 / 2×2;
- relatório individual;
- relatório completo.

Nenhum conteúdo é inventado para preencher espaço.
