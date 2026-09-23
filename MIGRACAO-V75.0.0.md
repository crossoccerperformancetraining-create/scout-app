# Migração para V75.0.0

1. Faça um backup completo na versão atual.
2. Substitua o `index.html` pelo arquivo V75.0.0.
3. Preserve os demais assets existentes do deploy (ícones, manifest, service worker, logos e modelos).
4. Publique no ambiente estático/Vercel.
5. No Windows use `Ctrl+Shift+R`; na PWA feche e abra novamente.
6. Abra **Recruitment Board** e teste primeiro com uma equipe já criada, como ECUS.
7. Se o Firestore rejeitar as novas coleções, o board continua localmente; ajuste as regras antes de depender de uso entre dispositivos.

A migração não duplica atletas e não altera automaticamente `club`, `squadTeam`, notas ou decisões existentes.
