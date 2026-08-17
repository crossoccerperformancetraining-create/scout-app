# Scout Intelligence V73.1.1 — Final de homologação

## Fontes de dados
- Google foi renomeado para **Pesquisa web (Google)** para não parecer uma fonte estatística validada.
- Cada fonte pode ser **Manual / referência** ou **Sincronizável pelo backend**.
- O modo sincronizável só é aceito para provedores que já possuem conector no app.
- TheSportsDB e football-data.org continuam identificados como conectores.
- Fontes como oGol, Sofascore, Transfermarkt, federação e clube podem ser usadas como referência/conferência.

## Status de atualização
Cada fonte recebe:
- **Atualizada**: conferida/sincronizada nos últimos 14 dias;
- **Revisar**: 15–30 dias;
- **Desatualizada**: mais de 30 dias;
- fonte nunca conferida entra como **Revisar**.

O app também apresenta um **indicador interno de confiabilidade das fontes**. Ele é apenas um indicador operacional do Scout Intelligence; não é uma certificação externa da fonte.

## Automação futura
A estrutura já guarda `syncMode`.
Quando o backend Cloud Run/conector estiver configurado, fontes suportadas podem evoluir para sincronização automática sem reconstruir o cadastro do atleta.

## PDF adaptativo
O relatório Scouting continua sendo de **até 3 páginas**:
- página 3 só é criada quando há volume suficiente de timeline, fontes, vídeos ou análise IA;
- quando a amostra é pequena, o PDF termina em 2 páginas;
- quando a página 3 existe, ela usa um painel compacto de evidências, saúde das fontes, vídeos, próxima ação e QR.
