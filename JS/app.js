/**
 * Gestión de Internacionalización (i18n) para el Portafolio
 * Vanessa Matallana - Desarrolladora Full Stack & Psicóloga
 */

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
});

function initI18n() {
  const initialLang = localStorage.getItem('user-language') || 'es';

  const resources = (typeof portfolioTranslations !== 'undefined') ? {
    es: { translation: portfolioTranslations.es },
    en: { translation: portfolioTranslations.en },
    pt: { translation: portfolioTranslations.pt }
  } : {};

  i18next.init({
    lng: initialLang,
    fallbackLng: 'es',
    resources: resources,
    interpolation: {
      escapeValue: false // Permite etiquetas HTML como <strong>, <em>, <p>
    }
  }, (err, t) => {
    if (err) {
      console.error('Error al inicializar i18next:', err);
      return;
    }

    updateContent();
    updateLanguageControls();
    setupLanguageEvents();
  });
}

function setupLanguageEvents() {
  document.querySelectorAll('.lang-btn[data-lang]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = button.getAttribute('data-lang');
      changeLanguage(selectedLang);
      
      const dropdown = button.closest('.dropdown-container');
      if (dropdown) {
        dropdown.classList.remove('open');
      }
    });
  });
}

function changeLanguage(lng) {
  i18next.changeLanguage(lng, (err) => {
    if (err) {
      console.error('Error al cambiar de idioma:', err);
      return;
    }
    localStorage.setItem('user-language', lng);
    updateContent();
    updateLanguageControls();
  });
}

function updateContent() {
  // 1. Elementos con contenido HTML o texto explícito: data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;

    // Proteger elementos que contienen iconos (SVGs) o inputs de ser reemplazados por texto
    if (el.tagName === 'IMG' || el.tagName === 'INPUT') return;
    if (el.tagName === 'BUTTON' && el.querySelector('svg')) return;

    if (i18next.exists(key)) {
      el.innerHTML = i18next.t(key);
    }
  });

  // 2. Elementos que traducen atributos (aria-label, title, alt): data-i18n-attr
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const attrKey = el.getAttribute('data-i18n-attr-key') || el.getAttribute('data-i18n');
    if (!attrKey) return;

    const attrs = el.getAttribute('data-i18n-attr').split(',').map(a => a.trim());
    if (i18next.exists(attrKey)) {
      const translatedVal = i18next.t(attrKey);
      attrs.forEach(attr => {
        el.setAttribute(attr, translatedVal);
      });
    }
  });

  // 3. Placeholders en campos de formulario: data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && i18next.exists(key)) {
      el.setAttribute('placeholder', i18next.t(key));
    }
  });

  // 4. Opciones de select: <option data-i18n="...">
  document.querySelectorAll('select option[data-i18n]').forEach(opt => {
    const key = opt.getAttribute('data-i18n');
    if (key && i18next.exists(key)) {
      opt.textContent = i18next.t(key);
    }
  });

  // 5. Atributo lang en la raíz html
  const currentLang = i18next.language || 'es';
  document.documentElement.lang = currentLang;
}

function updateLanguageControls() {
  const currentLang = (i18next.language || 'es').split('-')[0];
  
  // Código de idioma en el botón toggle (ES, EN, PT)
  const langCodeEl = document.querySelector('#lang-dropdown-container .lang-code');
  if (langCodeEl) {
    langCodeEl.textContent = currentLang.toUpperCase();
  }

  // Bandera en el botón toggle
  const selectedBtn = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
  const selectedFlag = selectedBtn?.querySelector('.flag-icon');
  const toggleBtn = document.querySelector('#lang-dropdown-container .dropdown-toggle-btn');
  
  if (selectedFlag && toggleBtn) {
    const currentFlag = toggleBtn.querySelector('.flag-icon');
    const newFlag = selectedFlag.cloneNode(true);
    newFlag.setAttribute('width', '18');
    newFlag.setAttribute('height', '13');
    if (currentFlag) {
      currentFlag.replaceWith(newFlag);
    } else {
      toggleBtn.prepend(newFlag);
    }
  }

  // Estado activo en los botones de selección
  document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
  });
}