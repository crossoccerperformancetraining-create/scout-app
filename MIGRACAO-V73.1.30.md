# Publicação V73.1.30

## GitHub Pages
Substitua juntos:
- `index.html`
- `sw.js`
- `manifest.json`

Mantenha/adicone:
- `modelo-importacao-atletas-scout.xlsx`
- `modelo-importacao-alertas-scout.xlsx`

Depois use Atualizar agora ou Ctrl+Shift+R.

## Vercel
Use o pacote estático separado `Scout_Intelligence_V73.1.30_VERCEL_STATIC.zip`.

O projeto do frontend deve ser tratado como site estático:
- Framework Preset: Other;
- Root Directory: raiz do projeto;
- Build Command: vazio;
- Output Directory: vazio/raiz;
- não colocar `server.js`, `api/`, `Dockerfile` ou backend do Video Intelligence nesse projeto.

O Video Intelligence deve continuar no Cloud Run e a URL do Cloud Run é configurada dentro do Scout.
