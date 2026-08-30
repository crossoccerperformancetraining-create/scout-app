# Deploy — Scout Video Intelligence V73.0

Este backend é necessário para o botão **Analisar com IA**. O `index.html` não recebe nem armazena a chave Gemini.

## O que esta versão faz
- Recebe um **URL público do YouTube**.
- Valida a sessão do usuário com Firebase Auth.
- Envia vídeo + contexto do atleta para Gemini Video Understanding.
- Exige saída JSON estruturada.
- Devolve timestamps, evidências, notas sugeridas, confiança e limitações.
- O navegador salva o resultado no mesmo registro de vídeo do atleta.

## Limite desta primeira versão
A entrada automática direta é para **vídeo público do YouTube**. Para arquivo privado/não listado do clube, use a futura rota de upload autorizado/Cloud Storage. Não coloque a chave Gemini no GitHub Pages.

## Pré-requisitos
- Google Cloud CLI (`gcloud`) autenticado.
- Projeto Google Cloud/Firebase usado pelo Scout.
- Chave Gemini API.
- Permissão para Cloud Run, Cloud Build e Secret Manager.

## 1. Ative serviços
```bash
gcloud config set project SEU_PROJECT_ID

gcloud services enable   run.googleapis.com   cloudbuild.googleapis.com   secretmanager.googleapis.com
```

## 2. Salve a chave Gemini no Secret Manager
```bash
printf '%s' 'SUA_CHAVE_GEMINI' | gcloud secrets create scout-gemini-api-key --data-file=-
```

Se o segredo já existir:
```bash
printf '%s' 'SUA_CHAVE_GEMINI' | gcloud secrets versions add scout-gemini-api-key --data-file=-
```

## 3. Faça o deploy do diretório backend
Entre nesta pasta e execute:

```bash
gcloud run deploy scout-video-intelligence   --source .   --region southamerica-east1   --allow-unauthenticated   --set-secrets GEMINI_API_KEY=scout-gemini-api-key:latest   --set-env-vars GEMINI_MODEL=gemini-3.5-flash,REQUIRE_FIREBASE_AUTH=true,FIREBASE_PROJECT_ID=SEU_FIREBASE_PROJECT_ID,ALLOWED_ORIGINS=https://SEU-USUARIO.github.io
```

`--allow-unauthenticated` permite o navegador alcançar o Cloud Run, mas o endpoint `/v1/analyze-youtube` continua exigindo um **Firebase ID token válido**.

## 4. Copie a URL do Cloud Run
Após o deploy, o terminal exibirá algo parecido com:

```text
https://scout-video-intelligence-xxxxx.a.run.app
```

No Scout:
**Configurar → Video Intelligence — Backend seguro → cole a URL → Testar conexão → Salvar Ajustes.**

## 5. Teste
1. Abra um atleta.
2. Cadastre um vídeo público do YouTube.
3. Na aba Vídeos, clique **🤖 Analisar com IA**.
4. Informe a camisa do atleta, se souber.
5. Clique **Analisar jogo inteiro**.
6. Aguarde o resultado.
7. Clique **Revisar na Avaliação** para conferir/ajustar as notas.

## Segurança
- Restrinja `ALLOWED_ORIGINS` ao domínio real do GitHub Pages.
- Mantenha `REQUIRE_FIREBASE_AUTH=true`.
- Não versionar `.env`.
- Revogue/troque a chave Gemini se ela for exposta.
- A análise é preliminar e deve ser revisada por um scout antes de virar parecer final.
