# Testes — Scout Intelligence V73.1.46

## Validação estática executada
- HTML parseado: OK.
- 54 tags `<script>` encontradas: 47 scripts inline validados com `node --check`; 7 bibliotecas externas preservadas.
- Erros de sintaxe JavaScript inline: 0.
- IDs HTML duplicados: 0.
- `manifest.json`: JSON válido.
- `sw.js`: `node --check` OK.
- Versão antiga V73.1.45 / 1.3.1.45 não permanece nos rótulos do arquivo final.

## Presença funcional conferida no código
- Banco inicial por GR / ZAG / LAT / VOL / MEI / EXT / CA.
- Filtro por categoria e busca de frases.
- Favoritos.
- Banco pessoal + exportação JSON.
- Ditado por voz preservado.
- Correção de escrita separada da IA.
- Organização técnica.
- Humanização com backend textual quando disponível e fallback local.
- Síntese executiva.
- Histórico das transformações do relato.
- Persistência extra na avaliação após salvar.
- Card Executivo pode usar a síntese executiva salva.
- Botão “Salvar e concluir análise”.

## Homologação manual recomendada
1. Abrir um zagueiro e criar nova avaliação.
2. Confirmar que “Frases rápidas” filtra ZAG e frases gerais.
3. Adicionar 2 frases e editar manualmente o texto.
4. Ditar uma frase por voz e confirmar que o áudio não é armazenado.
5. Clicar “Corrigir escrita” e comparar com o original.
6. Clicar “Organizar tecnicamente” e conferir que fatos não foram acrescentados.
7. Clicar “Humanizar”, revisar o texto e selecionar a versão apenas se estiver correta.
8. Gerar “Síntese executiva”.
9. Salvar e concluir a análise.
10. Reabrir a mesma avaliação e confirmar que organizado, síntese e histórico continuam presentes.
11. Gerar Card/PDF e conferir a leitura executiva.
12. Voltar ao Início e confirmar atualização da fila do dia.
13. Repetir em iPad/celular verificando rolagem, teclado e botões.
