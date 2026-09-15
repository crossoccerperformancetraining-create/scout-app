# Migração V74.3.4

1. Faça backup da versão atual antes da troca.
2. Substitua o `index.html` pela V74.3.4.
3. Publique no mesmo projeto Vercel/static atual.
4. No Windows use Ctrl+Shift+R. Na PWA, feche e reabra.
5. Não apague a base Firestore nem o localStorage: equipes, jogos, planos e preferências continuam usando as estruturas já existentes.
6. O Analyzer Local pode continuar em V2.3.0.

Observação: movimentações novas usam campos adicionais no documento do atleta (`squadMembershipHistory`, `squadMembershipStatus`, `squadPreviousTeam`, `squadLoanTeam`, datas relacionadas). A restauração continua sendo por mesclagem.
