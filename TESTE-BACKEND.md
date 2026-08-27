# TESTE DO BACKEND V73.2.0

## 1. Saúde

```bash
curl https://SUA-URL.a.run.app/health
```

## 2. Capacidades

```bash
curl https://SUA-URL.a.run.app/v1/capabilities
```

## 3. Autenticação

`/v1/analyze-youtube` e `/v1/rewrite-scout-text` exigem token Firebase quando
`REQUIRE_FIREBASE_AUTH=true`.

O Scout V73.1.26 já deve enviar o token ao backend.

## 4. Teste funcional do relato

Na avaliação:
1. escreva um relato;
2. clique `Qualificar com IA`;
3. confirme que a resposta vem do backend;
4. confira se ficou curta, sem repetir ideias e sem inventar fragilidade.

## 5. Teste funcional do vídeo

1. cadastre um jogo autorizado;
2. informe atleta/posição/camisa;
3. rode a análise;
4. confira timestamps e eventos;
5. compare pelo menos 5 lances manualmente;
6. confirme notas somente depois da revisão humana.
