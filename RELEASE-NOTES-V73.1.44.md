# Scout Intelligence V73.1.44 — Finalização STABLE

## Objetivo
Fechar a linha V73 com foco em estabilidade e operação, sem criar um novo módulo esportivo.

## Entregas
- Central de Finalização renomeada para **Saúde & Backup**.
- **Pendências de hoje**: tarefas, aprovações, atletas sem avaliação recente, jogos com cobertura incompleta, profundidade e integridade.
- **Validador de links** para vídeos, fontes, perfil externo e ficha pública.
- Backup schema v2 inclui **Equipe & Temporada**, `teamGames`, metadados locais das equipes e tarefas; dados sensíveis de auditoria/aprovação ficam no arquivo de backup e não são restaurados automaticamente.
- Checklist final ampliado com Equipe & Temporada, links/QR, rolagem mobile/iPad e backup/restauração.
- **Gate STABLE** só libera promoção local quando produção, homologação, backup recente, integridade crítica e links verificados estiverem em condições seguras.
- Certificado JSON de homologação ao promover a versão como STABLE.
- Versão/base corrigidas para `1.3.1.44` / `V73.1.44`.
- Service Worker com cache `scout-intelligence-v73-1-44-stable`.

## Observação sobre links externos
O navegador pode impedir a confirmação automática de status HTTP por CORS. Nesses casos o Scout marca o link para conferência manual em vez de afirmar que está quebrado.
- Gate de integridade também verifica referências órfãs em jogos/equipe e duplicidades operacionais.
- Gate de links exige que a sessão execute a validação quando houver links cadastrados; não considera “não verificado” como aprovado.
