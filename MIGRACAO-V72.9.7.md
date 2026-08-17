# Migração V72.9.7

Substitua no mesmo commit do GitHub Pages:
- `index.html`
- `sw.js`
- `manifest.json`

Depois:
1. aguarde o deployment;
2. faça `Ctrl + Shift + R`;
3. confirme **V72.9.7 / 1.2.9.7**;
4. teste primeiro a abertura da ficha;
5. teste o Encaixe tático automático;
6. gere um pacote em **Diretoria — essencial**.

Não há migração obrigatória do Firestore. O campo `tacticalFit` continua compatível para snapshots antigos; as leituras atuais são recalculadas a partir dos atributos e do Modelo de Jogo.
