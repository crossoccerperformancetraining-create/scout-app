# Scout Video Intelligence Backend V73.2.0

Backend seguro para a fase de Video Intelligence do Scout Intelligence.

## Incluído nesta primeira etapa

- `GET /health`
- `GET /v1/capabilities`
- `POST /v1/analyze-youtube`
- `POST /v1/rewrite-scout-text`
- Firebase ID token no backend
- CORS limitado ao GitHub Pages
- Gemini 3.7 Flash por padrão
- JSON estruturado
- timestamps + IDs de evidência
- notas sugeridas por dimensão
- limitações / não avaliável
- redação humanizada do Relato Técnico do Scout

## Regra de produto

A análise automática é uma pré-análise.
Ela não substitui confirmação humana e não deve inventar:
- ações;
- métricas;
- minutos;
- fragilidades;
- estatísticas;
- identificação facial.

## Entrada de vídeo nesta etapa

URL de YouTube processável pela API Gemini.

Use somente conteúdo que o clube/usuário esteja autorizado a analisar.

Arquivos privados do clube e Cloud Storage entram na etapa seguinte.
