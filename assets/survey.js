(() => {
  const form = document.getElementById('eventSurveyForm');
  if (!form) return;

  const status = document.getElementById('surveyStatus');
  const complete = document.getElementById('surveyComplete');
  const submitButton = document.getElementById('surveySubmitButton');
  const q8OtherWrap = document.getElementById('q8OtherWrap');
  const q8OtherInput = document.getElementById('q8_other');
  const config = window.SURVEY_CONFIG || {};
  const requiredGroups = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];
  let supabaseClient = null;

  function language() {
    const lang = document.documentElement.lang || 'ko';
    return lang.startsWith('zh') ? 'zh' : lang.slice(0, 2);
  }

  function dictionary() {
    const lang = language();
    return window.QR_LANG?.translations?.[lang] || window.QR_LANG?.translations?.ko || {};
  }

  function t(key, fallback = '') {
    return dictionary()[key] ?? fallback;
  }

  function setStatus(message, type = 'error') {
    status.textContent = message;
    status.className = `survey-status survey-status--${type}`;
    status.hidden = false;
    status.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearStatus() {
    status.hidden = true;
    status.textContent = '';
    status.className = 'survey-status';
  }

  function updateLanguageDetails() {
    document.title = t('surveyPageTitle', '행사 만족도 조사');
    document.querySelectorAll('[data-placeholder-key]').forEach((element) => {
      element.placeholder = t(element.dataset.placeholderKey, element.placeholder);
    });
  }

  function showComplete(alreadySubmitted = false) {
    form.hidden = true;
    complete.hidden = false;
    if (alreadySubmitted) {
      const paragraph = complete.querySelector('p');
      if (paragraph) paragraph.textContent = t('surveyAlreadyComplete', paragraph.textContent);
    }
    complete.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function checkedValue(name) {
    return form.querySelector(`input[name="${name}"]:checked`)?.value || '';
  }

  function checkedValues(name) {
    return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
  }

  function scoreOrNull(value) {
    return /^[1-5]$/.test(String(value)) ? Number(value) : null;
  }

  function q8OtherSelected() {
    return Boolean(form.querySelector('input[name="q8"][value="other"]:checked'));
  }

  function syncQ8Other() {
    const visible = q8OtherSelected();
    if (q8OtherWrap) q8OtherWrap.hidden = !visible;
    if (q8OtherInput) {
      q8OtherInput.required = visible;
      if (!visible) {
        q8OtherInput.value = '';
        q8OtherInput.removeAttribute('aria-invalid');
        const counter = form.querySelector('[data-count-for="q8_other"]');
        if (counter) counter.textContent = '0';
      }
    }
  }

  function validateRequired() {
    let firstInvalid = null;

    requiredGroups.forEach((name) => {
      const fieldset = form.querySelector(`[data-required-group="${name}"]`);
      const valid = Boolean(checkedValue(name));
      fieldset?.classList.toggle('is-invalid', !valid);
      if (!valid && !firstInvalid) firstInvalid = fieldset;
    });

    if (q8OtherSelected()) {
      const otherValid = Boolean(q8OtherInput?.value.trim());
      const q8Fieldset = form.querySelector('[data-required-group="q8"]');
      q8OtherInput?.toggleAttribute('aria-invalid', !otherValid);
      if (!otherValid) {
        q8Fieldset?.classList.add('is-invalid');
        if (!firstInvalid) firstInvalid = q8OtherInput || q8Fieldset;
      }
    }

    if (firstInvalid) {
      const otherMissing = q8OtherSelected() && !q8OtherInput?.value.trim();
      setStatus(
        otherMissing
          ? t('surveyOtherRequiredError', '8번에서 기타를 선택한 경우 기타 불편사항을 작성해 주세요.')
          : t('surveyRequiredError', '필수 문항에 모두 응답해 주세요.')
      );
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (firstInvalid === q8OtherInput) q8OtherInput?.focus({ preventScroll: true });
      return false;
    }

    clearStatus();
    return true;
  }

  function payload() {
    const q4 = checkedValue('q4');

    // Supabase Table Editor에서 질문 내용을 바로 알아볼 수 있도록
    // 실제 DB의 한국어 컬럼명을 그대로 사용합니다.
    return {
      '언어': language(),
      "이번 '섬 따라 등대 한바퀴' 행사에 전반적으로 ": scoreOrNull(checkedValue('q1')),
      '행사 참여 방법은 이해하기 쉬웠나요?': scoreOrNull(checkedValue('q2')),
      '스탬프 대상지 위치와 이동 동선은 찾기 편리했': scoreOrNull(checkedValue('q3')),
      '홈페이지의 명소정보·길찾기·운영시간·안전': q4 === 'not_used' ? 'not_used' : String(scoreOrNull(q4) || ''),
      '스탬프 투어를 통해 여수의 등대와 주변 관광지': scoreOrNull(checkedValue('q5')),
      '기념품은 행사 참여와 완주에 도움이 되었나요?': scoreOrNull(checkedValue('q6')),
      '앞으로 비슷한 행사가 열린다면 다시 참여하고 ': scoreOrNull(checkedValue('q7')),
      '행사에 참여하면서 불편했던 사항이 있었나요?': checkedValues('q8'),
      '행사에 참여하면서 불편했던 사항이 있었나요? ': q8OtherSelected() ? q8OtherInput.value.trim().slice(0, 500) : '',
      '불편했던 점이나 개선되었으면 하는 사항을 알': form.elements.q9.value.trim().slice(0, 1000),
      '이번 행사에서 가장 만족스러웠던 점을 알려주': form.elements.q10.value.trim().slice(0, 1000),
      submitted_at_client: new Date().toISOString(),
      source_page: 'survey.html'
    };
  }

  function isLocalPreview() {
    return Boolean(
      config.allowLocalPreview &&
      (location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname))
    );
  }

  function saveLocalPreview(data) {
    const previewKey = 'yeosuLighthouseSurveyPreviewResponses';
    const saved = JSON.parse(localStorage.getItem(previewKey) || '[]');
    saved.push(data);
    localStorage.setItem(previewKey, JSON.stringify(saved));
  }

  function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;

    const url = String(config.supabaseUrl || '').trim().replace(/\/$/, '');
    const publishableKey = String(config.supabasePublishableKey || '').trim();
    if (!url || !publishableKey) throw new Error('CONFIG_MISSING');
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) throw new Error('CONFIG_INVALID');
    if (!window.supabase?.createClient) throw new Error('SDK_MISSING');

    supabaseClient = window.supabase.createClient(url, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });
    return supabaseClient;
  }

  async function submitResponse(data) {
    const hasConfig = String(config.supabaseUrl || '').trim() && String(config.supabasePublishableKey || '').trim();
    if (!hasConfig && isLocalPreview()) {
      saveLocalPreview(data);
      return;
    }

    const client = getSupabaseClient();
    const tableName = String(config.tableName || 'survey_responses').trim();
    if (!/^[a-z_][a-z0-9_]*$/i.test(tableName)) throw new Error('CONFIG_INVALID');

    const { error } = await client.from(tableName).insert(data);
    if (error) {
      console.error('Supabase survey insert failed:', error);
      const wrapped = new Error('SUPABASE_INSERT_FAILED');
      wrapped.cause = error;
      throw wrapped;
    }
  }

  form.addEventListener('change', (event) => {
    if (event.target.matches('input[type="radio"]')) {
      event.target.closest('.survey-question')?.classList.remove('is-invalid');
    }

    if (event.target.matches('input[name="q8"]')) {
      const all = [...form.querySelectorAll('input[name="q8"]')];
      const none = all.find((input) => input.dataset.noneOption !== undefined);

      if (event.target === none && none.checked) {
        all.filter((input) => input !== none).forEach((input) => { input.checked = false; });
      } else if (event.target !== none && event.target.checked && none) {
        none.checked = false;
      }

      syncQ8Other();

      const fieldset = event.target.closest('.survey-question');
      if (checkedValue('q8') && (!q8OtherSelected() || q8OtherInput?.value.trim())) {
        fieldset?.classList.remove('is-invalid');
      }
    }
  });

  q8OtherInput?.addEventListener('input', () => {
    if (q8OtherInput.value.trim()) {
      q8OtherInput.removeAttribute('aria-invalid');
      form.querySelector('[data-required-group="q8"]')?.classList.remove('is-invalid');
      clearStatus();
    }
  });

  form.querySelectorAll('textarea[maxlength]').forEach((textarea) => {
    const counter = form.querySelector(`[data-count-for="${textarea.id}"]`);
    const update = () => { if (counter) counter.textContent = String(textarea.value.length); };
    textarea.addEventListener('input', update);
    update();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateRequired()) return;

    submitButton.disabled = true;
    const label = submitButton.querySelector('[data-i18n="surveySubmit"]');
    if (label) label.textContent = t('surveySubmitting', '제출 중...');

    try {
      await submitResponse(payload());
      if (config.duplicateStorageKey) localStorage.setItem(config.duplicateStorageKey, 'true');
      showComplete(false);
    } catch (error) {
      if (['CONFIG_MISSING', 'CONFIG_INVALID'].includes(error.message)) {
        setStatus(t('surveySaveConfigError', '설문 응답 저장 설정이 아직 완료되지 않았습니다.'));
      } else {
        console.error(error);
        setStatus(t('surveySubmitError', '설문을 전송하지 못했습니다. 다시 시도해 주세요.'));
      }
    } finally {
      submitButton.disabled = false;
      if (label) label.textContent = t('surveySubmit', '설문 제출하기');
    }
  });

  window.addEventListener('languagechange', updateLanguageDetails);
  document.addEventListener('DOMContentLoaded', () => {
    updateLanguageDetails();
    syncQ8Other();
    const alreadySubmitted = config.duplicateStorageKey && localStorage.getItem(config.duplicateStorageKey) === 'true';
    if (alreadySubmitted) showComplete(true);
  });
})();
