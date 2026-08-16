(() => {
  'use strict';

  const CD = {
    days: 'coachday-days-v40',
    week: 'coachday-week-v40',
    squad: 'coachday-squad-v40',
    memory: 'coachday-memory-v40',
    ui: 'coachday-ui-v40'
  };

  const weekDays = [
    ['mon','Segunda-feira'],['tue','Terça-feira'],['wed','Quarta-feira'],
    ['thu','Quinta-feira'],['fri','Sexta-feira'],['sat','Sábado'],['sun','Domingo']
  ];

  const reflectionQuestions = [
    'O que você quer que os jogadores consigam repetir sozinhos hoje, sem você precisar lembrá-los?',
    'Qual pessoa precisa mais de clareza hoje — e não necessariamente de cobrança?',
    'Qual informação é nova hoje e qual mensagem não precisa ser repetida?',
    'Em qual situação você pode ouvir mais antes de responder?',
    'O que você consegue corrigir no ambiente ou no exercício antes de corrigir uma pessoa?',
    'Qual comportamento positivo merece ser reconhecido hoje?',
    'O que deve permanecer simples para que os jogadores consigam executar sob pressão?'
  ];

  const momentPresets = {
    'new-coach': {
      audience:'Elenco',
      goal:'Apresentar valores de trabalho, começar a relação sem julgar o passado e explicar os primeiros passos.',
      context:'Chegada a um novo clube. Explique o momento da equipe, o que você já sabe e o que ainda precisa observar.'
    },
    midseason: {
      audience:'Elenco',
      goal:'Trazer clareza e estabilidade sem prometer uma transformação imediata.',
      context:'Assumindo durante a competição. Evite atacar o trabalho anterior; identifique poucas prioridades para começar.'
    },
    'season-start': {
      audience:'Elenco',
      goal:'Apresentar o modo de trabalho, expectativas de convivência e a lógica da preparação.',
      context:'Início de temporada ou competição. Explique processo, responsabilidades e como decisões serão tomadas.'
    },
    'squad-first': {
      audience:'Elenco',
      goal:'Criar uma primeira relação clara, respeitosa e aberta ao trabalho diário.',
      context:'Primeiro encontro com os atletas. Não tente explicar tudo; apresente princípios de relação e próximos passos.'
    },
    'board-first': {
      audience:'Diretoria',
      goal:'Alinhar diagnóstico inicial, critérios, responsabilidades, necessidades e forma de comunicação.',
      context:'Primeira conversa formal com a direção. Diferencie o que você sabe do que ainda precisa avaliar.'
    },
    'press-first': {
      audience:'Imprensa',
      goal:'Apresentar-se, respeitar o contexto do clube e comunicar expectativa realista.',
      context:'Primeira coletiva. Evite promessas de resultado ou críticas ao trabalho anterior.'
    },
    'staff-first': {
      audience:'Comissão técnica',
      goal:'Definir fluxo de trabalho, responsabilidades, comunicação interna e como discordâncias serão tratadas.',
      context:'Primeira reunião com a comissão. Dê espaço para conhecer as pessoas antes de mudar processos.'
    },
    'week-opening': {
      audience:'Elenco',
      goal:'Apresentar a lógica da semana sem antecipar todas as informações do adversário.',
      context:'Abertura da semana. Conecte recuperação, conteúdos de treino e jogo seguinte.'
    },
    'bad-run': {
      audience:'Elenco',
      goal:'Reconhecer o momento sem dramatizar, proteger a responsabilidade coletiva e indicar poucas ações controláveis.',
      context:'Equipe em sequência ruim. Não use culpa, ameaça ou discurso excessivamente longo.'
    },
    'decisive-week': {
      audience:'Elenco',
      goal:'Manter normalidade competitiva e clareza sobre os comportamentos que decidem o jogo.',
      context:'Semana de partida decisiva. Evite transformar cada treino em uma final emocional.'
    },
    project: {
      audience:'Diretoria',
      goal:'Explicar identidade de trabalho, prioridades, processo de avaliação e indicadores do projeto.',
      context:'Apresentação de projeto ou metodologia. Traduza conceitos técnicos em decisões e comportamentos observáveis.'
    }
  };

  let lastPrePlan = null;
  let lastPostPlan = null;
  let lastMomentPlan = null;
  let lastReactionPlan = null;
  let bound = false;

  function getJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function todayKey(offset = 0) {
    const d = new Date();
    d.setHours(12,0,0,0);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0,10);
  }

  function displayDate(key = todayKey()) {
    const [y,m,d] = key.split('-').map(Number);
    return new Date(y,m-1,d).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'});
  }

  function clean(value) {
    return String(value || '').trim();
  }

  function esc(value) {
    return String(value ?? '')
      .replaceAll('&','&amp;').replaceAll('<','&lt;')
      .replaceAll('>','&gt;').replaceAll('"','&quot;');
  }

  function daysStore() {
    return getJSON(CD.days, {});
  }

  function getDay(key = todayKey()) {
    const all = daysStore();
    return all[key] || { date:key, createdAt:Date.now() };
  }

  function saveDay(day, key = todayKey()) {
    const all = daysStore();
    all[key] = { ...day, date:key, updatedAt:Date.now() };
    setJSON(CD.days, all);
    updateCoachDayHome();
    return all[key];
  }

  function memoryStore() {
    return getJSON(CD.memory, []);
  }

  function addMemory(type, title, summary, data = {}) {
    if (!clean(summary)) return;
    const list = memoryStore();
    const signature = `${todayKey()}|${type}|${title}|${summary}`;
    if (list.some(item => item.signature === signature)) return;
    list.unshift({
      id:'mem-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
      signature,type,title,summary,data,
      day:todayKey(),createdAt:Date.now(),
      dateLabel:new Date().toLocaleString('pt-BR')
    });
    setJSON(CD.memory, list.slice(0,300));
    renderCoachDayMemory();
  }

  function eventLabel(value) {
    return ({
      training:'Treino',match:'Jogo',presentation:'Apresentação/reunião importante',
      meeting:'Reunião/conversa coletiva',recovery:'Recuperação',off:'Dia sem campo'
    })[value] || value;
  }

  function durationLabel(value) {
    return ({
      auto:'A IA recomenda',none:'sem discurso',quick:'20–40 segundos',
      short:'1–2 minutos',meeting:'5–6 minutos',special:'até 10 minutos'
    })[value] || value;
  }

  function recommendedDuration(data) {
    if (data.duration && data.duration !== 'auto') return data.duration;
    if (data.event === 'presentation') return 'meeting';
    if (data.event === 'meeting' && /primeir|apresent|semana|projeto/i.test(data.context || '')) return 'meeting';
    if (data.event === 'recovery' || data.event === 'off') return 'none';
    const yesterday = getDay(todayKey(-1));
    if (yesterday?.pre?.duration === 'meeting') return 'quick';
    if (data.newInfo && data.newInfo.length > 90) return 'short';
    return 'quick';
  }

  function localPrePlan(data) {
    const duration = recommendedDuration(data);
    const focus = data.focus || 'o comportamento principal do treino';
    const newInfo = data.newInfo || 'uma única referência nova';
    let why = 'Evite transformar todo treino em uma nova reunião. A comunicação deve acrescentar algo ao que já foi treinado.';
    let message = `Hoje eu quero uma referência clara: ${focus}. O ponto novo é ${newInfo}. Durante o treino, vamos reconhecer esse comportamento e corrigir no próprio exercício.`;
    if (duration === 'none') {
      why = 'Hoje a comunicação pode acontecer dentro da atividade. Não é necessário abrir com um discurso coletivo.';
      message = 'Sem reunião inicial. Apresente apenas o objetivo do primeiro exercício e deixe as correções aparecerem durante o treino.';
    } else if (duration === 'meeting') {
      message = `Comece conectando a semana ao objetivo de hoje. Explique por que ${focus} é importante, mostre dois ou três comportamentos observáveis, apresente ${newInfo} e termine dizendo como os jogadores reconhecerão que o treino funcionou.`;
    } else if (duration === 'short') {
      message = `Contextualize em uma frase, apresente ${focus}, explique ${newInfo} e finalize com uma pergunta curta para verificar se a referência ficou clara.`;
    }
    return {
      recommendation:`Hoje eu usaria ${durationLabel(duration)}.`,
      duration,
      why,
      message,
      structure:[
        'Comece pelo objetivo de hoje, sem revisar toda a semana.',
        'Use no máximo dois ou três comportamentos observáveis.',
        'Diga o que é novo e o que já foi treinado.',
        'Termine com a ação que você quer reconhecer no campo.'
      ],
      avoid:[
        'Repetir a mesma introdução de todos os dias.',
        'Misturar muitos problemas em uma única fala.',
        'Usar a reunião para resolver individualmente situações que pedem conversa privada.'
      ],
      questionToSelf:'Se eu retirar metade desta fala, os jogadores perderão alguma informação realmente necessária?'
    };
  }

  function renderPreResult(plan) {
    const box = document.getElementById('coachdayPreResult');
    if (!box || !plan) return;
    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="coachday-result-section"><h4>Recomendação</h4><p>${esc(plan.recommendation || durationLabel(plan.duration))}</p></div>
      <div class="coachday-result-section"><h4>Por que</h4><p>${esc(plan.why || '')}</p></div>
      <div class="coachday-result-section"><h4>O que falar / como conduzir</h4><p>${esc(plan.message || '')}</p></div>
      <div class="coachday-result-section"><h4>Estrutura</h4><ul>${(plan.structure || []).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachday-result-section"><h4>Evite</h4><ul>${(plan.avoid || []).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachday-question">${esc(plan.questionToSelf || '')}</div>`;
  }

  window.prepareCoachDayCommunication = async function prepareCoachDayCommunication() {
    saveCoachDayForm();
    const day = getDay();
    const data = day.preInput || {};
    const local = localPrePlan(data);
    const box = document.getElementById('coachdayPreResult');
    box.classList.remove('hidden');
    box.textContent = 'Preparando uma comunicação curta e conectada ao contexto...';

    const ai = typeof callCoachAI === 'function'
      ? await callCoachAI('coachday-pre', { ...data, yesterday:compactYesterday(), local })
      : {};
    lastPrePlan = {
      ...local,
      ...ai,
      duration: ai.duration || local.duration,
      structure: Array.isArray(ai.structure) ? ai.structure : local.structure,
      avoid: Array.isArray(ai.avoid) ? ai.avoid : local.avoid
    };
    renderPreResult(lastPrePlan);
    const saved = getDay();
    saved.pre = lastPrePlan;
    saveDay(saved);
  };

  window.saveCoachDayPreparation = function saveCoachDayPreparation() {
    saveCoachDayForm();
    const day = getDay();
    if (lastPrePlan) day.pre = lastPrePlan;
    saveDay(day);
    const summary = lastPrePlan?.message || day.pre?.message || clean(day.preInput?.focus);
    if (summary) addMemory('pre','Preparação antes da atividade',summary,{duration:lastPrePlan?.duration});
    if (typeof toast === 'function') toast('Preparação salva no CoachDay.');
  };

  function compactYesterday() {
    const yesterday = getDay(todayKey(-1));
    return {
      date:yesterday.date,
      postSummary:yesterday.post?.summary || '',
      followups:yesterday.post?.tomorrow || [],
      preDuration:yesterday.pre?.duration || ''
    };
  }

  function localPost(raw) {
    const sentences = clean(raw).split(/(?<=[.!?])\s+/).filter(Boolean);
    const playerSentences = sentences.filter(x=>/\b(jogador|atleta|goleiro|capitão|adriano|joão|pedro|carlos)\b/i.test(x));
    const communication = sentences.filter(x=>/\b(falei|fala|conversa|reunião|comunica|expliquei|disse)\b/i.test(x));
    const field = sentences.filter(x=>/\b(treino|jogo|bola|press|transi|constru|defens|ofens|finaliza|bloco)\b/i.test(x));
    return {
      summary: sentences.slice(0,3).join(' ') || raw,
      field: field.slice(0,4),
      communication: communication.slice(0,3),
      squad: playerSentences.slice(0,4).map(fact=>({person:'Acompanhar',fact,nextStep:'Separar o fato da interpretação e decidir se uma conversa é necessária.',when:'próximo contato'})),
      tomorrow:[
        field[0] ? `Retomar o comportamento de campo: ${field[0]}` : 'Escolher um único comportamento de campo para acompanhar.',
        playerSentences[0] ? 'Revisar a situação individual antes de decidir se exige conversa.' : 'Verificar se existe alguma conversa individual pendente.'
      ],
      noActionYet:['Nem todo episódio precisa de resposta imediata. Observe a sequência antes de transformar um fato isolado em avaliação permanente.'],
      reflection:'O que aconteceu hoje muda realmente sua avaliação de alguém, ou apenas pede uma conversa/observação?'
    };
  }

  function renderPostResult(plan) {
    const box = document.getElementById('coachdayPostResult');
    if (!box || !plan) return;
    box.classList.remove('hidden');
    const squad = Array.isArray(plan.squad) ? plan.squad : [];
    box.innerHTML = `
      <div class="coachday-result-section"><h4>Resumo do dia</h4><p>${esc(plan.summary || '')}</p></div>
      <div class="coachday-result-section"><h4>Campo</h4><ul>${(plan.field || []).map(x=>`<li>${esc(x)}</li>`).join('') || '<li>Sem registro específico.</li>'}</ul></div>
      <div class="coachday-result-section"><h4>Comunicação</h4><ul>${(plan.communication || []).map(x=>`<li>${esc(x)}</li>`).join('') || '<li>Sem registro específico.</li>'}</ul></div>
      <div class="coachday-result-section"><h4>Elenco / acompanhamento</h4>${squad.length ? squad.map(item=>`<p><strong>${esc(item.person || 'Situação')}:</strong> ${esc(item.fact || '')}<br><small>Próximo passo: ${esc(item.nextStep || '')} · ${esc(item.when || '')}</small></p>`).join('') : '<p>Nenhuma situação individual destacada.</p>'}</div>
      <div class="coachday-result-section"><h4>Para amanhã</h4><ul>${(plan.tomorrow || []).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachday-result-section"><h4>Talvez não exija ação agora</h4><ul>${(plan.noActionYet || []).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachday-question">${esc(plan.reflection || '')}</div>`;
  }

  window.organizeCoachDayPost = async function organizeCoachDayPost() {
    const raw = clean(document.getElementById('coachdayPostRaw')?.value);
    if (!raw) {
      if (typeof toast === 'function') toast('Conte primeiro o que aconteceu.');
      return;
    }
    saveCoachDayForm();
    const local = localPost(raw);
    const box = document.getElementById('coachdayPostResult');
    box.classList.remove('hidden');
    box.textContent = 'Organizando fatos, pendências e o que pode esperar...';
    const ai = typeof callCoachAI === 'function'
      ? await callCoachAI('coachday-post', { raw, pre:getDay().pre || {}, local })
      : {};
    lastPostPlan = {
      ...local,...ai,
      field:Array.isArray(ai.field)?ai.field:local.field,
      communication:Array.isArray(ai.communication)?ai.communication:local.communication,
      squad:Array.isArray(ai.squad)?ai.squad:local.squad,
      tomorrow:Array.isArray(ai.tomorrow)?ai.tomorrow:local.tomorrow,
      noActionYet:Array.isArray(ai.noActionYet)?ai.noActionYet:local.noActionYet
    };
    renderPostResult(lastPostPlan);
    const day = getDay();
    day.post = { ...lastPostPlan, raw };
    saveDay(day);
    addMemory('post','Pós-atividade',lastPostPlan.summary,{tomorrow:lastPostPlan.tomorrow});

    for (const item of lastPostPlan.squad || []) {
      if (item.person && item.person !== 'Acompanhar' && item.fact) {
        upsertSquadRecord(item.person,{
          type:'Registro do pós-atividade',fact:item.fact,nextStep:item.nextStep || '',followup:''
        }, false);
      }
    }
    renderCoachDaySquad();
    refreshCoachDayRadar(false);
  };

  function localReaction(person, fact) {
    return {
      facts:`Fato registrado: ${fact}`,
      separateDecisionFromRelationship:`Uma decisão de escalação, um erro ou uma reação pontual não precisa definir sua relação futura com ${person || 'a pessoa'}.`,
      options:[
        'Conversar agora, se houver risco de segurança, respeito ou funcionamento imediato do grupo.',
        'Conversar em particular depois, quando o objetivo for esclarecer expectativa e ouvir a pessoa.',
        'Observar mais um treino se ainda não há informação suficiente.',
        'Não agir, quando o episódio isolado não exige intervenção.'
      ],
      suggestedAction:'Se não houver urgência, prefira uma conversa privada e curta. Explique a decisão atual, diga o que você espera e deixe espaço para a pessoa responder.',
      shortScript:`${person ? person + ', ' : ''}percebi essa situação e quero separar uma decisão de hoje da nossa relação de trabalho. Quero explicar o que espero daqui para frente e também ouvir como você está vendo o momento.`
    };
  }

  window.coachDayBeforeReact = async function coachDayBeforeReact() {
    const person = clean(document.getElementById('coachdayReactionPerson')?.value);
    const fact = clean(document.getElementById('coachdayReactionFact')?.value);
    const timing = clean(document.getElementById('coachdayReactionTiming')?.value);
    if (!fact) {
      if (typeof toast === 'function') toast('Registre primeiro o fato observável.');
      return;
    }
    const local = localReaction(person, fact);
    const ai = typeof callCoachAI === 'function'
      ? await callCoachAI('coachday-reaction',{person,fact,timing,local})
      : {};
    lastReactionPlan = {
      ...local,...ai,
      options:Array.isArray(ai.options)?ai.options:local.options
    };
    const box = document.getElementById('coachdayReactionResult');
    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="coachday-result-section"><h4>Fato</h4><p>${esc(lastReactionPlan.facts)}</p></div>
      <div class="coachday-result-section"><h4>Não confunda decisão com relação</h4><p>${esc(lastReactionPlan.separateDecisionFromRelationship)}</p></div>
      <div class="coachday-result-section"><h4>Opções</h4><ul>${lastReactionPlan.options.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachday-result-section"><h4>Ação sugerida</h4><p>${esc(lastReactionPlan.suggestedAction)}</p></div>
      <div class="coachday-result-section"><h4>Uma forma de começar</h4><p>${esc(lastReactionPlan.shortScript)}</p></div>`;
    addMemory('reaction',person ? `Antes de reagir — ${person}` : 'Antes de reagir',fact,{suggestedAction:lastReactionPlan.suggestedAction});
  };

  window.addReactionToSquad = function addReactionToSquad() {
    const person = clean(document.getElementById('coachdayReactionPerson')?.value);
    const fact = clean(document.getElementById('coachdayReactionFact')?.value);
    if (!person || !fact) {
      if (typeof toast === 'function') toast('Preencha pessoa e fato antes de adicionar.');
      return;
    }
    upsertSquadRecord(person,{
      type:'Acompanhamento',fact,
      nextStep:lastReactionPlan?.suggestedAction || 'Rever a situação antes do próximo contato.',
      followup:''
    }, true);
  };

  function getWeek() {
    return getJSON(CD.week,{
      theme:'',opponent:'',opponentKeys:'',days:{},result:null,updatedAt:0
    });
  }

  function saveWeekObject(week) {
    setJSON(CD.week,{...week,updatedAt:Date.now()});
  }

  function renderWeekDays() {
    const wrap = document.getElementById('coachdayWeekDays');
    if (!wrap) return;
    const week = getWeek();
    wrap.innerHTML = weekDays.map(([id,label])=>`
      <article class="coachday-week-day">
        <div class="coachday-week-day-head"><h3>${label}</h3><small>atividade + mensagem</small></div>
        <label class="label" for="coachdayWeek_${id}" style="margin-top:8px">O que acontecerá?</label>
        <textarea id="coachdayWeek_${id}" data-week-day="${id}" class="text-input" placeholder="Ex.: recuperação + vídeo; organização ofensiva; treino do adversário; pré-jogo...">${esc(week.days?.[id] || '')}</textarea>
      </article>`).join('');
  }

  window.saveCoachDayWeek = function saveCoachDayWeek(showToast = true) {
    const week = getWeek();
    week.theme = clean(document.getElementById('coachdayWeekTheme')?.value);
    week.opponent = clean(document.getElementById('coachdayOpponent')?.value);
    week.opponentKeys = clean(document.getElementById('coachdayOpponentKeys')?.value);
    week.days = {};
    document.querySelectorAll('[data-week-day]').forEach(el=>week.days[el.dataset.weekDay]=clean(el.value));
    saveWeekObject(week);
    if (showToast && typeof toast === 'function') toast('Semana salva neste aparelho.');
    return week;
  };

  function localWeekPlan(week) {
    const filled = weekDays.filter(([id])=>week.days[id]).map(([id,label])=>({id,label,text:week.days[id]}));
    const cadence = filled.map((day,index)=>{
      let duration = index === 0 ? '1–2 minutos' : '20–40 segundos';
      if (/apresent|reuni|primeir|início|inicio/i.test(day.text)) duration = '5–6 minutos';
      if (/pré-jogo|pre-jogo|jogo decisivo/i.test(day.text)) duration = '1–2 minutos';
      return {
        day:day.label,focus:day.text,duration,
        communication:index === 0
          ? 'Apresente a lógica da semana e apenas as referências necessárias para este dia.'
          : 'Conecte o treino de hoje ao que já foi apresentado. Não refaça a reunião anterior.'
      };
    });
    return {
      weekTheme:week.theme || 'Construir a semana com progressão de informação.',
      cadence,
      opponentMessages:[
        'Introduza o adversário aos poucos, ligado aos exercícios que realmente serão treinados.',
        'No fim da semana, reforce poucas referências que já apareceram no campo.',
        'Evite acrescentar uma nova solução tática na última reunião apenas porque ela surgiu na análise.'
      ],
      avoid:'Transformar cada manhã em uma palestra completa ou apresentar na segunda-feira tudo o que será usado no jogo.'
    };
  }

  window.buildCoachDayWeek = async function buildCoachDayWeek() {
    const week = saveCoachDayWeek(false);
    const local = localWeekPlan(week);
    const box = document.getElementById('coachdayWeekResult');
    box.classList.remove('hidden');
    box.textContent = 'Montando uma cadência para a semana...';
    const ai = typeof callCoachAI === 'function'
      ? await callCoachAI('coachday-week',{week,local})
      : {};
    const result = {
      ...local,...ai,
      cadence:Array.isArray(ai.cadence)?ai.cadence:local.cadence,
      opponentMessages:Array.isArray(ai.opponentMessages)?ai.opponentMessages:local.opponentMessages
    };
    week.result = result;
    saveWeekObject(week);
    renderWeekResult(result);
    addMemory('week','Plano da semana',result.weekTheme,{cadence:result.cadence});
    refreshCoachDayRadar(false);
  };

  function renderWeekResult(result) {
    const box = document.getElementById('coachdayWeekResult');
    if (!box || !result) return;
    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="coachday-result-section"><h4>Tema da semana</h4><p>${esc(result.weekTheme || '')}</p></div>
      <div class="coachday-result-section"><h4>Cadência</h4>${(result.cadence || []).map(item=>`<p><strong>${esc(item.day)} — ${esc(item.duration || '')}</strong><br>${esc(item.communication || '')}<br><small>${esc(item.focus || '')}</small></p>`).join('')}</div>
      <div class="coachday-result-section"><h4>Adversário</h4><ul>${(result.opponentMessages || []).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachday-result-section"><h4>Evite</h4><p>${esc(result.avoid || '')}</p></div>`;
  }

  window.loadCoachDayMomentPreset = function loadCoachDayMomentPreset() {
    const type = document.getElementById('coachdayMomentType')?.value || 'new-coach';
    const preset = momentPresets[type];
    if (!preset) return;
    const audience = document.getElementById('coachdayMomentAudience');
    const context = document.getElementById('coachdayMomentContext');
    const goal = document.getElementById('coachdayMomentGoal');
    if (audience) audience.value = preset.audience;
    if (context && !context.value.trim()) context.value = preset.context;
    if (goal && !goal.value.trim()) goal.value = preset.goal;
  };

  function localMomentPlan(data) {
    const duration = data.duration === 'auto'
      ? (/first|new|midseason|season|project|week-opening/.test(data.type) ? '5–6 minutos' : '1–2 minutos')
      : durationLabel(data.duration);
    const opening = data.audience === 'Imprensa'
      ? 'Obrigado pela recepção. Quero começar respeitando o contexto do clube e sendo claro sobre a responsabilidade que assumo a partir de hoje.'
      : data.audience === 'Diretoria'
        ? 'Quero alinhar primeiro o que já sabemos, o que ainda precisa ser avaliado e como vamos comunicar as decisões daqui para frente.'
        : 'Quero começar sem julgar o que aconteceu antes. A partir de hoje, meu compromisso é conhecer vocês, tornar as expectativas claras e construir o trabalho no campo.';
    return {
      duration,
      opening,
      keyPoints:[
        'Contexto: reconheça o momento sem procurar culpados.',
        'Critérios: explique como o trabalho e as decisões serão conduzidos.',
        'Prioridades: apresente apenas os primeiros passos.',
        'Relação: deixe claro como as pessoas poderão conversar e receber feedback.',
        'Fechamento: diga o que acontecerá imediatamente depois da reunião.'
      ],
      script:`${opening} ${data.goal || 'Quero que todos entendam o próximo passo do trabalho.'} ${data.context || ''} Não precisamos resolver tudo nesta conversa. Precisamos sair dela sabendo o que começa agora e como vamos trabalhar juntos.`,
      avoid:[
        'Promessas de resultado que você não controla.',
        'Críticas ao treinador anterior ou exposição de pessoas.',
        'Explicar todo o modelo de jogo na primeira conversa.',
        'Confundir firmeza com excesso de informação.'
      ],
      questions:[
        'O que estas pessoas precisam entender hoje — e o que pode esperar?',
        'Qual é a primeira ação que comprova o que você acabou de dizer?',
        'Há alguma promessa na sua fala que deveria virar apenas um compromisso de processo?'
      ]
    };
  }

  function momentInput() {
    return {
      type:document.getElementById('coachdayMomentType')?.value || 'new-coach',
      audience:clean(document.getElementById('coachdayMomentAudience')?.value),
      duration:document.getElementById('coachdayMomentDuration')?.value || 'meeting',
      context:clean(document.getElementById('coachdayMomentContext')?.value),
      goal:clean(document.getElementById('coachdayMomentGoal')?.value)
    };
  }

  window.prepareCoachDayMoment = async function prepareCoachDayMoment() {
    const data = momentInput();
    const local = localMomentPlan(data);
    const box = document.getElementById('coachdayMomentResult');
    box.classList.remove('hidden');
    box.textContent = 'Preparando a conversa para este público...';
    const ai = typeof callCoachAI === 'function'
      ? await callCoachAI('coachday-moment',{...data,local})
      : {};
    lastMomentPlan = {
      ...local,...ai,
      keyPoints:Array.isArray(ai.keyPoints)?ai.keyPoints:local.keyPoints,
      avoid:Array.isArray(ai.avoid)?ai.avoid:local.avoid,
      questions:Array.isArray(ai.questions)?ai.questions:local.questions
    };
    renderMomentResult(lastMomentPlan);
    const ui = getJSON(CD.ui,{});
    ui.lastMoment={input:data,result:lastMomentPlan};
    setJSON(CD.ui,ui);
  };

  function renderMomentResult(plan) {
    const box = document.getElementById('coachdayMomentResult');
    if (!box || !plan) return;
    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="coachday-result-section"><h4>Duração recomendada</h4><p>${esc(plan.duration || '')}</p></div>
      <div class="coachday-result-section"><h4>Abertura</h4><p>${esc(plan.opening || '')}</p></div>
      <div class="coachday-result-section"><h4>O que abordar</h4><ul>${(plan.keyPoints || []).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachday-result-section"><h4>Versão para treinar</h4><p>${esc(plan.script || '')}</p></div>
      <div class="coachday-result-section"><h4>Evite</h4><ul>${(plan.avoid || []).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachday-result-section"><h4>Perguntas antes de entrar na sala</h4><ul>${(plan.questions || []).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  }

  window.saveCoachDayMoment = function saveCoachDayMoment() {
    const data = momentInput();
    const plan = lastMomentPlan || localMomentPlan(data);
    addMemory('moment',`Momento — ${data.audience}`,plan.script,{type:data.type,duration:plan.duration,context:data.context});
    if (typeof toast === 'function') toast('Momento salvo na memória.');
  };

  window.practiceMomentInStudio = function practiceMomentInStudio() {
    const data = momentInput();
    const plan = lastMomentPlan || localMomentPlan(data);
    const mode = document.getElementById('studioMode');
    const prompt = document.getElementById('studioPrompt');
    const duration = document.getElementById('studioDuration');
    if (mode) mode.value = data.audience === 'Imprensa' ? 'interview-pt' : 'presentation';
    if (typeof onStudioModeChange === 'function') onStudioModeChange();
    if (prompt) prompt.value = plan.script || data.context;
    if (duration) {
      if (/6/.test(plan.duration)) duration.value='360';
      else if (/5/.test(plan.duration)) duration.value='300';
      else if (/2/.test(plan.duration)) duration.value='120';
      else duration.value='60';
    }
    go('studio');
    if (typeof toast === 'function') toast('Estúdio preparado com esta apresentação.');
  };

  window.practiceCoachDayInStudio = function practiceCoachDayInStudio() {
    const day = getDay();
    const plan = lastPrePlan || day.pre;
    const text = plan?.message || clean(day.preInput?.focus);
    if (!text) {
      if (typeof toast === 'function') toast('Prepare a comunicação antes de abrir o Estúdio.');
      return;
    }
    const mode = document.getElementById('studioMode');
    const prompt = document.getElementById('studioPrompt');
    const duration = document.getElementById('studioDuration');
    if (mode) mode.value='presentation';
    if (typeof onStudioModeChange === 'function') onStudioModeChange();
    if (prompt) prompt.value=text;
    if (duration) {
      const d = plan?.duration;
      duration.value = d === 'meeting' ? '360' : d === 'short' ? '120' : '60';
    }
    go('studio');
  };

  window.sendMomentToMentor = function sendMomentToMentor() {
    const data = momentInput();
    const plan = lastMomentPlan || localMomentPlan(data);
    const field = document.getElementById('mentorSituation');
    if (field) field.value = `Quero aprofundar esta situação do CoachDay:\n${data.context}\nObjetivo: ${data.goal}\nRascunho atual: ${plan.script}`;
    const audience = document.getElementById('mentorAudience');
    if (audience && [...audience.options].some(o=>o.value===data.audience || o.text===data.audience)) audience.value=data.audience;
    go('mentor');
  };

  function squadStore() {
    return getJSON(CD.squad, []);
  }

  function saveSquad(list) {
    setJSON(CD.squad,list);
    renderCoachDaySquad();
    refreshCoachDayRadar(false);
  }

  function ensurePlayer(name) {
    const list = squadStore();
    const found = list.find(p=>p.name.toLowerCase()===name.toLowerCase());
    if (found) return {list,player:found};
    const player = {id:'pl-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),name,records:[],createdAt:Date.now()};
    list.push(player);
    return {list,player};
  }

  function upsertSquadRecord(name, record, notify = true) {
    name=clean(name);
    if (!name) return;
    const {list,player}=ensurePlayer(name);
    player.records = player.records || [];
    player.records.unshift({
      id:'rec-'+Date.now()+'-'+Math.random().toString(36).slice(2,5),
      date:new Date().toLocaleString('pt-BR'),
      day:todayKey(),
      type:record.type || 'Acompanhamento',
      fact:clean(record.fact),
      nextStep:clean(record.nextStep),
      followup:record.followup || '',
      contacted:record.type !== 'Observação sem conversa'
    });
    saveSquad(list);
    if (notify && typeof toast === 'function') toast(`Acompanhamento de ${name} salvo.`);
  }

  window.importCoachDaySquad = function importCoachDaySquad() {
    const raw = clean(document.getElementById('coachdaySquadNames')?.value);
    if (!raw) return;
    const names = raw.split(/[\n,;]+/).map(x=>clean(x)).filter(Boolean);
    let list = squadStore();
    for (const name of names) {
      if (!list.some(p=>p.name.toLowerCase()===name.toLowerCase())) {
        list.push({id:'pl-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name,records:[],createdAt:Date.now()});
      }
    }
    saveSquad(list);
    document.getElementById('coachdaySquadNames').value='';
    if (typeof toast === 'function') toast(`${names.length} nome(s) processado(s).`);
  };

  window.saveCoachDayPlayerRecord = function saveCoachDayPlayerRecord() {
    const name=clean(document.getElementById('coachdayPlayerName')?.value);
    const type=clean(document.getElementById('coachdayContactType')?.value);
    const followup=clean(document.getElementById('coachdayFollowup')?.value);
    const fact=clean(document.getElementById('coachdayPlayerFact')?.value);
    const nextStep=clean(document.getElementById('coachdayPlayerNext')?.value);
    if (!name || !fact) {
      if (typeof toast === 'function') toast('Preencha jogador e fato/assunto.');
      return;
    }
    upsertSquadRecord(name,{type,followup,fact,nextStep},true);
    document.getElementById('coachdayPlayerFact').value='';
    document.getElementById('coachdayPlayerNext').value='';
    addMemory('squad',`Acompanhamento — ${name}`,fact,{type,nextStep,followup});
  };

  window.markCoachDayPlayerContact = function markCoachDayPlayerContact(playerId) {
    const list=squadStore();
    const player=list.find(p=>p.id===playerId);
    if (!player) return;
    player.records=player.records||[];
    player.records.unshift({
      id:'rec-'+Date.now(),date:new Date().toLocaleString('pt-BR'),day:todayKey(),
      type:'Checagem rápida',fact:'Contato realizado.',nextStep:'',followup:'',contacted:true
    });
    saveSquad(list);
  };

  window.deleteCoachDayPlayer = function deleteCoachDayPlayer(playerId) {
    if (!confirm('Remover este jogador do mapa de acompanhamento? O histórico deste jogador será apagado do mapa, mas registros gerais da Memória continuam.')) return;
    saveSquad(squadStore().filter(p=>p.id!==playerId));
  };

  function playerLastRecord(player) {
    return (player.records || [])[0] || null;
  }

  function daysSince(day) {
    if (!day) return null;
    const a=new Date(day+'T12:00:00'),b=new Date(todayKey()+'T12:00:00');
    return Math.round((b-a)/86400000);
  }

  function renderCoachDaySquad() {
    const list=squadStore();
    const wrap=document.getElementById('coachdaySquadList');
    const stats=document.getElementById('coachdaySquadStats');
    if (stats) {
      const pending=list.filter(p=>playerLastRecord(p)?.nextStep).length;
      const never=list.filter(p=>!(p.records||[]).some(r=>r.contacted)).length;
      const recent=list.filter(p=>{
        const last=playerLastRecord(p); return last?.day && daysSince(last.day)<=7;
      }).length;
      stats.innerHTML=`
        <div class="coachday-stat"><strong>${list.length}</strong><small>Cadastrados</small></div>
        <div class="coachday-stat"><strong>${pending}</strong><small>Com próximo passo</small></div>
        <div class="coachday-stat"><strong>${never}</strong><small>Sem conversa registrada</small></div>
        <div class="coachday-stat"><strong>${recent}</strong><small>Contato/registro em 7 dias</small></div>`;
    }
    if (!wrap) return;
    if (!list.length) {
      wrap.innerHTML='<p class="coachday-empty">Cadastre o elenco para visualizar equilíbrio de atenção e conversas pendentes.</p>';
      return;
    }
    wrap.innerHTML=list
      .slice()
      .sort((a,b)=>{
        const ad=playerLastRecord(a)?.day||'',bd=playerLastRecord(b)?.day||'';
        return ad.localeCompare(bd);
      })
      .map(player=>{
        const last=playerLastRecord(player);
        const contactRecords=(player.records||[]).filter(r=>r.contacted);
        const lastContact=contactRecords[0];
        const age=lastContact?.day ? daysSince(lastContact.day) : null;
        return `<article class="coachday-player-card">
          <div class="coachday-player-top">
            <div><h3>${esc(player.name)}</h3><div class="coachday-player-meta">
              <span class="coachday-mini-badge ${lastContact?'ok':'pending'}">${lastContact ? `último contato: ${age===0?'hoje':age+' dia(s)'}` : 'sem conversa registrada'}</span>
              ${last?.nextStep?'<span class="coachday-mini-badge pending">próximo passo</span>':''}
            </div></div>
            <button class="outline" onclick="deleteCoachDayPlayer('${player.id}')">Excluir</button>
          </div>
          ${last ? `<p><strong>${esc(last.type)}:</strong> ${esc(last.fact || '')}</p>${last.nextStep?`<p><strong>Próximo:</strong> ${esc(last.nextStep)}</p>`:''}` : '<p>Nenhum registro ainda.</p>'}
          <div class="coachday-toolbar"><button class="secondary" onclick="markCoachDayPlayerContact('${player.id}')">Registrar contato hoje</button></div>
        </article>`;
      }).join('');
  }

  function radarLocal() {
    const attention=[];
    const yesterday=getDay(todayKey(-1));
    if (yesterday?.post?.summary) {
      attention.push({icon:'↩',subject:'Ontem',why:yesterday.post.summary,nextStep:(yesterday.post.tomorrow||[])[0]||'Escolha o que realmente precisa continuar hoje.'});
    }
    const week=getWeek();
    if (week.theme) {
      attention.push({icon:'📅',subject:'Semana',why:week.theme,nextStep:'Conecte o treino de hoje ao tema da semana sem repetir toda a reunião.'});
    }
    const squad=squadStore();
    const pending=squad.filter(p=>playerLastRecord(p)?.nextStep).slice(0,3);
    pending.forEach(p=>{
      const last=playerLastRecord(p);
      attention.push({icon:'👤',subject:p.name,why:last.fact||'Acompanhamento pendente',nextStep:last.nextStep});
    });
    const withoutContact=squad.filter(p=>!(p.records||[]).some(r=>r.contacted));
    if (withoutContact.length) {
      attention.push({icon:'⚖',subject:'Equilíbrio de atenção',why:`${withoutContact.length} jogador(es) cadastrado(s) ainda não têm conversa registrada.`,nextStep:'Não é necessário falar com todos hoje; escolha contatos naturais ao longo da semana.'});
    }
    if (!attention.length) {
      attention.push({icon:'🧭',subject:'Comece pelo contexto',why:'Ainda há pouca memória registrada.',nextStep:'Conte o que acontece hoje e deixe o CoachDay construir continuidade a partir daí.'});
    }
    return {
      attention:attention.slice(0,6),
      communicationNote:'Nem todo dia precisa de uma reunião. Fale quando houver informação nova, decisão, direção ou necessidade real de alinhamento.',
      question:reflectionQuestions[new Date().getDay() % reflectionQuestions.length]
    };
  }

  window.refreshCoachDayRadar = async function refreshCoachDayRadar(useAI = false) {
    const local=radarLocal();
    let result=local;
    if (useAI && typeof callCoachAI === 'function') {
      const ai=await callCoachAI('coachday-radar',{
        local,
        yesterday:compactYesterday(),
        week:getWeek(),
        squad:squadStore().slice(0,20).map(p=>({name:p.name,last:playerLastRecord(p)})),
        memory:memoryStore().slice(0,10).map(x=>({type:x.type,title:x.title,summary:x.summary,day:x.day}))
      });
      result={
        ...local,...ai,
        attention:Array.isArray(ai.attention)?ai.attention:local.attention
      };
    }
    renderRadar(result);
  };

  function renderRadar(result) {
    const list=document.getElementById('coachdayRadarList');
    const question=document.getElementById('coachdayRadarQuestion');
    const date=document.getElementById('coachdayRadarDate');
    if (date) date.textContent=displayDate();
    if (list) list.innerHTML=(result.attention||[]).map(item=>`
      <div class="coachday-attention">
        <span class="icon">${esc(item.icon||'•')}</span>
        <div><strong>${esc(item.subject||item.type||'Atenção')}</strong>
        <small>${esc(item.why||'')}${item.nextStep?`<br><b>Próximo:</b> ${esc(item.nextStep)}`:''}</small></div>
      </div>`).join('');
    if (question) question.textContent=result.question || result.communicationNote || '';
  }

  function renderYesterday() {
    const day=getDay(todayKey(-1));
    const title=document.getElementById('coachdayYesterdayTitle');
    const box=document.getElementById('coachdayYesterdaySummary');
    if (title) title.textContent=`Ontem — ${displayDate(todayKey(-1))}`;
    if (!box) return;
    const parts=[];
    if (day.pre?.message) parts.push(`<p><strong>Antes:</strong> ${esc(day.pre.message)}</p>`);
    if (day.post?.summary) parts.push(`<p><strong>Depois:</strong> ${esc(day.post.summary)}</p>`);
    if (day.post?.tomorrow?.length) parts.push(`<p><strong>Ficou para hoje:</strong> ${day.post.tomorrow.map(esc).join(' · ')}</p>`);
    box.innerHTML=parts.length?parts.join(''):'<p class="coachday-empty">Ainda não há um fechamento salvo para ontem.</p>';
  }

  function renderCoachDayMemory() {
    renderYesterday();
    const list=memoryStore();
    const wrap=document.getElementById('coachdayMemoryList');
    if (!wrap) return;
    if (!list.length) {
      wrap.innerHTML='<p class="coachday-empty">A memória começará a aparecer quando você salvar preparações, pós-atividade, momentos e acompanhamentos.</p>';
      return;
    }
    wrap.innerHTML=list.slice(0,80).map(item=>`
      <article class="coachday-memory-entry">
        <div class="coachday-memory-top">
          <div><h3>${esc(item.title)}</h3><div class="coachday-memory-meta">
            <span class="coachday-mini-badge">${esc(item.type)}</span>
            <span class="coachday-mini-badge">${esc(item.dateLabel||item.day)}</span>
          </div></div>
        </div>
        <p>${esc(item.summary)}</p>
      </article>`).join('');
  }

  window.buildCoachDayWeeklyReview = function buildCoachDayWeeklyReview() {
    const list=memoryStore().filter(item=>{
      const diff=daysSince(item.day);
      return diff!==null && diff>=0 && diff<=7;
    });
    const squad=squadStore();
    const contacts=squad.reduce((sum,p)=>sum+(p.records||[]).filter(r=>r.contacted && daysSince(r.day)<=7).length,0);
    const types={};
    list.forEach(item=>types[item.type]=(types[item.type]||0)+1);
    const result=document.getElementById('coachdayWeeklyReview');
    if (!result) return;
    const pending=squad.filter(p=>playerLastRecord(p)?.nextStep).map(p=>p.name);
    result.innerHTML=`
      <div class="coachday-result-section"><h4>Últimos 7 dias</h4><p>${list.length} registros na memória e ${contacts} contato(s) individuais registrados.</p></div>
      <div class="coachday-result-section"><h4>Distribuição</h4><p>${Object.entries(types).map(([k,v])=>`${esc(k)}: ${v}`).join(' · ') || 'Ainda há poucos registros.'}</p></div>
      <div class="coachday-result-section"><h4>Pendências</h4><p>${pending.length?`Acompanhar: ${pending.map(esc).join(', ')}.`:'Nenhum próximo passo individual registrado.'}</p></div>
      <div class="coachday-question">Revise se suas conversas desta semana tiveram propósitos diferentes — reconhecer, corrigir, ouvir e esclarecer — ou se você repetiu sempre o mesmo tipo de intervenção.</div>`;
  };

  window.saveCoachDayReflection = function saveCoachDayReflection() {
    const answer=clean(document.getElementById('coachdayReflectionAnswer')?.value);
    const question=clean(document.getElementById('coachdayReflectionQuestion')?.textContent);
    if (!answer) {
      if (typeof toast === 'function') toast('Escreva uma reflexão antes de salvar.');
      return;
    }
    addMemory('reflection','Reflexão do treinador',`${question} — ${answer}`);
    document.getElementById('coachdayReflectionAnswer').value='';
    if (typeof toast === 'function') toast('Reflexão salva.');
  };

  window.exportCoachDayData = function exportCoachDayData() {
    const data={
      exportedAt:new Date().toISOString(),
      coachDayVersion:'4.0',
      days:getJSON(CD.days,{}),
      week:getWeek(),
      squad:squadStore(),
      memory:memoryStore()
    };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=`coachday-backup-${todayKey()}.json`;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  function saveCoachDayForm() {
    const day=getDay();
    day.preInput={
      event:document.getElementById('coachdayEvent')?.value || 'training',
      audience:clean(document.getElementById('coachdayAudience')?.value),
      duration:document.getElementById('coachdayDuration')?.value || 'auto',
      focus:clean(document.getElementById('coachdayFocus')?.value),
      context:clean(document.getElementById('coachdayContext')?.value),
      style:document.getElementById('coachdayStyle')?.value || 'auto',
      newInfo:clean(document.getElementById('coachdayNewInfo')?.value)
    };
    day.postRaw=clean(document.getElementById('coachdayPostRaw')?.value);
    saveDay(day);
  }

  function loadCoachDayForm() {
    const day=getDay();
    const data=day.preInput||{};
    const setters={
      coachdayEvent:data.event||'training',
      coachdayAudience:data.audience||'Elenco completo',
      coachdayDuration:data.duration||'auto',
      coachdayFocus:data.focus||'',
      coachdayContext:data.context||'',
      coachdayStyle:data.style||'auto',
      coachdayNewInfo:data.newInfo||'',
      coachdayPostRaw:day.postRaw||day.post?.raw||''
    };
    Object.entries(setters).forEach(([id,value])=>{
      const el=document.getElementById(id);if(el)el.value=value;
    });
    lastPrePlan=day.pre||lastPrePlan;
    lastPostPlan=day.post||lastPostPlan;
    if(lastPrePlan)renderPreResult(lastPrePlan);
    if(lastPostPlan)renderPostResult(lastPostPlan);
  }

  function bindAutosave() {
    if (bound) return;
    bound=true;
    const ids=[
      'coachdayEvent','coachdayAudience','coachdayDuration','coachdayFocus','coachdayContext',
      'coachdayStyle','coachdayNewInfo','coachdayPostRaw'
    ];
    ids.forEach(id=>{
      const el=document.getElementById(id);
      if (!el) return;
      el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{
        clearTimeout(el._coachdayTimer);
        el._coachdayTimer=setTimeout(saveCoachDayForm,350);
      });
    });
    ['coachdayWeekTheme','coachdayOpponent','coachdayOpponentKeys'].forEach(id=>{
      const el=document.getElementById(id);
      if(el)el.addEventListener('input',()=>{clearTimeout(el._cdt);el._cdt=setTimeout(()=>saveCoachDayWeek(false),450)});
    });
    document.addEventListener('input',event=>{
      if(event.target?.matches?.('[data-week-day]')){
        clearTimeout(event.target._cdt);
        event.target._cdt=setTimeout(()=>saveCoachDayWeek(false),450);
      }
    });
  }

  window.showCoachDayTab = function showCoachDayTab(tab) {
    document.querySelectorAll('.coachday-pane').forEach(p=>p.classList.toggle('active',p.id===`coachdayPane${tab[0].toUpperCase()+tab.slice(1)}`));
    document.querySelectorAll('.coachday-tab').forEach(b=>b.classList.toggle('active',b.dataset.coachdayTab===tab));
    const ui=getJSON(CD.ui,{});
    ui.tab=tab;setJSON(CD.ui,ui);
    if(tab==='squad')renderCoachDaySquad();
    if(tab==='memory'){renderCoachDayMemory();buildCoachDayWeeklyReview();}
  };

  function updateCoachDayHome() {
    const day=getDay();
    const title=document.getElementById('homeDailyTitle');
    const text=document.getElementById('homeDailyText');
    const done=document.getElementById('homeDailyDone');
    const date=document.getElementById('homeDateLabel');
    if(date)date.textContent=displayDate().toUpperCase();
    if(title){
      if(day.post?.summary)title.textContent='Dia registrado. Veja o que deve continuar amanhã.';
      else if(day.pre?.message)title.textContent='Sua comunicação de hoje está preparada.';
      else if(day.preInput?.focus)title.textContent=`Hoje: ${day.preInput.focus}`;
      else title.textContent='Conte o que acontece hoje.';
    }
    if(text){
      text.textContent=day.post?.summary || day.pre?.recommendation ||
        'O CoachDay conecta treino, comunicação, elenco e memória sem transformar todo dia em uma reunião.';
    }
    if(done){
      const count=[day.pre,day.post].filter(Boolean).length;
      done.textContent=`${count} etapa(s) do CoachDay`;
    }
  }

  function loadWeekForm() {
    const week=getWeek();
    const theme=document.getElementById('coachdayWeekTheme');
    const opponent=document.getElementById('coachdayOpponent');
    const keys=document.getElementById('coachdayOpponentKeys');
    if(theme)theme.value=week.theme||'';
    if(opponent)opponent.value=week.opponent||'';
    if(keys)keys.value=week.opponentKeys||'';
    renderWeekDays();
    if(week.result)renderWeekResult(week.result);
  }

  window.initializeCoachDay = function initializeCoachDay() {
    if(!document.getElementById('daily'))return;
    loadCoachDayForm();
    loadWeekForm();
    renderCoachDaySquad();
    renderCoachDayMemory();
    const question=document.getElementById('coachdayReflectionQuestion');
    if(question)question.textContent=reflectionQuestions[new Date().getDay()%reflectionQuestions.length];
    const ui=getJSON(CD.ui,{});
    showCoachDayTab(ui.tab||'today');
    const storedMoment=ui.lastMoment;
    if(storedMoment?.input){
      const d=storedMoment.input;
      const type=document.getElementById('coachdayMomentType');if(type)type.value=d.type||'new-coach';
      const aud=document.getElementById('coachdayMomentAudience');if(aud)aud.value=d.audience||'Elenco';
      const dur=document.getElementById('coachdayMomentDuration');if(dur)dur.value=d.duration||'meeting';
      const context=document.getElementById('coachdayMomentContext');if(context)context.value=d.context||'';
      const goal=document.getElementById('coachdayMomentGoal');if(goal)goal.value=d.goal||'';
      lastMomentPlan=storedMoment.result||null;
      if(lastMomentPlan)renderMomentResult(lastMomentPlan);
    } else {
      loadCoachDayMomentPreset();
    }
    bindAutosave();
    updateCoachDayHome();
    refreshCoachDayRadar(false);
  };

  // Expõe atualização para chamadas futuras do updateUI.
  window.updateCoachDayHome = updateCoachDayHome;

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',window.initializeCoachDay,{once:true});
  }else{
    window.initializeCoachDay();
  }
})();
