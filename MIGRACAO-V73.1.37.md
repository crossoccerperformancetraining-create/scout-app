# Migração V73.1.37

1. Substitua `index.html`, `manifest.json` e `sw.js` na raiz do Scout.
2. Mantenha os assets atuais (ícones, logos, planilhas-modelo etc.).
3. Publique a nova versão.
4. No primeiro acesso após o deploy, use `Ctrl+Shift+R` no desktop; no iPad/iPhone feche a aba/PWA e abra novamente.
5. Gere/atualize novamente o link público do atleta para gravar o novo `executiveSnapshot`.

## Teste mínimo
- Card Executivo do mesmo atleta: Nota / Adequação / Potencial conferem com a ficha pública.
- Ficha pública: nenhum JavaScript aparece após o rodapé.
- Ficha pública: seção `Atributos avaliados` aparece com todas as notas publicadas.
- Melhores momentos e Jogo completo abrem o destino correto.
- `youtube.com/live/...` abre no player interno quando o provedor permite incorporação.
- Números/fonte abre a fonte estatística escolhida.
- QR do card abre a ficha pública.
- Impressão/Salvar PDF da ficha não corta o rodapé no meio de um card.
