# Teste rápido do backend

Depois do deploy:

```bash
curl https://SUA-URL.a.run.app/health
```

Resposta esperada:

```json
{
  "ok": true,
  "service": "Scout Video Intelligence",
  "version": "73.0.0",
  "model": "gemini-3.5-flash",
  "firebaseAuth": true,
  "youtube": "public-only"
}
```

O endpoint de análise exige um Firebase ID token e é chamado automaticamente pelo aplicativo.
