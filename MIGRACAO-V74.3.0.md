# Migração V74.0.1 → V74.3.0

1. Faça backup completo no Scout atual.
2. Substitua `index.html`, `manifest.json` e `sw.js` na raiz estática do frontend.
3. Preserve ícones, logos, modelos XLSX/CSV e demais assets existentes.
4. Publique no Vercel como frontend estático.
5. No desktop use `Ctrl+Shift+R`. No iPad/PWA feche e abra novamente.
6. Instale/atualize o **Scout Video Analyzer Local V2.3.0** no Windows.
7. No Analyzer, abra **Ponte Scout V74**, copie o token e cole no Scout em **Video Analyzer / Audit → Ponte automática**.
8. Teste `Testar ponte`. Se o navegador/ambiente bloquear a ponte local, continue usando Exportar tarefa / Importar JSON; nenhuma função crítica depende exclusivamente da ponte.

## Persistência
- Análises continuam em `scout_v740_video_audit_v1_<workspace>` e tentativa de coleção Firestore `videoAnalyses` quando as regras permitirem.
- Configuração/token da ponte ficam apenas no navegador atual.
- Dossiês de mercado V74.3 ficam em armazenamento local do workspace e podem ser exportados em JSON.
- O plano diário continua no armazenamento local por workspace/data.
