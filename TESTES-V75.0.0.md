# Testes V75.0.0

## Teste funcional recomendado
1. Recruitment Board → adicionar um atleta ao Pool geral.
2. Adicionar o mesmo atleta ao ECUS e confirmar que o clube de origem não muda.
3. Criar necessidade `VOL`, prioridade alta, 1 vaga.
4. Vincular dois candidatos à necessidade.
5. Abrir Dashboard ECUS e conferir pipeline e mapa por posição.
6. Enviar um candidato para o Plano de hoje.
7. Abrir avaliação e marcar parte do DNA como Observado, parte como Ainda observar e um item como N/A.
8. Salvar a avaliação e confirmar que o candidato passa de Para analisar/Em análise para Aguardando decisão.
9. Alterar manualmente para Monitorar/Aprofundar/Aprovado.
10. Em Aprovado, mover para Contratado e usar Integrar ao elenco.
11. Fazer backup e conferir que dados V75 constam no arquivo.

## Testes estáticos executados
- Parse HTML.
- Verificação de IDs duplicados.
- `node --check` em todos os scripts inline.

## Não testado neste ambiente
- Fluxo E2E em navegador real com a base do usuário.
- Permissões reais Firestore para `recruitmentBoard`, `recruitmentNeeds` e `recruitmentDna`.
- Sincronização real Windows ↔ iPad.
