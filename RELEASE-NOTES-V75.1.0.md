# Scout Intelligence V75.1.0 — Club Workspace & Recruitment Hub

## Objetivo
Transformar o Recruitment Board em uma operação centrada no clube, mantendo uma ficha única por atleta e separando claramente: elenco atual, lista de scouting do clube e pool geral.

## Principais mudanças
- Recruitment Board passa a se apresentar como **Clube & Mercado**.
- A **Página do Clube** vira a visão padrão ao abrir o módulo.
- Um único login pode alternar entre equipes acompanhadas do mesmo workspace; não é necessário criar um login por clube.
- O clube ativo pode ser definido como página inicial neste navegador.
- O **Pool Geral** continua existindo para concentrar todos os atletas monitorados.
- O DNA não possui mais uma página isolada: a configuração fica dentro da página do clube e a marcação observacional permanece dentro da avaliação do atleta.
- Painel combinado com **Elenco atual** e **Lista de scouting** do clube, sem duplicar fichas.
- **Sala de reunião / Shortlist visual** com Opção 1, Opção 2, Alternativa e Reserva de mercado, sempre definidas manualmente pelo scout.
- **Consenso dos scouts** calculado a partir da última avaliação de cada scout, exibindo quantidade de scouts, média descritiva e dispersão.
- **Validade da observação** mostra recência da última avaliação e sinaliza quando a última amostra foi apenas highlights.
- **Relatório de mercado por necessidade** em PDF, com candidatos, status humano, recência, consenso, cobertura do DNA e parecer registrado.
- O checklist de DNA continua medindo cobertura de observação; não gera nota ou decisão automática.
- Shortlists possuem persistência local e tentativa de sincronização opcional em `recruitmentHub/main` quando o Firestore permitir.

## Princípios preservados
- Uma ficha única por atleta.
- Clube atual/origem não é sobrescrito ao incluir o atleta em um projeto de scouting.
- Status pertence à relação atleta × clube/projeto.
- IA e automações apoiam o processo, mas decisão esportiva continua humana.
