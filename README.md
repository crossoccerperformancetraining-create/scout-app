# Scout Intelligence V72.9.5

Correção de fechamento da V72: relatórios/PDFs resilientes, pré-check executivo, diagnóstico de links online e separação de fonte de dados e fonte de vídeo.

Consulte:
- `RELEASE-NOTES-V72.9.5.md`
- `TESTES-V72.9.5.md`
- `PLANO-V73-VIDEO-INTELLIGENCE.md`

# Scout Intelligence V72.9.4

Versão de fechamento funcional antes da homologação. Consulte `RELEASE-NOTES-V72.9.4.md` e `TESTES-V72.9.4.md`.

# Scout Intelligence V72.9.3

Versão de produtividade, pesquisa e assistência contextual, construída sobre a V72.9.2.

## Publicação

1. Faça backup completo pela Central 1.0.
2. Envie o conteúdo deste pacote para a raiz do GitHub Pages.
3. Confirme que `index.html`, `sw.js` e `manifest.json` foram substituídos no mesmo commit.
4. Aguarde o deployment do GitHub Pages concluir.
5. Atualize com `Ctrl + Shift + R`.

## Principais melhorias

- Pesquisa global por atleta, clube, projeto, vídeo, relatório e tarefa.
- Busca tolerante a pequenos erros e comandos como `posição:ZAG`, `nivel:Base`, `clube:ASA`, `sem:fonte` e `pronto:diretoria`.
- Monitoramento com filtros, favoritos, seleção em lote, comparação e lista executiva.
- Indicador calculado `Pronto para diretoria` com pendências objetivas.
- Sincronização em lote com linha inteira selecionável, filtros adicionais e revisão campo a campo antes de gravar.
- Busca assistida de fonte/ID TheSportsDB, histórico de sincronização e opção de desfazer o último lote da sessão.
- Funil com filtros por clube, fonte, favoritos e prontidão para diretoria.
- Painel rápido do atleta para nível, etapa, prioridade, responsável, prazo e próxima ação.
- Caixa de entrada operacional no Dashboard Executivo.
- Analista IA contextual visível nas principais páginas, com ações específicas por tela.
- Cabeçalho adaptativo com pesquisa, botão Voltar e menu de ações secundárias em telas menores.
- Detecção preventiva de possível atleta duplicado antes de novo cadastro.

## Versão

- Scout Intelligence 1.2.9.3
- V72.9.3
- Build 2026.08.07-3
