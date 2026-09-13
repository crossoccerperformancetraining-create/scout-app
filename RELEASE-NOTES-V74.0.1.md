# Scout Intelligence V74.0.1 — Correções finais + Analyzer Ready

## Correções finais do Início

- Saudação não usa mais o prefixo do e-mail como nome do usuário.
- Prioridade da saudação: assinatura/nome do responsável → nome de exibição → clube → workspace → Scout.
- Escudo do clube aparece ao lado da saudação quando configurado.
- Sem fila automática, o progresso fica em 0% e o botão principal leva para o plano do dia, em vez de mostrar 100%.

## Planejamento diário no iPad/mobile

- O seletor de atletas agora acompanha a sincronização tardia do Firestore.
- Enquanto os atletas ainda estão carregando, o campo mostra “Carregando atletas…”.
- A lista é reconstruída após login/sincronização, troca de aba, foco e atualização manual.
- Foi incluído atalho “Atualizar” no próprio campo.

## Video Analyzer / Audit

- Mantidos os 4 modos: atleta/equipe × jogo completo/highlights.
- Badge informa compatibilidade com Scout Video Analyzer Local V2.2.0.
- O contrato continua sendo `scout.analyzer.job.v1` → `scout.analysis.v3` → revisão humana.
- Nenhuma nota ou decisão da IA é aplicada automaticamente.

## Versão

- Scout Intelligence 1.4.0.1
- Build: 2026.09.13-V74.0.1-FINAL-CORRECTIONS-ANALYZER-READY
