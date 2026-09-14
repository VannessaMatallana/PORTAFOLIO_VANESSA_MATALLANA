function captureOriginalKeys() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (!el.dataset.i18nKey) {
      el.dataset.i18nKey = el.textContent.trim();
    }
  });

  document.querySelectorAll('[data-i18n-placeholder], [data-i18n-attr]').forEach(el => {
    if (el.hasAttribute('data-i18n-placeholder') && !el.dataset.i18nAttrKey) {
      el.dataset.i18nAttrKey = el.getAttribute('placeholder')?.trim() || '';
      el.setAttribute('data-i18n-attr', 'placeholder');
    } else {
      const attr = el.getAttribute('data-i18n-attr');
      if (attr && !el.dataset.i18nAttrKey) {
        el.dataset.i18nAttrKey = el.getAttribute(attr)?.trim() || '';
      }
    }
  });
}

i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'es',
    debug: true,
    keySeparator: false,   // 👈 IMPORTANTE: las claves son texto literal, no rutas anidadas
    nsSeparator: false,    // 👈 evita conflictos si el texto contiene ":"
    backend: {
      loadPath: 'locales/{{lng}}/translation.json'
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage']
    }
  }, function (err, t) {
    if (err) return console.error('Error al inicializar i18next:', err);
    captureOriginalKeys();
    updateContent();
  });

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18nKey;
    if (key) {
      el.innerHTML = i18next.t(key, { defaultValue: key });
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const attr = el.getAttribute('data-i18n-attr');
    const key = el.dataset.i18nAttrKey;
    if (attr && key) {
      el.setAttribute(attr, i18next.t(key, { defaultValue: key }));
    }
  });
}

function changeLanguage(lng) {
  i18next.changeLanguage(lng, () => {
    updateContent();
  });
}