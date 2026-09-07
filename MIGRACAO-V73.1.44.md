# Migração para V73.1.44

1. Faça backup na versão atual antes de publicar.
2. Substitua na raiz do frontend: `index.html`, `manifest.json` e `sw.js`.
3. Preserve ícones, modelos e demais assets existentes.
4. Publique no Vercel como frontend estático.
5. No computador faça `Ctrl+Shift+R` uma vez. No iPhone/iPad feche e reabra o PWA.
6. Abra **Saúde & Backup** e execute:
   - Atualizar diagnóstico;
   - Analisar atletas;
   - Verificar links;
   - Executar verificação de produção;
   - Checklist de homologação;
   - Baixar backup completo.
7. Somente depois use **Promover como STABLE**.

A promoção como STABLE é um gate local de homologação; não altera os dados esportivos do workspace.
