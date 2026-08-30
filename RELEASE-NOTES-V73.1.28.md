# Scout Intelligence V73.1.28 — Importação Inteligente de Atletas

## Novo fluxo operacional
Na aba Monitoramento aparece **📥 Importar planilha**.

Fluxo:
1. XLSX / XLS / CSV;
2. detecção automática de cabeçalho;
3. leitura de todas as abas;
4. identificação de títulos de posição;
5. normalização dos atletas;
6. diagnóstico Novo / Atualizar / Revisar / Duplicado;
7. revisão manual;
8. importação;
9. envio opcional à Central de Relatórios.

## Campos reconhecidos
- Nome;
- Posição;
- Data/Ano de nascimento;
- Último(s) clube(s);
- Contrato;
- OGol / Perfil externo;
- YouTube / Vídeo;
- Indicação;
- Relatório/Observação;
- Situação.

## Hyperlinks
O importador prioriza o hyperlink real da célula.
Assim células como `OGOL JOAO` ou `VIDEO KAKA` podem trazer a URL verdadeira, mesmo que a planilha mostre somente um texto.

## Nascimento
- `2004` → geração 2004;
- uma data real → DOB + geração;
- `36 ANOS` → fica para revisão;
- não existe conversão automática de idade em ano.

A geração é salva em `birthYear`, sem inventar `01/01`.

## Contrato
Datas Excel são convertidas quando reconhecíveis.
Texto como `LIVRE` é preservado em `importContractRaw`; o sistema não cria uma data falsa.

## Segurança de atualização
Por padrão, uma planilha:
- cadastra novos atletas;
- completa campos vazios dos existentes;
- não substitui campos já preenchidos.

Existe uma opção explícita para sobrescrever dados existentes.

## Pré-relato
O Relatório do Observador pode ser salvo como **Pré-relato importado da planilha**.
Ele não cria Nota, Potencial, Fit ou atributos.

Na Avaliação aparece:
**Usar como relato original**

Depois segue o fluxo:
Pré-relato → Corrigir → Qualificar com IA → Confirmar.

## Central de Relatórios
Com a opção marcada, os atletas processados são selecionados automaticamente para a Central de Relatórios.

## Situação / Funil
Opcionalmente:
- Gostei / Contratação / Prioridade → Validação interna;
- Análise / Dúvida → Análise de vídeo;
- Não interessa → Descartado;
- Contratado → Aprovado.

O texto original da Situação também é preservado.
