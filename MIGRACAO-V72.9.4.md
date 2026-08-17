# Migração para V72.9.4

## Publicação
Substitua no mesmo commit:
- `index.html`
- `sw.js`
- `manifest.json`

Depois aguarde o GitHub Pages concluir e atualize com `Ctrl + Shift + R`.

## Banco de dados
Nenhuma alteração de regra do Firestore é obrigatória.

Foi introduzido o campo opcional:
- `goalsConceded`: gols sofridos pelo goleiro.

Dados antigos não são apagados nem convertidos automaticamente. Ao editar um goleiro, confira o valor antes de salvar.

## CSV
O modelo de temporadas agora inclui:
`gols_sofridos`

Para jogadores de linha, essa coluna pode permanecer vazia.
