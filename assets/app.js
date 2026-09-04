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
  // const mapChoiceGoogle = document.getElementById('mapChoiceGoogle');
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
      // if (mapChoiceGoogle) mapChoiceGoogle.href = button.dataset.googleUrl || '#';

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

  const stampMedia = stampImage?.closest('.stamp-location-dialog__media') || null;
  let stampSlides = [];
  let stampSlideIndex = 0;
  let stampTouchStartX = 0;
  let stampLoadToken = 0;

  // index.html은 수정하지 않고 필요한 슬라이더 버튼을 실행 시 자동 생성합니다.
  const stampPrevButton = document.createElement('button');
  stampPrevButton.type = 'button';
  stampPrevButton.className = 'stamp-location-slider__arrow stamp-location-slider__arrow--prev';
  stampPrevButton.setAttribute('aria-label', '이전 사진');
  stampPrevButton.textContent = '‹';
  stampPrevButton.hidden = true;

  const stampNextButton = document.createElement('button');
  stampNextButton.type = 'button';
  stampNextButton.className = 'stamp-location-slider__arrow stamp-location-slider__arrow--next';
  stampNextButton.setAttribute('aria-label', '다음 사진');
  stampNextButton.textContent = '›';
  stampNextButton.hidden = true;

  const stampCounter = document.createElement('div');
  stampCounter.className = 'stamp-location-slider__counter';
  stampCounter.setAttribute('aria-live', 'polite');
  stampCounter.hidden = true;

  stampMedia?.append(stampPrevButton, stampNextButton, stampCounter);

  function renderStampSlide() {
    if (!stampImage || !stampEmpty) return;

    if (!stampSlides.length) {
      stampImage.hidden = true;
      stampImage.removeAttribute('src');
      stampEmpty.hidden = false;
      stampPrevButton.hidden = true;
      stampNextButton.hidden = true;
      stampCounter.hidden = true;
      return;
    }

    stampSlideIndex = Math.max(0, Math.min(stampSlideIndex, stampSlides.length - 1));
    stampImage.src = stampSlides[stampSlideIndex];
    stampImage.hidden = false;
    stampEmpty.hidden = true;

    const multiple = stampSlides.length > 1;
    stampPrevButton.hidden = !multiple;
    stampNextButton.hidden = !multiple;
    stampCounter.hidden = !multiple;
    if (multiple) stampCounter.textContent = `${stampSlideIndex + 1} / ${stampSlides.length}`;
  }

  function previousStampSlide() {
    if (stampSlides.length <= 1) return;
    stampSlideIndex = (stampSlideIndex - 1 + stampSlides.length) % stampSlides.length;
    renderStampSlide();
  }

  function nextStampSlide() {
    if (stampSlides.length <= 1) return;
    stampSlideIndex = (stampSlideIndex + 1) % stampSlides.length;
    renderStampSlide();
  }

  function probeImage(src) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  async function findExistingImage(base) {
    for (const extension of imageExtensions) {
      const found = await probeImage(`${base}${extension}`);
      if (found) return found;
    }
    return null;
  }

  async function loadStampImage(base, title) {
    if (!stampImage || !stampEmpty) return;

    const token = ++stampLoadToken;
    stampSlides = [];
    stampSlideIndex = 0;
    stampImage.hidden = true;
    stampImage.removeAttribute('src');
    stampImage.alt = title;
    stampEmpty.hidden = false;
    stampPrevButton.hidden = true;
    stampNextButton.hidden = true;
    stampCounter.hidden = true;

    // 먼저 05-1.jpg, 05-2.jpg 같은 다중사진 형식을 확인합니다.
    const numberedSlides = [];
    for (let number = 1; number <= 10; number += 1) {
      const found = await findExistingImage(`${base}-${number}`);
      if (token !== stampLoadToken) return;
      if (!found) break;
      numberedSlides.push(found);
    }

    if (numberedSlides.length) {
      stampSlides = numberedSlides;
      renderStampSlide();
      return;
    }

    // 다중사진이 없으면 기존 방식(01.jpeg, 02.jpeg 등)을 그대로 사용합니다.
    const single = await findExistingImage(base);
    if (token !== stampLoadToken) return;

    stampSlides = single ? [single] : [];
    renderStampSlide();
  }

  stampPrevButton.addEventListener('click', (event) => {
    event.stopPropagation();
    previousStampSlide();
  });

  stampNextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    nextStampSlide();
  });

  // 모바일: 사진을 좌우로 밀어 다음/이전 사진을 볼 수 있습니다.
  stampMedia?.addEventListener('touchstart', (event) => {
    stampTouchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  stampMedia?.addEventListener('touchend', (event) => {
    if (stampSlides.length <= 1) return;
    const endX = event.changedTouches[0]?.clientX || 0;
    const distance = endX - stampTouchStartX;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) nextStampSlide();
    else previousStampSlide();
  }, { passive: true });


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


  // 메인 화면 스탬프 명소 6곳 전체 위치도 팝업.
  const locationOverviewDialog = document.getElementById('locationOverviewDialog');
  const locationOverviewButtons = [...document.querySelectorAll('[data-location-overview-open]')];

  function closeLocationOverviewDialog() {
    if (!locationOverviewDialog) return;
    if (typeof locationOverviewDialog.close === 'function' && locationOverviewDialog.open) locationOverviewDialog.close();
    else locationOverviewDialog.removeAttribute('open');
  }

  locationOverviewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!locationOverviewDialog) return;
      if (typeof locationOverviewDialog.showModal === 'function') locationOverviewDialog.showModal();
      else locationOverviewDialog.setAttribute('open', '');
    });
  });

  document.querySelectorAll('[data-location-overview-close]').forEach((button) => button.addEventListener('click', closeLocationOverviewDialog));
  locationOverviewDialog?.addEventListener('click', (event) => {
    if (event.target === locationOverviewDialog) closeLocationOverviewDialog();
  });

  // 네비게이션 명소별 "안전하게 방문하기" 안내창.
  const safetyDialog = document.getElementById('safetyGuideDialog');
  const safetyDialogTitle = document.getElementById('safetyGuideDialogTitle');
  const safetyPlaceName = document.getElementById('safetyGuidePlaceName');
  const safetyMessage = document.getElementById('safetyGuideMessage');
  const safetyPhotoWrap = document.getElementById('safetyGuidePhotoWrap');
  const safetyPhoto = document.getElementById('safetyGuidePhoto');
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
      const imageUrl = button.dataset.safetyImage || '';
      const imageAltKey = button.dataset.safetyImageAltKey || '';
      const imageAlt = imageAltKey ? (dict[imageAltKey] || title) : title;

      if (safetyDialogTitle) safetyDialogTitle.textContent = dict.visitSafely || '안전하게 방문하기';
      if (safetyPlaceName) safetyPlaceName.textContent = title;
      if (safetyMessage) safetyMessage.textContent = message;

      if (safetyPhotoWrap && safetyPhoto) {
        if (imageUrl) {
          safetyPhoto.src = imageUrl;
          safetyPhoto.alt = imageAlt;
          safetyPhotoWrap.hidden = false;
        } else {
          safetyPhotoWrap.hidden = true;
          safetyPhoto.removeAttribute('src');
          safetyPhoto.alt = '';
        }
      }

      if (typeof safetyDialog.showModal === 'function') safetyDialog.showModal();
      else safetyDialog.setAttribute('open', '');
    });
  });

  document.querySelectorAll('[data-safety-dialog-close]').forEach((button) => button.addEventListener('click', closeSafetyDialog));
  safetyDialog?.addEventListener('click', (event) => {
    if (event.target === safetyDialog) closeSafetyDialog();
  });

})();
