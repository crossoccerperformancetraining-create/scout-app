(() => {
  'use strict';

  const MK = {
    settings:'mentor42-settings',
    memory:'mentor42-memory',
    active:'mentor42-active',
    criticism:'mentor42-criticism'
  };

  const modeLabels = {
    free:'Conversa livre',
    mentor:'Modo Mentor',
    questions:'Só perguntas',
    simulation:'Simulação',
    avoid:'Estou evitando essa conversa',
    challenge:'Questione minha decisão',
    five:'Me prepare em 5 minutos',
    organize:'Só organizar — sem conselho'
  };

  const modeHints = {
    free:'Conte a situação do seu jeito. O Mentor pode perguntar antes de orientar.',
    mentor:'O Mentor pode concordar, discordar com respeito e testar seu critério.',
    questions:'O Mentor não entrega a solução. Ele faz uma pergunta de cada vez para você construir a resposta.',
    simulation:'A IA assume o papel escolhido e reage ao que você realmente fala.',
    avoid:'Conte qual conversa você está adiando. Vamos definir fato, objetivo, abertura e o que não deve ser prometido.',
    challenge:'Explique sua decisão. O Mentor procurará critério, coerência, possível ponto cego e alternativa.',
    five:'Diga o que vai acontecer nos próximos minutos. O Mentor ajuda a reduzir sua preparação ao essencial.',
    organize:'O Mentor separa fatos, interpretações, decisões e pendências sem aconselhar.'
  };

  const preClubScenarios = [
    'Primeira conversa com um jogador experiente que não iniciará como titular.',
    'Apresentação de 5 minutos ao elenco: relação de trabalho, critérios e primeiro passo.',
    'Diretoria pergunta o que você pretende mudar imediatamente.',
    'Jogador jovem comete um erro importante no primeiro treino.',
    'Capitão procura você para falar sobre uma preocupação do grupo.',
    'Primeira coletiva com pressão por resultado imediato.',
    'Primeiro pós-jogo: separar resultado, desempenho e decisões para o dia seguinte.'
  ];

  let state = {
    mode:'free',
    turns:[],
    review:null,
    isCallOpen:false,
    callMode:'voice',
    cameraEnabled:false,
    autoConversation:false,
    specialContext:'',
    startedAt:Date.now()
  };

  function getJSON(key,fallback){
    try{
      const raw=localStorage.getItem(key);
      return raw?JSON.parse(raw):fallback;
    }catch{return fallback;}
  }
  function setJSON(key,value){localStorage.setItem(key,JSON.stringify(value));}
  function esc(value){
    return String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  }
  function todayKey(){
    const d=new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function autoVoice(){
    return getJSON(MK.settings,{autoVoice:true}).autoVoice!==false;
  }
  function saveActive(){
    setJSON(MK.active,{...state,savedAt:Date.now()});
  }
  function memory(){return getJSON(MK.memory,[]);}
  function setMemory(list){setJSON(MK.memory,list.slice(0,120));}

  window.mentor42SaveVoiceSetting=function mentor42SaveVoiceSetting(){
    const checked=document.getElementById('mentor42AutoVoice')?.checked!==false;
    const settings=getJSON(MK.settings,{});
    settings.autoVoice=checked;setJSON(MK.settings,settings);
  };

  function mentor43SetSpeaking(active,text=''){
    document.getElementById('mentor43Avatar')?.classList.toggle('speaking',Boolean(active));
    document.getElementById('mentor43Wave')?.classList.toggle('speaking',Boolean(active));
    const c=document.getElementById('mentor43Caption');if(c&&text)c.textContent=text;
  }

  function mentor44PickVoice(){
    try{
      const voices=speechSynthesis.getVoices()||[];
      return voices.find(v=>/^pt-BR$/i.test(v.lang))
        || voices.find(v=>/^pt/i.test(v.lang))
        || null;
    }catch{return null;}
  }

  function speak(text){
    if(!text || !autoVoice()){
      mentor43SetSpeaking(false);
      mentor44AfterMentorSpeech();
      return;
    }
    if(!('speechSynthesis' in window)){
      setCallStatus('Resposta pronta em texto. A voz não está disponível neste navegador.');
      mentor44AfterMentorSpeech();
      return;
    }
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      u.lang='pt-BR';
      u.rate=.92;
      const voice=mentor44PickVoice();
      if(voice)u.voice=voice;
      u.onstart=()=>{
        mentor43SetSpeaking(true,text);
        setCallStatus('Mentor falando...');
      };
      u.onend=()=>{
        mentor43SetSpeaking(false);
        setCallStatus('Sua vez. Toque no microfone para continuar.');
        mentor44AfterMentorSpeech();
      };
      u.onerror=()=>{
        mentor43SetSpeaking(false);
        setCallStatus('A resposta está no texto. A leitura em voz falhou neste aparelho.');
        mentor44AfterMentorSpeech();
      };
      speechSynthesis.speak(u);
    }catch{
      mentor43SetSpeaking(false);
      mentor44AfterMentorSpeech();
    }
  }

  window.mentor42StopVoice=function mentor42StopVoice(){
    try{speechSynthesis?.cancel();}catch{}
    mentor43SetSpeaking(false);
    setCallStatus('Voz interrompida. Toque no microfone quando quiser continuar.');
  };

  function setCallStatus(text){
    const el=document.getElementById('mentor42CallStatus');
    if(el)el.textContent=text;
  }

  function setMode(mode){
    state.mode=modeLabels[mode]?mode:'free';
    const select=document.getElementById('mentor42Mode');
    if(select)select.value=state.mode;
    const title=document.getElementById('mentor42ModeTitle');
    if(title)title.textContent=modeLabels[state.mode];
    const callTitle=document.getElementById('mentor42CallTitle');
    if(callTitle)callTitle.textContent=modeLabels[state.mode];
    const hint=document.getElementById('mentor42ModeHint');
    if(hint)hint.textContent=modeHints[state.mode];
    saveActive();
  }

  window.mentor42ModeChanged=function mentor42ModeChanged(){
    setMode(document.getElementById('mentor42Mode')?.value||'free');
  };

  function addTurn(role,text,meta={}){
    if(!text)return;
    state.turns.push({
      role,text,
      time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
      ...meta
    });
    state.turns=state.turns.slice(-20);
    saveActive();
    renderChat();
  }

  function renderChat(){
    const html=state.turns.length
      ? state.turns.map(turn=>`
        <div class="mentor42-bubble ${turn.role==='user'?'user':'ai'}">
          ${esc(turn.text)}
          <small>${turn.role==='user'?'Você':'Mentor'} · ${esc(turn.time||'')}</small>
        </div>`).join('')
      : `<div class="mentor42-bubble ai">Estou aqui. Conte a situação do seu jeito. Não precisamos começar pela solução.</div>`;
    const main=document.getElementById('mentor42Chat');
    const call=document.getElementById('mentor42CallChat');
    if(main){main.innerHTML=html;main.scrollTop=main.scrollHeight;}
    if(call){call.innerHTML=html;call.scrollTop=call.scrollHeight;}
  }

  function compactHistory(){
    return state.turns.slice(-10).map(t=>({role:t.role,text:t.text.slice(0,700)}));
  }

  function lastUserText(){
    return [...state.turns].reverse().find(t=>t.role==='user')?.text||'';
  }

  function lastAssistantText(){
    return [...state.turns].reverse().find(t=>t.role==='assistant')?.text||'';
  }

  function localDialogue(mode,text){
    const common={
      reflection:'Procure separar o que aconteceu do significado que você está atribuindo ao episódio.',
      savePoint:'Fato, critério e próximo passo.'
    };
    if(mode==='questions'){
      return {...common,spoken:'Entendi. Antes de pensar em uma solução, quero fazer uma pergunta.',nextQuestion:'Qual é o fato observável, sem interpretar a intenção da outra pessoa?'};
    }
    if(mode==='simulation'){
      return {...common,spoken:'Professor, eu entendo sua posição, mas quero saber de forma concreta o que você espera de mim daqui para frente.',nextQuestion:'Como você responderia sem prometer uma decisão futura?'};
    }
    if(mode==='avoid'){
      return {...common,spoken:'Se você está evitando a conversa, primeiro vamos diminuir o tamanho dela. Não precisa resolver toda a relação de uma vez.',nextQuestion:'Qual é o único objetivo que essa conversa precisa cumprir hoje?'};
    }
    if(mode==='challenge'){
      return {...common,spoken:'Seu argumento pode fazer sentido, mas quero testar uma coisa antes de aceitá-lo.',nextQuestion:'Você aplicaria exatamente o mesmo critério se fosse outro jogador, especialmente um titular importante?'};
    }
    if(mode==='five'){
      return {...common,spoken:'Certo. Vamos reduzir isso ao essencial para os próximos cinco minutos.',nextQuestion:'Qual comportamento você quer que as pessoas consigam repetir depois da sua fala?'};
    }
    if(mode==='organize'){
      return {...common,spoken:'Vou apenas organizar, sem aconselhar: existe o fato que aconteceu, a sua interpretação sobre ele e uma decisão que ainda pode estar pendente.',nextQuestion:'O que você sabe com certeza e o que ainda está supondo?'};
    }
    if(mode==='mentor'){
      return {...common,spoken:'Entendi seu raciocínio. Quero ajudar sem simplesmente confirmar sua primeira leitura.',nextQuestion:'Qual parte da sua decisão é critério e qual parte pode ser reação ao episódio mais recente?'};
    }
    return {...common,spoken:'Entendi. Antes de montar uma resposta pronta, quero compreender melhor a situação.',nextQuestion:'O que aconteceu de forma concreta e o que você precisa decidir ou comunicar agora?'};
  }

  async function askDialogue(text){
    const role=document.getElementById('mentor42Role')?.value||'player';
    const difficulty=document.getElementById('mentor42Difficulty')?.value||'realistic';
    const local=localDialogue(state.mode,text);
    const payload={
      dialogueMode:state.mode,
      role,difficulty,
      message:text,
      history:compactHistory(),
      specialContext:state.specialContext||'',
      coachPrep:preClubContext(),
      local
    };
    if(typeof callCoachAI!=='function'){
      return {__error:true,__message:'A função da IA não está disponível nesta versão.'};
    }

    const ai=await callCoachAI('mentor-dialogue',payload);

    if(ai?.__error){
      return ai;
    }

    return ai;
  }

  function mentor45FriendlyError(error){
    const code=String(error?.__code||'').toLowerCase();
    const message=String(error?.__message||'A IA não respondeu.');

    if(code.includes('insufficient_quota') || /quota|billing|credit/i.test(message)){
      return '⚠️ A IA está conectada, mas a conta da API está sem crédito ou limite disponível. Abra a OpenAI Platform → Billing e confira o saldo da API.';
    }

    if(code.includes('invalid_api_key') || /api key|incorrect api key|invalid key/i.test(message)){
      return '⚠️ A OPENAI_API_KEY foi encontrada, mas a OpenAI recusou a chave. Gere uma chave nova na OpenAI Platform, substitua na Vercel e faça Redeploy.';
    }

    if(code.includes('model') || /model/i.test(message)){
      return '⚠️ A chave funcionou, mas o modelo configurado não pôde ser usado. Erro recebido: '+message;
    }

    if(code==='invalid_json'){
      return '⚠️ A OpenAI respondeu, mas o servidor não conseguiu interpretar a resposta. Tente novamente. Se persistir, abra os Logs da Vercel.';
    }

    if(error?.__status===503){
      return '⚠️ A Vercel ainda não está enxergando OPENAI_API_KEY neste deployment. Confira Environment Variables e faça um novo Redeploy.';
    }

    return '⚠️ A IA real não respondeu. Erro: '+message+(error?.__code?' ['+error.__code+']':'');
  }

  function responseToText(result){
    return [result.spoken,result.nextQuestion].filter(Boolean).join('\n\n');
  }

  window.mentor42Send=async function mentor42Send(fromCall=false){
    const input=document.getElementById('mentor42Input');
    const text=input?.value.trim()||'';
    if(!text){
      if(typeof toast==='function')toast('Fale ou escreva uma situação primeiro.');
      return;
    }
    addTurn('user',text);
    if(input)input.value='';
    setCallStatus('Mentor pensando na sua resposta...');
    const result=await askDialogue(text);

    if(result?.__error){
      const message=mentor45FriendlyError(result);
      addTurn('assistant',message,{apiError:true});
      state.review=null;
      saveActive();
      setCallStatus('A IA não conseguiu responder. Veja o erro na conversa.');
      const live=document.getElementById('mentor44LiveTranscript');
      if(live)live.textContent='Erro de conexão com a IA.';
      return;
    }

    const full=responseToText(result);
    addTurn('assistant',full,{savePoint:result.savePoint||''});
    state.review=null;
    saveActive();
    setCallStatus('Resposta pronta. O Mentor vai falar agora.');
    const live=document.getElementById('mentor44LiveTranscript');if(live)live.textContent='Mentor respondendo...';
    speak(full);
    if(!fromCall && typeof toast==='function')toast('O Mentor respondeu. Você pode continuar a conversa.');
  };

  let mentor44Recognition=null;
  let mentor44Listening=false;
  let mentor44ShouldAutoSend=true;
  let mentor44LastTranscript='';

  window.mentor42Capture=function mentor42Capture(autoSend=false){
    mentor44StartListening(autoSend);
  };

  function mentor44StartListening(autoSend=true){
    if(mentor44Listening){
      try{mentor44Recognition?.stop();}catch{}
      return;
    }

    // Evita que a própria voz do Mentor seja capturada.
    try{speechSynthesis?.cancel();}catch{}
    mentor43SetSpeaking(false);

    const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognition){
      mentor44FallbackVoiceCapture(autoSend);
      return;
    }

    mentor44ShouldAutoSend=autoSend;
    mentor44LastTranscript='';
    const input=document.getElementById('mentor42Input');
    const live=document.getElementById('mentor44LiveTranscript');
    const mic=document.getElementById('mentor42BigMic');

    try{
      mentor44Recognition=new Recognition();
      mentor44Recognition.lang='pt-BR';
      mentor44Recognition.continuous=false;
      mentor44Recognition.interimResults=true;
      mentor44Recognition.maxAlternatives=1;

      mentor44Recognition.onstart=()=>{
        mentor44Listening=true;
        if(mic){mic.classList.add('listening');mic.classList.remove('processing');}
        if(live){live.classList.add('listening');live.textContent='Ouvindo... fale normalmente.';}
        setCallStatus('Ouvindo você...');
      };

      mentor44Recognition.onresult=(event)=>{
        let finalText='', interimText='';
        for(let i=0;i<event.results.length;i++){
          const text=event.results[i][0]?.transcript||'';
          if(event.results[i].isFinal)finalText+=(finalText?' ':'')+text;
          else interimText+=(interimText?' ':'')+text;
        }
        mentor44LastTranscript=(finalText||interimText).trim();
        if(live)live.textContent=mentor44LastTranscript||'Ouvindo...';
      };

      mentor44Recognition.onerror=(event)=>{
        const err=event?.error||'unknown';
        if(err==='aborted')return;
        if(err==='not-allowed'||err==='service-not-allowed'){
          setCallStatus('O navegador bloqueou o reconhecimento de fala. Verifique a permissão do microfone.');
          if(live)live.textContent='Microfone/reconhecimento bloqueado. Use o diagnóstico abaixo.';
        }else if(err==='no-speech'){
          setCallStatus('Não ouvi uma frase. Toque no microfone e tente novamente.');
          if(live)live.textContent='Não consegui entender a fala.';
        }else{
          setCallStatus(`Reconhecimento de fala falhou (${err}). Tentando modo alternativo...`);
          setTimeout(()=>mentor44FallbackVoiceCapture(autoSend),250);
        }
      };

      mentor44Recognition.onend=async ()=>{
        mentor44Listening=false;
        if(mic){mic.classList.remove('listening');}
        if(live)live.classList.remove('listening');
        const text=(mentor44LastTranscript||'').trim();
        if(text){
          if(input)input.value=text;
          if(live)live.textContent=`Entendi: ${text}`;
          setCallStatus('Fala reconhecida. Enviando ao Mentor...');
          if(autoSend){
            if(mic)mic.classList.add('processing');
            await mentor42Send(true);
            if(mic)mic.classList.remove('processing');
          }
        }
      };

      mentor44Recognition.start();
    }catch(error){
      console.info('Mentor recognition fallback:',error);
      mentor44Listening=false;
      if(mic)mic.classList.remove('listening');
      mentor44FallbackVoiceCapture(autoSend);
    }
  }

  function mentor44FallbackVoiceCapture(autoSend=true){
    if(typeof startUniversalVoiceCapture!=='function'){
      setCallStatus('Este navegador não oferece reconhecimento de fala. Você pode digitar e enviar normalmente.');
      return;
    }
    setCallStatus('Abrindo modo alternativo de gravação...');
    startUniversalVoiceCapture({
      lang:'pt-BR',
      maxSeconds:45,
      label:'Falar com o Mentor — modo alternativo',
      onText:async text=>{
        const input=document.getElementById('mentor42Input');
        const live=document.getElementById('mentor44LiveTranscript');
        if(input)input.value=text;
        if(live)live.textContent=`Entendi: ${text}`;
        if(autoSend)await mentor42Send(true);
      }
    });
  }

  window.mentor42CaptureCriticism=function mentor42CaptureCriticism(){
    if(typeof startUniversalVoiceCapture!=='function')return;
    startUniversalVoiceCapture({
      lang:'pt-BR',maxSeconds:60,label:'Contar uma crítica',
      onText:text=>{const el=document.getElementById('mentor42CriticismInput');if(el)el.value=text;}
    });
  };

  window.mentor42Quick=function mentor42Quick(mode){
    setMode(mode);
    state.specialContext='';
    const prompts={
      free:'Conte o que está acontecendo. Pode começar do seu jeito.',
      mentor:'Conte a situação e também o que você está pensando em fazer.',
      questions:'Conte o problema. Eu vou trabalhar apenas com perguntas, uma de cada vez.',
      simulation:'Descreva a conversa que quer simular e escolha quem a IA deve interpretar.',
      avoid:'Qual conversa você está evitando? Diga com quem é, o que aconteceu e o que torna essa conversa difícil.',
      challenge:'Qual decisão você quer que eu questione? Explique o fato e o seu critério.',
      five:'O que vai acontecer nos próximos minutos? Diga se é treino, reunião, vestiário, diretoria ou imprensa.',
      organize:'Conte tudo. Eu vou apenas separar fato, interpretação, decisão e pendência, sem tentar resolver.'
    };
    const input=document.getElementById('mentor42Input');
    if(input){input.value='';input.placeholder=prompts[mode]||prompts.free;}
    const chat=document.getElementById('mentor42Chat');
    chat?.scrollIntoView({behavior:'smooth',block:'center'});
    if(typeof toast==='function')toast(modeLabels[mode]+' ativado.');
  };

  window.mentor42StartCall=function mentor42StartCall(mode){
    if(mode)setMode(mode);
    document.getElementById('mentor42CallOverlay')?.classList.remove('hidden');
    state.isCallOpen=true;if(!state.callMode)state.callMode='voice';
    saveActive();renderChat();mentor43ApplyCallMode();
    setCallStatus(state.callMode==='video'?'Videochamada pronta. Toque no microfone para falar.':'Toque no microfone para falar.');
    const greeting=callGreeting();
    if(state.turns.length===0){addTurn('assistant',greeting);speak(greeting);}
  };

  function callGreeting(){
    const pending=getPending();
    if(pending)return `Na última conversa ficou pendente: ${pending.nextAction}. Você conseguiu avançar nisso ou quer retomar daqui?`;
    const pre=preClubContext();
    if(pre.active)return `Faltam ${pre.days} dias para o início previsto. Hoje podemos treinar: ${pre.scenario}`;
    return `Estou aqui. ${modeHints[state.mode]} O que você quer trabalhar agora?`;
  }

  window.mentor42EndCall=function mentor42EndCall(){
    document.getElementById('mentor42CallOverlay')?.classList.add('hidden');
    state.isCallOpen=false;saveActive();mentor42StopVoice();mentor43StopCamera();
  };

  function localReview(answer){
    return {
      didWell:'Você colocou sua posição de forma direta.',
      improve:'Inclua uma pergunta de escuta antes de explicar todo o critério.',
      retryPrompt:'Tente novamente em menos palavras: ouça, diga o critério em uma frase e deixe um próximo passo.',
      model:'Eu quero primeiro entender como você está vendo a situação. Depois eu te explico o critério da decisão de hoje e o que eu preciso ver daqui para frente.'
    };
  }

  window.mentor42ReviewLastAnswer=async function mentor42ReviewLastAnswer(){
    const answer=lastUserText();
    if(!answer){if(typeof toast==='function')toast('Ainda não existe uma resposta sua para corrigir.');return;}
    const local=localReview(answer);
    const ai=typeof callCoachAI==='function'
      ? await callCoachAI('mentor-review-answer',{
          mode:state.mode,
          answer,
          previousPrompt:lastAssistantText(),
          history:compactHistory(),
          local
        })
      : {};
    state.review={...local,...ai};
    saveActive();
    const box=document.getElementById('mentor42Review');
    if(box){
      box.classList.remove('hidden');
      box.innerHTML=`
        <div class="mentor42-result-section"><h4>Você fez bem</h4><p>${esc(state.review.didWell||'')}</p></div>
        <div class="mentor42-result-section"><h4>Melhore agora</h4><p>${esc(state.review.improve||'')}</p></div>
        <div class="mentor42-result-section"><h4>Refaça desta forma</h4><p>${esc(state.review.retryPrompt||'')}</p></div>
        <div class="mentor42-result-section"><h4>Uma alternativa do Mentor</h4><p>${esc(state.review.model||'')}</p></div>`;
    }
    speak(`Uma melhoria por vez. ${state.review.improve||''} ${state.review.retryPrompt||''}`);
  };

  window.mentor42Retry=function mentor42Retry(){
    const input=document.getElementById('mentor42Input');
    if(!input)return;
    input.value='';
    input.placeholder=state.review?.retryPrompt||'Refaça sua resposta tentando ser mais claro e breve.';
    input.focus();
    if(typeof toast==='function')toast('Pronto para uma nova tentativa.');
  };

  window.mentor42HearModel=function mentor42HearModel(){
    const model=state.review?.model;
    if(!model){
      if(typeof toast==='function')toast('Use “Corrigir minha resposta” primeiro.');
      return;
    }
    if(typeof speakText==='function')speakText(model,'pt-BR',.84);
  };

  function localClose(){
    const user=lastUserText();
    return {
      summary:user?`Situação trabalhada: ${user.slice(0,220)}`:'Conversa de desenvolvimento com o Mentor.',
      learning:'Manter fato, critério, escuta e próximo passo separados.',
      nextAction:'Revisar se existe uma conversa ou decisão que precisa de acompanhamento.',
      carryForward:'Na próxima conversa, verificar o que aconteceu depois desta decisão.'
    };
  }

  window.mentor42SaveSession=async function mentor42SaveSession(fromCall=false){
    if(state.turns.length<2){
      if(typeof toast==='function')toast('Converse um pouco antes de salvar a sessão.');
      return;
    }
    const local=localClose();
    const ai=typeof callCoachAI==='function'
      ? await callCoachAI('mentor-close-session',{mode:state.mode,history:compactHistory(),local})
      : {};
    const result={...local,...ai};
    const list=memory();
    list.unshift({
      id:'m42-'+Date.now(),
      day:todayKey(),
      date:new Date().toLocaleString('pt-BR'),
      mode:state.mode,
      summary:result.summary||local.summary,
      learning:result.learning||local.learning,
      nextAction:result.nextAction||local.nextAction,
      carryForward:result.carryForward||local.carryForward,
      resolved:false
    });
    setMemory(list);
    // mantém também contagem histórica antiga do projeto
    try{
      const old=getJSON('coachvoice-mentor-history',[]);
      old.unshift({
        date:new Date().toLocaleString('pt-BR'),
        situation:lastUserText(),
        answer:lastAssistantText(),
        analysis:result.learning||''
      });
      localStorage.setItem('coachvoice-mentor-history',JSON.stringify(old.slice(0,30)));
      if(typeof updateLocalHistory==='function')updateLocalHistory();
    }catch{}
    renderMemory();renderPending();
    if(typeof toast==='function')toast('Sessão salva na Memória do Mentor.');
    if(fromCall)mentor42EndCall();
  };

  window.mentor42ClearConversation=function mentor42ClearConversation(){
    state={mode:'free',turns:[],review:null,isCallOpen:false,specialContext:'',startedAt:Date.now()};
    localStorage.removeItem(MK.active);
    setMode('free');renderChat();
    const review=document.getElementById('mentor42Review');if(review)review.classList.add('hidden');
  };

  function getPending(){
    return memory().find(x=>!x.resolved && x.nextAction);
  }

  function renderPending(){
    const item=getPending();
    const card=document.getElementById('mentor42PendingCard');
    const text=document.getElementById('mentor42PendingText');
    if(!card||!text)return;
    if(!item){card.classList.add('hidden');return;}
    card.classList.remove('hidden');
    text.textContent=`${item.nextAction} — ${item.carryForward||'Retome o contexto antes de decidir o próximo passo.'}`;
  }

  window.mentor42ResumePending=function mentor42ResumePending(){
    const item=getPending();if(!item)return;
    mentor42ClearConversation();
    setMode('mentor');
    state.specialContext=`Pendência anterior: ${item.nextAction}. Contexto: ${item.summary}`;
    addTurn('assistant',`Na última conversa ficou pendente: ${item.nextAction}. O que aconteceu depois?`);
    mentor42StartCall();
  };

  window.mentor42ResolvePending=function mentor42ResolvePending(){
    const list=memory();
    const item=list.find(x=>!x.resolved && x.nextAction);
    if(item)item.resolved=true;
    setMemory(list);renderPending();renderMemory();
    if(typeof toast==='function')toast('Pendência marcada como resolvida.');
  };

  function renderMemory(){
    const wrap=document.getElementById('mentor42Memory');if(!wrap)return;
    const list=memory();
    if(!list.length){
      wrap.innerHTML='<p class="intro">As sessões salvas aparecerão aqui com aprendizado e próximo passo.</p>';
      return;
    }
    wrap.innerHTML=list.slice(0,50).map(item=>`
      <div class="mentor42-memory">
        <strong>${esc(modeLabels[item.mode]||'Mentor')} · ${esc(item.date)}</strong>
        <small><b>Resumo:</b> ${esc(item.summary||'')}</small>
        <small><b>Aprendizado:</b> ${esc(item.learning||'')}</small>
        <small><b>Próximo:</b> ${esc(item.nextAction||'')}</small>
        <div class="mentor42-memory-actions">
          ${item.resolved?'<span class="coachday-mini-badge ok">resolvida</span>':`<button class="outline" onclick="mentor42ResolveMemory('${item.id}')">Marcar resolvida</button>`}
        </div>
      </div>`).join('');
  }

  window.mentor42ResolveMemory=function mentor42ResolveMemory(id){
    const list=memory();const item=list.find(x=>x.id===id);if(item)item.resolved=true;
    setMemory(list);renderMemory();renderPending();
  };

  function localCriticism(text){
    const hasSpecific=/intens|transi|press|comunica|treino|escala|substit|bola|bloco|resultado|critério|criterio/i.test(text);
    return {
      actionable:hasSpecific,
      actionableWhy:hasSpecific?'Existe pelo menos uma afirmação que pode ser traduzida em comportamento observável.':'A crítica está ampla demais para virar ação sem mais evidência.',
      usefulPart:hasSpecific?'Procure o comportamento concreto que pode ser verificado em treino ou jogo.':'Pergunte se existe algum exemplo concreto antes de tirar conclusão.',
      outsideControl:'Você não controla a opinião final de imprensa, torcida, dirigentes ou atletas.',
      noise:'Ataques genéricos sobre sua identidade ou valor profissional não oferecem uma ação técnica específica.',
      respondNow:false,
      action:hasSpecific?'Escolha um comportamento observável e verifique com vídeo, comissão ou treino antes de reagir publicamente.':'Não construa uma resposta completa ainda. Primeiro procure fatos.',
      blindSpot:'Você aplicou o mesmo critério aos jogadores mais importantes e aos que têm menos espaço?'
    };
  }

  window.mentor42AnalyzeCriticism=async function mentor42AnalyzeCriticism(){
    const text=document.getElementById('mentor42CriticismInput')?.value.trim()||'';
    if(!text){if(typeof toast==='function')toast('Conte a crítica primeiro.');return;}
    const challenge=document.getElementById('mentor42CriticChallenge')?.checked!==false;
    const local=localCriticism(text);
    const box=document.getElementById('mentor42CriticismResult');
    box.classList.remove('hidden');box.textContent='Separando o que merece atenção do que é ruído...';
    const ai=typeof callCoachAI==='function'
      ? await callCoachAI('mentor-filter-criticism',{criticism:text,challenge,local})
      : {};
    const r={...local,...ai};
    box.innerHTML=`
      ${xRow(r.actionable,'Posso agir sobre isso',r.actionableWhy||'')}
      ${xRow(Boolean(r.usefulPart),'Existe uma parte útil',r.usefulPart||'')}
      ${xRow(false,'Não depende totalmente de mim',r.outsideControl||'')}
      ${xRow(false,'Ruído / opinião sem ação específica',r.noise||'')}
      ${xRow(Boolean(r.respondNow),'Exige resposta agora',r.respondNow?'Há motivo para resposta imediata.':'Não reaja apenas para aliviar o desconforto da crítica.')}
      <div class="mentor42-result-section"><h4>Ação escolhida</h4><p>${esc(r.action||'')}</p></div>
      ${challenge?`<div class="mentor42-result-section"><h4>Ponto cego para testar</h4><p>${esc(r.blindSpot||'')}</p></div>`:''}
      <div class="mentor42-result-section"><h4>Princípio</h4><p>Eu não controlo toda crítica. Eu escolho o que merece minha atenção.</p></div>`;
    const hist=getJSON(MK.criticism,[]);
    hist.unshift({date:new Date().toLocaleString('pt-BR'),day:todayKey(),text,result:r});
    setJSON(MK.criticism,hist.slice(0,80));
    if(autoVoice())speak(`Filtro concluído. ${r.action||''} ${challenge?r.blindSpot||'':''}`);
  };

  function xRow(active,title,text){
    return `<div class="mentor42-xrow">
      <span class="mentor42-x ${active?'active':'inactive'}">${active?'X':'—'}</span>
      <div><strong>${esc(title)}</strong><small>${esc(text)}</small></div>
    </div>`;
  }

  window.mentor42FocusCriticism=function mentor42FocusCriticism(){
    document.getElementById('mentor42CriticismCard')?.scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(()=>document.getElementById('mentor42CriticismInput')?.focus(),350);
  };

  window.mentor42FridayCriticism=function mentor42FridayCriticism(){
    const hist=memory();
    const recent=hist.find(x=>!x.resolved)||hist[0];
    const input=document.getElementById('mentor42CriticismInput');
    if(input && !input.value){
      input.value=recent
        ? `Quero revisar criticamente esta situação da semana: ${recent.summary}. Próximo passo que eu tinha definido: ${recent.nextAction}.`
        : 'Quero fazer a Crítica da Sexta. Questione uma decisão ou conversa importante que tive nesta semana.';
    }
    mentor42FocusCriticism();
  };

  window.openMentorCriticismFromCoachPrep=function openMentorCriticismFromCoachPrep(){
    if(typeof go==='function')go('mentor');
    setTimeout(()=>mentor42FridayCriticism(),120);
  };

  function preClubContext(){
    let cfg=getJSON('coachprep-config-v41',null);
    if(!cfg)cfg=getJSON('coachprep-config-v42',null);
    if(!cfg?.startDate)return {active:false};
    const start=new Date(cfg.startDate+'T12:00:00');
    const now=new Date();now.setHours(12,0,0,0);
    const days=Math.ceil((start-now)/86400000);
    if(days<0||days>14)return {active:false,days};
    const idx=Math.abs(days)%preClubScenarios.length;
    return {active:true,days,scenario:preClubScenarios[idx],startDate:cfg.startDate};
  }

  function renderPreClub(){
    const box=document.getElementById('mentor42PreClubBanner');if(!box)return;
    const pre=preClubContext();
    if(!pre.active){box.classList.add('hidden');return;}
    box.classList.remove('hidden');
    box.innerHTML=`<strong>Modo Pré‑Clube — faltam ${pre.days} dias</strong><br>
      Treino sugerido: ${esc(pre.scenario)}
      <div class="mentor42-actions" style="margin-top:8px">
        <button class="secondary" onclick="mentor42StartPreClub()">Treinar agora</button>
      </div>`;
  }

  window.mentor42StartPreClub=function mentor42StartPreClub(){
    const pre=preClubContext();if(!pre.active)return;
    mentor42ClearConversation();
    setMode('simulation');
    state.specialContext=`Modo Pré-Clube. Faltam ${pre.days} dias. Situação de hoje: ${pre.scenario}`;
    addTurn('assistant',`Modo Pré‑Clube. Situação de hoje: ${pre.scenario} Comece como você faria na situação real.`);
    mentor42StartCall();
  };

  function loadLegacyInput(){
    const legacy=document.getElementById('mentorSituation');
    const value=legacy?.value.trim()||'';
    if(!value)return;
    const input=document.getElementById('mentor42Input');
    if(input && !input.value)input.value=value;
    legacy.value='';
    setMode('mentor');
  }

  window.mentor42LoadSituation=function mentor42LoadSituation(data={}){
    if(typeof go==='function')go('mentor');
    setTimeout(()=>{
      const input=document.getElementById('mentor42Input');
      if(input)input.value=data.situation||data.context||'';
      setMode(data.mode||'mentor');
    },80);
  };

  window.mentor42ExportMemory=function mentor42ExportMemory(){
    const data={
      version:'4.2',
      exportedAt:new Date().toISOString(),
      memory:memory(),
      criticism:getJSON(MK.criticism,[]),
      active:state.turns.length?state:null
    };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`mentor-ia-backup-${todayKey()}.json`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };


  let mentor43CameraStream=null;
  window.mentor43StartVideoCall=function(){
    state.callMode='video';saveActive();mentor42StartCall();setTimeout(()=>mentor43StartCamera(),100);
  };
  window.mentor43SetCallMode=function(mode){
    state.callMode=mode==='video'?'video':'voice';saveActive();mentor43ApplyCallMode();
    if(state.callMode==='video')mentor43StartCamera();else mentor43StopCamera();
  };
  function mentor43ApplyCallMode(){
    const v=state.callMode==='video';
    document.getElementById('mentor43VideoStage')?.classList.toggle('hidden',!v);
    document.getElementById('mentor43CameraBtn')?.classList.toggle('hidden',!v);
    document.getElementById('mentor43AvatarNote')?.classList.toggle('hidden',!v);
    document.getElementById('mentor43VoiceModeBtn')?.classList.toggle('active',!v);
    document.getElementById('mentor43VideoModeBtn')?.classList.toggle('active',v);
    const t=document.getElementById('mentor42CallTitle');if(t)t.textContent=v?`${modeLabels[state.mode]} · Vídeo`:modeLabels[state.mode];
  }
  async function mentor43StartCamera(){
    if(state.callMode!=='video')return;
    try{
      if(!mentor43CameraStream)mentor43CameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
      const v=document.getElementById('mentor43SelfVideo');if(v){v.srcObject=mentor43CameraStream;await v.play().catch(()=>{});}
      state.cameraEnabled=true;mentor43UpdateCameraUI();
    }catch{state.cameraEnabled=false;mentor43UpdateCameraUI();setCallStatus('A câmera não abriu. A conversa por voz continua funcionando.');}
  }
  function mentor43StopCamera(){
    if(mentor43CameraStream){mentor43CameraStream.getTracks().forEach(t=>t.stop());mentor43CameraStream=null;}
    const v=document.getElementById('mentor43SelfVideo');if(v)v.srcObject=null;
    state.cameraEnabled=false;mentor43UpdateCameraUI();
  }
  window.mentor43ToggleCamera=function(){mentor43CameraStream?mentor43StopCamera():mentor43StartCamera();};
  function mentor43UpdateCameraUI(){
    const p=document.getElementById('mentor43CameraPlaceholder');if(p)p.style.display=mentor43CameraStream?'none':'grid';
    const b=document.getElementById('mentor43CameraBtn');if(b)b.innerHTML=mentor43CameraStream?'📷<small>Desligar</small>':'🚫<small>Ligar câmera</small>';
  }


  function mentor44AfterMentorSpeech(){
    const settings=getJSON(MK.settings,{});
    const enabled=Boolean(settings.autoConversation);
    if(enabled && state.isCallOpen){
      setTimeout(()=>{
        if(state.isCallOpen && !mentor44Listening)mentor44StartListening(true);
      },700);
    }
  }

  window.mentor44SaveAutoConversation=function mentor44SaveAutoConversation(){
    const enabled=Boolean(document.getElementById('mentor44AutoConversation')?.checked);
    const settings=getJSON(MK.settings,{});
    settings.autoConversation=enabled;
    setJSON(MK.settings,settings);
    state.autoConversation=enabled;
    saveActive();
    if(enabled)setCallStatus('Conversa automática ligada. Depois da resposta do Mentor, o microfone tentará ouvir novamente.');
    else setCallStatus('Conversa automática desligada. Toque no microfone para cada fala.');
  };

  window.mentor44RepeatLastAnswer=function mentor44RepeatLastAnswer(){
    const text=lastAssistantText();
    if(!text){
      if(typeof toast==='function')toast('Ainda não há resposta do Mentor para repetir.');
      return;
    }
    speak(text);
  };

  function mentor44DiagnosticRow(level,title,detail){
    const icon=level==='ok'?'✓':level==='warn'?'!':'×';
    return `<div class="mentor44-diagnostic-row ${level}">
      <span>${icon}</span><div><strong>${esc(title)}</strong><small>${esc(detail)}</small></div>
    </div>`;
  }

  window.mentor44RunDiagnostic=async function mentor44RunDiagnostic(){
    const box=document.getElementById('mentor44DiagnosticResult');
    if(!box)return;
    box.classList.remove('hidden');
    box.innerHTML=mentor44DiagnosticRow('warn','Teste em andamento','Verificando recursos deste aparelho...');

    const rows=[];

    // Microfone
    if(navigator.mediaDevices?.getUserMedia){
      try{
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        stream.getTracks().forEach(t=>t.stop());
        rows.push(mentor44DiagnosticRow('ok','Microfone','Permissão e captura de áudio funcionando.'));
      }catch(error){
        rows.push(mentor44DiagnosticRow('bad','Microfone','O navegador não conseguiu abrir o microfone. Verifique a permissão do site.'));
      }
    }else{
      rows.push(mentor44DiagnosticRow('bad','Microfone','Este navegador não expõe captura de áudio para a página.'));
    }

    // Reconhecimento direto
    const recognition=Boolean(window.SpeechRecognition||window.webkitSpeechRecognition);
    rows.push(mentor44DiagnosticRow(
      recognition?'ok':'warn',
      'Fala → texto',
      recognition
        ?'Reconhecimento direto disponível. O Mentor usará este modo primeiro.'
        :'Reconhecimento direto não existe neste navegador; será usado o modo alternativo de gravação/transcrição.'
    ));

    // Voz de resposta
    const hasVoice='speechSynthesis' in window;
    rows.push(mentor44DiagnosticRow(
      hasVoice?'ok':'warn',
      'Resposta em voz',
      hasVoice?'O aparelho pode ler a resposta do Mentor em voz alta.':'A conversa continuará em texto porque a síntese de voz não está disponível.'
    ));

    // Transcrição de servidor
    try{
      const r=await fetch('/api/transcribe',{method:'GET',cache:'no-store'});
      const data=await r.json().catch(()=>({}));
      rows.push(mentor44DiagnosticRow(
        data.configured?'ok':'warn',
        'Transcrição alternativa',
        data.configured
          ?'A transcrição por IA está configurada para servir como fallback.'
          :'Não está configurada. Isso não impede o reconhecimento direto, mas o fallback de áudio não poderá transcrever.'
      ));
    }catch{
      rows.push(mentor44DiagnosticRow('warn','Transcrição alternativa','A rota /api/transcribe não respondeu.'));
    }

    // IA
    try{
      const result=typeof callCoachAI==='function'?await callCoachAI('health',{message:'diagnostico-v45'}):{__error:true,__message:'callCoachAI indisponível'};
      rows.push(mentor44DiagnosticRow(
        result?.ok?'ok':'bad',
        'Mentor IA REAL',
        result?.ok
          ?'A OpenAI respondeu corretamente. As conversas estão usando IA real.'
          :mentor45FriendlyError(result)
      ));
    }catch{
      rows.push(mentor44DiagnosticRow('warn','Mentor IA','A conexão com /api/coach-ai não respondeu.'));
    }

    box.innerHTML=rows.join('');
  };

  window.initializeMentorV42=function initializeMentorV42(){
    const root=document.getElementById('mentor42Chat');if(!root)return;
    const stored=getJSON(MK.active,null);
    if(stored?.turns && Array.isArray(stored.turns)){
      state={...state,...stored,isCallOpen:false};
    }
    const voice=document.getElementById('mentor42AutoVoice');
    if(voice)voice.checked=autoVoice();
    const settings=getJSON(MK.settings,{});
    const auto=document.getElementById('mentor44AutoConversation');
    if(auto)auto.checked=Boolean(settings.autoConversation);
    state.autoConversation=Boolean(settings.autoConversation);
    setMode(state.mode||'free');
    if(!state.callMode)state.callMode='voice';
    renderChat();renderMemory();renderPending();renderPreClub();loadLegacyInput();mentor43ApplyCallMode();
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',window.initializeMentorV42,{once:true});
  }else{
    window.initializeMentorV42();
  }
})();
