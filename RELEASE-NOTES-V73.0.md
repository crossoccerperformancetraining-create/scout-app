# Scout Intelligence V73.0 — Video Intelligence

## Análise automática
A aba Vídeos recebe o botão:
`🤖 Analisar com IA`

Nesta primeira versão automática:
- usa vídeo público do YouTube;
- envia o link ao backend seguro;
- o backend usa Gemini Video Understanding;
- o perfil de análise muda conforme a posição;
- recebe nome, equipe, camisa, adversário, competição e Modelo de Jogo;
- retorna timestamps, evidências, notas sugeridas, confiança e limitações;
- salva o resultado no vídeo;
- permite levar as quatro dimensões sugeridas para a Avaliação.

## Revisão humana
A análise não aprova atleta automaticamente.
Ao enviar para Avaliação, o texto entra como:
`RASCUNHO DA ANÁLISE AUTOMÁTICA — REVISAR E CONFIRMAR`

O scout deve conferir lances determinantes e confirmar/ajustar Técnica, Tática, Física e Mental.

## Rastreamento responsável
O prompt do backend proíbe identificação facial.
A IA deve usar:
- equipe;
- camisa/número quando visível;
- posição/contexto;
- continuidade visual.

Quando não houver segurança, deve classificar a ação como não avaliável.

## Backend
A chave Gemini não é armazenada no HTML ou no Firestore.
O app recebe apenas a URL do serviço Cloud Run.

Código do backend:
`backend-video-intelligence/`

Guia:
`backend-video-intelligence/README-DEPLOY.md`

## Entrada suportada
V73.0 automático: vídeo **público do YouTube**.

Arquivo privado/não listado do clube fica para a próxima evolução de upload autorizado/Cloud Storage.
