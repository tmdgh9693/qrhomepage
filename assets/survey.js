(() => {
  const form = document.getElementById('eventSurveyForm');
  if (!form) return;

  const status = document.getElementById('surveyStatus');
  const complete = document.getElementById('surveyComplete');
  const submitButton = document.getElementById('surveySubmitButton');
  const config = window.SURVEY_CONFIG || {};
  const requiredGroups = ['q1', 'q2', 'q3', 'q4'];
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

  function scoreOrNull(value) {
    return /^[1-5]$/.test(String(value)) ? Number(value) : null;
  }

  function validateRequired() {
    let firstInvalid = null;
    requiredGroups.forEach((name) => {
      const fieldset = form.querySelector(`[data-required-group="${name}"]`);
      const valid = Boolean(checkedValue(name));
      fieldset?.classList.toggle('is-invalid', !valid);
      if (!valid && !firstInvalid) firstInvalid = fieldset;
    });
    if (firstInvalid) {
      setStatus(t('surveyRequiredError', '필수 문항에 모두 응답해 주세요.'));
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    clearStatus();
    return true;
  }

  function payload() {
    const q4 = checkedValue('q4');
    return {
      survey_version: String(config.surveyVersion || '2026-01').slice(0, 30),
      language: language(),
      overall_satisfaction: scoreOrNull(checkedValue('q1')),
      participation_clarity: scoreOrNull(checkedValue('q2')),
      stamp_process_convenience: scoreOrNull(checkedValue('q3')),
      operation_satisfaction: q4 === 'not_used' ? 'not_used' : String(scoreOrNull(q4) || ''),
      lighthouse_interest: scoreOrNull(checkedValue('q5')),
      future_participation: scoreOrNull(checkedValue('q6')),
      inconveniences: [...form.querySelectorAll('input[name="q7"]:checked')].map((input) => input.value),
      improvement_comment: form.elements.q8.value.trim().slice(0, 1000),
      positive_comment: form.elements.q9.value.trim().slice(0, 1000),
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
      throw new Error('SUPABASE_INSERT_FAILED');
    }
  }

  form.addEventListener('change', (event) => {
    if (event.target.matches('input[type="radio"]')) {
      event.target.closest('.survey-question')?.classList.remove('is-invalid');
    }
    if (event.target.matches('input[name="q7"]')) {
      const all = [...form.querySelectorAll('input[name="q7"]')];
      const none = all.find((input) => input.dataset.noneOption !== undefined);
      if (event.target === none && none.checked) {
        all.filter((input) => input !== none).forEach((input) => { input.checked = false; });
      } else if (event.target !== none && event.target.checked && none) {
        none.checked = false;
      }
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
    const alreadySubmitted = config.duplicateStorageKey && localStorage.getItem(config.duplicateStorageKey) === 'true';
    if (alreadySubmitted) showComplete(true);
  });
})();
