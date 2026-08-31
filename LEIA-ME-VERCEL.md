# Corrigir o Scout no Vercel — frontend estático

O erro mostrado anteriormente foi:
`500 INTERNAL_SERVER_ERROR / FUNCTION_INVOCATION_FAILED`.

Para este Scout, a rota principal **não precisa ser uma Serverless Function**. O `index.html` deve ser servido como arquivo estático.

## Pacote recomendado
Use `Scout_Intelligence_V73.1.30_VERCEL_STATIC.zip`.

Ele contém somente os arquivos do frontend e não contém backend Node/Cloud Run.

## Configuração do projeto
No Vercel, em Project Settings:
1. Framework Preset: **Other**;
2. Root Directory: raiz;
3. Build Command: deixe vazio;
4. Output Directory: deixe vazio;
5. Install Command: não é necessário para esse pacote estático.

## Arquivos que NÃO devem estar no projeto frontend
- `server.js`;
- pasta `api/` com o backend de vídeo;
- `Dockerfile`;
- credenciais/chaves;
- pacote do Cloud Run.

## Arquivos que devem ficar na raiz
- `index.html`;
- `sw.js`;
- `manifest.json`;
- `vercel.json`;
- `modelo-importacao-atletas-scout.xlsx`;
- `modelo-importacao-alertas-scout.xlsx`.

## Depois do deploy
Abra primeiro:
- `/`
- `/sw.js`
- `/manifest.json`

Se `/` continuar exibindo `FUNCTION_INVOCATION_FAILED`, confirme em Settings > Build and Deployment que o projeto não está apontando para uma função/backend antigo e faça um novo deployment com o pacote estático limpo.

## Observação da conexão atual
O conector Vercel disponível nesta conversa enxerga o time `crossoccerperformancetraining-create's projects`, mas nesse time só retornou o projeto `coachvoice-ai`. Uma busca direta por `scout-app` nesse mesmo time retornou 404. Por isso não foi possível alterar diretamente o deployment `scout-app` visto nas capturas.
