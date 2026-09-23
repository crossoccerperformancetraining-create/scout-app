# Scout Intelligence V75.0.0 — Recruitment Board & DNA Posicional

## Objetivo
Transformar a base crescente de atletas em um fluxo de recrutamento por equipe/projeto, sem duplicar fichas e sem misturar clube de origem com elenco acompanhado.

## Novidades
- Nova aba **Recruitment Board**.
- **Dashboard geral** com todos os atletas vinculados a boards/projetos, filtros por equipe, posição, status e busca.
- **Dashboard por equipe** com candidatos separados do elenco oficial.
- Status por relação atleta × equipe: Para analisar, Em análise, Aguardando decisão, Aprofundar, Monitorar, Aprovado, Contratado e Descartado.
- Pool geral sem equipe para manter atletas monitorados mesmo sem projeto específico.
- Necessidades do elenco por posição, vagas, prioridade e subperfil.
- Mapa visual de candidatos por posição para reuniões.
- Integração com o Plano de Análises do Dia.
- Ao salvar uma avaliação de candidato em Para analisar/Em análise, o board muda apenas para **Aguardando decisão**; nenhuma decisão esportiva é tomada automaticamente.
- Contratado pode ser encaminhado para **Integrar ao elenco**, usando a ficha já existente.
- **DNA Posicional** configurável por equipe e posição.
- Checklist na avaliação com estados: Observado / Ainda observar / Não aplicável.
- Cobertura da observação e próxima observação sugerida a partir dos critérios ainda não vistos.
- Backup V75 inclui Recruitment Board, necessidades e DNA local/cloud quando disponíveis.

## Critérios posicionais iniciais
Baseados nas referências visuais fornecidas: goleiro, zagueiro, lateral, volante, meia, extremo/atacante de lado e centroavante, com ações técnicas e táticas específicas por função.

## Segurança metodológica
"Observado" significa somente que o critério foi visto na amostra. Não significa que o atleta executou bem e não gera nota, aprovação, contratação ou descarte automaticamente.

## Persistência
O board salva localmente primeiro e tenta sincronizar coleções Firestore `recruitmentBoard`, `recruitmentNeeds` e `recruitmentDna` quando as regras do workspace permitem. Não considerar sincronização entre dispositivos garantida até homologar as regras reais.
