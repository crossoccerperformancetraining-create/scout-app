(() => {
  'use strict';

  const gamePhases = {
    offensive: {
      label: 'Organização ofensiva',
      summary: 'Como a equipe se posiciona e progride quando tem a bola.',
      subphases: {
        goalKick: {
          label: 'Saída de tiro de meta',
          help: 'Defina onde o goleiro começa, como os defensores criam linhas e qual é a solução contra pressão alta.',
          example: {
            objective: 'Sair da primeira pressão e encontrar um jogador livre de frente.',
            trigger: 'Quando os dois atacantes adversários fecharem os zagueiros.',
            roles: 'Goleiro atrai; zagueiros abrem; volante baixa; laterais dão altura.',
            success: 'Superar a primeira linha e receber com espaço no meio-campo.',
            alternative: 'Usar o atacante como apoio e disputar a segunda bola.'
          }
        },
        firstBuild: {
          label: 'Primeira fase de construção',
          help: 'Organize goleiro, zagueiros, laterais e volante para iniciar a progressão.',
          example: {
            objective: 'Criar superioridade numérica na primeira linha.',
            trigger: 'Quando o adversário saltar com um meio-campista para pressionar.',
            roles: 'Zagueiro conduz; volante oferece apoio; lateral ocupa corredor alto.',
            success: 'Encontrar o meio-campista entre a primeira e a segunda linha.',
            alternative: 'Voltar ao goleiro e inverter o lado da construção.'
          }
        },
        secondBuild: {
          label: 'Segunda fase de construção',
          help: 'Defina como a equipe progride no meio-campo e encontra jogadores entre linhas.',
          example: {
            objective: 'Progredir pelo jogador livre e conectar o meio com o ataque.',
            trigger: 'Quando um meio-campista receber de frente.',
            roles: 'Volante sustenta; interiores ocupam espaços diferentes; ponta mantém largura.',
            success: 'Receber entre linhas com possibilidade de avançar.',
            alternative: 'Circular por trás e mudar rapidamente o corredor.'
          }
        },
        finalThird: {
          label: 'Último terço',
          help: 'Organize largura, ocupação da área, apoio e movimentos nas costas da defesa.',
          example: {
            objective: 'Criar vantagem para entrar na área com controle.',
            trigger: 'Quando o ponta receber de frente ou o lateral ultrapassar.',
            roles: 'Ponta fixa largura; lateral apoia; atacante ataca primeiro poste; meia ocupa entrada da área.',
            success: 'Finalizar dentro da área ou encontrar passe para trás.',
            alternative: 'Reciclar a posse e atacar pelo lado oposto.'
          }
        },
        finishing: {
          label: 'Finalização e ocupação da área',
          help: 'Defina quem ataca cada zona e quem protege a segunda bola.',
          example: {
            objective: 'Ocupar a área com diferentes alturas e manter equilíbrio fora dela.',
            trigger: 'Quando houver espaço para cruzar ou passe de ruptura.',
            roles: 'Atacante ataca primeira zona; ponta oposto segunda; meia chega atrás; volante protege.',
            success: 'Finalizar com pelo menos três zonas ocupadas.',
            alternative: 'Recolher a segunda bola e reiniciar o ataque.'
          }
        }
      }
    },
    defensive: {
      label: 'Organização defensiva',
      summary: 'Como a equipe protege espaços e recupera a bola sem estar em transição.',
      subphases: {
        goalKickPress: {
          label: 'Marcação no tiro de meta',
          help: 'Defina encaixes, direção da pressão e solução para a bola longa.',
          example: {
            objective: 'Impedir a saída curta e orientar o adversário para um lado.',
            trigger: 'Passe do goleiro para o zagueiro do lado escolhido.',
            roles: 'Atacante fecha retorno; ponta salta no lateral; meio protege passe por dentro.',
            success: 'Forçar bola longa previsível ou recuperar perto da área.',
            alternative: 'Recuar juntos e preparar a disputa da segunda bola.'
          }
        },
        highBlock: {
          label: 'Bloco alto',
          help: 'Organize a equipe perto da área adversária com gatilhos claros de pressão.',
          example: {
            objective: 'Recuperar alto sem abrir o centro.',
            trigger: 'Passe para trás, domínio orientado para a própria meta ou recepção de costas.',
            roles: 'Primeira linha pressiona; meio encurta; defesa protege profundidade.',
            success: 'Forçar passe lateral, erro técnico ou bola longa.',
            alternative: 'Interromper a pressão e formar bloco médio compacto.'
          }
        },
        mediumBlock: {
          label: 'Bloco médio',
          help: 'Defina onde esperar, qual corredor oferecer e quando acelerar a pressão.',
          example: {
            objective: 'Proteger o centro e recuperar no meio-campo.',
            trigger: 'Passe lento para o lateral ou recepção de costas.',
            roles: 'Atacantes orientam; meio fecha dentro; lateral salta com cobertura.',
            success: 'Conduzir o adversário para zona lateral sem passe interior.',
            alternative: 'Recuar mantendo distâncias curtas entre setores.'
          }
        },
        lowBlock: {
          label: 'Bloco baixo',
          help: 'Organize proteção da área, cruzamentos, segunda bola e saída após recuperar.',
          example: {
            objective: 'Proteger a área e impedir finalizações centrais.',
            trigger: 'Adversário entra no último terço com posse controlada.',
            roles: 'Defesa protege área; meio fecha rebote; ponta acompanha lateral.',
            success: 'Forçar cruzamento pressionado ou finalização de baixa qualidade.',
            alternative: 'Afastar para zona segura e subir o bloco após a segunda bola.'
          }
        },
        boxDefense: {
          label: 'Defesa da área',
          help: 'Defina referências para bola, adversário, zona e rebotes.',
          example: {
            objective: 'Ganhar a primeira bola e controlar o rebote.',
            trigger: 'Preparação para cruzamento ou passe lateral dentro do último terço.',
            roles: 'Primeiro defensor bloqueia; zagueiros protegem zonas; volante controla entrada.',
            success: 'Cortar com direção e recuperar a segunda bola.',
            alternative: 'Compactar novamente e impedir nova entrada imediata.'
          }
        }
      }
    },
    offensiveTransition: {
      label: 'Transição ofensiva',
      summary: 'O que fazer nos primeiros segundos depois de recuperar a bola.',
      subphases: {
        firstPass: {
          label: 'Primeiro passe após recuperar',
          help: 'Defina quem oferece apoio e onde procurar a primeira vantagem.',
          example: {
            objective: 'Sair da pressão e encontrar um jogador de frente.',
            trigger: 'Momento exato da recuperação.',
            roles: 'Recuperador protege; apoio aproxima; jogadores à frente atacam espaço.',
            success: 'Completar o primeiro passe para frente ou para um apoio seguro.',
            alternative: 'Manter a posse e iniciar organização ofensiva.'
          }
        },
        counterAttack: {
          label: 'Contra-ataque e profundidade',
          help: 'Organize corredores, portador e jogadores que atacam as costas da defesa.',
          example: {
            objective: 'Atacar antes que o adversário se reorganize.',
            trigger: 'Recuperação com espaço e superioridade para avançar.',
            roles: 'Portador conduz; atacante fixa; pontas atacam profundidade; apoio acompanha.',
            success: 'Entrar no último terço com vantagem numérica ou espacial.',
            alternative: 'Parar, proteger a bola e manter a posse.'
          }
        },
        securePossession: {
          label: 'Manter a posse após recuperar',
          help: 'Defina quando não acelerar e como tirar a bola da zona de pressão.',
          example: {
            objective: 'Conservar a bola e reorganizar a equipe.',
            trigger: 'Recuperação sem espaço, com equipe distante ou em inferioridade.',
            roles: 'Recuperador protege; apoio oferece passe curto; lado oposto abre.',
            success: 'Completar três passes seguros e organizar posições.',
            alternative: 'Jogar em zona segura e subir o bloco.'
          }
        }
      }
    },
    defensiveTransition: {
      label: 'Transição defensiva',
      summary: 'O comportamento imediato depois de perder a bola.',
      subphases: {
        counterpress: {
          label: 'Pressão pós-perda',
          help: 'Defina quem pressiona, quem cobre e quanto tempo a equipe tenta recuperar.',
          example: {
            objective: 'Impedir o primeiro passe para frente e recuperar perto da perda.',
            trigger: 'Perda com jogadores próximos e equipe equilibrada.',
            roles: 'Mais próximo pressiona; segundo fecha passe; restante protege centro.',
            success: 'Recuperar em poucos segundos ou obrigar passe para trás.',
            alternative: 'Abandonar a pressão e reorganizar em bloco.'
          }
        },
        protectCenter: {
          label: 'Proteger o centro após perder',
          help: 'Organize retorno, controle de profundidade e atraso do ataque rival.',
          example: {
            objective: 'Impedir progressão central e ganhar tempo para recompor.',
            trigger: 'Perda com equipe aberta ou poucos jogadores perto da bola.',
            roles: 'Mais próximo atrasa; meio corre para dentro; defesa controla profundidade.',
            success: 'Levar o adversário para o lado e recuperar o bloco.',
            alternative: 'Fazer falta tática somente dentro das regras e longe de zona de risco.'
          }
        },
        recoveryRun: {
          label: 'Recomposição e recuperação do bloco',
          help: 'Defina referências de retorno e a forma defensiva desejada.',
          example: {
            objective: 'Voltar rapidamente à estrutura defensiva.',
            trigger: 'Adversário supera a primeira pressão pós-perda.',
            roles: 'Atacantes fecham linha de passe; meios retornam por dentro; defesa recua coordenada.',
            success: 'Formar bloco compacto antes da entrada no último terço.',
            alternative: 'Proteger a área e preparar o bloco baixo.'
          }
        }
      }
    },
    offensiveSetPiece: {
      label: 'Bola parada ofensiva',
      summary: 'Como criar vantagem em escanteios, faltas, laterais e reinícios.',
      subphases: {
        corner: {
          label: 'Escanteio ofensivo',
          help: 'Defina cobrador, movimentos, zonas de ataque, rebote e equilíbrio.',
          example: {
            objective: 'Criar uma finalização limpa na primeira ou segunda bola.',
            trigger: 'Sinal do cobrador antes da corrida.',
            roles: 'Um bloqueia; dois atacam zonas; um espera rebote; dois equilibram.',
            success: 'Contato ofensivo na zona planejada ou recuperação do rebote.',
            alternative: 'Cobrança curta para mudar o ângulo.'
          }
        },
        freeKick: {
          label: 'Falta lateral ou frontal',
          help: 'Defina tipo de cobrança, ataque à linha e proteção contra contra-ataque.',
          example: {
            objective: 'Atacar o espaço entre goleiro e última linha.',
            trigger: 'Movimento inicial do jogador de referência.',
            roles: 'Cobrador sinaliza; atacantes cruzam movimentos; rebote ocupa entrada.',
            success: 'Primeiro contato ofensivo ou segunda bola controlada.',
            alternative: 'Cobrança curta para criar novo corredor.'
          }
        },
        throwIn: {
          label: 'Lateral ofensivo',
          help: 'Organize apoios, terceira opção e proteção contra perda.',
          example: {
            objective: 'Manter a posse e progredir pelo corredor.',
            trigger: 'Movimento de aproximação e ruptura simultâneos.',
            roles: 'Um aproxima; um ataca costas; um oferece segurança.',
            success: 'Receber de frente ou encontrar terceiro jogador.',
            alternative: 'Voltar ao defensor e mudar o lado.'
          }
        }
      }
    },
    defensiveSetPiece: {
      label: 'Bola parada defensiva',
      summary: 'Como proteger a área, controlar bloqueios, rebotes e contra-ataque.',
      subphases: {
        corner: {
          label: 'Escanteio defensivo',
          help: 'Defina sistema, referências, zonas, rebote e saída.',
          example: {
            objective: 'Ganhar a primeira bola e afastar com direção.',
            trigger: 'Movimento do cobrador e trajetórias dos bloqueadores.',
            roles: 'Jogadores protegem zonas; referências acompanham; um controla rebote.',
            success: 'Corte para zona lateral e domínio da segunda bola.',
            alternative: 'Recompactar e impedir novo cruzamento.'
          }
        },
        freeKick: {
          label: 'Falta lateral ou frontal defensiva',
          help: 'Organize linha, barreira, goleiro e controle do segundo lance.',
          example: {
            objective: 'Proteger gol e espaço entre linha e goleiro.',
            trigger: 'Corrida do cobrador.',
            roles: 'Barreira protege zona; linha controla profundidade; rebote sai no momento correto.',
            success: 'Corte com direção ou posse do goleiro.',
            alternative: 'Subir juntos após o primeiro corte.'
          }
        },
        secondBall: {
          label: 'Segunda bola e rebote',
          help: 'Defina quem sai da área e quem protege possíveis devoluções.',
          example: {
            objective: 'Impedir nova finalização após o primeiro corte.',
            trigger: 'Contato defensivo na primeira bola.',
            roles: 'Linha sobe; volante ataca rebote; ponta prepara saída.',
            success: 'Controlar o rebote e afastar a equipe da própria área.',
            alternative: 'Bloquear nova tentativa e recompor rapidamente.'
          }
        }
      }
    }
  };

  const extraInterviewScenarios = {
    penalty: {
      question: 'O pênalti marcado contra sua equipe foi correto?',
      help: 'Responda sobre o lance sem acusar intenção e volte ao que estava sob controle da equipe.',
      model: 'O lance merece ser revisto com calma. Vamos buscar os esclarecimentos corretos, mas também precisamos analisar nossas decisões durante toda a partida.',
      avoid: 'Falar em roubo, fraude ou intenção sem evidências.'
    },
    'added-time': {
      question: 'Sua equipe foi prejudicada pelo tempo de acréscimo e pelo encerramento da partida?',
      help: 'Reconheça a insatisfação, mas não faça do relógio a explicação completa.',
      model: 'Tivemos dúvidas sobre o controle do tempo, e o clube pode buscar esclarecimentos. Dentro de campo, ainda precisamos avaliar como administramos os minutos finais.',
      avoid: 'Atacar pessoalmente a arbitragem ou ignorar os próprios erros.'
    },
    injury: {
      question: 'O clube errou ao escalar um jogador que voltou a sentir uma lesão?',
      help: 'Não revele informação médica confidencial. Explique o processo de decisão de forma responsável.',
      model: 'As decisões são tomadas em conjunto com o departamento médico e com o jogador. Vamos avaliar o que aconteceu, preservar o atleta e comunicar apenas o que for apropriado.',
      avoid: 'Culpar o jogador ou divulgar diagnóstico sem autorização.'
    },
    captain: {
      question: 'Por que você retirou a faixa de capitão de um jogador importante?',
      help: 'Explique que liderança e funções são avaliadas internamente, sem desvalorizar a pessoa.',
      model: 'A escolha da liderança considera o momento e as necessidades do grupo. A decisão foi tratada internamente e o jogador continua sendo importante para a equipe.',
      avoid: 'Expor conflitos ou transformar a decisão em punição pública.'
    },
    youth: {
      question: 'Por que os jogadores da base recebem poucas oportunidades?',
      help: 'Mostre critério e plano de desenvolvimento sem prometer minutos.',
      model: 'Os jovens são avaliados diariamente e precisam receber oportunidades no momento adequado. Nosso compromisso é desenvolver, preparar e utilizar cada atleta com responsabilidade.',
      avoid: 'Prometer escalação ou responsabilizar a base pelos resultados.'
    },
    'build-up': {
      question: 'Sua equipe insistiu em sair jogando e perdeu bolas perigosas. Por que não mudou a estratégia?',
      help: 'Explique o objetivo da saída e reconheça quando a execução ou a alternativa precisa melhorar.',
      model: 'A saída curta faz parte do nosso modelo, mas precisa de leitura. Quando a pressão fecha a primeira opção, devemos reconhecer a alternativa. Vamos corrigir essa decisão.',
      avoid: 'Defender a ideia de forma rígida ou culpar apenas quem perdeu a bola.'
    },
    'high-block': {
      question: 'A pressão alta deixou muito espaço nas costas da defesa. Foi um erro de planejamento?',
      help: 'Explique coordenação e risco sem ficar defensivo.',
      model: 'A pressão alta exige sincronia entre a primeira linha e a proteção da profundidade. Em alguns momentos não coordenamos bem, e essa será uma correção objetiva.',
      avoid: 'Negar o espaço concedido ou usar jargão sem explicar.'
    },
    'low-block': {
      question: 'Sua equipe recuou demais e pareceu jogar apenas para não perder. Essa era a proposta?',
      help: 'Diferencie bloco baixo organizado de passividade.',
      model: 'Em alguns momentos precisávamos proteger espaços, mas isso não significa abdicar do jogo. Faltou sair melhor após recuperar e afastar o bloco da nossa área.',
      avoid: 'Dizer apenas que o adversário obrigou a equipe a recuar.'
    },
    transition: {
      question: 'Por que sua equipe continua sofrendo tantos contra-ataques depois de perder a bola?',
      help: 'Identifique um comportamento: pressão pós-perda, proteção do centro ou equilíbrio.',
      model: 'Estamos perdendo a bola com pouca proteção e reagindo tarde. Precisamos melhorar o equilíbrio durante o ataque e a primeira ação após a perda.',
      avoid: 'Apresentar muitas causas sem indicar a prioridade.'
    },
    'set-piece': {
      question: 'Mais uma vez sua equipe sofreu gol de bola parada. O trabalho está sendo suficiente?',
      help: 'Assuma a recorrência e indique o tipo de correção.',
      model: 'Quando o problema se repete, precisamos assumir que a resposta ainda não foi suficiente. Vamos revisar referências, bloqueios e a reação à segunda bola.',
      avoid: 'Tratar como azar ou apontar apenas um jogador.'
    },
    contract: {
      question: 'A incerteza sobre sua renovação está afetando a equipe?',
      help: 'Separe sua situação contratual do trabalho diário.',
      model: 'Questões contratuais serão tratadas com o clube no momento adequado. Minha responsabilidade diária continua sendo preparar a equipe e tomar as melhores decisões.',
      avoid: 'Pressionar publicamente a direção ou usar o contrato como justificativa.'
    },
    board: {
      question: 'Você ainda tem respaldo da diretoria para continuar o trabalho?',
      help: 'Não fale em nome da direção. Mantenha foco na sua responsabilidade.',
      model: 'Essa avaliação cabe à direção. Eu mantenho diálogo profissional com o clube e estou concentrado em preparar a equipe para responder dentro de campo.',
      avoid: 'Garantir apoio que não pode confirmar ou criar confronto institucional.'
    },
    schedule: {
      question: 'O calendário é uma desculpa para a queda de rendimento?',
      help: 'Reconheça o desgaste sem transformar o calendário em desculpa.',
      model: 'O calendário exige gestão e afeta todas as equipes. Precisamos adaptar recuperação, escolhas e intensidade sem usar isso para retirar nossa responsabilidade.',
      avoid: 'Culpar apenas a competição ou ignorar o desgaste real.'
    }
  };

  const interviewAlternatives = {
    referee: [
      'Você está evitando criticar a arbitragem por medo de punição?',
      'O clube pretende apresentar uma reclamação formal sobre os lances?'
    ],
    var: [
      'O tempo de revisão do VAR prejudicou o ritmo emocional da sua equipe?',
      'Você é favorável à divulgação do áudio entre árbitro e VAR?'
    ],
    defeat: [
      'Qual é hoje o principal problema da equipe?',
      'O que o torcedor verá de diferente já no próximo jogo?'
    ],
    tactical: [
      'A substituição resolveu o problema ou chegou tarde demais?',
      'Sua leitura inicial do adversário estava errada?'
    ],
    'build-up': [
      'O goleiro tem liberdade para jogar longo quando a pressão fecha?',
      'Como você evita que a saída curta se torne previsível?'
    ],
    transition: [
      'O problema está na escolha com a bola ou na reação depois da perda?',
      'Você pensa em mudar jogadores ou apenas comportamentos?'
    ],
    'set-piece': [
      'A marcação é individual, zonal ou mista?',
      'Quem assume a responsabilidade pela organização da bola parada?'
    ],
    player: [
      'O jogador aceitou a decisão de começar no banco?',
      'Existe risco de ele deixar o clube por falta de espaço?'
    ],
    'job-pressure': [
      'Você sente que ainda consegue convencer o elenco?',
      'Por que a direção deveria manter seu trabalho?'
    ]
  };

  const eliteStyles = {
    direct: {
      title: 'Direto e responsável',
      steps: ['Responder na primeira frase', 'Assumir a responsabilidade adequada', 'Indicar uma correção concreta'],
      prefix: 'O ponto principal é claro:'
    },
    protective: {
      title: 'Protege o grupo',
      steps: ['Não expor indivíduos', 'Separar correção pública e conversa interna', 'Falar em responsabilidade coletiva'],
      prefix: 'Vamos tratar as responsabilidades internamente, mas publicamente o grupo permanece protegido:'
    },
    tactical: {
      title: 'Tático e simples',
      steps: ['Explicar somente um comportamento', 'Usar linguagem compreensível', 'Terminar com a mudança esperada'],
      prefix: 'Taticamente, a prioridade é simples:'
    },
    calm: {
      title: 'Calmo sob pressão',
      steps: ['Não reagir à provocação', 'Reconhecer a pergunta', 'Voltar aos fatos e ao próximo jogo'],
      prefix: 'Entendo a cobrança e respondo com serenidade:'
    },
    institutional: {
      title: 'Institucional',
      steps: ['Respeitar funções do clube', 'Não revelar informação interna', 'Manter alinhamento e responsabilidade'],
      prefix: 'Essa questão será tratada pelos responsáveis dentro do clube. Sobre minha função:'
    }
  };

  let interviewAltIndex = 0;
  let lastCustomCorrection = '';

  function safeText(value) {
    return String(value || '').replace(/[<>]/g, '');
  }

  function cleanWords(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9'\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  function comparePhrase(expected, heard) {
    if (typeof compareSpokenWords === 'function') return compareSpokenWords(expected, heard);
    const target = cleanWords(expected);
    const spoken = cleanWords(heard);
    const results = target.map((word, index) => ({ word, correct: spoken[index] === word }));
    return {
      results,
      extras: spoken.slice(target.length),
      score: Math.round(results.filter(item => item.correct).length / Math.max(1, results.length) * 100)
    };
  }

  window.customEnglishListen = function customEnglishListen(rate = .65) {
    const phrase = document.getElementById('customEnglishPhrase')?.value.trim();
    if (!phrase) {
      if (typeof toast === 'function') toast('Digite uma frase curta.');
      return;
    }
    localStorage.setItem('coachvoice-custom-english-phrase', phrase);
    speakText(phrase, englishAccent, rate);
  };

  window.startCustomEnglishCoach = function startCustomEnglishCoach() {
    const phrase = document.getElementById('customEnglishPhrase')?.value.trim();
    const status = document.getElementById('customEnglishCoachStatus');
    if (!phrase) {
      if (typeof toast === 'function') toast('Digite uma frase curta.');
      return;
    }
    localStorage.setItem('coachvoice-custom-english-phrase', phrase);
    status.className = 'beginner-status listening';
    status.textContent = 'Fale a frase depois de autorizar o microfone.';
    startUniversalVoiceCapture({
      lang: englishAccent,
      maxSeconds: 12,
      label: 'Fale a frase em inglês',
      onText: transcript => renderCustomEnglishCorrection(phrase, transcript)
    });
  };

  window.renderCustomEnglishCorrection = function renderCustomEnglishCorrection(expected, heard) {
    const comparison = comparePhrase(expected, heard);
    const missing = comparison.results.filter(item => !item.correct).map(item => item.word);
    lastCustomCorrection = missing.join(' ') || expected;
    const result = document.getElementById('customEnglishCoachResult');
    const status = document.getElementById('customEnglishCoachStatus');

    result.classList.remove('hidden');
    result.innerHTML = `
      <strong>${comparison.score >= 90 ? 'Muito bem.' : 'Vamos corrigir uma parte por vez.'}</strong>
      <div class="spoken-line"><small>O celular entendeu:</small><br><strong>${safeText(heard || 'Nenhuma fala reconhecida')}</strong></div>
      <div class="expected-line"><small>A frase esperada é:</small><br><strong>${safeText(expected)}</strong></div>
      <div class="custom-word-row">
        ${comparison.results.map(item => `<span class="custom-word ${item.correct ? 'correct' : 'wrong'}">${item.correct ? '✓' : '×'} ${safeText(item.word)}</span>`).join('')}
      </div>
      <p><strong>Repita agora:</strong> ${safeText(lastCustomCorrection)}</p>
      <div class="beginner-actions">
        <button class="secondary" onclick="repeatCustomEnglishCorrection()">🔊 Ouvir só a correção</button>
        <button class="primary" onclick="startCustomEnglishCoach()">🎙 Tentar novamente</button>
      </div>`;

    status.className = 'beginner-status ' + (comparison.score >= 90 ? 'success' : 'retry');
    status.textContent = comparison.score >= 90
      ? 'Frase reconhecida. Agora repita em velocidade natural.'
      : `Não precisa repetir tudo de uma vez. Trabalhe primeiro: ${lastCustomCorrection}.`;

    if (typeof addXP === 'function') addXP(comparison.score >= 90 ? 5 : 2, 'Professor de frase em inglês');
  };

  window.repeatCustomEnglishCorrection = function repeatCustomEnglishCorrection() {
    if (lastCustomCorrection) speakText(lastCustomCorrection, englishAccent, .5);
  };

  function populateGamePhases() {
    const phaseSelect = document.getElementById('gamePhase');
    if (!phaseSelect) return;
    const savedPhase = localStorage.getItem('coachvoice-game-phase-v33') || 'offensive';
    phaseSelect.innerHTML = Object.entries(gamePhases)
      .map(([id, phase]) => `<option value="${id}">${phase.label}</option>`)
      .join('');
    phaseSelect.value = gamePhases[savedPhase] ? savedPhase : 'offensive';
    window.onGamePhaseChange(false);
  }

  window.onGamePhaseChange = function onGamePhaseChange(resetFields = true) {
    const phaseId = document.getElementById('gamePhase')?.value || 'offensive';
    const phase = gamePhases[phaseId];
    const subphaseSelect = document.getElementById('gameSubphase');
    if (!phase || !subphaseSelect) return;

    const savedSubphase = localStorage.getItem('coachvoice-game-subphase-v33');
    subphaseSelect.innerHTML = Object.entries(phase.subphases)
      .map(([id, sub]) => `<option value="${id}">${sub.label}</option>`)
      .join('');
    if (savedSubphase && phase.subphases[savedSubphase]) subphaseSelect.value = savedSubphase;

    localStorage.setItem('coachvoice-game-phase-v33', phaseId);
    if (resetFields) {
      ['gameObjective', 'gameTrigger', 'gameRoles', 'gameSuccess', 'gameAlternative'].forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
      });
    }
    window.renderGamePhaseHelp();
  };

  window.renderGamePhaseHelp = function renderGamePhaseHelp() {
    const phaseId = document.getElementById('gamePhase')?.value || 'offensive';
    const subphaseId = document.getElementById('gameSubphase')?.value;
    const phase = gamePhases[phaseId];
    const subphase = phase?.subphases?.[subphaseId];
    const box = document.getElementById('gamePhaseHelp');
    if (!phase || !subphase || !box) return;

    localStorage.setItem('coachvoice-game-phase-v33', phaseId);
    localStorage.setItem('coachvoice-game-subphase-v33', subphaseId);
    box.innerHTML = `<strong>${phase.label} — ${subphase.label}</strong><br>${subphase.help}`;
  };

  window.loadGamePhaseExample = function loadGamePhaseExample() {
    const phaseId = document.getElementById('gamePhase')?.value || 'offensive';
    const subphaseId = document.getElementById('gameSubphase')?.value;
    const example = gamePhases[phaseId]?.subphases?.[subphaseId]?.example;
    if (!example) return;
    document.getElementById('gameObjective').value = example.objective;
    document.getElementById('gameTrigger').value = example.trigger;
    document.getElementById('gameRoles').value = example.roles;
    document.getElementById('gameSuccess').value = example.success;
    document.getElementById('gameAlternative').value = example.alternative;
    document.getElementById('gameContext').value ||= 'Use este exemplo como ponto de partida e adapte aos seus jogadores e ao adversário.';
    if (typeof toast === 'function') toast('Exemplo da subfase carregado.');
  };

  function localGamePhaseMessage(data) {
    const intro = data.moment === 'Intervalo'
      ? 'No segundo tempo, a ideia é simples.'
      : data.moment === 'Pré-jogo'
        ? 'Desde o primeiro minuto, nossa referência será clara.'
        : data.moment === 'Pós-jogo'
          ? 'Na revisão desta fase, precisamos corrigir um comportamento.'
          : 'No exercício de hoje, vamos treinar um comportamento específico.';

    return `${intro} Na ${data.phaseLabel.toLowerCase()}, durante ${data.subphaseLabel.toLowerCase()}, o objetivo é ${data.objective}. O gatilho é ${data.trigger}. ${data.roles}. Saberemos que funcionou quando ${data.success}. Se a primeira opção fechar, ${data.alternative}.`;
  }

  window.generateGameMessage = async function generateGameMessageV33() {
    const phaseId = document.getElementById('gamePhase')?.value;
    const subphaseId = document.getElementById('gameSubphase')?.value;
    const phase = gamePhases[phaseId];
    const subphase = phase?.subphases?.[subphaseId];
    const box = document.getElementById('gameModelResult');
    if (!phase || !subphase || !box) return;

    const data = {
      phase: phaseId,
      phaseLabel: phase.label,
      subphase: subphaseId,
      subphaseLabel: subphase.label,
      objective: document.getElementById('gameObjective').value.trim(),
      trigger: document.getElementById('gameTrigger').value.trim(),
      roles: document.getElementById('gameRoles').value.trim(),
      success: document.getElementById('gameSuccess').value.trim(),
      alternative: document.getElementById('gameAlternative').value.trim(),
      moment: document.getElementById('gameMoment').value,
      audience: document.getElementById('gameAudience').value,
      context: document.getElementById('gameContext').value.trim()
    };

    const missing = [
      ['objetivo', data.objective],
      ['gatilho', data.trigger],
      ['funções dos jogadores', data.roles],
      ['critério de sucesso', data.success],
      ['alternativa', data.alternative]
    ].filter(([, value]) => !value).map(([label]) => label);

    box.classList.remove('hidden');
    if (missing.length) {
      box.textContent = `Complete estes pontos antes de gerar a mensagem: ${missing.join(', ')}. Você também pode tocar em “Carregar exemplo completo”.`;
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const local = localGamePhaseMessage(data);
    box.textContent = 'Mensagem local pronta. Consultando a IA para simplificar a comunicação...';
    const result = await callCoachAI('game-model', {
      phase: data.phaseLabel,
      subphase: data.subphaseLabel,
      objective: data.objective,
      trigger: data.trigger,
      roles: data.roles,
      success: data.success,
      alternative: data.alternative,
      moment: data.moment,
      audience: data.audience,
      context: data.context,
      local
    });

    const shortVersion = result.briefing ||
      `${data.phaseLabel}: ${data.objective}. Gatilho: ${data.trigger}. Se fechar, ${data.alternative}.`;

    box.textContent =
      `FASE\n${data.phaseLabel} — ${data.subphaseLabel}\n\n` +
      `MENSAGEM PARA FALAR\n${result.message || local}\n\n` +
      `VERSÃO CURTA\n${shortVersion}\n\n` +
      `PERGUNTAS PARA O TREINADOR\n` +
      `• Todos sabem reconhecer o gatilho?\n` +
      `• Quem oferece a segunda solução?\n` +
      `• O que protege a equipe se a bola for perdida?\n\n` +
      `EVITE\n${result.avoid || 'Dar muitas instruções sem deixar claro o gatilho e a alternativa.'}`;

    localStorage.setItem('coachvoice-last-game-message-v33', result.message || local);
    if (typeof addXP === 'function') addXP(10, `Modelo de jogo: ${phase.label}`);
  };

  window.speakGameModelResult = function speakGameModelResult() {
    const saved = localStorage.getItem('coachvoice-last-game-message-v33');
    const box = document.getElementById('gameModelResult');
    const text = saved || box?.textContent || '';
    if (!text.trim()) {
      if (typeof toast === 'function') toast('Crie uma mensagem primeiro.');
      return;
    }
    speakText(text, 'pt-BR', .84);
  };

  function addInterviewScenarios() {
    if (typeof interviewScenarios !== 'undefined') {
      Object.assign(interviewScenarios, extraInterviewScenarios);
    }
  }

  window.showEliteResponsePattern = function showEliteResponsePattern() {
    const styleId = document.getElementById('interviewResponseStyle')?.value || 'direct';
    const style = eliteStyles[styleId];
    const data = typeof currentInterviewData === 'function'
      ? currentInterviewData()
      : { model: 'Responda diretamente e indique o próximo passo.' };
    const box = document.getElementById('interviewElitePattern');
    if (!box || !style) return;

    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="elite-pattern-grid">
        <div class="elite-pattern-step"><strong>${style.title}</strong><br>Este é um padrão profissional genérico, não uma imitação de um treinador real.</div>
        ${style.steps.map((step, index) => `<div class="elite-pattern-step"><strong>${index + 1}.</strong> ${step}</div>`).join('')}
        <div class="elite-pattern-step"><strong>Exemplo:</strong><br>${style.prefix} ${data.model}</div>
      </div>`;
  };

  window.nextInterviewQuestionV33 = function nextInterviewQuestionV33() {
    const scenario = document.getElementById('interviewScenario')?.value || 'defeat';
    const data = typeof currentInterviewData === 'function' ? currentInterviewData() : null;
    const alternatives = interviewAlternatives[scenario] || [
      'Qual é a principal correção que será feita no próximo treino?',
      'Como você transforma essa análise em uma ação concreta para a equipe?'
    ];
    const question = alternatives[interviewAltIndex % alternatives.length];
    interviewAltIndex += 1;
    const finalQuestion = typeof pressureInterviewQuestion === 'function'
      ? pressureInterviewQuestion(question)
      : question;
    document.getElementById('interviewQuestion').textContent = finalQuestion;
    document.getElementById('interviewThemeHelp').innerHTML =
      `<strong>Pergunta complementar:</strong> ${data?.help || 'Responda diretamente e termine com um próximo passo.'}`;
    document.getElementById('interviewResponse').value = '';
    document.getElementById('interviewResult').classList.add('hidden');
  };

  function initializeV33() {
    const customPhrase = document.getElementById('customEnglishPhrase');
    if (customPhrase) {
      customPhrase.value = localStorage.getItem('coachvoice-custom-english-phrase') || 'My name is';
      customPhrase.addEventListener('change', () => {
        localStorage.setItem('coachvoice-custom-english-phrase', customPhrase.value.trim());
      });
    }

    addInterviewScenarios();
    populateGamePhases();

    const eliteBox = document.getElementById('interviewElitePattern');
    if (eliteBox) eliteBox.classList.add('hidden');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeV33, { once: true });
  } else {
    initializeV33();
  }
})();
