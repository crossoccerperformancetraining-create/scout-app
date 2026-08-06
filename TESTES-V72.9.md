# Roteiro de testes — V72.9

## 1. Publicação e cache

- Confirmar `V72.9` no topo e `2026.08.06-2` na Central 1.0.
- Fechar e reabrir o site para validar o novo service worker.

## 2. Pesquisa e triagem de vídeos

- Abrir Perfil do atleta → Vídeos → Adicionar vídeo.
- Confirmar as abas Pesquisar e Adicionar por link.
- Testar busca externa sem chave.
- Informar uma chave restrita da YouTube Data API e pesquisar.
- Pré-visualizar um resultado sem salvá-lo.
- Adicionar e remover itens da fila temporária.
- Selecionar um resultado e confirmar o preenchimento do formulário.
- Salvar um jogo completo com competição, adversário, data e minutos.
- Tentar salvar o mesmo vídeo novamente e confirmar o bloqueio de duplicidade.

## 3. Funil em lote

- Ativar Selecionar atletas.
- Selecionar atletas visíveis e limpar a seleção.
- Alterar etapa e prioridade em lote.
- Adicionar vários atletas a um projeto.
- Ordenar por nota, fit, confiança, prazo e nome.
- Enviar a seleção para o Pacote Executivo.

## 4. Pacote executivo

- Conferir os cinco destaques automáticos.
- Gerar PDF com pelo menos três atletas.
- Testar links de relatório, QR Codes e vídeos públicos.
- Confirmar que vídeos internos não aparecem na página online.
- Criar página online e testar em aba anônima.
- Solicitar aprovações em lote e conferir a aba Aprovações.

## 5. Regressão

- Editar e excluir vídeos antigos.
- Mover um atleta individualmente no funil.
- Abrir projetos, relatórios individuais e Campinho 2.2.
- Testar em desktop, tablet e celular.
