# Migração para V75.1.0

1. Faça backup completo na versão atual antes da troca.
2. Substitua o `index.html` pelo arquivo desta versão.
3. Preserve os demais assets do deploy existente.
4. Publique e faça hard refresh (`Ctrl+Shift+R`). Em PWA, feche e abra novamente.
5. Abra **Clube & Mercado** e confirme que a **Página do Clube** é a visão padrão.
6. Selecione o ECUS ou outra equipe criada em **Equipe & Temporada**.
7. Teste Elenco atual, Lista de scouting, shortlist, consenso, DNA integrado e PDF por necessidade.

### Compatibilidade de dados
A V75.1.0 reutiliza o armazenamento `scout_v750_recruitment_<workspace>` e preserva entradas, necessidades e DNA da V75.0.0. Os novos dados de shortlist são acrescentados ao mesmo objeto e, por isso, também entram no backup operacional já existente.

### Login por clube
Esta versão não cria credenciais separadas para cada clube. O desenho recomendado é um único login com alternância de contexto entre equipes do mesmo workspace. Caso diferentes organizações precisem de isolamento real de acesso, isso deve ser feito por membros/permissões de workspace, não por duplicação de fichas ou bancos locais.
