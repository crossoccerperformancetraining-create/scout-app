# Migração para V72.9.1

1. Faça backup completo pela Central 1.0.
2. Substitua os arquivos do pacote no repositório do GitHub Pages.
3. Garanta que `index.html`, `sw.js` e `manifest.json` sejam atualizados no mesmo commit.
4. Aguarde o deployment do GitHub Pages.
5. Abra o sistema e pressione `Ctrl + Shift + R`.
6. Confirme `V72.9.1` no topo e `2026.08.07-1` na Central 1.0.

## Banco e Firebase

- Não há migração obrigatória de documentos.
- Não há alteração necessária nas regras do Firestore nesta versão.
- Registros antigos de funil continuam compatíveis; o valor legado `internal`, se existir, é interpretado como `validation`.
- A chave opcional da YouTube Data API continua armazenada somente na sessão do navegador.
