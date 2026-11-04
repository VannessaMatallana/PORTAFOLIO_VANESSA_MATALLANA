document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SECTOR DE TEMA (MODO OSCURO BASE / CLARO)
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;

    // Modo oscuro como base por defecto
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        rootElement.setAttribute('data-theme', 'light');
    } else {
        rootElement.removeAttribute('data-theme'); 
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = rootElement.getAttribute('data-theme');
            if (theme === 'light') {
                rootElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                rootElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    /* ==========================================================================
       2. MENÚ HAMBURGUESA RESPONSIVE (MÓVIL)
       ========================================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       3. NAVEGACIÓN SUAVE
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    /* ==========================================================================
       4. CONTROLADOR DE MENÚS DESPLEGABLES (NAVBAR)
       ========================================================================== */
    document.addEventListener("click", (e) => {
        const dropdownToggle = e.target.closest(".dropdown-toggle-btn");
        
        document.querySelectorAll(".dropdown-container").forEach(container => {
            if (container.contains(e.target)) {
                if (dropdownToggle) {
                    container.classList.toggle("open");
                }
            } else {
                container.classList.remove("open");
            }
        });
    });

    /* ==========================================================================
       5. INTERSECTION OBSERVER (ANIMACIONES AL HACER SCROLL)
       ========================================================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card-modern, .tool-glow-card, .about-main-card, .about-card-glow, .timeline-exp-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    /* ==========================================================================
       6. FILTRADO INTERACTIVO - STACK TECNOLÓGICO
       ========================================================================== */
    const filterBtns = document.querySelectorAll(".filter-btn");
    const toolCards = document.querySelectorAll(".tools-grid-modern .tool-glow-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            toolCards.forEach(card => {
                const category = card.getAttribute("data-category");

                if (filterValue === "all" || category === filterValue) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });

    /* ==========================================================================
       7. CONTROLADOR DE FORMULARIO DE CONTACTO
       ========================================================================== */
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerHTML;
            
            const successText = (typeof i18next !== 'undefined') 
                ? i18next.t('form-success-msg') 
                : "¡Mensaje enviado con éxito! ✓";

            submitBtn.innerHTML = successText;
            submitBtn.style.background = "var(--accent)";
            submitBtn.style.color = "var(--bg)";

            contactForm.reset();
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = "";
                submitBtn.style.color = "";
            }, 4000);
        });
    }

});

/* ==========================================================================
   8. CONTROL DE VENTANAS MODALES ("SOBRE MÍ") CON SOPORTE I18N
   ========================================================================== */
function openModal(modalId) {
    const backdrop = document.getElementById('about-modal-backdrop');
    const modalBody = document.getElementById('modal-body-content');
    
    const t = (key, fallback) => (typeof i18next !== 'undefined' && i18next.exists(key)) ? i18next.t(key) : fallback;

    const contentData = {
        'modal-main': `
            <h2 style="color: var(--accent); margin-bottom: 16px; font-family: var(--font-display); font-size: 1.45rem;">${t('modal-main-title', 'Identidad Profesional: Psicología & Desarrollo Frontend')}</h2>
            <div style="color: var(--text-muted); line-height: 1.75; font-size: 0.96rem;">${t('modal-main-desc', '<p>Mi perfil profesional une la sensibilidad estética y el diseño web con la psicología analítica.</p>')}</div>
        `,
        'modal-psico': `
            <h2 style="color: var(--accent); margin-bottom: 16px; font-family: var(--font-display); font-size: 1.45rem;">${t('modal-psico-title', 'Psicología Aplicada & Experiencia de Usuario (UX)')}</h2>
            <div style="color: var(--text-muted); line-height: 1.75; font-size: 0.96rem;">${t('modal-psico-desc', '<p>Aplicación directa del comportamiento humano y la percepción visual al diseño de experiencias digitales fluidas, intuitivas y centradas en el usuario.</p>')}</div>
        `,
        'modal-frontend': `
            <h2 style="color: var(--accent); margin-bottom: 16px; font-family: var(--font-display); font-size: 1.45rem;">${t('modal-frontend-title', 'Desarrollo Frontend & Diseño de Interacción (UI)')}</h2>
            <div style="color: var(--text-muted); line-height: 1.75; font-size: 0.96rem;">${t('modal-frontend-desc', '<p>Creación de componentes estilizados, animaciones sutiles, maquetación con CSS moderno y desarrollo de interactividad fluida con JavaScript.</p>')}</div>
        `,
        'modal-backend': `
            <h2 style="color: var(--accent); margin-bottom: 16px; font-family: var(--font-display); font-size: 1.45rem;">${t('modal-backend-title', 'Visión Integral & Conexión con el Backend')}</h2>
            <div style="color: var(--text-muted); line-height: 1.75; font-size: 0.96rem;">${t('modal-backend-desc', '<p>Conexión limpia con servicios backend, cimentación lógica y estructuras sólidas que operan eficientemente detrás de la interfaz.</p>')}</div>
        `
    };

    if (contentData[modalId] && modalBody) {
        modalBody.innerHTML = contentData[modalId];
    }

    if (backdrop) {
        backdrop.classList.add('active');
    }
}

function closeModal() {
    const backdrop = document.getElementById('about-modal-backdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});