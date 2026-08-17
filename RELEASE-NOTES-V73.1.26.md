# Scout Intelligence V73.1.26 — Redação de Scout Qualificada

## Correção de texto
O botão **Corrigir texto** passa a fazer mais do que ortografia:
- organiza frases longas do ditado;
- remove palavras repetidas;
- remove pequenas frases duplicadas;
- corrige artefatos comuns de voz;
- melhora conectivos e pontuação;
- preserva o conteúdo factual do scout.

Exemplos tratados:
- `zagueiro com zagueiro` → remove repetição;
- `pela pela` → remove repetição;
- `console construir` → `consegue construir`;
- `finaliza bem a jogada termina bem a jogada` → formulação sem duplicidade.

Quando a posição é lateral, o artefato de voz `alterar agudo` no início pode ser normalizado para `Lateral agudo`.

## IA / humanizada
A versão IA agora recebe instruções explícitas para:
- usar 2 a 4 frases;
- preferir até 110 palavras;
- não repetir substantivos ou a mesma ideia;
- juntar informações redundantes;
- preservar nomes, clubes, competições e fatos;
- não inventar qualidades ou fragilidades;
- não usar frases genéricas de preenchimento.

A resposta do backend também passa por uma limpeza final de repetição antes de ser mostrada.

## Profundidade
Foi corrigido um erro conceitual importante.

**Busca de profundidade** não é automaticamente um ponto a desenvolver.

Agora:
- `busca/ataque à profundidade` → evidência positiva;
- `dificuldade no controle da profundidade` → ponto de atenção.

Um ponto a desenvolver só é criado quando o relato contém uma avaliação negativa explícita.

## Sugestões de evidência
Foram ampliadas:
- Ataque / busca de profundidade;
- Cruzamento;
- Apoio por dentro;
- Construção / primeira fase;
- além dos critérios já existentes.
