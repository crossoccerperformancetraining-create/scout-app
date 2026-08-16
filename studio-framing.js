(() => {
  'use strict';

  const requiredLandscapeModes = new Set(['tactical']);
  const adaptiveBodyModes = new Set(['oratory', 'locker', 'presentation']);
  const gestureSteps = [
    {
      title: 'Levante as duas mãos',
      instruction: 'Confira na imagem se sua cabeça e as duas mãos estão completamente visíveis.'
    },
    {
      title: 'Abra os braços',
      instruction: 'Abra os braços sem sair das laterais da moldura.'
    },
    {
      title: 'Aponte para a direita',
      instruction: 'Simule uma indicação no quadro ou para um jogador do lado direito.'
    },
    {
      title: 'Aponte para a esquerda',
      instruction: 'Repita para o lado esquerdo e confira se o braço continua dentro da imagem.'
    }
  ];

  let gestureIndex = -1;
  let gesturePassed = false;
  let framingListenersBound = false;

  const originalLoadStudioPrompt = window.loadStudioPrompt;
  const originalStartStudioCamera = window.startStudioCamera;
  const originalStartStudioRecording = window.startStudioRecording;
  const originalSaveStudioVideo = window.saveStudioVideo;
  const originalInitializeStudio = window.initializeStudio;

  function currentMode() {
    return document.getElementById('studioMode')?.value || 'oratory';
  }

  function recommendedFraming(mode = currentMode()) {
    if (mode === 'interview-pt' || mode === 'interview-en') return 'interview';
    if (mode === 'tactical') return 'tactical';
    if (adaptiveBodyModes.has(mode)) return isLandscape() ? 'presentation' : 'fullbody';
    return isLandscape() ? 'presentation' : 'fullbody';
  }

  function currentFraming() {
    return document.getElementById('studioFraming')?.value || recommendedFraming();
  }

  function framingLabel(frame = currentFraming()) {
    if (frame === 'interview') return 'Entrevista — plano próximo';
    if (frame === 'fullbody') return 'Corpo inteiro — vertical';
    if (frame === 'tactical') return 'Quadro tático — plano aberto';
    return 'Apresentação — horizontal';
  }

  function isLandscape() {
    if (window.matchMedia) return window.matchMedia('(orientation: landscape)').matches;
    return window.innerWidth >= window.innerHeight;
  }

  function landscapeRequired() {
    return requiredLandscapeModes.has(currentMode()) || currentFraming() === 'tactical';
  }

  function gestureRequired() {
    return currentFraming() !== 'interview';
  }

  function recorderIsActive() {
    return typeof studioRecorder !== 'undefined' &&
      studioRecorder &&
      studioRecorder.state !== 'inactive';
  }

  function resetGestureTest() {
    gestureIndex = -1;
    gesturePassed = !gestureRequired();
    renderGestureTest();
    updateRecordAvailability();
  }

  function renderGestureTest() {
    const panel = document.getElementById('studioGesturePanel');
    const title = document.getElementById('studioGestureTitle');
    const instruction = document.getElementById('studioGestureInstruction');
    const badge = document.getElementById('studioGestureBadge');
    const button = document.getElementById('studioGestureButton');
    const progress = document.getElementById('studioGestureProgress');
    if (!panel || !title || !instruction || !badge || !button || !progress) return;

    progress.innerHTML = gestureSteps.map((_, index) => {
      const state = gesturePassed || index < gestureIndex ? 'done' : index === gestureIndex ? 'active' : '';
      return `<span class="gesture-step ${state}"></span>`;
    }).join('');

    if (!gestureRequired()) {
      title.textContent = 'Teste opcional para entrevista';
      instruction.textContent = 'No plano próximo, confirme apenas se o rosto, os ombros e parte das mãos aparecem.';
      badge.textContent = 'Opcional';
      badge.className = 'gesture-badge ok';
      button.disabled = !studioStream;
      button.textContent = 'Fazer teste mesmo assim';
      return;
    }

    if (gesturePassed) {
      title.textContent = 'Enquadramento confirmado';
      instruction.textContent = 'Cabeça, mãos e movimentos laterais foram conferidos manualmente. Você já pode gravar.';
      badge.textContent = 'Concluído';
      badge.className = 'gesture-badge ok';
      button.disabled = !studioStream;
      button.textContent = 'Refazer teste';
      return;
    }

    badge.textContent = 'Pendente';
    badge.className = 'gesture-badge';
    button.disabled = !studioStream;

    if (gestureIndex < 0) {
      title.textContent = 'Prepare a câmera';
      instruction.textContent = 'Faça quatro movimentos simples olhando para a prévia. O aplicativo não detecta o corpo automaticamente nesta versão.';
      button.textContent = 'Iniciar teste de gestos';
    } else {
      title.textContent = gestureSteps[gestureIndex].title;
      instruction.textContent = gestureSteps[gestureIndex].instruction;
      button.textContent = gestureIndex === gestureSteps.length - 1
        ? 'Concluir enquadramento'
        : 'Está visível — próximo';
    }
  }

  window.advanceStudioGestureTest = function advanceStudioGestureTest() {
    if (!studioStream) {
      if (typeof setStudioStatus === 'function') {
        setStudioStatus('Ative a câmera antes de realizar o teste de enquadramento.', 'warning');
      }
      return;
    }

    if (gesturePassed) {
      gesturePassed = false;
      gestureIndex = 0;
      renderGestureTest();
      updateRecordAvailability();
      return;
    }

    if (gestureIndex < 0) {
      gestureIndex = 0;
    } else if (gestureIndex < gestureSteps.length - 1) {
      gestureIndex += 1;
    } else {
      gesturePassed = true;
      gestureIndex = gestureSteps.length;
      if (typeof setStudioStatus === 'function') {
        setStudioStatus('Teste de enquadramento concluído. Você pode iniciar a gravação.', 'ready');
      }
    }

    renderGestureTest();
    updateRecordAvailability();
  };

  function updateOrientationNotice() {
    const notice = document.getElementById('studioOrientationNotice');
    const stage = document.getElementById('studioCameraStage');
    if (!notice || !stage) return;

    const frame = currentFraming();
    const landscape = isLandscape();
    const required = landscapeRequired();

    stage.classList.toggle('orientation-blocked', required && !landscape);

    if (required && !landscape) {
      notice.className = 'orientation-notice';
      notice.innerHTML = '<strong>↻ Gire o celular</strong><span>O quadro tático precisa do formato horizontal para mostrar treinador e quadro completos.</span>';
    } else if (frame === 'fullbody' || (!landscape && adaptiveBodyModes.has(currentMode()))) {
      notice.className = 'orientation-notice ok';
      notice.innerHTML = '<strong>✓ Vertical de corpo inteiro</strong><span>Afaste o celular e mantenha cabeça, mãos e pés dentro da moldura.</span>';
    } else if (frame === 'interview') {
      notice.className = 'orientation-notice optional';
      notice.innerHTML = '<strong>📱 Entrevista adaptável</strong><span>Vertical para plano próximo; horizontal quando quiser mostrar mais gestos.</span>';
    } else {
      notice.className = 'orientation-notice ok';
      notice.innerHTML = '<strong>✓ Horizontal para gestos</strong><span>Formato adequado para braços, postura e deslocamentos laterais.</span>';
    }
  }

  function updateRecordAvailability() {
    const recordButton = document.getElementById('studioRecordBtn');
    if (!recordButton) return;

    const orientationOK = !landscapeRequired() || isLandscape();
    const gestureOK = !gestureRequired() || gesturePassed;
    const hasCamera = Boolean(studioStream);
    const recording = recorderIsActive();

    recordButton.disabled = !hasCamera || !orientationOK || !gestureOK || recording;

    if (!hasCamera) {
      recordButton.textContent = '⏺ Gravar';
    } else if (!orientationOK) {
      recordButton.textContent = '↻ Gire o celular';
    } else if (!gestureOK) {
      recordButton.textContent = '👋 Faça o teste';
    } else {
      recordButton.textContent = '⏺ Gravar';
    }
  }

  function updateCameraResolutionInfo() {
    const info = document.getElementById('studioCameraInfo');
    const video = document.getElementById('studioPreview');
    if (!info || !video) return;

    const track = studioStream?.getVideoTracks?.()[0];
    const settings = track?.getSettings?.() || {};
    const width = settings.width || video.videoWidth || 0;
    const height = settings.height || video.videoHeight || 0;

    if (width && height) {
      const orientationText = width >= height ? 'horizontal' : 'vertical';
      info.textContent = `Câmera ativa: ${width} × ${height} · ${orientationText}. Meta de gravação: até 720p.`;
    } else {
      info.textContent = 'Resolução solicitada: 1280 × 720 (720p).';
    }
  }

  window.applyStudioFraming = function applyStudioFraming(resetTest = false) {
    const frame = currentFraming();
    const safeFrame = document.getElementById('studioSafeFrame');
    const title = document.getElementById('studioFrameTitle');
    if (!safeFrame || !title) return;

    const stage = document.getElementById('studioCameraStage');
    const select = document.getElementById('studioFraming');
    let effectiveFrame = frame;

    if (adaptiveBodyModes.has(currentMode())) {
      if (!isLandscape() && frame === 'presentation') effectiveFrame = 'fullbody';
      if (isLandscape() && frame === 'fullbody') effectiveFrame = 'presentation';
      if (select && select.value !== effectiveFrame) select.value = effectiveFrame;
    }

    safeFrame.classList.remove('frame-interview', 'frame-fullbody', 'frame-presentation', 'frame-tactical');
    safeFrame.classList.add(`frame-${effectiveFrame}`);
    if (stage) {
      stage.classList.toggle('portrait-stage', effectiveFrame === 'fullbody');
      stage.classList.toggle('landscape-stage', effectiveFrame !== 'fullbody');
    }
    title.textContent = framingLabel(effectiveFrame);

    if (resetTest) resetGestureTest();
    updateOrientationNotice();
    renderGestureTest();
    updateRecordAvailability();
  };

  window.onStudioModeChange = function onStudioModeChange() {
    const framingSelect = document.getElementById('studioFraming');
    if (framingSelect) framingSelect.value = recommendedFraming();
    if (typeof originalLoadStudioPrompt === 'function') originalLoadStudioPrompt();
    resetGestureTest();
    window.applyStudioFraming(false);
  };

  window.loadStudioPrompt = function enhancedLoadStudioPrompt() {
    if (typeof originalLoadStudioPrompt === 'function') originalLoadStudioPrompt();
    window.applyStudioFraming(false);
  };

  window.startStudioCamera = async function enhancedStartStudioCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      if (typeof setStudioStatus === 'function') {
        setStudioStatus('Este navegador não oferece acesso à câmera.', 'warning');
      }
      return;
    }

    if (typeof stopStudioCamera === 'function') stopStudioCamera();

    try {
      const facingMode = document.getElementById('studioCamera')?.value || 'user';
      const portraitCapture = currentFraming() === 'fullbody' || (!isLandscape() && adaptiveBodyModes.has(currentMode()));
      studioStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: portraitCapture ? 720 : 1280 },
          height: { ideal: portraitCapture ? 1280 : 720 },
          aspectRatio: { ideal: portraitCapture ? 9 / 16 : 16 / 9 },
          frameRate: { ideal: 30, max: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const video = document.getElementById('studioPreview');
      video.srcObject = studioStream;
      await video.play().catch(() => {});
      if (video.readyState < 1) {
        await new Promise(resolve => {
          video.addEventListener('loadedmetadata', resolve, { once: true });
          setTimeout(resolve, 1200);
        });
      }

      document.getElementById('studioCameraBtn').textContent = '📷 Câmera ativa';
      document.getElementById('studioGestureButton').disabled = false;
      if (typeof setStudioPill === 'function') setStudioPill('Pronto para enquadrar');

      resetGestureTest();
      updateCameraResolutionInfo();
      updateOrientationNotice();
      updateRecordAvailability();

      if (landscapeRequired() && !isLandscape()) {
        if (typeof setStudioStatus === 'function') {
          setStudioStatus('Câmera ativa. Agora gire o celular para a posição horizontal.', 'warning');
        }
      } else if (gestureRequired()) {
        if (typeof setStudioStatus === 'function') {
          setStudioStatus('Câmera ativa. Faça o teste de gestos antes de gravar.', 'ready');
        }
      } else if (typeof setStudioStatus === 'function') {
        setStudioStatus('Câmera ativa. Confira rosto e ombros no enquadramento.', 'ready');
      }
    } catch (error) {
      console.error('Studio camera error:', error);
      if (typeof setStudioStatus === 'function') {
        setStudioStatus('Não foi possível acessar câmera e microfone. Verifique as permissões do navegador.', 'warning');
      }
      updateRecordAvailability();
    }
  };

  window.startStudioRecording = async function guardedStartStudioRecording() {
    if (!studioStream) {
      await window.startStudioCamera();
      if (!studioStream) return;
    }

    if (landscapeRequired() && !isLandscape()) {
      if (typeof setStudioStatus === 'function') {
        setStudioStatus('Gire o celular para o modo horizontal antes de gravar.', 'warning');
      }
      updateRecordAvailability();
      return;
    }

    if (gestureRequired() && !gesturePassed) {
      if (typeof setStudioStatus === 'function') {
        setStudioStatus('Conclua o teste de enquadramento antes de gravar.', 'warning');
      }
      updateRecordAvailability();
      return;
    }

    await originalStartStudioRecording();
  };

  // Salva também a moldura e a orientação usadas na sessão.
  window.saveStudioVideo = async function enhancedSaveStudioVideo() {
    if (!studioDraftBlob) {
      if (typeof toast === 'function') toast('Grave um vídeo primeiro.');
      return;
    }

    updateStudioDraftMetrics();
    const metrics = studioTranscriptMetrics();
    const framing = currentFraming();
    const record = {
      id: 'video-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      createdAt: Date.now(),
      createdLabel: new Date().toLocaleString('pt-BR'),
      mode: currentMode(),
      title: studioSessionTitle(),
      prompt: document.getElementById('studioPrompt').value.trim(),
      language: document.getElementById('studioLanguage').value,
      duration: metrics.duration,
      words: metrics.words,
      wpm: metrics.wpm,
      fillers: metrics.fillers,
      transcript: document.getElementById('studioTranscript').value.trim(),
      observations: [...studioSelectedObservations],
      framing,
      framingLabel: framingLabel(framing),
      orientation: isLandscape() ? 'horizontal' : 'vertical',
      resolution: document.getElementById('studioCameraInfo')?.textContent || '',
      mimeType: studioDraftBlob.type,
      size: studioDraftBlob.size,
      blob: studioDraftBlob
    };

    try {
      await studioDBPut(record);
      if (typeof addXP === 'function') addXP(15, 'Vídeo salvo: ' + record.title);
      if (typeof toast === 'function') toast('Vídeo salvo neste navegador.');
      await renderStudioLibrary();
    } catch (error) {
      console.error(error);
      if (typeof setStudioStatus === 'function') {
        setStudioStatus('Não foi possível salvar. O armazenamento do celular pode estar cheio.', 'warning');
      }
    }
  };

  function bindFramingListeners() {
    if (framingListenersBound) return;
    framingListenersBound = true;

    const handleOrientation = () => {
      const select = document.getElementById('studioFraming');
      if (select && adaptiveBodyModes.has(currentMode()) && ['presentation','fullbody'].includes(select.value)) {
        select.value = isLandscape() ? 'presentation' : 'fullbody';
        window.applyStudioFraming(true);
      } else {
        updateOrientationNotice();
        updateRecordAvailability();
      }
      updateCameraResolutionInfo();
      if (landscapeRequired() && !isLandscape() && studioStream && !recorderIsActive()) {
        if (typeof setStudioStatus === 'function') {
          setStudioStatus('O quadro tático exige o celular na horizontal.', 'warning');
        }
      }
    };

    window.addEventListener('resize', handleOrientation, { passive: true });
    window.addEventListener('orientationchange', handleOrientation, { passive: true });

    if (screen.orientation?.addEventListener) {
      screen.orientation.addEventListener('change', handleOrientation);
    }
  }

  window.initializeStudio = function enhancedInitializeStudio() {
    if (typeof originalInitializeStudio === 'function') originalInitializeStudio();
    const framingSelect = document.getElementById('studioFraming');
    if (framingSelect && !framingSelect.dataset.initialized) {
      framingSelect.value = recommendedFraming();
      framingSelect.dataset.initialized = 'true';
    }
    bindFramingListeners();
    resetGestureTest();
    window.applyStudioFraming(false);
  };

  // Garante inicialização mesmo quando o módulo é carregado após o DOM.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializeStudio, { once: true });
  } else {
    window.initializeStudio();
  }
})();
