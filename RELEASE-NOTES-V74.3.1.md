# Scout Intelligence V74.3.1 — Gestão de Elenco + Seleção Inteligente + Parecer no PDF

## 1. Gestão de elenco
- **Equipe & Temporada** passa a tratar como equipe acompanhada somente equipes criadas manualmente em `+ Nova equipe`.
- Clubes de origem existentes nas fichas deixam de preencher automaticamente o seletor de equipes acompanhadas.
- O atleta continua com **uma única ficha**: `club` preserva o clube atual/origem e `squadTeam` registra o vínculo com a equipe acompanhada.
- Em `+ Adicionar atleta`, a tela mostra o clube de origem e permite escolher **Elenco atual**, **Contratado — aguardando integração** ou **Emprestado / vínculo temporário**.
- A opção **Atualizar também “Clube atual” da ficha** é explícita e vem desmarcada. Use-a apenas quando a transferência estiver confirmada.
- O histórico do vínculo fica em `squadMembershipHistory`, sem duplicar atletas.
- O modo **Equipe** do Video Analyzer passa a priorizar somente equipes acompanhadas criadas manualmente.

## 2. Parecer assistido — seleção múltipla
- Frases do **Subperfil da função** e de **Frases rápidas do Scout** agora podem ser marcadas antes de entrar no relato.
- Frase selecionada recebe **borda verde + ✓ verde**.
- Nova barra de seleção:
  - Selecionar tudo visível;
  - Limpar;
  - Adicionar selecionadas;
  - **Montar texto qualificado**.
- `Montar texto qualificado` usa somente o relato existente + frases escolhidas, organiza e aciona a humanização. O scout continua comparando Original / Organizado / Humanizado e escolhe a versão final.
- Nenhuma seleção altera nota, atributo, potencial ou decisão automaticamente.

## 3. Parecer na ficha e nos PDFs
- A **Visão geral do atleta** ganhou um bloco `Parecer técnico da última avaliação`, com texto confirmado, data/jogo, scout e status de inclusão no PDF.
- O bloco faz parte da área imprimível do **PDF Completo** do navegador.
- **Card Executivo / Card PDF** passam a preferir a síntese executiva da avaliação; na ausência dela, usam o parecer confirmado.
- O **relatório oficial versionado** congela o parecer confirmado da avaliação no snapshot, em vez de depender apenas do campo legado `conclusion`.
- Avaliações marcadas `includeInPdf = false` continuam fora do fluxo de PDF.

## Versão
- Interface: **Scout Intelligence 1.4.3.1 / V74.3.1**.
