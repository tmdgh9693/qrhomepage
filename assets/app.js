(() => {
  const root = document.documentElement;
  const sizeButton = document.getElementById('sizeButton');
  const sizePanel = document.getElementById('sizePanel');
  const sizeButtons = [...document.querySelectorAll('[data-font-size]')];
  const navLinks = [...document.querySelectorAll('.bottom-nav a')];

  const scales = {
    small: '0.9',
    normal: '1',
    large: '1.18'
  };

  const savedSize = localStorage.getItem('qrPageFontSize');
  const initialSize = Object.hasOwn(scales, savedSize) ? savedSize : 'normal';

  function applyFontSize(size) {
    root.style.setProperty('--font-scale', scales[size]);
    localStorage.setItem('qrPageFontSize', size);

    sizeButtons.forEach((button) => {
      const active = button.dataset.fontSize === size;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  applyFontSize(initialSize);

  if (sizeButton && sizePanel) {
    sizeButton.addEventListener('click', () => {
      const isOpen = !sizePanel.hidden;
      sizePanel.hidden = isOpen;
      sizeButton.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  sizeButtons.forEach((button) => {
    button.addEventListener('click', () => applyFontSize(button.dataset.fontSize));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });

  const sections = [
    { selector: '#home', href: '#home' },
    { selector: '#notice-title', href: '#notice-title' },
    { selector: '#guide-title', href: '#guide-title' },
    { selector: '#caution-title', href: '#caution-title' }
  ];

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const matched = sections.find((section) => document.querySelector(section.selector) === visible.target);
    if (!matched) return;

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === matched.href);
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.5] });

  sections.forEach(({ selector }) => {
    const element = document.querySelector(selector);
    if (element) observer.observe(element);
  });


  // 모바일에서는 네이버지도 앱을 먼저 호출하고, 앱이 없으면 웹 지도로 연결합니다.
  const naverMapLinks = [...document.querySelectorAll('[data-map-app="naver"]')];
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  naverMapLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!isMobile) return;

      event.preventDefault();
      const query = encodeURIComponent(link.dataset.query || '');
      const fallbackUrl = link.href;
      const appName = encodeURIComponent(window.location.href.split('#')[0]);

      if (isAndroid) {
        const fallback = encodeURIComponent(fallbackUrl);
        window.location.href = `intent://search?query=${query}&appname=${appName}`
          + `#Intent;scheme=nmap;action=android.intent.action.VIEW;`
          + `category=android.intent.category.BROWSABLE;package=com.nhn.android.nmap;`
          + `S.browser_fallback_url=${fallback};end`;
        return;
      }

      let pageHidden = false;
      const onVisibilityChange = () => {
        if (document.hidden) pageHidden = true;
      };
      document.addEventListener('visibilitychange', onVisibilityChange, { once: true });
      window.location.href = `nmap://search?query=${query}&appname=${appName}`;

      window.setTimeout(() => {
        if (!pageHidden && !document.hidden) window.location.href = fallbackUrl;
      }, 1200);
    });
  });

})();
