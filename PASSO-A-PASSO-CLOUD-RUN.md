# PASSO A PASSO — CLOUD RUN — V73.2.0

## 0. Pré-requisitos

Você precisa:
- Google Cloud CLI (`gcloud`);
- projeto Google Cloud/Firebase do Scout;
- uma chave da Gemini API;
- permissão para Cloud Run, Cloud Build, Artifact Registry e Secret Manager.

## 1. Abra a pasta do backend

Descompacte o ZIP e entre na pasta que contém:
- `server.js`
- `package.json`
- `Dockerfile`

## 2. Autentique

```bash
gcloud auth login
gcloud auth application-default login
```

## 3. Defina o projeto

```bash
gcloud config set project SEU_PROJECT_ID
```

Confira:

```bash
gcloud config get-value project
```

## 4. Ative APIs

```bash
gcloud services enable   run.googleapis.com   cloudbuild.googleapis.com   artifactregistry.googleapis.com   secretmanager.googleapis.com
```

## 5. Crie o segredo da Gemini

Primeira vez:

```bash
printf '%s' 'SUA_CHAVE_GEMINI' | gcloud secrets create scout-gemini-api-key --data-file=-
```

Se o segredo já existe:

```bash
printf '%s' 'SUA_CHAVE_GEMINI' | gcloud secrets versions add scout-gemini-api-key --data-file=-
```

## 6. Deploy

Troque:
- `SEU_FIREBASE_PROJECT_ID`
- `https://SEU-USUARIO.github.io`

```bash
gcloud run deploy scout-video-intelligence   --source .   --region southamerica-east1   --allow-unauthenticated   --timeout=900   --concurrency=2   --cpu=2   --memory=2Gi   --max-instances=3   --set-secrets GEMINI_API_KEY=scout-gemini-api-key:latest   --set-env-vars GEMINI_MODEL=gemini-3.7-flash,REQUIRE_FIREBASE_AUTH=true,FIREBASE_PROJECT_ID=SEU_FIREBASE_PROJECT_ID,ALLOWED_ORIGINS=https://SEU-USUARIO.github.io
```

A opção `--allow-unauthenticated` deixa o navegador alcançar o Cloud Run.
Os endpoints sensíveis continuam exigindo Firebase ID token.

## 7. Copie a URL

Exemplo:

```text
https://scout-video-intelligence-xxxxx.a.run.app
```

## 8. Teste a saúde

```bash
curl https://SUA-URL.a.run.app/health
```

Esperado:

```json
{
  "ok": true,
  "service": "Scout Video Intelligence",
  "backendVersion": "73.2.0",
  "frontendCompatibleFrom": "73.1.26",
  "model": "gemini-3.7-flash"
}
```

## 9. Conecte ao Scout

No Scout:

**Configurar → Video Intelligence — Backend seguro**

Cole somente a URL base, sem `/health`.

Exemplo:

```text
https://scout-video-intelligence-xxxxx.a.run.app
```

Depois:
1. Testar conexão;
2. Salvar ajustes;
3. abrir um atleta;
4. cadastrar um jogo completo autorizado;
5. executar `Analisar com IA`.

## 10. Primeiro teste recomendado

Não comece com uma final ou um vídeo crítico.

Use:
- 1 atleta;
- 1 jogo completo autorizado;
- camisa conhecida;
- posição correta;
- adversário e competição preenchidos.

Revise:
- identificação contextual do alvo;
- timestamps;
- eventos;
- limitações;
- notas sugeridas;
- relato final.

Só depois habilite uso operacional amplo.
