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
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            
            setTimeout(() => {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.transform = 'translateY(0) rotate(0)';
                    entry.target.style.opacity = '1';
                }
            }, delay);
        }
    });
}, observerOptions);

// Инициализация карты
function initMap() {
    ymaps.ready(function() {
        const map = new ymaps.Map('map', {
            center: [55.7558, 37.6173], // Координаты Москвы
            zoom: 14,
            controls: ['zoomControl', 'fullscreenControl']
        });

        // Метка на карте
        const placemark = new ymaps.Placemark([55.7558, 37.6173], {
            balloonContent: 'г. Москва, ул. Детская, д. 15',
            hintContent: 'Кабинет психолога'
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -40]
        });

        map.geoObjects.add(placemark);
        map.controls.remove('searchControl');
        map.controls.remove('trafficControl');
        map.controls.remove('typeSelector');
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Анимации
    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        el.dataset.delay = index * 100;
        observer.observe(el);
    });
    
    document.querySelectorAll('.animate-on-scroll-left').forEach((el, index) => {
        el.dataset.delay = index * 150;
        observer.observe(el);
    });
    
    document.querySelectorAll('.animate-on-scroll-right').forEach((el, index) => {
        el.dataset.delay = index * 150;
        observer.observe(el);
    });
    
    // Специальные анимации для карточек услуг
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.transform = 'translateY(30px) rotate(1deg)';
        card.style.opacity = '0.7';
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
