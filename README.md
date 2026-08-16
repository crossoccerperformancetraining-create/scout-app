# CoachVoice AI v4.5 — Mentor IA Real

Esta versão corrige o problema de respostas falsas/repetidas.

## Mudanças principais
- O app não esconde mais erros da OpenAI.
- Se a API falhar, o Mentor mostra o erro real na tela.
- O endpoint usa JSON mode para reduzir falhas de parsing.
- O Diagnóstico mostra se a IA REAL está conectada.
- Respostas locais prontas não substituem silenciosamente a IA.

## Possíveis mensagens
- Sem crédito/quota: verificar OpenAI Platform > Billing.
- Chave inválida: gerar outra API key e substituir na Vercel.
- Modelo indisponível: revisar OPENAI_MODEL/modelo padrão.
- Vercel sem variável: revisar OPENAI_API_KEY e Redeploy.

## Publicação
Commit sugerido:
`Corrigir Mentor para IA real e remover fallback falso v4.5`

Teste:
`https://coachvoice-ai.vercel.app/?v=45`

Primeiro teste:
Mentor > Diagnóstico rápido > Testar agora.
A linha **Mentor IA REAL** precisa ficar verde.
