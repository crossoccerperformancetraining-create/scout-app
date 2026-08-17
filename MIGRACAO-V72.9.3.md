# Migração — V72.9.3

1. Faça backup pela Central 1.0.
2. Substitua `index.html`, `sw.js` e `manifest.json` no mesmo commit.
3. Não altere as regras atuais do Firestore para esta versão.
4. Aguarde o GitHub Pages concluir o deployment.
5. Atualize com `Ctrl + Shift + R`.
6. Confirme V72.9.3 / 1.2.9.3 / build 2026.08.07-3.

## Cache
O Service Worker usa `scout-intelligence-v72-9-3-productivity`, provocando a renovação do cache anterior.

## Dados novos
A versão pode gravar `sourcePreferences` na ficha do atleta quando o usuário definir preferência de fonte no painel rápido. O campo é opcional e não interfere nos registros antigos.

Favoritos e filtros salvos são preferências locais do navegador e ficam em `localStorage`.
