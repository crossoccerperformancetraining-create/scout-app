# CONECTAR AO FRONTEND V73.1.26

O frontend atual já tem o conceito de backend seguro do Video Intelligence.

## Endpoint base

Salve apenas:

```text
https://SEU-SERVICO.a.run.app
```

O frontend/backend usam:

- `/health`
- `/v1/analyze-youtube`
- `/v1/rewrite-scout-text`

## Ordem de homologação

1. `/health`
2. `Qualificar com IA` do Relato Técnico
3. análise de 1 jogo completo
4. revisão humana
5. salvar avaliação
6. gerar PDF
7. confirmar que evidência e relato continuam coerentes

## Não mexer no PDF agora

Durante esta fase, alterações de frontend ficam limitadas a bug de integração.
As próximas melhorias entram depois da homologação do backend.
