# Scout Intelligence V75.2.0 — Temporada de Mercado & Reuniões

Base: V75.1.0 Club Workspace & Recruitment Hub.

## Novidades

- **Temporada de Mercado por clube**: crie janelas como `ECUS • Mercado 2027` sem duplicar atletas.
- Enquanto a temporada estiver **aberta**, candidatos e necessidades do clube podem ser sincronizados automaticamente.
- Ao **encerrar a temporada**, candidatos, necessidades e status são congelados em um snapshot histórico.
- A temporada pode ser reaberta conscientemente; ao reabrir, o snapshot deixa de ser definitivo até novo encerramento.
- **Reuniões de Mercado**: crie uma pauta com data, hora, título e observação.
- A reunião congela a shortlist atual. Se a shortlist estiver vazia, o usuário pode optar por usar os candidatos ativos da temporada.
- Para cada atleta da reunião, o scout registra uma decisão humana: `Manter`, `Pedir novo jogo`, `Avançar contato`, `Aguardar / monitorar` ou `Encerrar análise`.
- **Salvar decisões** não altera o Board. O Board só muda com a ação explícita **Aplicar ao Board**.
- Reuniões podem ser encerradas/congeladas e reabertas conscientemente.
- Dados de temporadas e reuniões usam a mesma estrutura local do Recruitment Hub, portanto entram no backup operacional já existente.
- Tentativa opcional de sincronização Firestore em `recruitmentMarket/main`; em caso de indisponibilidade, a cópia local continua funcionando.

## Princípios preservados

- Uma ficha única por atleta.
- Clube de origem separado do projeto/equipe que está analisando o atleta.
- Status e decisões pertencem ao vínculo atleta × clube/projeto.
- O sistema não escolhe automaticamente o melhor jogador e não altera decisões esportivas sem ação humana.
