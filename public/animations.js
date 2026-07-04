(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function wireHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function wireReveal() {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (!items.length) {
      return;
    }

    if (reduced) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const seenGroups = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const group = el.closest('[data-reveal-group]');

          if (group && !seenGroups.has(group)) {
            seenGroups.add(group);
            const siblings = [...group.querySelectorAll('[data-reveal]')];
            siblings.forEach((sibling, index) => {
              sibling.style.setProperty('--reveal-delay', `${index * 90}ms`);
              sibling.classList.add('is-visible');
              observer.unobserve(sibling);
            });
            return;
          }

          if (!group) {
            el.classList.add('is-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;

    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals !== undefined
      ? parseInt(el.dataset.decimals, 10)
      : String(target).includes('.') ? 1 : 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const value = target * eased;
      const formatted = decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value).toLocaleString('en-IN');
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function wireCounters() {
    const counters = [...document.querySelectorAll('[data-count]')];
    if (!counters.length || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function wireFactoryFlow() {
    const graphic = document.querySelector('[data-factory-flow]');
    if (!graphic || reduced) return;

    const plan = graphic.querySelector('[data-flow-plan]');
    const produce = graphic.querySelector('[data-flow-produce]');
    const nodes = [...graphic.querySelectorAll('.flow-node')];
    let activeIndex = 0;
    let planVal = 248;
    let produceVal = 253;

    const cycleActive = () => {
      nodes.forEach((node) => node.classList.remove('active'));
      nodes[activeIndex % nodes.length].classList.add('active');
      activeIndex += 1;
    };

    const tickNumbers = () => {
      if (!plan || !produce) return;
      planVal += Math.floor(Math.random() * 4) + 1;
      produceVal = planVal + Math.floor(Math.random() * 7) + 2;
      plan.textContent = `${planVal}k`;
      produce.textContent = `${produceVal}k`;
    };

    cycleActive();
    const activeTimer = window.setInterval(cycleActive, 2600);
    const numberTimer = window.setInterval(tickNumbers, 3400);

    graphic.addEventListener('mouseenter', () => {
      window.clearInterval(activeTimer);
      window.clearInterval(numberTimer);
    });
  }

  function wireHeroEntrance() {
    if (reduced) return;
    requestAnimationFrame(() => {
      document.querySelector('.hero-entrance')?.classList.add('is-loaded');
      document.querySelector('.page-hero-entrance')?.classList.add('is-loaded');
    });
  }

  function wireStepsTimeline() {
    const timeline = document.querySelector('[data-steps-timeline]');
    if (!timeline || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          timeline.classList.add('is-drawn');
          observer.unobserve(timeline);
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(timeline);
  }

  function wireParallax() {
    const frames = [...document.querySelectorAll('[data-parallax]')];
    if (!frames.length || reduced) return;

    const onScroll = () => {
      const viewport = window.innerHeight;
      frames.forEach((frame) => {
        const rect = frame.getBoundingClientRect();
        if (rect.top > viewport || rect.bottom < 0) return;
        const offset = (rect.top - viewport * 0.5) * 0.04;
        frame.style.transform = `translateY(${offset}px)`;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  wireHeaderScroll();
  wireReveal();
  wireCounters();
  wireFactoryFlow();
  wireHeroEntrance();
  wireStepsTimeline();
  wireParallax();
})();