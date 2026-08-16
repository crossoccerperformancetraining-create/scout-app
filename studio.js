const STUDIO_DB_NAME='coachvoice-studio-db';
const STUDIO_DB_VERSION=1;
const STUDIO_STORE='videos';
let studioStream=null,studioRecorder=null,studioChunks=[],studioDraftBlob=null,studioDraftUrl='',studioRecordingStartedAt=0,studioStopTimer=null,studioClockTimer=null,studioSpeechRecognition=null,studioLiveTranscript='';
let studioAudioRecorder=null,studioAudioChunks=[],studioAudioBlob=null;
let studioSelectedObservations=new Set();
let studioLibraryUrls=[];

const studioModeData={
  oratory:{title:'Oratória em vídeo',prompt:'Explique, em até 60 segundos, como sua equipe deve responder depois de uma sequência de resultados ruins.',guide:'Fale olhando para a câmera, use frases curtas e termine com uma ação concreta.',checklist:['Câmera na altura dos olhos','Começo direto','Mãos visíveis','Uma ideia principal','Conclusão com próximo passo']},
  'interview-pt':{title:'Entrevista em português',prompt:'Por que sua equipe voltou a cometer os mesmos erros e o que será diferente no próximo jogo?',guide:'Responda como em uma coletiva: reconheça o tema, assuma responsabilidade e proteja o grupo.',checklist:['Olhar para a câmera','Resposta de 20 a 40 segundos','Sem culpar jogadores','Sem discutir com o jornalista','Próxima ação clara']},
  'interview-en':{title:'Interview in English',prompt:'Your team has not won in four matches. Why should the supporters still believe in your work?',guide:'Use short sentences. Start directly, explain one correction, and finish with the next match.',checklist:['Look at the camera','Short sentences','One main idea','Clear ending','Natural pace']},
  tactical:{title:'Explicação no quadro tático',prompt:'Explique aos jogadores como funcionará a pressão na saída de bola adversária: posição inicial, gatilho, movimento e ação após recuperar.',guide:'Posicione você e o quadro dentro do enquadramento. Aponte sem bloquear o desenho.',checklist:['Treinador e quadro visíveis','Objetivo primeiro','Posição inicial','Gatilho da pressão','Ação após recuperar']},
  locker:{title:'Vestiário e liderança',prompt:'Faça uma mensagem de intervalo para uma equipe que está perdendo por um gol, mas continua competitiva.',guide:'Mantenha a mensagem curta, firme e ligada a comportamentos observáveis.',checklist:['Postura estável','Tom objetivo','No máximo três correções','Proteção do grupo','Fechamento mobilizador']},
  presentation:{title:'Apresentação profissional',prompt:'Apresente-se como novo treinador e explique sua identidade de trabalho em até 60 segundos.',guide:'Diga quem você é, como trabalha e o que espera construir com o clube.',checklist:['Nome e função','Identidade de trabalho','Relação com jogadores','Responsabilidade por resultados','Conclusão positiva']}
};
const studioObservationOptions=['Olhei para a câmera','Mantive as mãos visíveis','Evitei balançar o corpo','Usei gestos com propósito','Mantive o quadro visível','Terminei com clareza'];

