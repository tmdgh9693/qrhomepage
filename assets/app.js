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
    { selector: '#stamp-spots', href: '#stamp-spots' },
    { selector: '#guide', href: '#guide' },
    { selector: '#notice', href: '#notice' }
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


  // 메인 명소 카드의 "지도 보기"는 바로 이동하지 않고 지도 앱 선택창을 띄웁니다.
  const mapChoiceDialog = document.getElementById('mapChoiceDialog');
  const mapChoiceTitle = document.getElementById('mapChoiceDialogTitle');
  const mapChoiceKakao = document.getElementById('mapChoiceKakao');
  const mapChoiceNaver = document.getElementById('mapChoiceNaver');
  const mapChoiceGoogle = document.getElementById('mapChoiceGoogle');
  const mapChoiceButtons = [...document.querySelectorAll('[data-map-choice]')];

  function closeMapChoiceDialog() {
    if (!mapChoiceDialog) return;
    if (typeof mapChoiceDialog.close === 'function' && mapChoiceDialog.open) mapChoiceDialog.close();
    else mapChoiceDialog.removeAttribute('open');
  }

  mapChoiceButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!mapChoiceDialog) return;
      const dict = currentTranslations();
      const titleKey = button.dataset.titleKey;
      const title = dict[titleKey] || button.closest('.stamp-spot-card')?.querySelector('h3')?.textContent || '';
      if (mapChoiceTitle) mapChoiceTitle.textContent = `${title} · ${dict.mapChoice || '지도 앱 선택'}`;

      if (mapChoiceKakao) mapChoiceKakao.href = button.dataset.kakaoUrl || '#';
      if (mapChoiceNaver) {
        mapChoiceNaver.href = button.dataset.naverUrl || '#';
        mapChoiceNaver.dataset.query = button.dataset.query || title;
      }
      if (mapChoiceGoogle) mapChoiceGoogle.href = button.dataset.googleUrl || '#';

      if (typeof mapChoiceDialog.showModal === 'function') mapChoiceDialog.showModal();
      else mapChoiceDialog.setAttribute('open', '');
    });
  });

  document.querySelectorAll('[data-map-dialog-close]').forEach((button) => button.addEventListener('click', closeMapChoiceDialog));
  mapChoiceDialog?.addEventListener('click', (event) => {
    if (event.target === mapChoiceDialog) closeMapChoiceDialog();
  });


  // 메인 화면의 "스탬프 위치 보기" 사진 팝업.
  // assets/stamp-locations/01~06 파일만 넣으면 jpg/jpeg/png/webp 순서로 자동 탐색합니다.
  const stampDialog = document.getElementById('stampLocationDialog');
  const stampImage = document.getElementById('stampLocationImage');
  const stampEmpty = document.getElementById('stampLocationEmpty');
  const stampDialogTitle = document.getElementById('stampLocationDialogTitle');
  const stampButtons = [...document.querySelectorAll('[data-stamp-location]')];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  function currentTranslations() {
    const lang = (document.documentElement.lang || 'ko').toLowerCase();
    const key = lang.startsWith('ja') ? 'ja' : lang.startsWith('zh') ? 'zh' : lang.startsWith('en') ? 'en' : 'ko';
    return window.QR_LANG?.translations?.[key] || window.QR_LANG?.translations?.ko || {};
  }

  function closeStampDialog() {
    if (!stampDialog) return;
    if (typeof stampDialog.close === 'function' && stampDialog.open) stampDialog.close();
  }

  function loadStampImage(base, title) {
    if (!stampImage || !stampEmpty) return;
    let index = 0;
    stampImage.hidden = true;
    stampImage.removeAttribute('src');
    stampImage.alt = title;
    stampEmpty.hidden = false;

    const tryNext = () => {
      if (index >= imageExtensions.length) {
        stampImage.onerror = null;
        stampImage.onload = null;
        stampImage.hidden = true;
        stampEmpty.hidden = false;
        return;
      }
      const src = `${base}${imageExtensions[index++]}`;
      stampImage.onload = () => {
        stampEmpty.hidden = true;
        stampImage.hidden = false;
        stampImage.onerror = null;
      };
      stampImage.onerror = tryNext;
      stampImage.src = src;
    };
    tryNext();
  }

  stampButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!stampDialog) return;
      const dict = currentTranslations();
      const titleKey = button.dataset.titleKey;
      const title = dict[titleKey] || button.closest('.stamp-spot-card')?.querySelector('h3')?.textContent || '';
      if (stampDialogTitle) stampDialogTitle.textContent = `${title} · ${dict.viewStampLocation || '스탬프 위치 보기'}`;
      loadStampImage(button.dataset.stampImageBase || '', title);
      if (typeof stampDialog.showModal === 'function') stampDialog.showModal();
      else stampDialog.setAttribute('open', '');
    });
  });

  document.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', closeStampDialog));
  stampDialog?.addEventListener('click', (event) => {
    if (event.target === stampDialog) closeStampDialog();
  });


  // 네비게이션 명소별 "안전하게 방문하기" 안내창.
  const safetyDialog = document.getElementById('safetyGuideDialog');
  const safetyDialogTitle = document.getElementById('safetyGuideDialogTitle');
  const safetyPlaceName = document.getElementById('safetyGuidePlaceName');
  const safetyMessage = document.getElementById('safetyGuideMessage');
  const safetyButtons = [...document.querySelectorAll('[data-safety-guide]')];

  function closeSafetyDialog() {
    if (!safetyDialog) return;
    if (typeof safetyDialog.close === 'function' && safetyDialog.open) safetyDialog.close();
    else safetyDialog.removeAttribute('open');
  }

  safetyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!safetyDialog) return;
      const dict = currentTranslations();
      const title = dict[button.dataset.titleKey] || '';
      const message = dict[button.dataset.safetyKey] || '';
      if (safetyDialogTitle) safetyDialogTitle.textContent = dict.visitSafely || '안전하게 방문하기';
      if (safetyPlaceName) safetyPlaceName.textContent = title;
      if (safetyMessage) safetyMessage.textContent = message;
      if (typeof safetyDialog.showModal === 'function') safetyDialog.showModal();
      else safetyDialog.setAttribute('open', '');
    });
  });

  document.querySelectorAll('[data-safety-dialog-close]').forEach((button) => button.addEventListener('click', closeSafetyDialog));
  safetyDialog?.addEventListener('click', (event) => {
    if (event.target === safetyDialog) closeSafetyDialog();
  });

})();
