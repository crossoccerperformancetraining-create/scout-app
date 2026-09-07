# Testes V73.1.47 — Perfil Executivo Final

## Validação estática
- HTML parseado: OK
- IDs HTML duplicados: 0
- Scripts internos verificados com `node --check`: 47
- Erros de sintaxe JavaScript: 0
- `manifest.json`: JSON válido
- `sw.js`: sintaxe válida

## Casos funcionais recomendados
1. Atleta com `dob` completo: exibir idade + `Nasc. AAAA` + altura.
2. Atleta com apenas `birthYear`: exibir o ano como fallback.
3. Atleta sem `dob` e sem `birthYear`: não inferir o ano pela idade.
4. Editar nascimento, salvar e reabrir a ficha: ano deve acompanhar o dado salvo.
5. Testar desktop, iPad e celular para confirmar que o novo texto não quebra o card.
6. Confirmar que Parecer Assistido, Dashboard inicial, Card Executivo, PDF e Equipe & Temporada permanecem funcionais.
