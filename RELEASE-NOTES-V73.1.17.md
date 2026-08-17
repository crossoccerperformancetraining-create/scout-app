# Scout Intelligence V73.1.17 — Relato Técnico Assistido

## Novo bloco na Avaliação
**Relato Técnico do Scout**

O scout pode escrever ou ditar o relato, gerar uma versão corrigida e uma versão humanizada, e escolher qual texto será usado no parecer final.

## Fluxo
- Seu relato original;
- Falar relato;
- Corrigir texto;
- Qualificar com IA;
- Usar original;
- Usar corrigido;
- Usar versão IA;
- Confirmar evidências sugeridas.

O original é sempre preservado.

## IA textual
Quando o backend configurado oferecer `POST /v1/rewrite-scout-text`, o app usa essa rota.

Se a rota ainda não existir, o app produz uma versão assistida local e informa isso claramente. Não há falsa indicação de que o backend analisou o texto.

## Evidências
O sistema pode sugerir fortalezas e pontos a desenvolver encontrados no próprio relato. O scout confirma manualmente.

Essas sugestões não alteram automaticamente Nota, Potencial, DNA ou atributos.

## PDF
Quando uma avaliação marcada para PDF possui uma versão narrativa selecionada, o relatório individual/completo prioriza esse texto na leitura executiva.
