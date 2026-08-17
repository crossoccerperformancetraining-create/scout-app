# Migração para Scout Intelligence V72.9.5

## Arquivos a substituir
No mesmo commit do GitHub, substitua:
1. `index.html`
2. `sw.js`
3. `manifest.json`

Use os arquivos da V72.9.5.

## Cache
Novo cache:
`scout-intelligence-v72-9-5-report-resilient`

Após o GitHub Pages concluir:
1. abra o aplicativo;
2. pressione `Ctrl + Shift + R`;
3. confirme **V72.9.5 / 1.2.9.5**;
4. se necessário, feche e abra o PWA uma vez.

## Firestore
Não há migração obrigatória de banco ou regra para gerar PDFs locais.

A criação de páginas/links online continua dependendo da permissão de gravação já usada em `publicReports`. Na V72.9.5, uma falha dessa etapa não deve bloquear o PDF.

## Importante
Primeiro teste a geração com **1 atleta**. Depois teste um Pacote Executivo com **3 a 5 atletas**.
