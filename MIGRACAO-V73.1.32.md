# Publicação V73.1.32

## Scout
Substitua:
- index.html
- sw.js
- manifest.json

## Vercel
O frontend deve ser estático.

Não deixe na raiz do projeto Vercel:
- package.json do Video Intelligence;
- server.js;
- Dockerfile do backend.

Esses arquivos pertencem ao Cloud Run.

Use `vercel.json` da V73.1.32 e mantenha `index.html` na raiz.

Após o novo deployment:
1. abra `https://scout-app-liard.vercel.app`;
2. a página deve carregar o Scout, não `Cannot GET /`;
3. faça Ctrl + Shift + R;
4. confira V73.1.32.
