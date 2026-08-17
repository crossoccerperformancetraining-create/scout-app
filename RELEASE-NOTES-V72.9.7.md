# Scout Intelligence V72.9.7 — correção crítica e fechamento executivo

## Correção de abertura
- Corrigido `v713MaybeAutoTour is not defined`.
- O tour só é chamado depois de estar carregado.
- O loader é encerrado antes da inicialização visual protegida, evitando tela girando indefinidamente quando uma rotina secundária falha.

## Encaixe tático automático
O antigo percentual manual deixa de ser a referência principal.

O encaixe passa a ser calculado por:
- atributos ofensivos;
- atributos defensivos;
- atributos físico/mentais;
- pesos diferentes por posição;
- formação principal;
- pressão;
- altura da linha;
- construção;
- estilo de ataque.

O campo no editor é somente leitura e recalcula ao alterar posição ou atributos. Atleta sem atributos suficientes recebe 0% em vez do antigo 50% padrão.

## Saída para diretoria simplificada
O sistema interno continua detalhado. A saída externa passa a ser escolhida por audiência.

### Diretoria — essencial
- nome, idade, clube, posição e nível;
- recomendação;
- nota;
- encaixe tático automático;
- confiança;
- jogos e minutos;
- duas forças;
- um ponto de atenção;
- próxima ação;
- jogo completo e/ou melhores momentos públicos;
- link da ficha completa quando disponível.

O pacote essencial usa dois atletas por página para reduzir volume.

### Scouting / análise — ampliado
Mantém a versão técnica com mais contexto, fontes, vídeos e evidências.

### Dossiê técnico
Permanece como documento aprofundado para finalistas.

## Regra de produto
A riqueza de dados permanece dentro do Scout Intelligence. Diretoria recebe síntese para decisão; equipe técnica recebe profundidade quando necessário.
