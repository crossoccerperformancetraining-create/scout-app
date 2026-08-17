# Scout Intelligence V73.1.21 — Texto do Sistema + Relato do Scout

## Correção principal
O bloco **Texto que o sistema pode usar** agora é salvo como parte própria da avaliação.

O texto exibido na tela passa a ser o mesmo texto recuperado no histórico e utilizado no PDF.

## Persistência do Relato Técnico
A normalização das avaliações agora preserva os campos criados pelo Relato Técnico Assistido:
- original;
- corrigido;
- humanizado;
- versão selecionada;
- modo selecionado;
- evidências confirmadas;
- assistente utilizado.

Isso corrige o caso em que o relato podia existir no banco, mas desaparecer ao reabrir a ficha.

## Histórico
A avaliação pode exibir:
1. **Texto que o sistema pode usar**;
2. **Parecer da avaliação**, somente quando houver um texto diferente;
3. **Relato Técnico do Scout • Confirmado**.

## PDF
### Individual
Exibe:
- Texto que o sistema pode usar;
- Relato Técnico do Scout;
- Síntese para decisão.

### Comparativo / Lista Geral
A primeira página de cards permanece igual.

A página qualitativa usa **2 atletas por página**, dando mais espaço para:
- texto objetivo do sistema;
- relato técnico confirmado;
- síntese para decisão.

### Relatório completo
Mantém a página ampliada com os textos completos, contexto e evidências.