function openStudioDB(){return new Promise((resolve,reject)=>{const request=indexedDB.open(STUDIO_DB_NAME,STUDIO_DB_VERSION);request.onupgradeneeded=e=>{const db=e.target.result;if(!db.objectStoreNames.contains(STUDIO_STORE)){const store=db.createObjectStore(STUDIO_STORE,{keyPath:'id'});store.createIndex('createdAt','createdAt');store.createIndex('mode','mode');}};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
async function studioDBPut(record){const db=await openStudioDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STUDIO_STORE,'readwrite');tx.objectStore(STUDIO_STORE).put(record);tx.oncomplete=()=>resolve(record);tx.onerror=()=>reject(tx.error);});}
async function studioDBGetAll(){const db=await openStudioDB();return new Promise((resolve,reject)=>{const request=db.transaction(STUDIO_STORE,'readonly').objectStore(STUDIO_STORE).getAll();request.onsuccess=()=>resolve((request.result||[]).sort((a,b)=>b.createdAt-a.createdAt));request.onerror=()=>reject(request.error);});}
async function studioDBDelete(id){const db=await openStudioDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STUDIO_STORE,'readwrite');tx.objectStore(STUDIO_STORE).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}
function studioPreferredMimeType(){const c=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'];return c.find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t))||'';}
function studioPreferredAudioMimeType(){const c=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'];return c.find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t))||'';}
function loadStudioPrompt(){const mode=document.getElementById('studioMode')?.value||'oratory',data=studioModeData[mode],language=document.getElementById('studioLanguage');if(mode==='interview-en'&&language&&!language.value.startsWith('en'))language.value='en-US';if(mode!=='interview-en'&&language&&language.value.startsWith('en'))language.value='pt-BR';document.getElementById('studioPrompt').value=data.prompt;document.getElementById('studioGuideTitle').textContent=data.title;document.getElementById('studioGuideText').textContent=data.guide;document.getElementById('studioChecklist').innerHTML=data.checklist.map(item=>`<button class="studio-check" onclick="this.classList.toggle('active')">${item}</button>`).join('');}
function renderStudioObservations(){const c=document.getElementById('studioObservations');if(c)c.innerHTML=studioObservationOptions.map(item=>`<button class="observation-btn ${studioSelectedObservations.has(item)?'active':''}" onclick="toggleStudioObservation('${item.replaceAll("'","\\'")}')">${item}</button>`).join('');}
function toggleStudioObservation(item){studioSelectedObservations.has(item)?studioSelectedObservations.delete(item):studioSelectedObservations.add(item);renderStudioObservations();}
function setStudioStatus(message,state=''){const e=document.getElementById('studioStatus');if(e){e.textContent=message;e.className='studio-status'+(state?' '+state:'');}}
function setStudioPill(text,live=false){const e=document.getElementById('studioRecordPill');if(e){e.textContent=text;e.classList.toggle('live',live);}}
async function startStudioCamera(){if(!navigator.mediaDevices?.getUserMedia){setStudioStatus('Este navegador não oferece acesso à câmera.','warning');return;}stopStudioCamera();try{studioStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:document.getElementById('studioCamera').value},width:{ideal:1280},height:{ideal:720}},audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});const video=document.getElementById('studioPreview');video.srcObject=studioStream;await video.play().catch(()=>{});document.getElementById('studioRecordBtn').disabled=false;document.getElementById('studioCameraBtn').textContent='📷 Câmera ativa';setStudioPill('Pronto para gravar');setStudioStatus('Câmera e microfone ativos. Confira o enquadramento.','ready');}catch(error){console.error(error);setStudioStatus('Não foi possível acessar câmera e microfone. Verifique as permissões.','warning');}}
function stopStudioCamera(){if(studioStream){studioStream.getTracks().forEach(t=>t.stop());studioStream=null;}const v=document.getElementById('studioPreview');if(v)v.srcObject=null;}
async function restartStudioCamera(){if(studioStream)await startStudioCamera();}
function readStudioPrompt(){const prompt=document.getElementById('studioPrompt').value.trim(),lang=document.getElementById('studioLanguage').value;if(prompt)speakText(prompt,lang,.86);}
async function studioCountdown(){const e=document.getElementById('studioCountdown');e.classList.remove('hidden');for(let i=3;i>=1;i--){e.textContent=i;await new Promise(r=>setTimeout(r,700));}e.textContent='GRAVANDO';await new Promise(r=>setTimeout(r,350));e.classList.add('hidden');}
function startStudioSpeechRecognition(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return;studioLiveTranscript='';try{studioSpeechRecognition=new R();studioSpeechRecognition.lang=document.getElementById('studioLanguage').value;studioSpeechRecognition.interimResults=true;studioSpeechRecognition.continuous=true;studioSpeechRecognition.onresult=e=>{let finalText=studioLiveTranscript,interim='';for(let i=e.resultIndex;i<e.results.length;i++){const p=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=(finalText?' ':'')+p;else interim+=p;}studioLiveTranscript=finalText.trim();document.getElementById('studioTranscript').value=(studioLiveTranscript+(interim?' '+interim:'')).trim();};studioSpeechRecognition.onerror=()=>{};studioSpeechRecognition.start();}catch(error){console.info(error);}}
function stopStudioSpeechRecognition(){if(studioSpeechRecognition){try{studioSpeechRecognition.stop();}catch{}studioSpeechRecognition=null;}}
async function startStudioRecording(){
  if(!studioStream){await startStudioCamera();if(!studioStream)return;}
  if(!window.MediaRecorder){setStudioStatus('Este navegador não oferece gravação de vídeo.','warning');return;}
  await studioCountdown();
  studioChunks=[];studioAudioChunks=[];studioDraftBlob=null;studioAudioBlob=null;studioRecordingStartedAt=Date.now();
  const mimeType=studioPreferredMimeType();
  try{studioRecorder=new MediaRecorder(studioStream,mimeType?{mimeType}:{});}catch{studioRecorder=new MediaRecorder(studioStream);}
  studioRecorder.ondataavailable=e=>{if(e.data&&e.data.size)studioChunks.push(e.data);};
  studioRecorder.onstop=finalizeStudioRecording;

  const audioTracks=studioStream.getAudioTracks();
  if(audioTracks.length){
    try{
      const audioStream=new MediaStream(audioTracks);
      const audioMime=studioPreferredAudioMimeType();
      studioAudioRecorder=new MediaRecorder(audioStream,audioMime?{mimeType:audioMime}:{});
      studioAudioRecorder.ondataavailable=e=>{if(e.data&&e.data.size)studioAudioChunks.push(e.data);};
      studioAudioRecorder.onstop=()=>{
        const mime=studioAudioRecorder?.mimeType||studioAudioChunks[0]?.type||'audio/webm';
        studioAudioBlob=new Blob(studioAudioChunks,{type:mime});
        if(document.getElementById('studioReviewPanel')&&!document.getElementById('studioReviewPanel').classList.contains('hidden'))transcribeStudioAudio();
      };
      studioAudioRecorder.start(500);
    }catch(error){console.info('Audio recorder unavailable:',error);}
  }

  studioRecorder.start(500);
  const max=Number(document.getElementById('studioDuration').value||60);
  document.getElementById('studioRecordBtn').disabled=true;document.getElementById('studioStopBtn').disabled=false;document.getElementById('studioResetBtn').disabled=true;
  setStudioPill('● 00:00',true);setStudioStatus('Gravação em andamento.','live');
  studioClockTimer=setInterval(()=>{const s=Math.floor((Date.now()-studioRecordingStartedAt)/1000);setStudioPill(`● ${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`,true);},250);
  studioStopTimer=setTimeout(stopStudioRecording,max*1000);
}
function stopStudioRecording(){
  if(studioRecorder&&studioRecorder.state!=='inactive')studioRecorder.stop();
  if(studioAudioRecorder&&studioAudioRecorder.state!=='inactive'){try{studioAudioRecorder.stop();}catch{}}
  stopStudioSpeechRecognition();clearTimeout(studioStopTimer);clearInterval(studioClockTimer);
  const stopButton=document.getElementById('studioStopBtn');if(stopButton)stopButton.disabled=true;
}
function finalizeStudioRecording(){
  const mime=studioRecorder?.mimeType||studioChunks[0]?.type||'video/webm';
  studioDraftBlob=new Blob(studioChunks,{type:mime});
  if(!studioDraftBlob.size){setStudioStatus('A gravação ficou vazia. Tente novamente e mantenha a tela aberta.','warning');return;}
  if(studioDraftUrl)URL.revokeObjectURL(studioDraftUrl);studioDraftUrl=URL.createObjectURL(studioDraftBlob);
  const p=document.getElementById('studioPlayback');p.src=studioDraftUrl;p.load();
  const duration=Math.max(1,Math.round((Date.now()-studioRecordingStartedAt)/1000));
  document.getElementById('studioMetricDuration').dataset.seconds=String(duration);updateStudioDraftMetrics();
  document.getElementById('studioReviewPanel').classList.remove('hidden');document.getElementById('studioResetBtn').disabled=false;document.getElementById('studioRecordBtn').disabled=false;
  setStudioPill('Tentativa concluída');setStudioStatus('Vídeo pronto. Preparando a transcrição do áudio...','ready');
  document.getElementById('studioReviewPanel').scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(transcribeStudioAudio,500);
}
async function transcribeStudioAudio(){
  const field=document.getElementById('studioTranscript');
  if(!field||field.value.trim()||!studioAudioBlob||!studioAudioBlob.size)return;
  setStudioStatus('Vídeo pronto. Transcrevendo o áudio...','ready');
  try{
    const lang=document.getElementById('studioLanguage').value;
    const response=await fetch(`/api/transcribe?lang=${encodeURIComponent(lang)}`,{method:'POST',headers:{'Content-Type':studioAudioBlob.type||'application/octet-stream'},body:studioAudioBlob});
    const payload=await response.json().catch(()=>({}));
    if(!response.ok||!payload.text)throw new Error(payload.error||'Transcrição indisponível');
    field.value=payload.text.trim();updateStudioDraftMetrics();setStudioStatus('Vídeo e transcrição prontos para revisão.','ready');
  }catch(error){
    console.info('Studio transcription fallback:',error);
    setStudioStatus('O vídeo foi gravado. A transcrição automática não está disponível; escreva ou corrija o texto manualmente.','warning');
  }
}
function studioTranscriptMetrics(){const t=document.getElementById('studioTranscript').value.trim(),words=t.split(/\s+/).filter(Boolean),duration=Number(document.getElementById('studioMetricDuration').dataset.seconds||1),fillers=(t.match(/\b(né|então|tipo|assim|basicamente|na verdade|you know|like|basically)\b/gi)||[]).length;return{words:words.length,duration,wpm:Math.round(words.length/(duration/60)),fillers};}
function updateStudioDraftMetrics(){const m=studioTranscriptMetrics();document.getElementById('studioMetricDuration').textContent=m.duration+'s';document.getElementById('studioMetricWords').textContent=m.words;document.getElementById('studioMetricWpm').textContent=m.wpm;document.getElementById('studioMetricFillers').textContent=m.fillers;}
async function analyzeStudioDraft(){if(!studioDraftBlob){toast('Grave um vídeo primeiro.');return;}updateStudioDraftMetrics();const transcript=document.getElementById('studioTranscript').value.trim(),m=studioTranscriptMetrics(),box=document.getElementById('studioAnalysis'),local=[];box.classList.remove('hidden');box.textContent='Analisando a transcrição...';if(!transcript)local.push('A transcrição está vazia. Escreva um resumo do que falou.');if(m.words&&m.words<20)local.push('A fala ficou curta. Verifique contexto, ideia principal e próximo passo.');if(m.wpm>165)local.push('A velocidade estimada está alta. Faça mais pausas.');if(m.fillers>2)local.push('Escolha um vício de linguagem para reduzir na próxima tentativa.');if(!local.length)local.push('A estrutura textual está equilibrada. Escolha uma melhoria visual para a próxima tentativa.');let ai={};if(typeof callCoachAI==='function'&&transcript){ai=await callCoachAI('video-session',{mode:document.getElementById('studioMode').value,prompt:document.getElementById('studioPrompt').value,transcript,metrics:m,observations:[...studioSelectedObservations]});}box.textContent=`Análise local:\n- ${local.join('\n- ')}\n\n${ai.feedback?'Feedback da IA:\n'+ai.feedback+'\n\n':''}${ai.contentStructure?'Estrutura sugerida:\n'+ai.contentStructure+'\n\n':''}${ai.nextAttempt?'Meta da próxima tentativa:\n'+ai.nextAttempt+'\n\n':''}Autoavaliação visual:\n${studioSelectedObservations.size?[...studioSelectedObservations].map(x=>'• '+x).join('\n'):'Nenhum item marcado.'}\n\nEsta versão não interpreta automaticamente postura, olhar ou gestos.`;}
function studioSessionTitle(){return studioModeData[document.getElementById('studioMode').value]?.title||'Sessão em vídeo';}
async function saveStudioVideo(){
  if(!studioDraftBlob){toast('Grave um vídeo primeiro.');return;}
  updateStudioDraftMetrics();const m=studioTranscriptMetrics();
  const record={id:'video-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),createdAt:Date.now(),createdLabel:new Date().toLocaleString('pt-BR'),mode:document.getElementById('studioMode').value,title:studioSessionTitle(),prompt:document.getElementById('studioPrompt').value.trim(),language:document.getElementById('studioLanguage').value,duration:m.duration,words:m.words,wpm:m.wpm,fillers:m.fillers,transcript:document.getElementById('studioTranscript').value.trim(),observations:[...studioSelectedObservations],mimeType:studioDraftBlob.type,size:studioDraftBlob.size,blob:studioDraftBlob};
  try{await studioDBPut(record);if(typeof addXP==='function')addXP(15,'Vídeo salvo: '+record.title);toast('Vídeo salvo neste navegador.');await renderStudioLibrary();}
  catch(error){console.error(error);setStudioStatus('Não foi possível salvar. O armazenamento do celular pode estar cheio. Exclua vídeos antigos ou libere espaço.','warning');}
}
function resetStudioDraft(){discardStudioDraft(false);document.getElementById('studioReviewPanel').classList.add('hidden');setStudioStatus('Pronto para uma nova tentativa.','ready');document.getElementById('studioResetBtn').disabled=true;}
function discardStudioDraft(showToast=true){if(studioDraftUrl){URL.revokeObjectURL(studioDraftUrl);studioDraftUrl='';}studioDraftBlob=null;studioAudioBlob=null;studioChunks=[];studioAudioChunks=[];studioLiveTranscript='';const p=document.getElementById('studioPlayback');if(p){p.removeAttribute('src');p.load();}document.getElementById('studioTranscript').value='';studioSelectedObservations.clear();renderStudioObservations();document.getElementById('studioAnalysis').classList.add('hidden');if(showToast)toast('Tentativa descartada.');}
async function renderStudioLibrary(){const c=document.getElementById('studioLibrary');if(!c)return;studioLibraryUrls.forEach(u=>URL.revokeObjectURL(u));studioLibraryUrls=[];const records=await studioDBGetAll(),bytes=records.reduce((s,r)=>s+Number(r.size||0),0);document.getElementById('studioSavedCount').textContent=records.length;document.getElementById('studioSavedSize').textContent=(bytes/1024/1024).toFixed(1)+' MB';if(!records.length)c.innerHTML='<p class="intro">Nenhum vídeo salvo ainda.</p>';else c.innerHTML=records.map(r=>{const u=URL.createObjectURL(r.blob);studioLibraryUrls.push(u);return `<article class="video-card"><video controls playsinline src="${u}"></video><h3>${r.title}</h3><p>${r.createdLabel} · ${r.duration}s · ${r.language}</p><div class="studio-metrics"><div class="studio-metric"><strong>${r.words||0}</strong><small>Palavras</small></div><div class="studio-metric"><strong>${r.wpm||0}</strong><small>Palavras/min</small></div><div class="studio-metric"><strong>${r.fillers||0}</strong><small>Vícios</small></div><div class="studio-metric"><strong>${(r.size/1024/1024).toFixed(1)}</strong><small>MB</small></div></div><div class="video-card-actions" style="margin-top:10px"><button class="outline" onclick="loadStudioVideoForReview('${r.id}')">Ver detalhes</button><button class="outline" onclick="deleteStudioVideo('${r.id}')">Excluir</button></div></article>`;}).join('');renderStudioCompareSelectors(records);}
async function loadStudioVideoForReview(id){const r=(await studioDBGetAll()).find(x=>x.id===id);if(!r)return;document.getElementById('studioMode').value=r.mode;document.getElementById('studioLanguage').value=r.language;loadStudioPrompt();document.getElementById('studioPrompt').value=r.prompt;document.getElementById('studioTranscript').value=r.transcript||'';studioSelectedObservations=new Set(r.observations||[]);renderStudioObservations();const panel=document.getElementById('studioReviewPanel');panel.classList.remove('hidden');document.getElementById('studioPlayback').src=URL.createObjectURL(r.blob);document.getElementById('studioMetricDuration').textContent=r.duration+'s';document.getElementById('studioMetricDuration').dataset.seconds=String(r.duration);document.getElementById('studioMetricWords').textContent=r.words||0;document.getElementById('studioMetricWpm').textContent=r.wpm||0;document.getElementById('studioMetricFillers').textContent=r.fillers||0;panel.scrollIntoView({behavior:'smooth',block:'start'});}
async function deleteStudioVideo(id){if(!confirm('Excluir este vídeo salvo neste navegador?'))return;await studioDBDelete(id);toast('Vídeo excluído.');await renderStudioLibrary();}
function renderStudioCompareSelectors(records){const a=document.getElementById('compareVideoA'),b=document.getElementById('compareVideoB');if(!a||!b)return;const options='<option value="">Escolha um vídeo</option>'+records.map(r=>`<option value="${r.id}">${r.title} — ${r.createdLabel}</option>`).join('');const oldA=a.value,oldB=b.value;a.innerHTML=options;b.innerHTML=options;if(records.some(r=>r.id===oldA))a.value=oldA;if(records.some(r=>r.id===oldB))b.value=oldB;renderStudioComparison();}
async function renderStudioComparison(){const idA=document.getElementById('compareVideoA')?.value,idB=document.getElementById('compareVideoB')?.value,grid=document.getElementById('studioCompareGrid'),diff=document.getElementById('studioCompareDiff');if(!grid||!diff)return;if(!idA||!idB||idA===idB){grid.innerHTML='<p class="intro">Escolha dois vídeos diferentes para comparar.</p>';diff.classList.add('hidden');return;}const records=await studioDBGetAll(),a=records.find(r=>r.id===idA),b=records.find(r=>r.id===idB);if(!a||!b)return;const card=r=>`<div class="compare-slot"><video controls playsinline src="${URL.createObjectURL(r.blob)}"></video><h3>${r.title}</h3><p>${r.createdLabel}</p><div class="studio-metrics"><div class="studio-metric"><strong>${r.duration}s</strong><small>Duração</small></div><div class="studio-metric"><strong>${r.wpm||0}</strong><small>Palavras/min</small></div><div class="studio-metric"><strong>${r.fillers||0}</strong><small>Vícios</small></div><div class="studio-metric"><strong>${r.words||0}</strong><small>Palavras</small></div></div></div>`;grid.innerHTML=card(a)+card(b);const dd=b.duration-a.duration,wd=(b.wpm||0)-(a.wpm||0),fd=(b.fillers||0)-(a.fillers||0);diff.classList.remove('hidden');diff.textContent=`Comparação da segunda seleção com a primeira:\nDuração: ${dd>=0?'+':''}${dd}s\nVelocidade estimada: ${wd>=0?'+':''}${wd} palavras/min\nVícios localizados: ${fd>=0?'+':''}${fd}\n\nAssista aos dois vídeos e compare enquadramento, olhar, gestos e clareza do fechamento.`;}
function initializeStudio(){loadStudioPrompt();renderStudioObservations();renderStudioLibrary().catch(e=>console.error(e));}
window.addEventListener('beforeunload',stopStudioCamera);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeStudio);else initializeStudio();
