# Scout Intelligence V73.1.47 — Perfil Executivo Final

Base: V73.1.46 — Parecer Assistido Final.

## Ajuste principal
- O cartão de identificação da ficha passa de **IDADE / ALTURA** para **IDADE / NASC. / ALTURA**.
- Quando houver data de nascimento ou `birthYear` válido, mostra por exemplo: **23 anos • Nasc. 2003 • 1,87m**.
- O ano é derivado primeiro da data de nascimento cadastrada; `birthYear` é usado apenas como fallback.
- Quando a data completa existe, ela fica disponível como informação auxiliar no `title`/hover, sem poluir a ficha.
- Quando o nascimento não estiver informado, o trecho de ano fica oculto; o Scout não inventa ano a partir da idade.

## Preservado
- Dashboard operacional de início.
- Parecer Assistido, ditado, frases rápidas, correção, organização, humanização e síntese executiva.
- Card Executivo, PDF, QR, vídeos, Equipe & Temporada, Campinho, decisões e Gate STABLE.
