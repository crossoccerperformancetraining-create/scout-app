
/* ===== V73.1.35 — PLAYER /LIVE + GOOGLE DRIVE + CARD INTERATIVO + QR NA FICHA ===== */
(function(){
  const clean35=v=>String(v??'').trim();
  const valid35=url=>/^https?:\/\//i.test(clean35(url))?clean35(url):'';
  const current35=()=>{try{return db.find(p=>String(p.id)===String(currentId))||null;}catch(_){return null;}};

  /* Player: aceita YouTube /live/, links comuns, Vimeo, Google Drive, Streamable e Dailymotion. */
  function youtubeId35(url){
    try{
      const u=new URL(valid35(url));
      const host=u.hostname.toLowerCase().replace(/^www\./,'');
      if(host==='youtu.be') return u.pathname.split('/').filter(Boolean)[0]||'';
      if(host.endsWith('youtube.com')){
        const parts=u.pathname.split('/').filter(Boolean);
        if(['shorts','embed','live'].includes(parts[0])) return parts[1]||'';
        if(parts[0]==='watch') return u.searchParams.get('v')||'';
        return u.searchParams.get('v')||'';
      }
    }catch(_){ }
    return '';
  }
  function vimeoId35(url){try{const u=new URL(valid35(url));if(!u.hostname.toLowerCase().includes('vimeo.com'))return'';return u.pathname.split('/').filter(Boolean).find(x=>/^\d+$/.test(x))||'';}catch(_){return'';}}
  function driveId35(url){
    try{
      const u=new URL(valid35(url));
      if(!/(^|\.)drive\.google\.com$/i.test(u.hostname))return'';
      const m=u.pathname.match(/\/file\/d\/([^/]+)/i); if(m?.[1])return m[1];
      return u.searchParams.get('id')||'';
    }catch(_){return'';}
  }
  function streamableId35(url){try{const u=new URL(valid35(url));if(!u.hostname.toLowerCase().includes('streamable.com'))return'';const p=u.pathname.split('/').filter(Boolean);return p[0]==='e'?(p[1]||''):(p[0]||'');}catch(_){return'';}}
  function dailymotionId35(url){try{const u=new URL(valid35(url));if(!(u.hostname.includes('dailymotion.com')||u.hostname.includes('dai.ly')))return'';if(u.hostname.includes('dai.ly'))return u.pathname.split('/').filter(Boolean)[0]||'';const m=u.pathname.match(/\/video\/([^_/?]+)/);return m?.[1]||'';}catch(_){return'';}}

  window.v73135MediaInfo=function(url,startValue=''){
    const clean=valid35(url), start=(typeof v711Seconds==='function'?v711Seconds(startValue):0);
    if(!clean)return{url:'',provider:'',embed:'',start};
    const yt=youtubeId35(clean); if(yt)return{url:clean,provider:'youtube',embed:`https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}?rel=0&playsinline=1&start=${Math.max(0,start||0)}`,start};
    const vm=vimeoId35(clean); if(vm)return{url:clean,provider:'vimeo',embed:`https://player.vimeo.com/video/${encodeURIComponent(vm)}${start?`#t=${start}s`:''}`,start};
    const gd=driveId35(clean); if(gd)return{url:clean,provider:'google-drive',embed:`https://drive.google.com/file/d/${encodeURIComponent(gd)}/preview`,start};
    const st=streamableId35(clean); if(st)return{url:clean,provider:'streamable',embed:`https://streamable.com/e/${encodeURIComponent(st)}`,start};
    const dm=dailymotionId35(clean); if(dm)return{url:clean,provider:'dailymotion',embed:`https://www.dailymotion.com/embed/video/${encodeURIComponent(dm)}`,start};
    return{url:clean,provider:'external',embed:'',start};
  };
  try{v711YouTubeId=youtubeId35;}catch(_){ }
  try{v711MediaInfo=window.v73135MediaInfo;}catch(_){ }

  function loadAnalysisPlayer35(video,start=''){
    const stage=document.getElementById('v7210-analysis-player');if(!stage)return;clearElement(stage);
    const info=window.v73135MediaInfo(video?.url||'',start);
    if(info.embed){
      const frame=document.createElement('iframe');frame.src=info.embed;frame.title=video?.title||'Vídeo do atleta';
      frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
      frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';stage.appendChild(frame);
    }else{
      const box=document.createElement('div');box.className='v7210-analysis-player-empty';
      box.innerHTML='<strong style="display:block;margin-bottom:8px">Player incorporado indisponível para este link</strong><span>Use “Abrir externamente”. YouTube (inclusive /live/), Vimeo, Google Drive, Streamable e Dailymotion são reconhecidos automaticamente quando o link permite incorporação.</span>';
      stage.appendChild(box);
    }
  }
  try{v7210LoadAnalysisPlayer=loadAnalysisPlayer35;}catch(_){ }

  /* Fonte de números: respeita a fonte de estatísticas escolhida; depois usa fonte ativa / temporada / link externo cadastrado. */
  function sources35(player){try{return (getPlayerDataSources(player||{})||[]).filter(s=>s?.active&&valid35(s.url));}catch(_){return[];}}
  function statsSource35(player){
    try{
      const list=sources35(player),pref=String(player?.sourcePreferences?.stats||'');
      const explicit=list.find(s=>String(s.id)===pref); if(explicit)return explicit;
      const fold=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      const score=s=>{const u=String(s.url||'').toLowerCase(),f=fold(`${s.label||''} ${s.provider||''}`);let n=0;
        if(/\/jogador\/|\/player\//.test(u))n+=80;if(/estat|jogos|stats|statistics|numeros/.test(f+' '+u))n+=40;
        if(s.primary)n+=25;if(/\/equipe\/|\/equipa\/|\/team\/|\/grupo\//.test(u))n-=60;return n;};
      const ranked=[...list].sort((a,b)=>score(b)-score(a));if(ranked[0])return ranked[0];
      const seasons=(typeof getPlayerSeasonRecords==='function'?getPlayerSeasonRecords(player||{}):[]).filter(s=>valid35(s?.sourceUrl));
      if(seasons[0])return{url:seasons[0].sourceUrl,label:seasons[0].sourceName||seasons[0].competition||'Números / fonte',provider:'season'};
      const ext=valid35(player?.extLink);if(ext)return{url:ext,label:'Fonte cadastrada',provider:'external'};
    }catch(_){ }
    return null;
  }
  function videos35(player){
    try{const out=[],seen=new Set();(normalizePlayerVideos(player||{})||[]).forEach(v=>{const url=valid35(v?.url);if(!url||seen.has(url))return;seen.add(url);out.push({...v,url});});return out;}catch(_){return[];}
  }
  function targets35(data,player){
    const vids=videos35(player),src=statsSource35(player);
    const preferred=vids.filter(v=>v.visibility==='public'&&v.includeInPdf), pub=vids.filter(v=>v.visibility==='public');
    const pool=preferred.length?preferred:(pub.length?pub:vids);
    return{
      highlights:valid35(data?.links?.highlights)||valid35(pool.find(v=>v.type!=='full-match')?.url)||valid35(vids.find(v=>v.type!=='full-match')?.url),
      full:valid35(data?.links?.full)||valid35(pool.find(v=>v.type==='full-match')?.url)||valid35(vids.find(v=>v.type==='full-match')?.url),
      source:valid35(src?.url)||valid35(data?.links?.source),
      sourceLabel:src?.label||data?.links?.sourceLabel||'Números / fonte',
      report:valid35(data?.publicLink)||valid35(data?.links?.profile)
    };
  }
  function selectedQr35(){return document.getElementById('v73135-card-qr-target')?.value||document.getElementById('v73134-card-qr-target')?.value||'report';}
  function resolveQr35(data,player){
    const t=targets35(data,player),mode=selectedQr35();
    if(mode==='report')return{url:t.report,label:'Ficha do atleta',mode:'report'};
    if(mode==='source')return{url:t.source,label:t.sourceLabel,mode:'source'};
    if(mode==='highlights')return{url:t.highlights,label:'Melhores momentos',mode:'highlights'};
    if(mode==='full')return{url:t.full,label:'Jogo completo',mode:'full'};
    if(t.report)return{url:t.report,label:'Ficha do atleta',mode:'report'};
    if(t.source)return{url:t.source,label:t.sourceLabel,mode:'source'};
    if(t.highlights)return{url:t.highlights,label:'Melhores momentos',mode:'highlights'};
    return{url:t.full,label:'Jogo completo',mode:'full'};
  }
  window.v73135ResolveTargets=targets35;
  window.v73134ResolveQr=(data,player)=>resolveQr35(data,player);

  const cardBase35=window.v73127CardDataFromPlayer;
  if(typeof cardBase35==='function'){
    window.v73127CardDataFromPlayer=async function(player,item={}){
      const data=await cardBase35.apply(this,arguments);if(!data)return data;
      data.links=data.links||{};const t=targets35(data,player),vids=videos35(player);
      data.links.highlights=t.highlights||'';data.links.full=t.full||'';data.links.source=t.source||'';data.links.sourceLabel=t.sourceLabel||'Números / fonte';
      data.links.videos=vids.map(v=>({url:v.url,title:v.title||'Vídeo',type:v.type||'video'}));return data;
    };
  }

  const ensure35=window.ensurePublicShareLink;
  window.v73134PrepareCardData=async function(){
    const p=current35();if(!p)throw new Error('Selecione um atleta.');
    let report='';try{if(typeof ensure35==='function')report=await ensure35();}catch(_){ }
    const data=await window.v73127CardDataFromPlayer(p,{reportUrl:report});data.publicLink=valid35(report)||valid35(data?.publicLink)||'';
    const q=resolveQr35(data,p);data.qrTarget=q.url||'';data.qrLabel=q.label||'Ficha do atleta';
    try{data.qrData=data.qrTarget&&typeof createQrDataUrl==='function'?await createQrDataUrl(data.qrTarget):'';}catch(_){data.qrData='';}
    return data;
  };

  function rects35(format){
    if(format==='horizontal'){const W=1920,H=1080,pad=44,readingW=W-pad*2-318-18,bottomY=824,resW=readingW,step=(resW-54)/4,rw=step-6;return{W,H,resources:[0,1,2,3].map(i=>({x:pad+18+i*step,y:bottomY+48,w:rw,h:74})),qr:{x:pad+readingW+18,y:bottomY,w:300,h:154}};}
    return{W:1080,H:1350,resources:[0,1,2,3].map(i=>({x:60+i*168,y:1015,w:154,h:88})),qr:{x:776,y:964,w:210,h:180}};
  }
  function safe35(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'').toLowerCase()||'atleta';}

  async function renderPrepared35(format='horizontal'){
    const prepared=await window.v73134PrepareCardData();const prev=window.v73127CardDataFromPlayer;window.v73127CardDataFromPlayer=async()=>prepared;
    try{if(typeof window.v73130RenderExecutiveCardCanvas!=='function')throw new Error('Renderizador do card indisponível.');return await window.v73130RenderExecutiveCardCanvas(format);}finally{window.v73127CardDataFromPlayer=prev;}
  }

  /* PDF: botões e QR clicáveis; QR da ficha por padrão. */
  window.v73134GenerateExecutiveCardPdf=async function(format='horizontal'){
    if(!window.jspdf?.jsPDF){alert('O gerador PDF ainda está carregando.');return;}
    const progress=document.getElementById('v73127-progress');if(progress){progress.style.display='block';progress.textContent='Gerando Card PDF clicável...';}
    try{
      const p=current35();if(!p)throw new Error('Selecione um atleta.');const rendered=await renderPrepared35(format),data=rendered.data||await window.v73134PrepareCardData(),canvas=rendered.canvas;
      const {jsPDF}=window.jspdf,landscape=format==='horizontal';const doc=new jsPDF({orientation:landscape?'landscape':'portrait',unit:'pt',format:[canvas.width,canvas.height],compress:true});
      doc.addImage(canvas.toDataURL('image/jpeg',.94),'JPEG',0,0,canvas.width,canvas.height);const r=rects35(format),t=targets35(data,p),urls=[t.highlights,t.full,t.source,t.report];
      r.resources.forEach((box,i)=>{if(urls[i])try{doc.link(box.x,box.y,box.w,box.h,{url:urls[i]});}catch(_){ }});
      const q=resolveQr35(data,p);if(q.url)try{doc.link(r.qr.x,r.qr.y,r.qr.w,r.qr.h,{url:q.url});}catch(_){ }
      doc.save(`card_executivo_clicavel_${safe35(data.name)}_${format}.pdf`);if(progress)progress.textContent='Card PDF criado: recursos clicáveis e QR apontando para a ficha.';
      showToast?.('Card PDF clicável criado','Melhores momentos, jogo completo, números/fonte e ficha foram vinculados.','success',6500);
    }catch(error){console.error('Card PDF V73.1.35:',error);if(progress)progress.textContent=`Não foi possível gerar o Card PDF: ${error?.message||'erro inesperado'}`;}
  };

  function liveHtml35(canvas,data,format,p){
    const r=rects35(format),t=targets35(data,p),q=resolveQr35(data,p),links=[t.highlights,t.full,t.source,t.report],labels=['Melhores momentos','Jogo completo','Números / fonte','Ficha / relatório'];
    const area=(box,url,label)=>url?`<a href="${url.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" target="_blank" rel="noopener noreferrer" title="Abrir ${label}" style="position:absolute;left:${box.x/r.W*100}%;top:${box.y/r.H*100}%;width:${box.w/r.W*100}%;height:${box.h/r.H*100}%;display:block;border-radius:10px;outline:2px solid transparent"></a>`:'';
    const overlays=r.resources.map((b,i)=>area(b,links[i],labels[i])).join('')+area(r.qr,q.url,'ficha do atleta');
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Card Executivo — ${String(data.name||'Atleta').replace(/</g,'&lt;')}</title><style>html,body{margin:0;background:#020617;font-family:Segoe UI,Arial,sans-serif}.wrap{width:min(100vw,${r.W}px);margin:auto;position:relative}.wrap img{display:block;width:100%;height:auto}.hint{position:fixed;left:12px;bottom:12px;background:rgba(2,6,23,.92);color:#dbeafe;border:1px solid #2563eb;border-radius:10px;padding:9px 12px;font-size:12px;z-index:5;box-shadow:0 6px 20px #0008}.wrap a:hover{outline-color:#60a5fa;background:#60a5fa18}</style></head><body><div class="wrap"><img src="${canvas.toDataURL('image/jpeg',.94)}" alt="Card executivo">${overlays}</div><div class="hint">Card interativo: clique nos recursos. O QR abre a ficha do atleta.</div></body></html>`;
  }
  window.v73135OpenInteractiveCard=async function(format='horizontal'){
    const win=window.open('','scout-card-interativo','noopener,noreferrer');if(!win){alert('Permita pop-ups para abrir o Card Interativo.');return;}
    try{win.document.write('<p style="font-family:Segoe UI;padding:20px">Gerando card interativo...</p>');const p=current35(),rendered=await renderPrepared35(format),data=rendered.data||await window.v73134PrepareCardData();win.document.open();win.document.write(liveHtml35(rendered.canvas,data,format,p));win.document.close();}catch(error){win.document.body.innerHTML=`<p style="font-family:Segoe UI;padding:20px;color:#b91c1c">Não foi possível gerar o card: ${String(error?.message||error)}</p>`;}
  };
  window.v73135DownloadInteractiveCard=async function(format='horizontal'){
    try{const p=current35(),rendered=await renderPrepared35(format),data=rendered.data||await window.v73134PrepareCardData(),html=liveHtml35(rendered.canvas,data,format,p),blob=new Blob([html],{type:'text/html;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`card_executivo_interativo_${safe35(data.name)}_${format}.html`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}catch(error){alert(`Não foi possível salvar o Card Interativo. ${error?.message||''}`);}
  };

  /* Modal do Card: deixa explícito que PNG é imagem; adiciona card interativo e QR padrão na ficha. */
  window.v73127OpenExecutiveCard=function(){
    if(!current35()){alert('Selecione um atleta.');return;}document.getElementById('v73127-card-modal')?.remove();
    const modal=document.createElement('div');modal.id='v73127-card-modal';modal.className='v73127-modal';modal.style.cssText='position:fixed!important;inset:0!important;z-index:2147483000!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;padding:48px 18px 18px!important;overflow:auto!important;background:rgba(2,6,23,.84)!important';
    modal.innerHTML=`<div class="v73127-modal-card" role="dialog" aria-modal="true"><div class="v73127-modal-head"><div><h3>📸 Card Executivo do Atleta</h3><p>Use o Card Interativo ou o PDF para ter botões clicáveis. O PNG continua disponível para imagem/WhatsApp.</p></div><button class="v73127-close" type="button">×</button></div>
      <div class="v73134-qr-row"><label>Destino do QR do card</label><select id="v73135-card-qr-target"><option value="report" selected>Ficha do atleta / relatório público (recomendado)</option><option value="source">Números / fonte cadastrada</option><option value="highlights">Melhores momentos</option><option value="full">Jogo completo</option><option value="auto">Automático — ficha → fonte → vídeo</option></select></div>
      <div class="v73127-format-grid"><button class="v73127-format v73135-format-live" type="button" data-live="horizontal"><strong>🌐 Card Interativo</strong><small>Abre o mesmo card com Melhores momentos, Jogo completo, Números/fonte e Ficha clicáveis.</small></button><button class="v73127-format v73135-format-live" type="button" data-html="horizontal"><strong>⬇ HTML Interativo</strong><small>Arquivo do card com os quatro recursos clicáveis.</small></button><button class="v73127-format v73134-pdf-btn" type="button" data-pdf="horizontal"><strong>📄 PDF clicável Horizontal</strong><small>Botões e QR com links reais.</small></button><button class="v73127-format v73134-pdf-btn" type="button" data-pdf="vertical"><strong>📄 PDF clicável Vertical</strong><small>Versão para celular com links reais.</small></button><button class="v73127-format" type="button" data-png="horizontal"><strong>⬇ PNG Horizontal</strong><small>Imagem: botões são apenas visuais; QR continua escaneável.</small></button><button class="v73127-format" type="button" data-png="vertical"><strong>⬇ PNG Vertical</strong><small>Imagem: não possui hyperlinks embutidos.</small></button></div>
      <div class="v73135-card-live-note"><strong>Correção V73.1.35:</strong> o QR passa a apontar para a <strong>ficha do atleta</strong> por padrão. O botão Números/fonte usa a fonte cadastrada para estatísticas. Jogo completo e melhores momentos usam os vídeos vinculados à ficha.</div><div class="v73127-progress" id="v73127-progress"></div></div>`;
    modal.querySelector('.v73127-close').onclick=()=>modal.remove();modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
    modal.querySelectorAll('[data-live]').forEach(b=>b.onclick=()=>window.v73135OpenInteractiveCard(b.dataset.live));
    modal.querySelectorAll('[data-html]').forEach(b=>b.onclick=()=>window.v73135DownloadInteractiveCard(b.dataset.html));
    modal.querySelectorAll('[data-pdf]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await window.v73134GenerateExecutiveCardPdf(b.dataset.pdf);}finally{b.disabled=false;}});
    modal.querySelectorAll('[data-png]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await window.v73127GenerateExecutiveCard(b.dataset.png);}finally{b.disabled=false;}});document.body.appendChild(modal);
  };

  setTimeout(()=>{
    try{const badge=document.querySelector('.v7317-hub-badge');if(badge)badge.textContent='V73.1.35 • player /live + card interativo + QR na ficha';}catch(_){ }
    try{document.title=document.title.replace('1.3.1.34','1.3.1.35').replace('V73.1.34','V73.1.35');}catch(_){ }
  },700);
})();
