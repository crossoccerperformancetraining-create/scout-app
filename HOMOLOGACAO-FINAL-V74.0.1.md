# Homologação final — Scout Intelligence V74.0.1 + Analyzer Local V2.2.0

## 1. Dashboard no iPad/mobile

1. Entrar no Scout e abrir **Início**.
2. Confirmar que a saudação não exibe o prefixo do e-mail de login.
3. Se houver assinatura/nome do responsável configurado, confirmar o nome na saudação.
4. Se houver escudo configurado, confirmar o escudo no cabeçalho.
5. Com fila automática vazia, confirmar progresso em **0%** e botão **Montar plano**.
6. Em **Meu plano de análises do dia**, aguardar a sincronização e abrir **Todas > Atleta**.
7. Confirmar que os atletas aparecem; adicionar um atleta e abrir a avaliação.

## 2. Ponte com Analyzer Local

1. No Scout, abrir **Video Analyzer / Audit**.
2. Escolher Atleta ou Equipe e Jogo completo ou Highlights.
3. Clicar **Preparar tarefa para Analyzer**.
4. No Analyzer V2.2.0, clicar **Importar tarefa do Scout V74**.
5. Conferir alvo, material e contexto; selecionar MP4 local quando necessário.
6. Processar o vídeo e clicar **Exportar JSON V3 para o Scout**.
7. No Scout, importar o V3 e revisar cada evidência/conclusão: Confirmar, Ajustar ou Rejeitar.
8. Criar rascunho de avaliação e preencher a decisão profissional.

## 3. Regra de aceite

A etapa é considerada homologada quando:

- o e-mail não aparece como nome na saudação;
- o seletor de atletas funciona no iPad após sincronização;
- o planejamento diário aceita e conclui atletas;
- a tarefa V74 abre no Analyzer V2.2.0;
- o V3 volta ao Scout com evidências/timestamps;
- highlights continuam sem nota automática;
- nada entra na avaliação oficial sem revisão humana.

## Validações executadas neste pacote

- Scout: 52 scripts inline, 0 erros de sintaxe; 0 IDs duplicados; manifest e service worker válidos.
- Analyzer: `py_compile` aprovado; `TESTE_BRIDGE_JOB.py` aprovado; `TESTE_ESTRUTURA.py` aprovado.
- Não foi executado neste ambiente um processamento real no Gemini nem teste E2E das regras Firestore.
