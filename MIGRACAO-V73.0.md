# Migração para V73.0

## GitHub Pages
Substitua no mesmo commit:
- `index.html`
- `sw.js`
- `manifest.json`

## Backend
A V73.0 precisa de um serviço Cloud Run para a análise automática.

1. Abra `backend-video-intelligence/README-DEPLOY.md`.
2. Faça o deploy.
3. Copie a URL do Cloud Run.
4. No Scout, abra:
   `Configurar → Video Intelligence — Backend seguro`
5. Cole a URL.
6. Clique `Testar conexão`.
7. Salve.

Sem backend configurado, todo o restante do Scout continua funcionando e a pré-análise manual permanece como fallback.
