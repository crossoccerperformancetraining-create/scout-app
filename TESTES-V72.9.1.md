# Roteiro de testes — V72.9.1

## 1. Publicação e versão

- Confirmar `V72.9.1` no topo.
- Abrir Central 1.0 e confirmar versão `1.2.9.1` e build `2026.08.07-1`.
- Fechar e reabrir o site para validar o service worker novo.

## 2. Teste completo de um atleta

Executar o fluxo: Pesquisa → Perfil → Vídeos → Jogo completo → Avaliação → Funil → Lista curta → Pacote Executivo → Aprovação.

## 3. Vídeos

- Abrir Perfil → Vídeos → Adicionar vídeo.
- Testar Pesquisa e Adicionar por link.
- Pré-visualizar um vídeo sem salvá-lo.
- Adicionar/remover vídeo da fila temporária.
- Salvar um jogo completo com competição, adversário, data, minutos e fonte.
- Confirmar bloqueio de duplicidade.
- Confirmar que vídeo interno não aparece no pacote público.

## 4. Funil

- Testar cada botão de etapa.
- Ativar seleção múltipla e selecionar atletas visíveis.
- Mover em lote para **Validação interna** e confirmar que os atletas permanecem nessa etapa.
- Mover em lote para Análise de vídeo, Observação ao vivo e Avaliação médica.
- Alterar prioridade em lote.
- Adicionar seleção a um projeto/lista.
- Enviar seleção para Pacote Executivo.

## 5. Lista e pacote executivo

- Criar lista com 3 a 10 atletas.
- Ordenar por nota, fit, confiança e nome.
- Conferir os cinco destaques automáticos.
- Gerar PDF e testar links/QR Codes.
- Confirmar links de até três vídeos públicos por atleta.
- Criar página online e abrir em janela anônima.
- Confirmar que conteúdo marcado como interno não é publicado.

## 6. Aprovações e regressão

- Solicitar aprovação em lote.
- Conferir solicitações na aba Aprovações.
- Editar um atleta e garantir que o funil e o projeto continuam íntegros.
- Abrir Modelo de jogo, Inteligência Aplicada e Campinho 2.2.
- Testar desktop e celular.

## Critério de liberação

Liberar a V72.9.1 somente se o fluxo completo não apresentar bloqueios e a Central 1.0 não indicar erro crítico de produção.
