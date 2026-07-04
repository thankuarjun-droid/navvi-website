const WHATSAPP_NUMBER = '919894466715';
const BOOKING_URL = '';

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function wireNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const links = document.querySelector('[data-nav-links]');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

function wireLeadForm() {
  const form = document.querySelector('[data-lead-form]');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || 'Factory owner';
    const company = data.get('company') || 'my factory';
    const interest = data.get('interest') || 'Navvi';
    const message = data.get('message') || 'Please call me.';
    window.location.href = whatsappUrl(`Hello Navvi, I am ${name} from ${company}. I want help with ${interest}. ${message}`);
  });
}

function wireBookingLinks() {
  document.querySelectorAll('[data-booking-link]').forEach((link) => {
    if (BOOKING_URL) {
      link.href = BOOKING_URL;
      link.target = '_blank';
      link.rel = 'noopener';
    } else {
      link.href = whatsappUrl('Hello Navvi, I want to book a free factory assessment call.');
    }
  });
}

function wireGallery() {
  const gallery = document.querySelector('[data-screenshot-gallery]');
  const main = document.querySelector('[data-gallery-main]');
  if (!main) return;

  const labelEl = document.querySelector('[data-gallery-label]');
  const captionEl = document.querySelector('[data-gallery-caption]');
  const categoryEl = document.querySelector('[data-gallery-category]');
  const thumbs = [...document.querySelectorAll('[data-gallery-src]')];
  const tabs = [...document.querySelectorAll('[data-gallery-filter]')];

  const setActive = (button) => {
    const src = button.getAttribute('data-gallery-src');
    const alt = button.getAttribute('data-gallery-alt') || 'SewTrak screenshot';
    if (main.getAttribute('src') === src) return;

    thumbs.forEach((thumb) => thumb.classList.remove('is-active'));
    button.classList.add('is-active');
    main.classList.add('is-fading');

    window.setTimeout(() => {
      main.src = src;
      main.alt = alt;
      if (labelEl) labelEl.textContent = button.getAttribute('data-gallery-label') || '';
      if (captionEl) captionEl.textContent = button.getAttribute('data-gallery-caption') || '';
      if (categoryEl) categoryEl.textContent = button.getAttribute('data-gallery-category') || '';
      main.classList.remove('is-fading');
    }, 200);
  };

  thumbs.forEach((button, index) => {
    if (index === 0) button.classList.add('is-active');
    button.addEventListener('click', () => setActive(button));
  });

  if (!gallery || !tabs.length) return;

  const applyFilter = (filter) => {
    tabs.forEach((tab) => {
      const active = tab.getAttribute('data-gallery-filter') === filter;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    thumbs.forEach((thumb) => {
      const category = thumb.getAttribute('data-gallery-category-filter');
      const show = filter === 'all' || category === filter;
      thumb.hidden = !show;
    });

    const visible = thumbs.filter((thumb) => !thumb.hidden);
    if (visible.length && !visible.some((thumb) => thumb.classList.contains('is-active'))) {
      setActive(visible[0]);
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => applyFilter(tab.getAttribute('data-gallery-filter')));
  });
}

wireNav();
wireLeadForm();
wireBookingLinks();
wireGallery();
