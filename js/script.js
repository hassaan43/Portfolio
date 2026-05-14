(() => {
  // Age — computed from Aug 29, 2005
  const ageEl = document.getElementById('age');
  if (ageEl) {
    const bday = new Date(2005, 7, 29); // month is 0-indexed: 7 = August
    const now = new Date();
    let age = now.getFullYear() - bday.getFullYear();
    const m = now.getMonth() - bday.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bday.getDate())) age--;
    ageEl.textContent = age;
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav border on scroll
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Tabs
  const tabList = document.querySelector('.tab-list');
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabList || !tabs.length) return;

  const moveIndicator = (tab) => {
    tabList.style.setProperty('--indicator-x', tab.offsetLeft + 'px');
    tabList.style.setProperty('--indicator-w', tab.offsetWidth + 'px');
  };

  const activate = (name) => {
    const tab = Array.from(tabs).find((t) => t.dataset.tab === name);
    if (!tab) return;
    tabs.forEach((t) => t.classList.toggle('active', t === tab));
    panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === name));
    moveIndicator(tab);
  };

  tabs.forEach((t) => t.addEventListener('click', () => activate(t.dataset.tab)));

  // Init indicator after fonts load
  const initial = document.querySelector('.tab.active') || tabs[0];
  if (initial) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => moveIndicator(initial));
    }
    requestAnimationFrame(() => moveIndicator(initial));
  }

  // Recompute on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const active = document.querySelector('.tab.active');
      if (active) moveIndicator(active);
    }, 80);
  });

  // ===== Deckira flashcard demo =====
  const deck = [
    { q: 'What does FSRS stand for?', a: 'Free Spaced Repetition Scheduler.' },
    { q: 'How do Deckira decks sync?', a: 'Through a shared Supabase backend across web, mobile, and desktop.' },
    { q: 'What can the AI pipeline do?', a: 'Generate flashcards from your notes or images, with deduplication.' },
  ];

  const demoCard = document.getElementById('demoCard');
  const demoText = document.getElementById('demoText');
  const demoLabel = document.getElementById('demoLabel');
  const demoHint = document.getElementById('demoHint');
  const demoCount = document.getElementById('demoCount');
  const demoActions = document.getElementById('demoActions');

  if (demoCard) {
    let idx = 0;
    let revealed = false;

    const render = () => {
      const c = deck[idx];
      demoCount.textContent = `${idx + 1} / ${deck.length}`;
      demoLabel.textContent = revealed ? 'BACK' : 'FRONT';
      demoText.textContent = revealed ? c.a : c.q;
      demoHint.textContent = revealed
        ? 'Rate how well you remembered.'
        : 'Tap to reveal answer';
      demoActions.hidden = !revealed;
      demoCard.classList.toggle('revealed', revealed);
    };

    const flip = (toRevealed) => {
      demoCard.classList.add('flipping');
      setTimeout(() => {
        revealed = toRevealed;
        render();
        demoCard.classList.remove('flipping');
      }, 140);
    };

    demoCard.addEventListener('click', () => {
      if (!revealed) flip(true);
    });
    demoCard.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !revealed) {
        e.preventDefault();
        flip(true);
      }
    });

    demoActions.addEventListener('click', (e) => {
      const btn = e.target.closest('.demo-rate');
      if (!btn) return;
      idx = (idx + 1) % deck.length;
      flip(false);
    });

    render();
  }
})();
