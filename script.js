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

    // Инициализация карты
    initMap();
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
        .animate-on-scroll-right {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(reducedMotionStyle);
}
