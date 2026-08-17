# Scout Intelligence V73.1.22 — Layout Inteligente + Update Fix

## Comparativo e Lista Geral
Nova opção **Distribuição por página**:
- Automático — evita página com 1 atleta;
- 2 por página — leitura ampliada;
- 3 por página — comparativo tradicional;
- 4 em uma página — compacto 2×2.

### Regra automática
O modo Automático evita distribuições como **3 + 1**.

Exemplos:
- 4 atletas → 2 + 2;
- 5 atletas → 3 + 2;
- 7 atletas → 3 + 2 + 2;
- 8 atletas → 3 + 3 + 2.

O modo 3 por página também redistribui o final quando sobraria apenas 1 atleta.

## Parecer + Relato
As páginas separadas de leitura qualitativa foram removidas do comparativo/lista.

O próprio card do atleta passa a incluir:
- **SISTEMA** — resumo do Texto que o sistema pode usar;
- **SCOUT** — resumo do Relato Técnico confirmado.

Assim informação técnica, radar, parecer e relato permanecem juntos.

O relatório individual/completo continua oferecendo espaço ampliado para os textos completos.

## 4 em uma página
O modo compacto usa grade **2×2**.
Mantém:
- identificação;
- Nota / Encaixe / Potencial;
- radar;
- atributos;
- Sistema;
- Scout;
- acessos rápidos.

## Atualizar agora
Corrigido o fluxo de atualização PWA.

O novo Service Worker:
1. baixa a atualização;
2. aguarda confirmação;
3. recebe `SKIP_WAITING` ao clicar **Atualizar agora**;
4. assume o controle;
5. limpa caches antigos do Scout;
6. recarrega com cache-buster;
7. remove o cache-buster da URL após abrir.

Isso elimina a necessidade de usar o menu de três pontos do navegador para efetivar a versão.
