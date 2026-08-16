(() => {
  'use strict';

  const CP = {
    config:'coachprep-config-v41',
    plan:'coachprep-plan-v41',
    code:'coachprep-code-v41',
    history:'coachprep-history-v41',
    daily:'coachprep-daily-v41',
    ui:'coachprep-ui-v41'
  };

  const defaultCode = [
    'Minhas decisões importantes precisam ter critério que eu consiga explicar.',
    'Eu corrijo comportamento e decisão; não transformo um episódio em rótulo sobre a pessoa.',
    'Eu não tomo decisões importantes no calor da reação quando posso criar tempo para pensar.',
    'Eu protejo o grupo publicamente e trato correções individuais no ambiente adequado.',
    'Eu procuro ouvir antes de explicar quando a conversa envolve frustração ou discordância.',
    'Eu não prometo titularidade; deixo claro o comportamento e o papel que espero.',
    'Eu distribuo atenção também a quem não está jogando ou não procura espontaneamente o treinador.',
    'Todos têm valor; as decisões precisam servir ao coletivo e aparecer com coerência no dia a dia.',
    'Autoridade nasce da coerência entre discurso, decisão e atitude diária.'
  ];

  const phases = [
    {
      id:'identity',
      title:'Semanas 1–2 — Identidade e processo coletivo',
      purpose:'Definir seus princípios e transformar valores em comportamentos observáveis.',
      topics:['Identidade do treinador','Processo coletivo e coerência']
    },
    {
      id:'conversations',
      title:'Semanas 3–5 — Conversas individuais',
      purpose:'Treinar escuta, critério, micro-meta e fechamento com diferentes perfis de atletas.',
      topics:['Atleta sem minutos','Titular, jovem e experiente','Feedback, micro-meta e acompanhamento']
    },
    {
      id:'conflicts',
      title:'Semanas 6–8 — Conflitos e decisões difíceis',
      purpose:'Praticar firmeza sem fechar portas em situações de tensão.',
      topics:['Substituição e reclamações','Capitão, disciplina e conflitos','Critério sob pressão']
    },
    {
      id:'criticism',
      title:'Semanas 9–10 — Pós-jogo, críticas e pressão',
      purpose:'Separar fatos, ruído, responsabilidade e comunicação após resultados.',
      topics:['Pós-jogo e proteção do grupo','Críticas, imprensa e diretoria']
    },
    {
      id:'arrival',
      title:'Semanas 11–12 — Simulação completa',
      purpose:'Integrar liderança, comunicação e gestão na chegada ao clube.',
      topics:['Primeiros dias e decisões','Primeira semana completa']
    }
  ];

  const curriculum12 = [
    {week:1,phaseId:'identity',topic:'Identidade do treinador',goal:'Definir como você quer liderar quando houver pressão, frustração e decisões impopulares.'},
    {week:2,phaseId:'identity',topic:'Processo coletivo e coerência',goal:'Todos têm valor; as decisões precisam servir ao coletivo. Transforme esse princípio em comportamento diário.'},
    {week:3,phaseId:'conversations',topic:'Atleta que não vem jogando',goal:'Ouvir sem prometer, explicar critério e deixar uma micro-meta.'},
    {week:4,phaseId:'conversations',topic:'Titular, jovem e experiente',goal:'Adaptar a mesma coerência a perfis e momentos diferentes.'},
    {week:5,phaseId:'conversations',topic:'Feedback e acompanhamento',goal:'Equilibrar correção, reconhecimento e continuidade das conversas.'},
    {week:6,phaseId:'conflicts',topic:'Substituição e reclamação',goal:'Validar a frustração sem negociar respeito ao ambiente e sem discutir no calor do momento.'},
    {week:7,phaseId:'conflicts',topic:'Capitão, disciplina e conflito',goal:'Proteger relações e grupo com critérios claros e conversas no ambiente adequado.'},
    {week:8,phaseId:'conflicts',topic:'Decisão sob pressão',goal:'Separar fato, critério, comunicação e revisão quando há pressão de jogador, comissão ou diretoria.'},
    {week:9,phaseId:'criticism',topic:'Pós-jogo e críticas',goal:'Assumir responsabilidade sem procurar culpados e escolher o que realmente precisa de ação.'},
    {week:10,phaseId:'criticism',topic:'Imprensa, diretoria e Filtro da Crítica',goal:'Distinguir parte útil, ruído, controle e urgência antes de responder.'},
    {week:11,phaseId:'arrival',topic:'Chegada ao clube',goal:'Ensaiar apresentação, primeiros contatos e primeira decisão de equipe.'},
    {week:12,phaseId:'arrival',topic:'Simulação da primeira semana',goal:'Integrar elenco, comissão, diretoria, imprensa, pré-jogo e pós-jogo.'}
  ];

  const dailyExercises = [
    {
      title:'Ouvir antes de explicar',
      why:'Em conversas difíceis, começar justificando a decisão pode fechar o canal antes de você entender a perspectiva da outra pessoa.',
      question:'Um jogador pergunta por que perdeu a titularidade. Qual seria sua primeira pergunta antes de explicar o critério?',
      context:'Responda em até 45 segundos. O objetivo de hoje é apenas abrir a conversa, não resolver toda a situação.',
      type:'listening'
    },
    {
      title:'Separar episódio e pessoa',
      why:'Um erro ou uma reação negativa não precisa definir sua avaliação futura do atleta.',
      question:'Depois de um erro tático importante no jogo, como você corrigiria o comportamento sem fazer o jogador sentir que foi “marcado”?',
      context:'Explique fato, expectativa e próxima oportunidade de resposta.',
      type:'criterion'
    },
    {
      title:'Critério antes da decisão',
      why:'A coerência fica mais forte quando você sabe por que está decidindo antes de pensar em como justificar.',
      question:'Você precisa colocar um titular no banco. Quais três critérios precisam estar claros na sua cabeça antes da conversa?',
      context:'Evite “porque eu sou o treinador”. Procure fatos, necessidade do jogo e comportamento esperado.',
      type:'decision'
    },
    {
      title:'Reconhecer sem bajular',
      why:'Gestão não pode ser apenas correção. Reconhecimento específico ajuda o jogador a saber o que repetir.',
      question:'Como você daria um feedback positivo de 30 segundos a um jogador que respondeu bem depois de perder espaço?',
      context:'Diga qual comportamento você observou e por que ele ajuda a equipe.',
      type:'recognition'
    },
    {
      title:'Firme sem fechar portas',
      why:'Uma decisão pode ser negativa para o jogador hoje e ainda deixar um caminho claro de resposta amanhã.',
      question:'Um reserva diz: “Professor, parece que não importa o que eu faça, eu não vou jogar.” Como você responderia?',
      context:'Não prometa minutos. Reconheça a frustração, explique o que observa e deixe uma micro-meta.',
      type:'conversation'
    },
    {
      title:'Proteger o ambiente',
      why:'Nem toda insatisfação precisa virar conflito público ou reunião coletiva.',
      question:'Um jogador reclama da escalação na frente de outros atletas. O que você fala naquele momento e o que deixa para uma conversa privada?',
      context:'Divida a resposta em “agora” e “depois”.',
      type:'environment'
    },
    {
      title:'Não falar por hábito',
      why:'Liderança também é escolher quando uma conversa coletiva não acrescenta informação.',
      question:'Você falou cinco minutos com o elenco ontem. Hoje o treino é cedo e não existe conteúdo novo importante. O que você faria antes de começar?',
      context:'Explique se falaria, quanto tempo e qual informação seria suficiente.',
      type:'communication'
    }
    ,
    {
      title:'Crítica da Sexta',
      why:'Uma crítica ou decisão da semana pode conter uma parte útil sem merecer toda a sua energia.',
      question:'Escolha uma crítica ou decisão desta semana. O que é fato, o que depende de você, o que é ruído e qual ação realmente merece um X?',
      context:'Use o Filtro da Crítica no Mentor depois da sua resposta.',
      type:'criticism'
    }
  ];

  const threeProfiles = {
    notplaying:{
      label:'Atleta que não vem jogando',
      prompt:'O jogador diz: “Professor, eu estou treinando e não estou recebendo oportunidade. Queria entender o que falta.”',
      model:'Quero primeiro ouvir como você está vendo seu momento. Depois eu te explico o que tenho observado e deixamos uma meta bem concreta para esta semana.'
    },
    starter:{
      label:'Titular em fase ruim',
      prompt:'O jogador diz: “Eu sei que não estou bem, mas sinto que estou jogando pressionado para não errar.”',
      model:'Quero entender onde você está sentindo essa pressão. Depois vamos separar uma ou duas ações que você consegue controlar no próximo treino.'
    },
    young:{
      label:'Jogador jovem',
      prompt:'O jovem diz: “Depois daquele erro eu fiquei pensando que talvez não esteja pronto.”',
      model:'O erro precisa ser corrigido, mas ele não define quem você é como jogador. Quero ouvir o que você viu no lance e depois vamos definir o comportamento para a próxima situação.'
    },
    experienced:{
      label:'Jogador experiente',
      prompt:'O jogador diz: “Tenho experiência e sinto que algumas decisões estão sendo tomadas sem me ouvir.”',
      model:'Eu respeito sua experiência e quero ouvir sua leitura. Isso não significa que vamos decidir tudo da mesma forma, mas quero manter esse canal aberto.'
    },
    substitute:{
      label:'Reserva que perdeu espaço',
      prompt:'O jogador diz: “Antes eu entrava todo jogo. Agora parece que estou cada vez mais longe.”',
      model:'Eu entendo que a mudança incomoda. Quero separar a situação de hoje do caminho daqui para frente e te dizer o que eu preciso ver no treino.'
    },
    returning:{
      label:'Atleta voltando de lesão',
      prompt:'O atleta diz: “Eu me sinto pronto para jogar mais minutos, mas parece que estão me segurando.”',
      model:'Quero ouvir como você está se sentindo no campo. A decisão de minutos também considera o processo com o departamento médico e a resposta nos treinos.'
    },
    positive:{
      label:'Atleta que respondeu positivamente',
      prompt:'O jogador teve uma boa semana depois de receber uma correção e não procurou você para conversar.',
      model:'Quero reconhecer uma coisa específica: sua resposta depois da nossa última conversa foi muito boa. Continue repetindo esse comportamento.'
    },
    decisive:{
      label:'Jogador que pode ser decisivo',
      prompt:'Você quer preparar um jogador importante para assumir responsabilidade sem colocar peso excessivo sobre ele.',
      model:'Você pode ser importante neste jogo. Não preciso que resolva tudo sozinho; preciso que repita os comportamentos que treinamos e ajude o grupo dentro do seu papel.'
    }
  };

  const simulationScenarios = {
    player:[
      {id:'bench',title:'Perdeu a titularidade',prompt:'“Professor, eu fui titular o campeonato todo. Por que você me tirou agora?”'},
      {id:'minutes',title:'Quer mais minutos',prompt:'“Eu entro dez minutos e depois dizem que preciso mostrar mais. Como vou mostrar desse jeito?”'},
      {id:'sub',title:'Reagiu mal à substituição',prompt:'“Eu não gostei de sair. Eu era um dos melhores em campo.”'},
      {id:'mistake',title:'Erro fora do plano',prompt:'“Eu tomei aquela decisão porque achei que era a melhor no momento. Agora parece que você não confia mais em mim.”'}
    ],
    captain:[
      {id:'captain-complaint',title:'Capitão discorda da cobrança',prompt:'“Professor, o grupo achou que a cobrança de hoje foi pesada demais.”'},
      {id:'captain-role',title:'Mudança de capitão',prompt:'“Quero entender por que você mudou a faixa. Isso muda sua confiança em mim?”'},
      {id:'locker',title:'Problema no vestiário',prompt:'“Tem dois jogadores que estão se estranhando e isso está começando a contaminar o grupo.”'}
    ],
    staff:[
      {id:'staff-disagree',title:'Auxiliar discorda',prompt:'“Eu não concordo com a mudança tática e acho que precisamos rever antes de apresentar ao grupo.”'},
      {id:'staff-public',title:'Discordância na frente da comissão',prompt:'O auxiliar questionou uma decisão sua diante dos demais membros da comissão.'},
      {id:'staff-standard',title:'Padrão de treino não foi seguido',prompt:'A comissão montou uma atividade que não respeitou o princípio combinado para a semana.'}
    ],
    board:[
      {id:'board-player',title:'Pedido sobre escalação',prompt:'“Esse jogador é importante para o clube. Precisamos que ele esteja mais em campo.”'},
      {id:'board-results',title:'Cobrança por resultados',prompt:'“O desempenho ainda não evoluiu. O que você precisa mudar agora?”'},
      {id:'board-recruit',title:'Pedido de reforços',prompt:'A diretoria pede que você explique por que precisa de uma contratação sem desvalorizar o elenco atual.'}
    ]
  };

  const decisionScenarios = {
    bench:{
      prompt:'Você decidiu tirar da equipe titular um jogador que vinha começando os jogos.',
      defaults:{fact:'O rendimento e/ou a necessidade do próximo jogo indicam outra composição.',criterion:'Rendimento recente, comportamento treinado e necessidade do jogo.',who:'O jogador antes da divulgação coletiva, depois o grupo pela escalação.',review:'Após o próximo ciclo de treinos e jogos.'}
    },
    captain:{
      prompt:'Você considera mudar a faixa de capitão.',
      defaults:{fact:'A função de liderança precisa de outro desenho neste momento.',criterion:'Comportamento de liderança, necessidades do grupo e função dentro da equipe.',who:'Primeiro o capitão envolvido; depois os líderes e o grupo de forma simples.',review:'Revisão periódica da estrutura de liderança.'}
    },
    'young-error':{
      prompt:'Um jogador jovem cometeu um erro decisivo e será muito comentado.',
      defaults:{fact:'Houve um erro observável em uma decisão do jogo.',criterion:'Corrigir a ação sem transformar o episódio em julgamento do atleta.',who:'Jogador em particular e grupo apenas sobre o comportamento coletivo.',review:'Observar a resposta nos próximos treinos.'}
    },
    'sub-reaction':{
      prompt:'Um jogador demonstrou insatisfação e discutiu ao ser substituído.',
      defaults:{fact:'Houve uma reação pública à substituição.',criterion:'Respeito ao ambiente e direito do treinador de decidir, sem negar o direito à frustração.',who:'Jogador em conversa privada; grupo somente se o ambiente foi afetado.',review:'Após a conversa e a resposta comportamental.'}
    },
    complaint:{
      prompt:'Um jogador critica publicamente sua decisão.',
      defaults:{fact:'A crítica foi feita em espaço público e pode afetar o ambiente.',criterion:'Proteger o grupo e tratar divergências nos canais internos.',who:'Jogador e, se necessário, liderança/comissão.',review:'Depois da conversa e dos próximos comportamentos.'}
    },
    training:{
      prompt:'Um jogador importante está treinando abaixo do padrão.',
      defaults:{fact:'Comportamentos específicos de treino estão abaixo da expectativa.',criterion:'Mesmo padrão de cobrança aplicado ao grupo, ajustado à função.',who:'Jogador individualmente.',review:'Próximas duas ou três sessões.'}
    },
    conflict:{
      prompt:'Dois jogadores entram em conflito recorrente.',
      defaults:{fact:'Existem episódios observáveis de conflito que afetam o trabalho.',criterion:'Respeito, funcionamento do grupo e responsabilidade individual.',who:'Primeiro separadamente; depois juntos se houver condições.',review:'Depois de acordos claros e observação.'}
    },
    'board-pressure':{
      prompt:'Um dirigente pressiona para que determinado jogador seja escalado.',
      defaults:{fact:'Existe uma solicitação externa sobre decisão técnica.',criterion:'Responsabilidade técnica, desempenho, necessidade do jogo e governança do clube.',who:'Diretoria em conversa profissional; não transferir pressão para o jogador.',review:'Sempre que houver mudança relevante de contexto.'}
    },
    cut:{
      prompt:'Um jogador ficará fora da convocação.',
      defaults:{fact:'A lista exige uma decisão de seleção.',criterion:'Necessidade do jogo, rendimento, função e equilíbrio do grupo.',who:'Quando apropriado, jogador antes da exposição pública.',review:'Nova convocação começa uma nova avaliação.'}
    }
  };

  const firstWeek = [
    {day:1,title:'Primeiro encontro com o elenco',focus:'Apresentar relação de trabalho, critérios e próximos passos sem explicar tudo.',mode:'studio',prompt:'Você está se apresentando ao elenco pela primeira vez. Fale por 5 minutos sobre como quer trabalhar, como tomará decisões e o que começa agora.'},
    {day:2,title:'Conhecer antes de concluir',focus:'Ouvir jogadores e comissão; evitar formar julgamentos definitivos cedo.',mode:'three',prompt:'Faça três conversas curtas com perfis diferentes e pratique perguntas de escuta.'},
    {day:3,title:'Primeiro critério de equipe',focus:'Comunicar uma decisão de treino ou escalação sem transformar em promessa ou punição.',mode:'decision',prompt:'Um jogador esperava estar no time e ficou fora. Prepare a conversa antes da divulgação.'},
    {day:4,title:'Primeiro jogador insatisfeito',focus:'Manter firmeza e canal aberto depois de uma decisão negativa para o atleta.',mode:'simulation',prompt:'O jogador diz que não entende sua decisão e questiona se realmente terá oportunidade.'},
    {day:5,title:'Primeira comunicação externa',focus:'Proteger grupo, não prometer resultado e explicar o processo de forma simples.',mode:'studio',prompt:'Faça sua primeira coletiva como treinador, com uma equipe em momento de pressão.'},
    {day:6,title:'Reunião pré-jogo',focus:'Ser claro, breve e conectado ao que foi treinado durante a semana.',mode:'studio',prompt:'Faça uma reunião de 5 minutos antes do primeiro jogo. Use poucas referências já treinadas.'},
    {day:7,title:'Primeiro pós-jogo',focus:'Separar emoção do resultado, proteger pessoas e identificar próximos passos.',mode:'coachday',prompt:'Registre o que aconteceu no primeiro jogo e escolha o que precisa ser tratado no dia seguinte.'}
  ];

  let threeHistory = [];
  let simHistory = [];
  let currentDailyExercise = null;

  function getJSON(key,fallback){
    try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}
    catch{return fallback;}
  }
  function setJSON(key,value){localStorage.setItem(key,JSON.stringify(value));}
  function esc(value){
    return String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  }
  function todayKey(){
    const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function defaultStartDate(){
    const d=new Date();
    const year=d.getMonth()<=9?d.getFullYear():d.getFullYear()+1;
    return `${year}-11-01`;
  }
  function getConfig(){
    return getJSON(CP.config,{startDate:defaultStartDate()});
  }
  function saveConfig(config){setJSON(CP.config,config);}
  function daysUntilStart(){
    const date=getConfig().startDate||defaultStartDate();
    const start=new Date(date+'T12:00:00');
    const now=new Date();now.setHours(12,0,0,0);
    return Math.max(0,Math.ceil((start-now)/86400000));
  }
  function totalWeeks(){ return 12; }
  function phaseForWeek(week,total=12){
    if(week<=2)return phases[0];
    if(week<=5)return phases[1];
    if(week<=8)return phases[2];
    if(week<=10)return phases[3];
    return phases[4];
  }
  function currentWeekNumber(){
    const startDate=getConfig().startDate||defaultStartDate();
    const start=new Date(startDate+'T12:00:00');
    const planStart=new Date(start);
    planStart.setDate(planStart.getDate()-84);
    const now=new Date();now.setHours(12,0,0,0);
    const elapsed=Math.floor((now-planStart)/604800000);
    return Math.min(12,Math.max(1,elapsed+1));
  }
  function history(){
    return getJSON(CP.history,[]);
  }
  function logActivity(type,title,data={}){
    const list=history();
    list.unshift({
      id:'cp-'+Date.now()+'-'+Math.random().toString(36).slice(2,6),
      type,title,data,day:todayKey(),date:new Date().toLocaleString('pt-BR'),createdAt:Date.now()
    });
    setJSON(CP.history,list.slice(0,300));
    renderCoachPrepProgress();
    updateCoachPrepHome();
  }
  function currentPhase(){
    const total=totalWeeks();
    return phaseForWeek(currentWeekNumber(),total);
  }

  window.saveCoachPrepStartDate=function saveCoachPrepStartDate(){
    const value=document.getElementById('coachprepStartDate')?.value;
    if(!value)return;
    const cfg=getConfig();cfg.startDate=value;saveConfig(cfg);
    buildCoachPrepPlan();
    refreshCoachPrepHeader();
    renderCoachPrepToday();
    updateCoachPrepHome();
  };

  function refreshCoachPrepHeader(){
    const days=daysUntilStart(),weeks=totalWeeks(),phase=currentPhase();
    const d=document.getElementById('coachprepDaysRemaining');if(d)d.textContent=days;
    const w=document.getElementById('coachprepWeeksRemaining');if(w)w.textContent=weeks;
    const p=document.getElementById('coachprepCurrentPhase');
    if(p)p.innerHTML=`<strong>Fase atual: ${esc(phase.title)}</strong><br>${esc(phase.purpose)}`;
  }

  window.buildCoachPrepPlan=function buildCoachPrepPlan(){
    const old=getJSON(CP.plan,{});
    const weeks=curriculum12.map(item=>{
      const phase=phases.find(p=>p.id===item.phaseId)||phases[0];
      return {
        week:item.week,phaseId:item.phaseId,phase:phase.title,topic:item.topic,goal:item.goal,
        activities:[
          'Segunda — reflexão e princípio: 15–20 min.',
          'Terça — conversa individual ou decisão prática: 15–25 min.',
          'Quarta — simulação com IA por voz: 15–25 min.',
          'Quinta — refazer resposta em áudio ou vídeo: 15–25 min.',
          item.week>=9 ? 'Sexta — Crítica da Sexta: filtre fato, ação, ruído e ponto cego.' : 'Sexta — revisão: o que você evitou, decidiu e quer repetir.'
        ],
        reviewed:Boolean(old.weeks?.find(x=>x.week===item.week)?.reviewed)
      };
    });
    const plan={createdAt:old.createdAt||Date.now(),startDate:getConfig().startDate,weeks,program:'12-weeks'};
    setJSON(CP.plan,plan);
    renderCoachPrepPlan();
    refreshCoachPrepHeader();
  };

  function renderCoachPrepPlan(){
    let plan=getJSON(CP.plan,null);
    if(!plan||plan.startDate!==getConfig().startDate){buildCoachPrepPlan();return;}
    const wrap=document.getElementById('coachprepPlanList');if(!wrap)return;
    const current=currentWeekNumber();
    wrap.innerHTML=plan.weeks.map(item=>`
      <article class="coachprep-week-card ${item.week===current?'current':''}">
        <div class="coachprep-week-head">
          <div><small>SEMANA ${item.week}</small><h3>${esc(item.topic)}</h3></div>
          <span class="coachprep-week-pill ${item.week===current?'current':''}">${item.week===current?'Atual':esc(item.phase)}</span>
        </div>
        <p>${esc(item.goal)}</p>
        <ul>${item.activities.map(a=>`<li>${esc(a)}</li>`).join('')}</ul>
        <button class="outline" onclick="openCoachPrepWeek(${item.week})">${item.reviewed?'✓ Revisada':'Abrir esta semana'}</button>
      </article>`).join('');
  }

  window.openCoachPrepWeek=function openCoachPrepWeek(week){
    const plan=getJSON(CP.plan,null);const item=plan?.weeks?.find(x=>x.week===week);if(!item)return;
    currentDailyExercise={
      title:item.topic,
      why:item.goal,
      question:`Nesta semana o foco é “${item.topic}”. Descreva uma situação real em que esse tema pode testar sua liderança e diga como você pretende agir.`,
      context:`Fase: ${item.phase}. Responda de forma prática e depois grave uma tentativa em áudio ou vídeo.`,
      type:'week'
    };
    showCoachPrepTab('journey');
    renderCoachPrepExercise();
  };

  window.markCurrentCoachPrepWeek=function markCurrentCoachPrepWeek(){
    const plan=getJSON(CP.plan,null);if(!plan)return;
    const current=currentWeekNumber();
    const item=plan.weeks.find(x=>x.week===current);
    if(item)item.reviewed=true;
    setJSON(CP.plan,plan);
    logActivity('week',`Semana ${current} revisada`,{phase:item?.phase,topic:item?.topic});
    renderCoachPrepPlan();
    if(typeof toast==='function')toast('Semana atual marcada como revisada.');
  };

  function chooseDailyExercise(offset=0){
    const friday=dailyExercises.find(x=>x.type==='criticism');
    if(new Date().getDay()===5 && friday)return {...friday};
    const regular=dailyExercises.filter(x=>x.type!=='criticism');
    const idx=(new Date().getDay()+currentWeekNumber()+offset)%regular.length;
    return {...regular[idx]};
  }

  function renderCoachPrepToday(){
    const phase=currentPhase();
    currentDailyExercise=currentDailyExercise||chooseDailyExercise();
    const title=document.getElementById('coachprepTodayTitle');
    const why=document.getElementById('coachprepTodayWhy');
    const steps=document.getElementById('coachprepTodaySteps');
    if(title)title.textContent=currentDailyExercise.title;
    if(why)why.textContent=`${phase.title}: ${currentDailyExercise.why}`;
    if(steps)steps.innerHTML=[
      ['1','Check-in','2 minutos para preparar sua postura.'],
      ['2','Situação prática','Responda a uma pergunta real de gestão.'],
      ['3','Áudio ou vídeo','Observe clareza, escuta e critério.'],
      ['4','Registro','Escolha apenas uma melhoria para repetir.']
    ].map(x=>`<div class="coachprep-step"><b>${x[0]}</b><div><strong>${x[1]}</strong><small>${x[2]}</small></div></div>`).join('');
    renderCoachPrepExercise();
  }

  function renderCoachPrepExercise(){
    if(!currentDailyExercise)return;
    const q=document.getElementById('coachprepExerciseQuestion');
    const c=document.getElementById('coachprepExerciseContext');
    if(q)q.textContent=currentDailyExercise.question;
    if(c)c.textContent=currentDailyExercise.context;
    const a=document.getElementById('coachprepExerciseAnswer');if(a)a.value='';
    const r=document.getElementById('coachprepExerciseResult');if(r)r.classList.add('hidden');
  }

  window.startCoachPrepToday=function startCoachPrepToday(){
    document.getElementById('coachprepExerciseAnswer')?.scrollIntoView({behavior:'smooth',block:'center'});
  };
  window.regenerateCoachPrepToday=function regenerateCoachPrepToday(){
    const ui=getJSON(CP.ui,{});
    ui.exerciseOffset=(ui.exerciseOffset||0)+1;setJSON(CP.ui,ui);
    currentDailyExercise=chooseDailyExercise(ui.exerciseOffset);
    renderCoachPrepToday();
  };

  window.saveCoachPrepDailyReflection=function saveCoachPrepDailyReflection(moment){
    const store=getJSON(CP.daily,{});
    const day=store[todayKey()]||{};
    if(moment==='before'){
      day.before={
        arrival:document.getElementById('coachprepArrival')?.value.trim()||'',
        trigger:document.getElementById('coachprepTrigger')?.value.trim()||'',
        posture:document.getElementById('coachprepPosture')?.value.trim()||''
      };
      logActivity('reflection','Preparação pessoal antes de liderar',day.before);
    }else{
      day.after={
        avoided:document.getElementById('coachprepAfterConversation')?.value.trim()||'',
        criterion:document.getElementById('coachprepAfterCriterion')?.value.trim()||''
      };
      logActivity('reflection','Reflexão de liderança',day.after);
    }
    store[todayKey()]=day;setJSON(CP.daily,store);
    if(typeof toast==='function')toast('Reflexão salva neste aparelho.');
  };

  function localExerciseFeedback(answer){
    const words=answer.split(/\s+/).filter(Boolean).length;
    return {
      didWell:words>=20?'Você desenvolveu a ideia e trouxe contexto suficiente para trabalhar.':'Você respondeu de forma direta, o que é útil para uma primeira tentativa.',
      improve:'Deixe explícitos o fato observado, o critério da sua decisão e o próximo passo da pessoa.',
      nextAttempt:'Na próxima tentativa, faça uma pergunta de escuta antes de explicar sua decisão.',
      question:'Sua resposta mantém a porta aberta para o jogador responder sem retirar sua autoridade?'
    };
  }

  window.analyzeCoachPrepExercise=async function analyzeCoachPrepExercise(){
    const answer=document.getElementById('coachprepExerciseAnswer')?.value.trim()||'';
    if(!answer){if(typeof toast==='function')toast('Responda ao exercício primeiro.');return;}
    const box=document.getElementById('coachprepExerciseResult');box.classList.remove('hidden');box.textContent='Analisando sua resposta...';
    const local=localExerciseFeedback(answer);
    const ai=typeof callCoachAI==='function'
      ? await callCoachAI('coachprep-session',{exercise:currentDailyExercise,answer,phase:currentPhase(),local})
      : {};
    const result={...local,...ai};
    box.innerHTML=renderSimpleCoachPrepFeedback(result);
    logActivity('session',currentDailyExercise?.title||'Sessão CoachPrep',{answer,result,type:currentDailyExercise?.type});
  };

  function renderSimpleCoachPrepFeedback(result){
    return `
      <div class="coachprep-result-section"><h4>Você fez bem</h4><p>${esc(result.didWell||'')}</p></div>
      <div class="coachprep-result-section"><h4>Melhore agora</h4><p>${esc(result.improve||'')}</p></div>
      <div class="coachprep-result-section"><h4>Repita desta forma</h4><p>${esc(result.nextAttempt||'')}</p></div>
      <div class="coachprep-prompt">${esc(result.question||'')}</div>`;
  }

  window.sendCoachPrepExerciseToStudio=function sendCoachPrepExerciseToStudio(){
    if(!currentDailyExercise)return;
    prepareStudioForCoachPrep(currentDailyExercise.question,60,'presentation');
  };

  function loadCoachPrepDailyReflection(){
    const day=getJSON(CP.daily,{})[todayKey()]||{};
    const values={
      coachprepArrival:day.before?.arrival||'',
      coachprepTrigger:day.before?.trigger||'',
      coachprepPosture:day.before?.posture||'',
      coachprepAfterConversation:day.after?.avoided||'',
      coachprepAfterCriterion:day.after?.criterion||''
    };
    Object.entries(values).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v;});
  }

  window.loadCoachPrepThreeScenario=function loadCoachPrepThreeScenario(){
    const key=document.getElementById('coachprepThreeProfile')?.value||'notplaying';
    const item=threeProfiles[key];
    const box=document.getElementById('coachprepThreeScenario');
    if(box)box.innerHTML=`<strong>${esc(item.label)}</strong><br>${esc(item.prompt)}`;
    resetCoachPrepThree(false);
  };

  window.hearCoachPrepThreeModel=function hearCoachPrepThreeModel(){
    const key=document.getElementById('coachprepThreeProfile')?.value||'notplaying';
    speakText(threeProfiles[key].model,'pt-BR',.82);
  };

  window.continueCoachPrepThree=async function continueCoachPrepThree(){
    const key=document.getElementById('coachprepThreeProfile')?.value||'notplaying';
    const item=threeProfiles[key];
    const answer=document.getElementById('coachprepThreeAnswer')?.value.trim()||'';
    if(!answer){if(typeof toast==='function')toast('Fale ou escreva sua parte da conversa.');return;}
    const box=document.getElementById('coachprepThreeResult');box.classList.remove('hidden');box.textContent='A outra pessoa está respondendo...';
    const local={
      feedback:'Procure ouvir antes de explicar e deixe o critério em uma frase simples.',
      otherPersonReply:'Entendo, professor. Mas eu queria saber exatamente o que você espera de mim nesta semana.',
      nextQuestion:'Qual micro-meta concreta você deixaria para esta pessoa?',
      nextAttempt:'Responda em menos de 40 segundos e termine verificando se a expectativa ficou clara.'
    };
    const ai=typeof callCoachAI==='function'
      ? await callCoachAI('coachprep-conversation',{
          profile:key,scenario:item.prompt,goal:document.getElementById('coachprepThreeStyle')?.value,
          history:threeHistory.slice(-5),answer,local
        })
      : {};
    const result={...local,...ai};
    threeHistory.push({coach:answer,person:result.otherPersonReply});
    box.innerHTML=`
      <div class="coachprep-result-section"><h4>Reação da pessoa</h4><p>${esc(result.otherPersonReply)}</p></div>
      <div class="coachprep-result-section"><h4>Leitura da sua fala</h4><p>${esc(result.feedback)}</p></div>
      <div class="coachprep-result-section"><h4>Próxima pergunta</h4><p>${esc(result.nextQuestion)}</p></div>
      <div class="coachprep-result-section"><h4>Próxima tentativa</h4><p>${esc(result.nextAttempt)}</p></div>`;
    document.getElementById('coachprepThreeAnswer').value='';
  };

  window.finishCoachPrepThree=function finishCoachPrepThree(){
    const key=document.getElementById('coachprepThreeProfile')?.value||'notplaying';
    logActivity('conversation',`3 Minutos — ${threeProfiles[key].label}`,{turns:threeHistory.length,history:threeHistory.slice(-6)});
    if(typeof toast==='function')toast('Conversa registrada no progresso.');
  };

  window.resetCoachPrepThree=function resetCoachPrepThree(clear=true){
    threeHistory=[];
    if(clear){
      const a=document.getElementById('coachprepThreeAnswer');if(a)a.value='';
      const r=document.getElementById('coachprepThreeResult');if(r)r.classList.add('hidden');
    }
  };

  window.coachPrepThreeToStudio=function coachPrepThreeToStudio(){
    const key=document.getElementById('coachprepThreeProfile')?.value||'notplaying';
    prepareStudioForCoachPrep(`Conversa individual de 3 minutos. Situação: ${threeProfiles[key].prompt}`,180,'presentation');
  };

  function loadSimOptions(){
    const role=document.getElementById('coachprepSimRole')?.value||'player';
    const select=document.getElementById('coachprepSimScenario');if(!select)return;
    select.innerHTML=simulationScenarios[role].map(x=>`<option value="${x.id}">${esc(x.title)}</option>`).join('');
  }
  function currentSimScenario(){
    const role=document.getElementById('coachprepSimRole')?.value||'player';
    const id=document.getElementById('coachprepSimScenario')?.value;
    return simulationScenarios[role].find(x=>x.id===id)||simulationScenarios[role][0];
  }
  window.loadCoachPrepSimulation=function loadCoachPrepSimulation(){
    loadSimOptions();
    const item=currentSimScenario();
    const box=document.getElementById('coachprepSimPrompt');if(box)box.innerHTML=`<strong>${esc(item.title)}</strong><br>${esc(item.prompt)}`;
    resetCoachPrepSimulation(false);
  };

  window.continueCoachPrepSimulation=async function continueCoachPrepSimulation(){
    const item=currentSimScenario();
    const answer=document.getElementById('coachprepSimAnswer')?.value.trim()||'';
    if(!answer){if(typeof toast==='function')toast('Responda à situação primeiro.');return;}
    const role=document.getElementById('coachprepSimRole')?.value||'player';
    const difficulty=document.getElementById('coachprepSimDifficulty')?.value||'realistic';
    const box=document.getElementById('coachprepSimResult');box.classList.remove('hidden');box.textContent='A conversa está continuando...';
    const local={
      feedback:'Mantenha uma ideia por vez: ouvir, explicar o critério e deixar o próximo passo claro.',
      otherPersonReply:'Eu entendo melhor seu critério, mas quero saber o que posso fazer de forma concreta daqui para frente.',
      nextQuestion:'Como você fecha a conversa sem prometer uma decisão futura?',
      leadershipSignal:'Você manteve a conversa no comportamento e no próximo passo, em vez de discutir sobre a identidade da pessoa.',
      nextAttempt:'Use uma frase mais curta para o critério e faça uma pergunta ao final.'
    };
    const ai=typeof callCoachAI==='function'
      ? await callCoachAI('coachprep-simulation',{role,difficulty,scenario:item,history:simHistory.slice(-5),answer,local})
      : {};
    const result={...local,...ai};
    simHistory.push({coach:answer,other:result.otherPersonReply});
    box.innerHTML=`
      <div class="coachprep-result-section"><h4>Reação da pessoa</h4><p>${esc(result.otherPersonReply)}</p></div>
      <div class="coachprep-result-section"><h4>Feedback</h4><p>${esc(result.feedback)}</p></div>
      <div class="coachprep-result-section"><h4>Sinal de liderança observado no texto</h4><p>${esc(result.leadershipSignal)}</p></div>
      <div class="coachprep-result-section"><h4>Pergunta seguinte</h4><p>${esc(result.nextQuestion)}</p></div>
      <div class="coachprep-result-section"><h4>Próxima tentativa</h4><p>${esc(result.nextAttempt)}</p></div>`;
    document.getElementById('coachprepSimAnswer').value='';
  };

  window.finishCoachPrepSimulation=function finishCoachPrepSimulation(){
    const item=currentSimScenario();
    logActivity('simulation',`Simulação — ${item.title}`,{turns:simHistory.length,history:simHistory.slice(-8)});
    if(typeof toast==='function')toast('Simulação registrada.');
  };
  window.resetCoachPrepSimulation=function resetCoachPrepSimulation(clear=true){
    simHistory=[];
    if(clear){
      const a=document.getElementById('coachprepSimAnswer');if(a)a.value='';
      const r=document.getElementById('coachprepSimResult');if(r)r.classList.add('hidden');
    }
  };
  window.coachPrepSimulationToStudio=function coachPrepSimulationToStudio(){
    const item=currentSimScenario();
    prepareStudioForCoachPrep(`Simulação de liderança: ${item.title}. ${item.prompt}`,180,'presentation');
  };

  function getCode(){return getJSON(CP.code,defaultCode.map((text,i)=>({id:'c'+i,text})));}
  function renderCoachPrepCode(){
    const list=document.getElementById('coachprepCodeList');if(!list)return;
    list.innerHTML=getCode().map((item,i)=>`
      <div class="coachprep-code-row">
        <span>${i+1}</span>
        <input data-coachprep-code="${esc(item.id)}" value="${esc(item.text)}">
        <button onclick="removeCoachPrepCodePrinciple('${esc(item.id)}')" title="Remover">✕</button>
      </div>`).join('');
  }
  window.saveCoachPrepCode=function saveCoachPrepCode(){
    const code=[...document.querySelectorAll('[data-coachprep-code]')].map(el=>({id:el.dataset.coachprepCode,text:el.value.trim()})).filter(x=>x.text);
    setJSON(CP.code,code);logActivity('code','Código de Liderança revisado',{count:code.length});
    if(typeof toast==='function')toast('Código de Liderança salvo.');
  };
  window.addCoachPrepCodePrinciple=function addCoachPrepCodePrinciple(){
    const code=getCode();code.push({id:'c'+Date.now(),text:'Novo princípio de liderança'});setJSON(CP.code,code);renderCoachPrepCode();
  };
  window.removeCoachPrepCodePrinciple=function removeCoachPrepCodePrinciple(id){
    setJSON(CP.code,getCode().filter(x=>x.id!==id));renderCoachPrepCode();
  };
  window.reviewCoachPrepCode=async function reviewCoachPrepCode(){
    saveCoachPrepCode();
    const code=getCode();
    const box=document.getElementById('coachprepCodeResult');box.classList.remove('hidden');box.textContent='Revisando se os princípios são claros e aplicáveis...';
    const local={
      strengths:'Os princípios priorizam critério, relação e coerência em vez de autoridade por slogan.',
      tensions:['Verifique se “grupo acima do indivíduo” não vira justificativa para deixar de ouvir situações individuais.','Transforme cada valor em um comportamento observável.'],
      additions:['Como você age quando erra como treinador?','Como você comunica uma decisão que ainda pode ser revista?'],
      practice:'Escolha um princípio por semana e teste em uma simulação.'
    };
    const ai=typeof callCoachAI==='function'?await callCoachAI('coachprep-code',{code,local}):{};
    const result={...local,...ai};
    box.innerHTML=`
      <div class="coachprep-result-section"><h4>Pontos fortes</h4><p>${esc(result.strengths)}</p></div>
      <div class="coachprep-result-section"><h4>Tensões para revisar</h4><ul>${(result.tensions||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachprep-result-section"><h4>Perguntas que podem entrar</h4><ul>${(result.additions||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachprep-result-section"><h4>Prática</h4><p>${esc(result.practice)}</p></div>`;
  };

  window.loadCoachPrepDecision=function loadCoachPrepDecision(){
    const key=document.getElementById('coachprepDecisionScenario')?.value||'bench';
    const item=decisionScenarios[key];
    const prompt=document.getElementById('coachprepDecisionPrompt');if(prompt)prompt.textContent=item.prompt;
    const values={
      coachprepDecisionFact:item.defaults.fact,
      coachprepDecisionCriterion:item.defaults.criterion,
      coachprepDecisionWho:item.defaults.who,
      coachprepDecisionReview:item.defaults.review,
      coachprepDecisionMessage:''
    };
    Object.entries(values).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v;});
    const r=document.getElementById('coachprepDecisionResult');if(r)r.classList.add('hidden');
  };

  window.analyzeCoachPrepDecision=async function analyzeCoachPrepDecision(){
    const key=document.getElementById('coachprepDecisionScenario')?.value||'bench';
    const item=decisionScenarios[key];
    const data={
      scenario:key,prompt:item.prompt,
      timing:document.getElementById('coachprepDecisionTiming')?.value,
      fact:document.getElementById('coachprepDecisionFact')?.value.trim(),
      criterion:document.getElementById('coachprepDecisionCriterion')?.value.trim(),
      who:document.getElementById('coachprepDecisionWho')?.value.trim(),
      review:document.getElementById('coachprepDecisionReview')?.value.trim(),
      message:document.getElementById('coachprepDecisionMessage')?.value.trim()
    };
    const box=document.getElementById('coachprepDecisionResult');box.classList.remove('hidden');box.textContent='Revisando critério e comunicação...';
    const local={
      facts:`Fato: ${data.fact}`,
      criterion:`Critério: ${data.criterion}`,
      risks:['Não transformar a decisão atual em avaliação definitiva da pessoa.','Não prometer mudança futura apenas para aliviar desconforto.'],
      communication:data.message||'Explique a decisão atual, o critério e o comportamento esperado. Depois deixe espaço para a pessoa responder.',
      review:`Revisão: ${data.review}`,
      avoid:'Evite excesso de justificativas, comparação com outros atletas e discussão no calor do episódio.'
    };
    const ai=typeof callCoachAI==='function'?await callCoachAI('coachprep-decision',{...data,local}):{};
    const result={...local,...ai,risks:Array.isArray(ai.risks)?ai.risks:local.risks};
    box.innerHTML=`
      <div class="coachprep-result-section"><h4>Fato x interpretação</h4><p>${esc(result.facts)}</p></div>
      <div class="coachprep-result-section"><h4>Critério</h4><p>${esc(result.criterion)}</p></div>
      <div class="coachprep-result-section"><h4>Riscos</h4><ul>${result.risks.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="coachprep-result-section"><h4>Comunicação</h4><p>${esc(result.communication)}</p></div>
      <div class="coachprep-result-section"><h4>Revisão</h4><p>${esc(result.review)}</p></div>
      <div class="coachprep-result-section"><h4>Evite</h4><p>${esc(result.avoid)}</p></div>`;
    logActivity('decision',`Decisão difícil — ${key}`,{data,result});
  };

  window.coachPrepDecisionToStudio=function coachPrepDecisionToStudio(){
    const item=decisionScenarios[document.getElementById('coachprepDecisionScenario')?.value||'bench'];
    prepareStudioForCoachPrep(`Comunique esta decisão difícil: ${item.prompt}`,180,'presentation');
  };

  function renderFirstWeek(){
    const wrap=document.getElementById('coachprepFirstWeekList');if(!wrap)return;
    wrap.innerHTML=firstWeek.map(item=>`
      <article class="coachprep-first-day">
        <div class="coachprep-first-day-head">
          <span class="coachprep-day-number">${item.day}</span>
          <div><small>DIA ${item.day}</small><h3>${esc(item.title)}</h3></div>
        </div>
        <p><strong>Foco:</strong> ${esc(item.focus)}</p>
        <p>${esc(item.prompt)}</p>
        <button class="primary" onclick="openCoachPrepFirstWeek(${item.day})">Treinar este dia</button>
      </article>`).join('');
  }

  window.openCoachPrepFirstWeek=function openCoachPrepFirstWeek(day){
    const item=firstWeek.find(x=>x.day===day);if(!item)return;
    if(item.mode==='studio'){
      prepareStudioForCoachPrep(item.prompt,item.day===1||item.day===6?300:120,item.day===5?'interview-pt':'presentation');
    }else if(item.mode==='three'){
      showCoachPrepTab('three');loadCoachPrepThreeScenario();
    }else if(item.mode==='decision'){
      showCoachPrepTab('decisions');loadCoachPrepDecision();
    }else if(item.mode==='simulation'){
      showCoachPrepTab('simulations');loadCoachPrepSimulation();
    }else if(item.mode==='coachday'){
      go('daily');
      const raw=document.getElementById('coachdayPostRaw');if(raw)raw.value='Primeiro pós-jogo: ';
    }
    logActivity('firstweek',`Primeira semana — Dia ${day}: ${item.title}`,{mode:item.mode});
  };

  function prepareStudioForCoachPrep(prompt,seconds=60,mode='presentation'){
    const studioMode=document.getElementById('studioMode');
    const studioPrompt=document.getElementById('studioPrompt');
    const studioDuration=document.getElementById('studioDuration');
    if(studioMode)studioMode.value=mode;
    if(typeof onStudioModeChange==='function')onStudioModeChange();
    if(studioPrompt)studioPrompt.value=prompt;
    if(studioDuration){
      const values=[30,45,60,120,300,360];
      const nearest=values.reduce((a,b)=>Math.abs(b-seconds)<Math.abs(a-seconds)?b:a,60);
      studioDuration.value=String(nearest);
    }
    go('studio');
    if(typeof toast==='function')toast('Estúdio preparado com a situação do CoachPrep.');
  }

  function renderCoachPrepProgress(){
    const list=history();
    const counts={
      session:list.filter(x=>x.type==='session').length,
      conversation:list.filter(x=>x.type==='conversation').length,
      simulation:list.filter(x=>x.type==='simulation').length,
      decision:list.filter(x=>x.type==='decision').length,
      reflection:list.filter(x=>x.type==='reflection').length
    };
    const stats=document.getElementById('coachprepProgressStats');
    if(stats)stats.innerHTML=[
      ['Sessões',counts.session],['Conversas 3 min',counts.conversation],['Simulações',counts.simulation],
      ['Decisões',counts.decision],['Reflexões',counts.reflection]
    ].map(x=>`<div class="coachprep-stat"><strong>${x[1]}</strong><small>${x[0]}</small></div>`).join('');

    const patterns=document.getElementById('coachprepProgressPatterns');
    if(patterns){
      const practiced=[];
      if(counts.conversation)practiced.push(['Escuta e conversas individuais','Você já registrou práticas de conversa de 3 minutos.']);
      if(counts.decision)practiced.push(['Critério nas decisões','Você já treinou decisões difíceis com revisão de fato e critério.']);
      if(counts.simulation)practiced.push(['Resposta sob interação','Você já praticou conversas em que a outra pessoa reage à sua fala.']);
      if(counts.reflection)practiced.push(['Autopercepção profissional','Você está registrando situações que podem afetar sua postura e suas decisões.']);
      if(!practiced.length)practiced.push(['Comece com uma prática','Complete uma conversa, decisão ou reflexão para iniciar o histórico.']);
      patterns.innerHTML=practiced.map(x=>`<div class="coachprep-pattern"><strong>${esc(x[0])}</strong><small>${esc(x[1])}</small></div>`).join('');
    }

    const hist=document.getElementById('coachprepHistoryList');
    if(hist)hist.innerHTML=list.length
      ? list.slice(0,60).map(x=>`<div class="coachprep-history"><strong>${esc(x.title)}</strong><small>${esc(x.date)} · ${esc(x.type)}</small></div>`).join('')
      : '<p class="intro">Nenhuma atividade CoachPrep registrada ainda.</p>';
  }

  window.exportCoachPrepData=function exportCoachPrepData(){
    const data={
      version:'4.1',
      exportedAt:new Date().toISOString(),
      config:getConfig(),
      plan:getJSON(CP.plan,null),
      code:getCode(),
      history:history(),
      daily:getJSON(CP.daily,{})
    };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`coachprep-backup-${todayKey()}.json`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  window.showCoachPrepTab=function showCoachPrepTab(tab){
    const paneId=`coachprepPane${tab[0].toUpperCase()+tab.slice(1)}`;
    document.querySelectorAll('.coachprep-pane').forEach(p=>p.classList.toggle('active',p.id===paneId));
    document.querySelectorAll('.coachprep-tab').forEach(b=>b.classList.toggle('active',b.dataset.coachprepTab===tab));
    const ui=getJSON(CP.ui,{});ui.tab=tab;setJSON(CP.ui,ui);
    if(tab==='plan')renderCoachPrepPlan();
    if(tab==='code')renderCoachPrepCode();
    if(tab==='firstweek')renderFirstWeek();
    if(tab==='progress')renderCoachPrepProgress();
  };

  window.updateCoachPrepHome=function updateCoachPrepHome(){
    const days=daysUntilStart();
    const title=document.getElementById('homeCoachPrepTitle');
    const text=document.getElementById('homeCoachPrepText');
    const count=document.getElementById('homeCoachPrepCountdown');
    const phase=document.getElementById('homeCoachPrepPhase');
    if(title)title.textContent=days>0?'CoachPrep — preparação em andamento':'CoachPrep — transição para o trabalho real';
    if(text)text.textContent=days>0
      ?'Treine gestão de grupo, conversas e decisões antes de assumir.'
      :'A data de início chegou. Use o CoachPrep para desenvolvimento e leve situações reais ao CoachDay.';
    if(count)count.textContent=days>0?`${days} dias`:'Início';
    if(phase)phase.textContent=currentPhase().title;
  };

  window.initializeCoachPrep=function initializeCoachPrep(){
    const start=document.getElementById('coachprepStartDate');if(!start)return;
    const cfg=getConfig();start.value=cfg.startDate||defaultStartDate();
    if(!getJSON(CP.plan,null))buildCoachPrepPlan();
    refreshCoachPrepHeader();
    renderCoachPrepToday();
    renderCoachPrepPlan();
    renderCoachPrepCode();
    loadCoachPrepThreeScenario();
    loadSimOptions();loadCoachPrepSimulation();
    loadCoachPrepDecision();
    renderFirstWeek();
    renderCoachPrepProgress();
    loadCoachPrepDailyReflection();
    const ui=getJSON(CP.ui,{});
    showCoachPrepTab(ui.tab||'journey');
    updateCoachPrepHome();
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',window.initializeCoachPrep,{once:true});
  }else{
    window.initializeCoachPrep();
  }
})();
