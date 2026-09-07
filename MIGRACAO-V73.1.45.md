# Migração para V73.1.45

1. Faça um backup completo na V73.1.44 antes da publicação.
2. Substitua na raiz do frontend:
   - `index.html`
   - `manifest.json`
   - `sw.js`
3. Preserve logos, ícones, planilhas, documentos e demais assets existentes.
4. Publique no Vercel.
5. No computador, execute `Ctrl+Shift+R` uma vez.
6. No iPhone/iPad/Android, feche e reabra o PWA após a atualização.
7. Confirme que, após o login, a primeira tela é **Início**.
8. Teste a fila do dia, `Analisar próximo`, agenda, pendências de dados e resumo diário.
9. Execute novamente `Saúde & Backup` antes de promover a V73.1.45 como STABLE.
