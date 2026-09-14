# Testes V74.3.2

## Estáticos executados
- V74.3.1 patch: `node --check` OK.
- Patch Parecer/PDF: `node --check` OK.
- Hotfix V74.3.2: `node --check` OK.
- IDs HTML duplicados: 0.
- Hotfix e elementos críticos encontrados no HTML.

## Homologação recomendada no navegador
1. Abrir Equipe & Temporada.
2. Alternar entre Visão geral / Elenco e Jogos & Temporada.
3. Selecionar ECUS Suzano e clicar Atualizar 3 vezes.
4. Adicionar um atleta e fechar/reabrir a tela.
5. Verificar que não ocorre `Maximum call stack size exceeded`.
6. Confirmar seletor superior sem `undefined`.
7. Abrir uma avaliação e testar seleção ✓ verde + montagem de texto qualificado.
8. Gerar/Imprimir PDF e conferir o parecer técnico.

Observação: Firestore, PWA e fluxo real do navegador ainda devem ser homologados no ambiente do usuário.
