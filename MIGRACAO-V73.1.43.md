# Migração V73.1.43

Base: V73.1.42.

## O que muda
- A área **Equipe acompanhada** passa a exibir duas visões: **Visão geral / Elenco** e **Jogos & Temporada**.
- Novo cadastro de jogo da equipe com data, adversário, competição, mando, placar, jogo completo, melhores momentos e observações coletivas.
- Escalação/atletas utilizados por partida: titular, minutos, gols e assistências.
- O jogo consegue abrir diretamente a avaliação individual do atleta já com data, competição, adversário, minutos e vídeo preenchidos.
- Dashboard de temporada: campanha, gols, atletas utilizados, minutos e cobertura de avaliações.
- Exportação CSV dos jogos.

## Persistência
- Os jogos tentam sincronizar no workspace em `teamGames`.
- Se a sincronização não estiver disponível, a V73.1.43 mantém uma cópia local no dispositivo e informa o estado na tela.

## Atualização
Substitua o `index.html` pela versão V73.1.43 e faça uma atualização forçada do navegador uma vez.
