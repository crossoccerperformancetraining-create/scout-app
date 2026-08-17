# Scout Intelligence V73.1 FINAL — Publicação

## Padrão visual
Os quatro formatos de PDF permanecem no padrão visual aprovado da apresentação/TV:
1. Diretoria — 1 página;
2. Scouting — até 3 páginas;
3. Dossiê técnico;
4. Lista curta / pacote executivo.

A identidade configurada do clube solicitante é aplicada automaticamente.

## Leitura assistida pela IA
A nova versão inclui uma leitura curta e humanizada baseada na análise automática de vídeo.

O bloco **só aparece quando a análise é considerada válida**:
- status da análise IA = `ready`;
- pelo menos 3 evidências avaliáveis;
- confiança geral mínima de 35%;
- cobertura diferente de `uncertain`;
- resumo real retornado pela análise.

Quando essas condições não forem atendidas, Diretoria, Scouting e Lista Curta simplesmente não exibem uma leitura IA. No Dossiê, é informado que ainda não existe análise válida.

A leitura mostra também:
`IA • N evidências • confiança X% • sujeito à revisão do scout`

## Onde aparece
- Diretoria: leitura curta.
- Scouting: leitura curta junto da análise ampliada.
- Dossiê: leitura IA e limitações de avaliação.
- Lista curta: leitura por atleta somente quando aquele atleta possui vídeo válido; a capa recebe síntese IA apenas se houver atletas com análise válida.

## Integridade
- Nenhum heatmap é inventado.
- Timeline depende de evidências registradas.
- Nota IA depende de análise IA real.
- Parecer e decisão humanos continuam prioritários.
