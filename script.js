// Глобальные переменные
let isMobile = false;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Определение типа устройства
function detectDevice() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768 || 
               'ontouchstart' in window;
    
    document.body.classList.toggle('mobile', isMobile);
    document.body.classList.toggle('touch', 'ontouchstart' in window);
}

// Мобильное меню
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Обновляем aria-expanded для доступности
    const isExpanded = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
    
    // Блокируем скролл при открытом меню
    document.body.style.overflow = isExpanded ? 'hidden' : '';
});

// Закрываем мобильное меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// Закрываем мобильное меню при клике вне его
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Учитываем высоту навигации
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Система табов для меню с поддержкой touch
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Убираем активный класс у всех кнопок и контента
        tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('hidden', '');
        });
        
        // Активируем выбранную вкладку
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.removeAttribute('hidden');
        }
    });
    
    // Добавляем touch поддержку для табов
    if ('ontouchstart' in window) {
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.click();
        });
    }
});

// Система рейтинга звёздами с улучшенной touch поддержкой
const starInputs = document.querySelectorAll('.star-input');

starInputs.forEach(input => {
    input.addEventListener('change', function() {
        const rating = this.value;
        const starLabels = this.closest('.star-rating').querySelectorAll('.star-label');
        
        // Сбрасываем все звёзды
        starLabels.forEach((label, index) => {
            const star = label.querySelector('.star');
            if (index < rating) {
                star.style.color = '#ffd700';
            } else {
                star.style.color = '#e0e0e0';
            }
        });
    });
});

// Hover эффект для звёзд с поддержкой touch
const starLabels = document.querySelectorAll('.star-label');

starLabels.forEach((label, index) => {
    if (!isMobile) {
        label.addEventListener('mouseenter', () => {
            const stars = label.closest('.star-rating').querySelectorAll('.star');
            stars.forEach((star, starIndex) => {
                if (starIndex <= index) {
                    star.style.color = '#ffd700';
                }
            });
        });
        
        label.addEventListener('mouseleave', () => {
            const stars = label.closest('.star-rating').querySelectorAll('.star');
            const checkedInput = label.closest('.star-rating').querySelector('.star-input:checked');
            const rating = checkedInput ? parseInt(checkedInput.value) : 0;
            
            stars.forEach((star, starIndex) => {
                if (starIndex < rating) {
                    star.style.color = '#ffd700';
                } else {
                    star.style.color = '#e0e0e0';
                }
            });
        });
    }
    
    // Touch поддержка для звёзд
    if ('ontouchstart' in window) {
        label.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const input = label.querySelector('.star-input');
            if (input) {
                input.checked = true;
                input.dispatchEvent(new Event('change'));
            }
        });
    }
});

// Обработка формы отзывов с улучшенной валидацией
const reviewForm = document.querySelector('.review-form');

if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name').trim();
        const review = formData.get('review').trim();
        const rating = formData.get('rating');
        
        // Улучшенная валидация
        if (!name || name.length < 2) {
            showNotification('Имя должно содержать минимум 2 символа', 'error');
            return;
        }
        
        if (!review || review.length < 10) {
            showNotification('Отзыв должен содержать минимум 10 символов', 'error');
            return;
        }
        
        if (!rating) {
            showNotification('Пожалуйста, поставьте оценку', 'error');
            return;
        }
        
        // Создаём новый отзыв
        createReview(name, review, rating);
        
        // Очищаем форму
        this.reset();
        
        // Сбрасываем звёзды
        const stars = this.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.color = '#e0e0e0';
        });
        
        showNotification('Спасибо за ваш отзыв!', 'success');
    });
}

// Функция создания нового отзыва с анимацией
function createReview(name, review, rating) {
    const reviewsContainer = document.querySelector('.reviews-container');
    const reviewCard = document.createElement('article');
    reviewCard.className = 'review-card';
    
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <h3>${escapeHtml(name)}</h3>
            <div class="stars" aria-label="Оценка: ${rating} из 5 звёзд">${stars}</div>
        </div>
        <p>"${escapeHtml(review)}"</p>
        <time class="review-date" datetime="${new Date().toISOString().split('T')[0]}">${currentDate}</time>
    `;
    
    // Добавляем анимацию появления
    reviewCard.style.opacity = '0';
    reviewCard.style.transform = 'translateY(20px)';
    reviewsContainer.appendChild(reviewCard);
    
    // Анимация появления
    setTimeout(() => {
        reviewCard.style.transition = 'all 0.5s ease';
        reviewCard.style.opacity = '1';
        reviewCard.style.transform = 'translateY(0)';
    }, 10);
}

// Экранирование HTML для безопасности
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Система уведомлений с улучшенным дизайном
function showNotification(message, type = 'info') {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#333333',
        color: '#ffffff',
        padding: '1rem 1.5rem',
        borderRadius: '0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        maxWidth: '300px',
        fontSize: '0.9rem',
        fontWeight: '400',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        wordWrap: 'break-word',
        lineHeight: '1.4'
    });
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Touch события для мобильных устройств
function initTouchEvents() {
    if (!('ontouchstart' in window)) return;
    
    // Swipe для мобильного меню
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe влево для закрытия меню
        if (diffX > 50 && Math.abs(diffY) < 50 && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
    
    // Улучшенная прокрутка для touch устройств
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        let startY = 0;
        let startScrollTop = 0;
        
        section.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startScrollTop = window.pageYOffset;
        });
        
        section.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const diffY = startY - currentY;
            
            // Плавная прокрутка при touch
            if (Math.abs(diffY) > 10) {
                window.scrollTo(0, startScrollTop + diffY);
            }
        });
    });
}

// Lazy loading для изображений
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback для старых браузеров
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Оптимизация производительности для мобильных устройств
function optimizePerformance() {
    if (isMobile) {
        // Уменьшаем анимации на мобильных
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        
        // Отключаем hover эффекты на touch устройствах
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .menu-item:hover,
                .event-card:hover,
                .review-card:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Адаптивные анимации
function initAdaptiveAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
    
    // Анимации появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    const animatedElements = document.querySelectorAll('.menu-item, .event-card, .review-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Определяем тип устройства
    detectDevice();
    
    // Инициализируем touch события
    initTouchEvents();
    
    // Оптимизируем производительность
    optimizePerformance();
    
    // Инициализируем адаптивные анимации
    initAdaptiveAnimations();
    
    // Инициализируем lazy loading
    lazyLoadImages();
    
    // Добавляем активный класс для текущей секции в навигации
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Обновляем активную ссылку при скролле с throttling
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavLink);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Инициализируем активную ссылку
    updateActiveNavLink();
    
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            detectDevice();
            optimizePerformance();
        }, 250);
    });
    
    // Обработка изменения ориентации
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            detectDevice();
            optimizePerformance();
        }, 100);
    });
});

// Обработка ошибок с улучшенным логированием
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    console.error('Error details:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    if (isMobile) {
        showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
    }
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    
    if (isMobile) {
        showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
    }
});

// Service Worker для PWA (если поддерживается)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Экспортируем функции для возможного использования в других модулях
window.AppUtils = {
    showNotification,
    createReview,
    detectDevice,
    isMobile
};
