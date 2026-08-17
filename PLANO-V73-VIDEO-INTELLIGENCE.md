# Plano V73 — Scout Video Intelligence

A V73 será uma fase separada da homologação da V72.

## Objetivo
Transformar vídeo autorizado em evidências rastreáveis para scouting, com IA assistindo o processo sem substituir a revisão humana.

## Tipos de material
### Jogo completo
Maior peso de evidência:
- ações com e sem bola;
- posicionamento;
- transições;
- repetição de comportamentos;
- tomada de decisão;
- aderência ao Modelo de Jogo.

### Melhores momentos
Peso complementar:
- ações técnicas;
- finalizações;
- passes;
- cruzamentos;
- dribles;
- defesas;
- lances destacados.

A confiança deve ser menor porque o vídeo é editado e não mostra todo o contexto.

## Fluxo proposto
1. Selecionar atleta.
2. Enviar/indicar vídeo autorizado.
3. Confirmar clube, adversário, posição e camisa.
4. Escolher perfil de análise por posição.
5. Processamento assíncrono no backend.
6. Linha do tempo de ações sugeridas.
7. Scout aprova, corrige ou descarta cada ação.
8. IA sugere notas.
9. Scout confirma a nota final.
10. Evidências aprovadas alimentam avaliação e relatório.

## Resultado
Exemplo:
- Saída de bola: IA 7,6 / Scout 7,4
- 8 ações observadas
- Confiança 82%
- Evidências 05:42, 21:18, 37:09 e 63:51

## Estados de evidência
- observado;
- parcialmente observado;
- fora do enquadramento;
- não avaliável.

A IA nunca deve inferir negativamente uma ação que não estava visível.

## Por posição
### Zagueiro
Duelos, bolas aéreas, cobertura, profundidade, pressão, saída, passe vertical, condução, perdas e posicionamento.

### Goleiro
Defesas, gols sofridos, 1x1, cruzamentos, saída aérea, profundidade, jogo com os pés, reposição, goleiro-líbero e decisão sob pressão.

Demais posições terão matrizes próprias ligadas ao Modelo de Jogo.

## Arquitetura
A análise real de 90 minutos não deve depender apenas do HTML/GitHub Pages. Requer backend para:
- processamento do vídeo;
- extração de quadros/trechos;
- tracking;
- classificação de eventos;
- execução assíncrona;
- armazenamento de resultados estruturados.

Para vídeo de terceiros, respeitar direitos e permissões. O processamento quadro a quadro deve priorizar material que o clube tenha autorização para analisar.
