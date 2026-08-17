# Release Notes — V72.9.3

## Objetivo
Reduzir navegação repetitiva e transformar listas, sincronização, funil e gestão em fluxos de trabalho orientados a pesquisa, seleção e próxima ação.

## Pesquisa global
- Atalho `/` e botão Pesquisar no cabeçalho.
- Pesquisa local em atletas, projetos, tarefas, relatórios e vídeos.
- Busca tolerante a pequenos erros de digitação.
- Comandos estruturados: posição, nível, clube, ausência de fonte e prontidão para diretoria.

## Monitoramento
- Pesquisa por nome/clube/posição/nível.
- Filtros de nível, saúde da fonte e prontidão para diretoria.
- Favoritos e filtros salvos no navegador.
- Seleção de todos os resultados filtrados, inverter seleção e limpar.
- Comparação rápida e envio para lista/pacote executivo.
- Paginação para bases maiores.

## Sincronização em lote
- Cartão inteiro clicável para seleção.
- Checkboxes maiores.
- Filtros por posição, nível, fonte e prontidão.
- Botões Selecionar filtrados e Inverter.
- Procurar fonte/ID usando o conector TheSportsDB existente.
- Revisão de alterações campo a campo antes da aplicação.
- Campos básicos encontrados pela fonte também aparecem na revisão quando estiverem ausentes localmente.
- Snapshot temporário para desfazer o último lote aplicado durante a sessão.
- Exibição de saúde da fonte, confiança e prontidão.

## Funil e diretoria
- Filtros adicionais por clube, fonte, favoritos e prontidão.
- Indicador de prontidão nos cartões.
- Resumo rápido sem sair do funil.
- Seleção para diretoria permanece integrada ao pacote executivo.

## Painel rápido do atleta
- Nível, etapa, prioridade, responsável, próxima ação e prazo.
- Saúde da fonte e últimas sincronizações.
- Preferência de fonte para estatísticas e contrato/mercado quando houver mais de uma fonte.
- Acesso rápido à busca de fonte/ID e à ficha completa.

## Assistência contextual
- Faixa contextual nas páginas fora do Perfil.
- Ações específicas para Monitoramento, Sincronização, Funil, Projetos, Relatórios, Descoberta, Modelo de Jogo, Vídeos, Tarefas, Notificações, Equipe, Auditoria e Central 1.0.
- Mantém revisão humana e não aplica decisões automaticamente.

## Segurança e dados
- Nenhuma regra do Firestore é alterada nesta versão.
- Campos bloqueados manualmente continuam protegidos durante sincronização.
- xG e xA continuam sem estimativa artificial; somente dados de fonte confiável devem preencher esses campos.
