// Плавная прокрутка к якорям с улучшенной анимацией
document.querySelectorAll('nav a, .hero .btn').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Проверяем, является ли ссылка якорем на странице
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Рассчитываем позицию с учетом фиксированного меню
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Плавная прокрутка с кастомной анимацией
                smoothScrollTo(targetPosition, 1000);
            }
        }
    });
});

// Функция для плавной прокрутки с easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing функция для более естественного движения
        const easeProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + (distance * easeProgress));
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Easing функция - cubic in-out (самая плавная)
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Альтернативные easing функции (можно попробовать разные):
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Функция показа уведомлений
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else {
        notification.style.background = '#e74c3c';
    }
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Добавляем задержку для последовательного появления
            const delay = entry.target.dataset.delay || 0;
            
            setTimeout(() => {
                entry.target.classList.add('visible');
                
                // Добавляем дополнительную анимацию для карточек услуг
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.transform = 'translateY(0) rotate(0)';
                    entry.target.style.opacity = '1';
                }
            }, delay);
        }
    });
}, observerOptions);

// Наблюдаем за всеми элементами с классами анимации
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем задержки для последовательного появления
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
});

// Дополнительные улучшения для UX
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

// CSS для активного пункта меню (добавьте в CSS)
const style = document.createElement('style');
style.textContent = `
    nav a.active {
        color: #3498db !important;
        font-weight: 600;
    }
    
    nav a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #3498db;
        transition: width 0.3s ease;
    }
    
    .notification {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(style);

// Предзагрузка критических ресурсов
window.addEventListener('load', function() {
    // Предзагрузка следующего изображения при приближении к секции
    const aboutSection = document.querySelector('.about');
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Можно добавить предзагрузку следующих изображений
                console.log('About section in view - preload next images if needed');
            }
        });
    });
    
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
});

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.log('Произошла ошибка:', e.error);
});

// Резервный вариант прокрутки для старых браузеров
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 1000 / 60);
    };
}

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
