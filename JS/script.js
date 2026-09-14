document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SECTOR DE TEMA (MODO OSCURO / CLARO)
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const rootElement = document.documentElement;

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
       3. NAVEGACIÓN
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    /* ==========================================================================
       5. CONTROLADOR DE MENÚS DESPLEGABLES (NAVBAR)
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
       6. EFECTO TILT 3D EN TARJETAS DE PROYECTO
       ========================================================================== */
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });


    /* ==========================================================================
       7. INTERSECTION OBSERVER (ANIMACIONES AL HACER SCROLL)
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

    document.querySelectorAll('.organic-card, .project-card, .service-row').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

});


/* ==========================================================================
   8. CONTROL DE VENTANAS MODALES ("SOBRE MÍ")
   ========================================================================== */

function openModal(modalId) {
    const backdrop = document.getElementById('about-modal-backdrop');
    const modalBody = document.getElementById('modal-body-content');
    
    const contentData = {
        'modal-main': `
            <h2 style="color: var(--accent); margin-bottom: 16px; font-family: var(--font-display);">Identidad Profesional</h2>
            <p style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem;">Mi perfil une la sensibilidad estética y el diseño web con la psicología analítica. Como desarrolladora frontend formada en <strong>Generation Colombia</strong>, creo interfaces atractivas donde cada detalle visual y cada interacción tienen un propósito humano claro.</p>
        `,
        'modal-psico': `
            <h2 style="color: var(--accent); margin-bottom: 16px; font-family: var(--font-display);">Psicología & UX</h2>
            <p style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem;">Aplicación directa del comportamiento humano y la percepción visual al diseño de experiencias digitales fluidas, intuitivas y centradas en el usuario.</p>
        `,
        'modal-frontend': `
            <h2 style="color: var(--accent); margin-bottom: 16px; font-family: var(--font-display);">Frontend & UI</h2>
            <p style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem;">Creación de componentes estilizados, animaciones sutiles, maquetación con CSS moderno y desarrollo de interactividad fluida con JavaScript.</p>
        `,
        'modal-backend': `
            <h2 style="color: var(--accent); margin-bottom: 16px; font-family: var(--font-display);">Visión Integral & Backend</h2>
            <p style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem;">Conexión limpia con servicios backend, cimentación lógica y estructuras sólidas (como Java y Spring Boot) que operan eficientemente detrás de la interfaz.</p>
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

/* ==========================================================================
   9. FILTRADO INTERACTIVO - STACK TECNOLÓGICO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
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
});


/* ==========================================================================
   10. EFECTO FLIP 3D - PROYECTOS CIRCULARES
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card-container");

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
});


/* ==========================================================================
   11. MODAL DE SERVICIOS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("open-services-modal");
  const closeModalBtn = document.getElementById("close-services-modal");
  const modalOverlay = document.getElementById("services-modal");

  if (openModalBtn && closeModalBtn && modalOverlay) {
    openModalBtn.addEventListener("click", () => {
      modalOverlay.classList.add("active");
    });

    closeModalBtn.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
    });

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
      }
    });
  }
});


/* ==========================================================================
   12. CONTROLADOR DE FORMULARIO DE CONTACTO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
      };

      console.log("Datos del formulario listos para enviar:", formData);

      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = "¡Mensaje enviado con éxito! ✓";
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