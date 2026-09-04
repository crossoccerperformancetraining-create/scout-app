# Scout Intelligence V73.1.36 — Card funcional e links reais

## Correções
- Card Executivo abre com **prévia funcional dentro do Scout**: os quatro recursos são links HTML reais.
- O Card Interativo abre em nova aba sem usar `noopener` na criação da janela (evita retorno `null` em alguns navegadores).
- **Jogo completo** também procura URL em avaliações do tipo `Vídeo completo` e em títulos/notas claramente classificados como partida completa.
- **Melhores momentos** também procura URL em avaliações do tipo `Melhores momentos`.
- **Estatísticas / fonte** respeita a fonte de estatísticas preferida e prioriza página individual do atleta.
- QR continua apontando para a ficha pública por padrão.
- PDF recebe áreas clicáveis com os alvos consolidados.

## Importante
PNG/JPG não contém hyperlinks. Na V73.1.36 o usuário não precisa usar o PNG para navegar: o próprio Card Executivo dentro do Scout é clicável, e HTML/PDF preservam os links.
