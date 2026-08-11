(() => {
  document.body.classList.add('reveal-ready');
  const storageKey = 'workout-completed-exercises-v1';
  const logStorageKey = 'workout-exercise-log-v1';
  let completed = {};
  let exerciseLog = {};

  try {
    completed = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (_) {
    completed = {};
  }
  try {
    exerciseLog = JSON.parse(localStorage.getItem(logStorageKey)) || {};
  } catch (_) {
    exerciseLog = {};
  }

  const checkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const exerciseInstructions = {
    'Push-Ups': 'ضع يديك أوسع قليلاً من الكتفين، وثبّت جسمك بخط مستقيم. انزل بصدر متحكّم حتى يقترب من الأرض، ثم ادفع دون ترك الحوض يهبط.',
    'Incline Push-Ups': 'ضع يديك على سطح ثابت ومرتفع، وحافظ على استقامة الجسم. اخفض صدرك نحو الحافة ثم ادفع حتى تمد الذراعين دون قفل قوي للمرفقين.',
    'Pike Push-Ups': 'ارفع الحوض ليأخذ الجسم شكل مثلث، وانظر بين القدمين. اثنِ المرفقين وأنزل الرأس باتجاه الأرض ثم ادفع بالكتفين للأعلى.',
    'Chair Dips': 'ثبّت الكرسي على الأرض وضع الكفين قرب الوركين. انزل عمودياً مع إبقاء الكتفين للخلف، ثم ادفع حتى تعود دون النزول أعمق من راحة كتفك.',
    'Shoulder Taps': 'ابدأ بوضعية البلانك وباعد القدمين للثبات. المس كل كتف باليد المقابلة بالتناوب مع مقاومة دوران الحوض.',
    'Squats': 'ثبّت القدمين بعرض الكتفين ووجّه الركبتين مع اتجاه الأصابع. ادفع الحوض للخلف والأسفل، ثم اصعد بالضغط عبر كامل القدم.',
    'Lunges': 'خذ خطوة كافية للأمام وانزل بالركبة الخلفية نحو الأرض. حافظ على الجذع ثابتاً والركبة الأمامية باتجاه أصابع القدم، ثم ادفع للعودة.',
    'Bulgarian Split Squat': 'ضع مشط القدم الخلفية على سطح ثابت وتقدّم بالأمامية. انزل عمودياً بتحكم ثم ادفع من القدم الأمامية مع بقاء الحوض مستقيماً.',
    'Glute Bridge': 'استلقِ واثنِ الركبتين وثبّت القدمين. اضغط بالكعبين وارفع الحوض مع عصر عضلات المؤخرة، ثم انزل ببطء دون تقويس أسفل الظهر.',
    'Calf Raises': 'قف بثبات وارفع الكعبين لأعلى مدى مريح. اثبت لحظة في الأعلى ثم انزل ببطء حتى تشعر بتمدد عضلة الساق.',
    'Leg Raises': 'استلقِ وثبّت أسفل الظهر باتجاه الأرض. ارفع الساقين بتحكم ثم اخفضهما دون السماح للظهر بالتقوس.',
    'Plank': 'ضع المرفقين تحت الكتفين وشد البطن والمؤخرة. حافظ على خط مستقيم من الرأس للكعبين وتنفس طبيعياً طوال مدة الثبات.',
    'Mountain Climbers': 'ابدأ ببلانك قوي واسحب ركبة واحدة نحو الصدر ثم بدّل بسرعة. أبقِ الكتفين فوق اليدين والحوض ثابتاً قدر الإمكان.',
    'Russian Twists': 'اجلس مع ميل خفيف للخلف وظهر محايد. دوّر القفص الصدري من جهة لأخرى بتحكم بدلاً من تحريك الذراعين وحدهما.',
    'Bicycle Crunch': 'قرّب الكتف نحو الركبة المقابلة مع مد الساق الأخرى. بدّل الجانبين ببطء وحافظ على أسفل الظهر قريباً من الأرض.',
    'One-Arm Dumbbell Row': 'ثبّت اليد والركبة المقابلتين على سطح ثابت وحافظ على ظهر محايد. اسحب الدمبل نحو الورك ثم اخفضه ببطء دون تدوير الجذع.',
    'Dumbbell Pullover': 'استلقِ بثبات وامسك الدمبل فوق الصدر بكلتا اليدين. اخفضه خلف الرأس بقوس متحكّم ومرفقين مثنيين قليلاً، ثم اسحبه للعودة.',
    'Superman Hold': 'استلقِ على البطن ومد الذراعين والساقين. ارفعهما مسافة مريحة مع شد المؤخرة والظهر، وتجنب رفع الرقبة بقوة.',
    'Reverse Snow Angels': 'استلقِ على البطن وارفع اليدين قليلاً عن الأرض. حرّك الذراعين بقوس من فوق الرأس نحو الوركين ببطء مع إبقاء الكتفين بعيدين عن الأذنين.',
    'Towel Rows': 'استخدم نقطة تثبيت قوية وآمنة فقط، وامسك المنشفة بكلتا اليدين. مِل للخلف بجسم مستقيم واسحب صدرك للأمام مع ضم لوحي الكتف.',
    'Bicep Curls': 'ثبّت المرفقين بجانب الجسم وارفع الدمبلين دون تأرجح. اعصر البايسبس في الأعلى ثم اخفض الوزن ببطء حتى تمد الذراع.',
    'Hammer Curls': 'امسك الدمبلين براحتين متقابلتين وثبّت المرفقين. ارفع بتحكم مع بقاء القبضة محايدة ثم اخفض الوزن ببطء.',
    'Jump Squats': 'انزل إلى سكوات مريح ثم اقفز بقوة. اهبط بهدوء على منتصف القدم واثنِ الركبتين مباشرة لامتصاص الصدمة.'
  };
  const compoundExercises = new Set([
    'Push-Ups', 'Incline Push-Ups', 'Pike Push-Ups', 'Chair Dips', 'Squats', 'Lunges',
    'Bulgarian Split Squat', 'One-Arm Dumbbell Row', 'Dumbbell Pullover', 'Towel Rows'
  ]);
  const conditioningExercises = new Set(['Mountain Climbers', 'Jump Squats']);

  const getRestRecommendation = (dayId, exerciseName) => {
    if (dayId === 'day5') {
      return conditioningExercises.has(exerciseName)
        ? { seconds: 30, reason: 'دائرة كارديو؛ راحة قصيرة تحافظ على النبض.' }
        : { seconds: 60, reason: 'ضمن دائرة؛ وقت كافٍ لاستعادة الأداء دون فقدان الإيقاع.' };
    }
    if (compoundExercises.has(exerciseName)) {
      return { seconds: 90, reason: 'تمرين مركّب؛ راحة أطول تحافظ على جودة التكرارات.' };
    }
    if (conditioningExercises.has(exerciseName)) {
      return { seconds: 45, reason: 'تمرين لياقة؛ راحة متوسطة تحافظ على شدة الجهد.' };
    }
    return { seconds: 60, reason: 'مناسب لتمارين العزل والكور مع الحفاظ على جودة الأداء.' };
  };
  const timer = document.querySelector('.rest-timer');
  const timerTime = timer.querySelector('.rest-timer-time');
  const timerFill = timer.querySelector('.rest-timer-fill');
  const timerToggle = timer.querySelector('.timer-toggle');
  const presetButtons = [...timer.querySelectorAll('.timer-preset')];
  let timerInterval;
  let timerDuration = 60;
  let timerRemaining = 60;
  let timerRunning = false;
  const dialog = document.querySelector('.exercise-dialog');
  const dialogTitle = dialog.querySelector('.dialog-title');
  const dialogInstructions = dialog.querySelector('.dialog-instructions');
  const weightInput = dialog.querySelector('.dialog-input');
  const notesInput = dialog.querySelector('.dialog-notes');
  const saveState = dialog.querySelector('.save-state');
  let activeExerciseId = '';
  let dialogTrigger = null;
  let saveStateTimeout;

  const closeDialog = () => {
    dialog.classList.remove('is-open');
    dialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    dialogTrigger?.focus();
  };

  const openDialog = (exerciseId, exerciseName, trigger) => {
    activeExerciseId = exerciseId;
    dialogTrigger = trigger;
    const saved = exerciseLog[exerciseId] || {};
    dialogTitle.textContent = exerciseName;
    dialogInstructions.textContent = exerciseInstructions[exerciseName] || 'نفّذ الحركة بتحكم، حافظ على وضعية جسم ثابتة، وأوقف المجموعة إذا لم تعد قادراً على الحفاظ على الأداء الصحيح.';
    weightInput.value = saved.weight ?? '';
    notesInput.value = saved.notes ?? '';
    saveState.textContent = '';
    dialog.classList.add('is-open');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    dialog.querySelector('.dialog-close').focus();
  };

  const saveExerciseLog = () => {
    if (!activeExerciseId) return;
    exerciseLog[activeExerciseId] = { weight: weightInput.value, notes: notesInput.value };
    try {
      localStorage.setItem(logStorageKey, JSON.stringify(exerciseLog));
      saveState.textContent = 'تم الحفظ تلقائياً';
      clearTimeout(saveStateTimeout);
      saveStateTimeout = setTimeout(() => { saveState.textContent = ''; }, 1600);
    } catch (_) {
      saveState.textContent = 'تعذّر الحفظ في المتصفح';
    }
  };

  weightInput.addEventListener('input', saveExerciseLog);
  notesInput.addEventListener('input', saveExerciseLog);
  dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.classList.contains('is-open')) closeDialog();
  });

  const renderTimer = () => {
    const minutes = Math.floor(timerRemaining / 60);
    const seconds = timerRemaining % 60;
    timerTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerFill.style.width = `${(timerRemaining / timerDuration) * 100}%`;
  };

  const soundAlert = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 720;
      gain.gain.setValueAtTime(.12, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .45);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + .45);
    } catch (_) {}
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
    timerRunning = false;
    timerToggle.textContent = timerRemaining === 0 ? 'إعادة المؤقت' : 'استكمال المؤقت';
  };

  const startTimer = (seconds = timerRemaining) => {
    clearInterval(timerInterval);
    timerDuration = seconds;
    timerRemaining = seconds;
    timerRunning = true;
    timer.classList.remove('is-finished');
    timer.classList.add('is-open');
    timer.setAttribute('aria-hidden', 'false');
    timerToggle.textContent = 'إيقاف مؤقت';
    presetButtons.forEach((button) => button.classList.toggle('is-active', Number(button.dataset.seconds) === seconds));
    renderTimer();
    timerInterval = setInterval(() => {
      timerRemaining -= 1;
      renderTimer();
      if (timerRemaining <= 0) {
        stopTimer();
        timer.classList.add('is-finished');
        timerToggle.textContent = 'ابدأ مرة أخرى';
        soundAlert();
      }
    }, 1000);
  };

  presetButtons.forEach((button) => {
    button.addEventListener('click', () => startTimer(Number(button.dataset.seconds)));
  });
  timerToggle.addEventListener('click', () => {
    if (timerRunning) {
      stopTimer();
    } else {
      startTimer(timerRemaining || timerDuration);
    }
  });
  timer.querySelector('.rest-timer-close').addEventListener('click', () => {
    stopTimer();
    timer.classList.remove('is-open');
    timer.setAttribute('aria-hidden', 'true');
  });

  document.querySelectorAll('.day-section').forEach((day) => {
    const cards = [...day.querySelectorAll('.ex-card')];
    const dayInfo = day.querySelector('.day-info');
    if (!cards.length || !dayInfo) return;

    const progress = document.createElement('div');
    progress.className = 'day-progress';
    progress.innerHTML = `
      <div class="day-progress-copy">
        <span>تقدّم اليوم</span>
        <strong><span class="day-progress-count">0</span> / ${cards.length}</strong>
      </div>
      <div class="day-progress-track" role="progressbar" aria-label="تقدّم تمارين اليوم" aria-valuemin="0" aria-valuemax="${cards.length}" aria-valuenow="0">
        <span class="day-progress-fill"></span>
      </div>`;
    dayInfo.appendChild(progress);

    const updateProgress = () => {
      const done = cards.filter((card) => card.classList.contains('is-complete')).length;
      progress.querySelector('.day-progress-count').textContent = done;
      progress.querySelector('.day-progress-fill').style.width = `${(done / cards.length) * 100}%`;
      progress.querySelector('.day-progress-track').setAttribute('aria-valuenow', done);
    };

    cards.forEach((card, index) => {
      const meta = card.querySelector('.ex-meta');
      const exerciseName = card.querySelector('.ex-name-en')?.textContent.trim() || `exercise-${index + 1}`;
      const exerciseId = `${day.id}:${exerciseName}`;
      const recommendation = getRestRecommendation(day.id, exerciseName);
      const reps = card.querySelector('.ex-reps');
      const restNote = document.createElement('p');
      restNote.className = 'rest-note';
      restNote.innerHTML = `<strong>الراحة المقترحة: ${recommendation.seconds} ثانية</strong> · ${recommendation.reason}`;
      reps.insertAdjacentElement('afterend', restNote);
      const detailsButton = document.createElement('button');
      detailsButton.className = 'details-btn';
      detailsButton.type = 'button';
      detailsButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>تفاصيل التمرين والسجل</span>';
      detailsButton.addEventListener('click', () => openDialog(exerciseId, exerciseName, detailsButton));
      const button = document.createElement('button');
      button.className = 'complete-btn';
      button.type = 'button';
      const restButton = document.createElement('button');
      restButton.className = 'rest-btn';
      restButton.type = 'button';
      restButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6"/></svg><span>أنهيت مجموعة · راحة ${recommendation.seconds}ث</span>`;
      restButton.addEventListener('click', () => startTimer(recommendation.seconds));

      const setComplete = (isComplete) => {
        card.classList.toggle('is-complete', isComplete);
        button.setAttribute('aria-pressed', String(isComplete));
        button.innerHTML = `${checkIcon}<span>${isComplete ? 'تم الإنجاز' : 'تحديد كمُنجز'}</span>`;
        completed[exerciseId] = isComplete;
      };

      setComplete(Boolean(completed[exerciseId]));
      button.addEventListener('click', () => {
        const isNowComplete = !card.classList.contains('is-complete');
        setComplete(isNowComplete);
        try {
          localStorage.setItem(storageKey, JSON.stringify(completed));
        } catch (_) {}
        updateProgress();
      });

      meta.appendChild(detailsButton);
      meta.appendChild(restButton);
      meta.appendChild(button);
    });

    updateProgress();
  });

  const navLinks = [...document.querySelectorAll('.day-pill')];
  const daySections = [...document.querySelectorAll('.day-section')];
  const setActiveDay = (dayId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${dayId}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if ('IntersectionObserver' in window) {
    const dayObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveDay(visible.target.id);
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, .15, .35] });
    daySections.forEach((section) => dayObserver.observe(section));

    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    document.querySelectorAll('.ex-card').forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index % 4, 3) * 45}ms`;
      cardObserver.observe(card);
    });
  } else {
    document.querySelectorAll('.ex-card').forEach((card) => card.classList.add('is-visible'));
  }

  navLinks.forEach((link) => link.addEventListener('click', () => setActiveDay(link.hash.slice(1))));
})();
