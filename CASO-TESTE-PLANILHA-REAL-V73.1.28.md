# Caso de teste — planilha real recebida

Arquivo analisado durante o desenvolvimento:
`RELAÇÃO ATLETAS ECUS E OBSERVAR(1).xlsx`

## Estrutura encontrada
### ATLETAS- ECUS
Cabeçalho:
NOME | POSIÇÃO | DATA DE NASC | ULTIMO CLUBE | YOUTUBE | OGOL | OBSERVAÇÃO

Atletas explícitos reconhecíveis no arquivo:
- Luan Labiuc
- Luiz Fernando - Índio
- Luis Gabriel
- Moyses Nascimento
- Lucas Porto
- Kawwan
- Vinicius Molina

### ATLETAS OBSERVAR
Cabeçalho:
NOME | POSIÇÃO | DATA NASC. | ULTIMOS CLUBES | CONTRATO ATUAL | OGOL | VÍDEO YOUTUBE | INDICAÇÃO | RELATÓRIO DO OBSERVADOR | SITUAÇÃO

Exemplos úteis para homologação:
- Kaka — contrato armazenado como número/data Excel;
- João Rocha — OGol em hyperlink;
- Yuri Rodrigues Santos Solis — relatório técnico textual;
- Gerson Lima — OGol + vídeo em hyperlinks;
- David Lazari — `36 ANOS`;
- Bruninho — `29 ANOS`;
- Felipe Sussai da Silva — YouTube como URL visível.

## Regra de segurança
`36 ANOS` e `29 ANOS` não são convertidos automaticamente em ano de nascimento.
