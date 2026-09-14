# Testes V74.3.1

## Gestão de elenco
1. Abra Equipe & Temporada.
2. Confirme que o seletor mostra somente equipes criadas em `+ Nova equipe`.
3. Crie `ECUS Suzano`.
4. Adicione um atleta cujo clube de origem seja outro.
5. Confirme que o clube de origem permanece igual quando `Atualizar Clube atual` está desmarcado.
6. Confirme que o vínculo com ECUS aparece como equipe acompanhada.

## Seleção inteligente de frases
1. Abra uma avaliação.
2. Marque 2 frases de Subperfil e 2 de Frases rápidas.
3. Confirme borda verde + ✓ em cada frase.
4. Use `Adicionar selecionadas` e confirme que as frases entram uma única vez no relato.
5. Repita usando `Montar texto qualificado` e compare Original / Organizado / Humanizado.

## Parecer e PDF
1. Escolha uma versão final do parecer e salve a avaliação.
2. Volte à Visão geral e confirme o bloco `Parecer técnico da última avaliação`.
3. Gere `PDF Completo` e confirme o parecer na ficha impressa.
4. Gere Card Executivo/PDF e confirme a leitura do scout.
5. Versione um relatório oficial e gere o PDF; confirme o parecer técnico.

## Validação estática realizada
- scripts inline verificados com `node --check`;
- IDs HTML duplicados verificados;
- presença dos patches V74.3.1 verificada.

> Ainda requer homologação funcional em navegador real, impressão/PDF real e Firestore real.
