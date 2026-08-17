# Scout Intelligence V72.9.1 — Estabilização

## Objetivo

Consolidar a V72.9 antes da fase final de testes, corrigindo inconsistências de versão e um erro identificado na ação em lote do Funil de Contratação.

## Correções

- Corrigida a opção **Validação interna** nas ações em lote do funil: agora usa o estágio `validation`, igual ao restante do sistema.
- Adicionada compatibilidade defensiva para registros antigos que eventualmente usem o valor `internal` no estágio do funil.
- A atualização em lote de etapa passa a registrar `funnelUpdatedAt`, mantendo o mesmo campo usado pelas movimentações individuais.
- Versão interna do aplicativo atualizada para `1.2.9.1`; diagnósticos, backups e relatórios deixam de identificar incorretamente a aplicação como `1.2.4`.
- Build atualizado para `2026.08.07-1`.
- Rodapés dos PDFs e identificação do modo apresentação atualizados para V72.9.1.
- Pesquisa do YouTube passa a solicitar também vídeos sindicáveis quando a API oferece esse filtro, reduzindo resultados inadequados para incorporação.
- Cache do service worker renovado para evitar reaproveitamento da versão anterior.

## Mantido sem alteração de banco

- Pesquisa e triagem de vídeos.
- Jogos completos e metadados audiovisuais.
- Seleção múltipla no funil.
- Projetos e listas curtas.
- Pacote executivo e página online.
- Aprovações em lote.
- Firebase/Firestore e documentos existentes.

## Versão

- Produto: Scout Intelligence 1.2.9.1
- Release: V72.9.1
- Build: 2026.08.07-1
