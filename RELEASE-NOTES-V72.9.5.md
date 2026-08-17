# Scout Intelligence V72.9.5 — Relatórios resilientes e fechamento da V72

## Correção principal
O PDF executivo e o Pacote Executivo deixam de depender do sucesso da criação de links públicos no Firestore.

Antes, a geração podia ser interrompida se:
- um link público falhasse;
- uma gravação em `publicReports` fosse negada;
- um QR Code não pudesse ser criado;
- a conexão estivesse instável;
- uma rotina auxiliar do PDF falhasse.

Agora:
- o PDF local continua sendo gerado mesmo sem link online;
- links e QR Codes são adicionados somente quando disponíveis;
- falhas online são apresentadas separadamente;
- o pacote informa quantos relatórios online foram criados;
- o usuário pode tentar novamente sem perder o documento.

## Correção técnica do gerador
As rotinas do Centro de Relatórios passam a usar uma função de quebra de texto própria e disponível no mesmo escopo do novo gerador. Isso elimina a dependência de uma função auxiliar que podia estar inacessível em determinadas rotinas executivas.

## Pré-check Executivo
Antes da geração, a tela apresenta:
- gerador de PDF disponível;
- número de atletas selecionados;
- atletas com fonte de dados;
- atletas com avaliação;
- atletas com jogo completo;
- atletas com parecer;
- atletas prontos para diretoria;
- estado do serviço de links online.

Opções:
- tentar links/QR Codes online;
- verificar novamente;
- testar links;
- copiar diagnóstico quando ocorrer erro.

## Relatório individual
Resumo de 1 página e relatório executivo de até 3 páginas:
- geram mesmo sem Firestore;
- mostram aviso no próprio PDF quando o relatório online não estiver disponível;
- preservam estatísticas específicas de goleiro.

## Pacote Executivo
- geração local independente;
- ranking e destaques preservados;
- página por atleta;
- vídeos públicos selecionados;
- QR Code apenas quando existe link;
- falha em um atleta não cancela o pacote inteiro.

## Vídeos e fontes
A interface passa a distinguir explicitamente:
- **Fonte de dados**: estatísticas, temporada, cadastro e informações verificáveis;
- **Fonte de vídeo**: canal/origem do material audiovisual.

Qualidade da fonte de vídeo:
- oficial;
- verificada;
- externa;
- não confirmada.

## Estabilidade
Foram incorporadas as proteções de estabilidade da V72.9.4.1:
- mensagens/toasts mais seguros em telas menores;
- deduplicação de notificações;
- tratamento de erros de cliente sem exibir ruído de abortos normais do navegador;
- inicializações protegidas.

## Próxima fase
A V72 fica funcionalmente congelada após a homologação desta versão. A evolução audiovisual passa a ser planejada como **V73 — Scout Video Intelligence**.
