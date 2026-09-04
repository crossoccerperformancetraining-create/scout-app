# Migração V73.1.35

No repositório `crossoccerperformancetraining-create/scout-app`:

1. Substitua o `index.html` da raiz pelo `index.html` deste pacote.
2. Substitua `manifest.json`.
3. Substitua `sw.js`.
4. Mantenha os demais assets já existentes (ícones, logos, CSV/XLSX etc.).
5. Publique no Vercel/GitHub conectado.
6. Após o deploy, faça `Ctrl+Shift+R` uma vez para invalidar a versão anterior do service worker.

## Teste mínimo
- Abra um jogo completo cujo link seja `youtube.com/live/...` e confirme o player.
- Teste também `drive.google.com/file/d/.../view` quando houver vídeo autorizado no Drive.
- Card Executivo → Card Interativo → clique em Melhores momentos, Jogo completo, Números/fonte e Ficha/relatório.
- Gere PDF clicável e repita os quatro cliques.
- Escaneie o QR: deve abrir a ficha pública do atleta por padrão.
