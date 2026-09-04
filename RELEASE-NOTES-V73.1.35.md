# Scout Intelligence V73.1.35 — Player + Card + Links + QR da ficha

## Correções principais

1. **Pré-análise / jogo completo**
   - YouTube `youtube.com/live/...` agora é reconhecido como YouTube e abre no player incorporado quando o próprio vídeo permite embed.
   - Mantém `watch?v=`, `youtu.be`, `shorts` e `embed`.
   - Adiciona player para links de arquivo do **Google Drive** (`/file/d/.../view` → `/preview`).
   - Adiciona suporte a Vimeo, Streamable e Dailymotion.
   - Quando o provedor realmente não permite incorporação, o botão **Abrir externamente** continua disponível.

2. **Card Executivo**
   - Novo **Card Interativo**, com os quatro recursos realmente clicáveis.
   - Novo **HTML Interativo** para salvar/abrir o card mantendo hyperlinks.
   - PDF vertical e horizontal continuam clicáveis.
   - PNG permanece imagem; por definição, não possui hyperlink nos botões.

3. **Recursos do card**
   - `Melhores momentos` usa o vídeo correspondente vinculado à ficha.
   - `Jogo completo` usa o vídeo `full-match` vinculado à ficha.
   - `Números / fonte` respeita primeiro a fonte definida em `sourcePreferences.stats`; depois usa a melhor fonte ativa, temporada ou link externo cadastrado.
   - `Ficha / relatório` usa o link público da ficha.

4. **QR Code**
   - O destino padrão agora é **Ficha do atleta / relatório público**.
   - O modo automático também prioriza a ficha antes de fonte e vídeos.
   - Se a ficha pública não puder ser criada, o QR não é silenciosamente redirecionado para o Google.

## Observação importante
PNG/JPG é uma imagem estática. Não existe hyperlink embutido em áreas da imagem. Para botões funcionais, use **Card Interativo**, **HTML Interativo** ou **PDF clicável**.
