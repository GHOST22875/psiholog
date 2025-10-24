// script.js
// Плавная прокрутка к якорям
document.querySelectorAll('nav a, .hero .btn').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                smoothScrollTo(targetPosition, 1000);
            }
        }
    });
});

function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easeProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + (distance * easeProgress));
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

// Создаем отдельные наблюдатели для каждого контейнера
const containerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Находим все анимируемые элементы внутри этого контейнера
            const animatedElements = entry.target.querySelectorAll(
                '.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .service-card'
            );
            
            // Добавляем класс visible всем элементам одновременно
            animatedElements.forEach(el => {
                el.classList.add('visible');
            });
        }
    });
}, observerOptions);

// Стандартный наблюдатель для отдельных элементов
const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Находим основные контейнеры с группами элементов
    const containers = [
        '.approaches-grid',
        '.requests-content', 
        '.process-steps',
        '.services-grid',
        '.education-content',
        '.testimonials-grid',
        '.contact-content'
    ];
    
    // Наблюдаем за контейнерами для одновременного появления
    containers.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) {
            containerObserver.observe(container);
        }
    });
    
    // Для отдельных элементов, не входящих в группы, используем стандартный наблюдатель
    document.querySelectorAll('.section-title.animate-on-scroll').forEach(el => {
        elementObserver.observe(el);
    });
    
    // Для about-content особый случай, так как там только два элемента
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        containerObserver.observe(aboutContent);
    }

    // Инициализация специальных анимаций для карточек услуг
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.transform = 'translateY(30px) rotate(1deg)';
        card.style.opacity = '0.7';
        card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
});

// Подсветка активного пункта меню при скролле
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Отключение анимаций для пользователей, которые их не предпочитают
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    const reducedMotionStyle = document.createElement('style');
    reducedMotionStyle.textContent = `
        .animate-on-scroll,
        .animate-on-scroll-left,
        .animate-on-scroll-right,
        .service-card {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(reducedMotionStyle);
}

// Обработчик для кнопок в контактах
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для кнопки "Позвонить"
    const callButton = document.querySelector('a[href^="tel:"]');
    if (callButton) {
        callButton.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            if (confirm(`Позвонить по номеру ${phoneNumber}?`)) {
                window.location.href = this.getAttribute('href');
            }
        });
    }
    
    // Обработчик для кнопки "Написать"
    const emailButton = document.querySelector('a[href^="mailto:"]');
    if (emailButton) {
        emailButton.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href').replace('mailto:', '');
            if (confirm(`Написать письмо на ${email}?`)) {
                window.location.href = this.getAttribute('href');
            }
        });
    }
});

// Дополнительные улучшения для пользовательского опыта
document.addEventListener('DOMContentLoaded', function() {
    // Плавное появление страницы при загрузке
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Добавляем loading="lazy" для всех изображений для улучшения производительности
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    
    // Предзагрузка критических ресурсов
    const criticalResources = [
        'https://i.pinimg.com/736x/35/8c/94/358c94aa9da3a23a638f45ed45d8194c.jpg',
        'https://i.pinimg.com/736x/5b/62/99/5b6299c05f59bfbe8be3ea5d1a2d6e2a.jpg'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'image';
        document.head.appendChild(link);
    });
});

// Обработка ошибок загрузки изображений
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Не удалось загрузить изображение:', this.src);
            // Можно установить заглушку
            this.style.backgroundColor = '#f0f0f0';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: #666;">Изображение</span>';
        });
    });
});

// Оптимизация производительности при скролле
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            scrollTimeout = null;
            
            // Обновляем активный пункт меню
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('nav a');
            
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
            
        }, 10);
    }
});

// Ресайз обработчик для адаптивности
window.addEventListener('resize', function() {
    // Переинициализация при изменении размера окна
    const headerHeight = document.querySelector('header').offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
});

// Установка CSS переменной для высоты header
document.addEventListener('DOMContentLoaded', function() {
    const headerHeight = document.querySelector('header').offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
});

// Дополнительные улучшения доступности
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем aria-labels для улучшения доступности
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
                const sectionTitle = targetSection.querySelector('h2') || targetSection.querySelector('h1');
                if (sectionTitle) {
                    link.setAttribute('aria-label', `Перейти к разделу: ${sectionTitle.textContent}`);
                }
            }
        }
    });
    
    // Добавляем клавиатурную навигацию
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Закрытие модальных окон (если будут добавлены)
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
    
    // Улучшение фокуса для элементов
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid #5d8aa8';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

// Дополнительные оптимизации для iOS
        document.addEventListener('DOMContentLoaded', function() {
            // Предотвращение масштабирования при фокусе на полях ввода
            document.addEventListener('touchstart', function() {}, {passive: true});
            
            // Оптимизация для iPhone X и новее
            function updateSafeArea() {
                const header = document.querySelector('header');
                const footer = document.querySelector('footer');
                
                if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
                    document.documentElement.style.setProperty('--safe-area-inset-top', env(safe-area-inset-top) + 'px');
                    document.documentElement.style.setProperty('--safe-area-inset-bottom', env(safe-area-inset-bottom) + 'px');
                    
                    // Добавляем отступы для безопасных зон
                    if (header) {
                        header.style.paddingTop = 'var(--safe-area-inset-top)';
                    }
                    if (footer) {
                        footer.style.paddingBottom = 'var(--safe-area-inset-bottom)';
                    }
                }
            }
            
            // Обновляем при загрузке и изменении ориентации
            updateSafeArea();
            window.addEventListener('resize', updateSafeArea);
            window.addEventListener('orientationchange', updateSafeArea);
            
            // Оптимизация для iOS Safari - предотвращение bounce эффекта
            document.body.addEventListener('touchmove', function(e) {
                if (e.target === document.body || e.target === document.documentElement) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Улучшение производительности на iOS
            const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right');
            animatedElements.forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
        });
