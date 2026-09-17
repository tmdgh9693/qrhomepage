(() => {
  'use strict';

  const SUPABASE_URL = 'https://rkxqayycirimuptduwwy.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_dFlJrnyhyXKMcdwEmjLKQA_D8gGDa0Z';
  const STORAGE_KEY = 'yeosuLighthouseAnonymousVisitorId_v1';

  function fallbackUuid() {
    const bytes = new Uint8Array(16);

    if (window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;

      const hex = [...bytes]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getVisitorId() {
    try {
      let id = localStorage.getItem(STORAGE_KEY);

      if (!id) {
        id = window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : fallbackUuid();

        localStorage.setItem(STORAGE_KEY, id);
      }

      return id;
    } catch (_) {
      return window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : fallbackUuid();
    }
  }

  async function recordVisit() {
    if (navigator.webdriver) return;

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_site_visit`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          p_visitor_id: getVisitorId(),
          p_path: location.pathname || '/'
        }),
        keepalive: true
      });
    } catch (_) {
      // 방문자 기록 실패는 홈페이지 이용에 영향을 주지 않습니다.
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', recordVisit, { once: true });
  } else {
    recordVisit();
  }
})();
