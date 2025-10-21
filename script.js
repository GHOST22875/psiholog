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
    rootMargin: '0px 0px -30px 0px' // Уменьшено для более раннего срабатывания
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, observerOptions);


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Анимации с уменьшенными задержками
    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        el.dataset.delay = index * 50; // Уменьшено с 100 до 50
        observer.observe(el);
    });
    
    document.querySelectorAll('.animate-on-scroll-left').forEach((el, index) => {
        el.dataset.delay = index * 75; // Уменьшено с 150 до 75
        observer.observe(el);
    });
    
    document.querySelectorAll('.animate-on-scroll-right').forEach((el, index) => {
        el.dataset.delay = index * 75; // Уменьшено с 150 до 75
        observer.observe(el);
    });
    
    // Специальные анимации для карточек услуг
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.transform = 'translateY(30px) rotate(1deg)';
        card.style.opacity = '0.7';
        card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Ускорено
    });

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
