# Migração para V72.9

1. Faça backup completo pela Central 1.0.
2. Substitua todos os arquivos do pacote no repositório do GitHub Pages.
3. Confirme que `index.html`, `sw.js` e `manifest.json` foram atualizados no mesmo commit.
4. Aguarde o deployment do GitHub Pages.
5. Atualize com `Ctrl + Shift + R`.
6. Caso o navegador mantenha a versão anterior, remova o service worker e limpe os dados do site uma única vez.

## Banco e Firebase

- Não há migração obrigatória de documentos existentes.
- Novos metadados de vídeo são opcionais e compatíveis com registros anteriores.
- A pesquisa do YouTube não grava a chave da API no Firestore ou no repositório.
- As ações em lote usam as permissões já existentes de funil, projetos e aprovações.
