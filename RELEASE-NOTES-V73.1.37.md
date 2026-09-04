# Scout Intelligence V73.1.37 — Card e Relatório Unificados

## Correções
- Corrige a quebra de HTML/JavaScript que fazia código aparecer abaixo do relatório público e da apresentação.
- Restaura o fechamento correto da janela TV/Apresentador.
- Ficha pública usa o mesmo snapshot executivo do Card: nota, adequação, potencial, confiança e encaminhamento não divergem.
- Ficha pública passa a exibir todos os atributos numéricos publicados, com barras e notas.
- Forças e pontos a desenvolver são derivados do mesmo conjunto de atributos do card.
- Leitura do scout é preservada como bloco próprio.
- Acessos rápidos mostram Melhores momentos, Jogo completo, Números/fonte e Perfil externo quando realmente disponíveis.
- YouTube `youtube.com/live/...` é reconhecido pelo player interno.
- QR do Card permanece na ficha pública por padrão.
- CSS de impressão evita quebrar cards/blocos no rodapé ao imprimir/salvar PDF pelo navegador.
- Elementos internos (Analista IA, apresentações e controles) são ocultados na ficha pública.

## Regra de consistência
Card Executivo, ficha pública e compartilhamento passam a usar um `executiveSnapshot` publicado junto com a ficha. O snapshot congela as métricas apresentadas naquele compartilhamento e evita que o topo mostre 0% enquanto o resumo mostra outra nota.
