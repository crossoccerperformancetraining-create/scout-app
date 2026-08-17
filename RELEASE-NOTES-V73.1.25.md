# Scout Intelligence V73.1.25 — Deduplicação + Texto Completo

## Histórico sem duplicação
Quando **Parecer da avaliação** contém o mesmo conteúdo do **Relato Técnico do Scout**, o bloco duplicado deixa de ser exibido.

A comparação ignora diferenças de:
- maiúsculas/minúsculas;
- acentos;
- pontuação;
- espaços extras.

Isso também corrige avaliações antigas que foram gravadas quando o relato ainda ocupava o campo de parecer.

## Texto completo no PDF
O **Texto que o sistema pode usar** e o **Relato Técnico do Scout** deixam de usar corte por quantidade fixa de linhas.

O PDF adapta a tipografia progressivamente para manter o conteúdo integral no espaço disponível.

## Síntese para decisão
A Síntese não copia mais frases do relato.

Ela passa a usar apenas:
- Nota;
- Encaixe;
- Potencial;
- Encaminhamento.

Exemplo:
`Nota 7.0/10 • Encaixe 68% • Potencial 4/5. Encaminhamento: Manter em análise.`

## Origem do relato
O histórico identifica:
- ORIGINAL;
- CORRIGIDO;
- IA HUMANIZADA;
- CONFIRMADO.
