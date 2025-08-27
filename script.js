// Глобальные переменные
let isMobile = false;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = '8275768497:AAFRLQcK7PJseN3YYJEtW5Afk5LuupJxjWc';
const TELEGRAM_CHAT_ID = '873320985';

// Функции для Telegram бота
async function sendTelegramMessage(message, parseMode = 'Markdown') {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: parseMode
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            return result.ok;
        }
        return false;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

// Функция для обработки команд бота (отключена)
// Бот работает только для уведомлений о бронированиях
function handleBotCommand(command) {
    return `🤖 *Трактир "Старая Школа" - Бот*

Этот бот автоматически уведомляет персонал о новых бронированиях.

💬 *Для получения информации:*
• Сайт: oldschooldrinks.ru
• Телефон: +7 (999) 877-87-88

🍺 *Добро пожаловать в трактир!*`;
}

// Функция для настройки webhook (если понадобится)
async function setWebhook() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: 'https://your-domain.com/webhook', // Замените на ваш домен
                allowed_updates: ['message', 'callback_query']
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Webhook установлен:', result);
            return result.ok;
        }
        return false;
    } catch (error) {
        console.error('Ошибка установки webhook:', error);
        return false;
    }
}

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

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Обновляем aria-expanded для доступности
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        // Блокируем скролл при открытом меню
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
}

// Закрываем мобильное меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});

// Закрываем мобильное меню при клике вне его
document.addEventListener('click', (e) => {
    if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
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

// Обработка формы бронирования
const reservationForm = document.querySelector('.reservation-form');

if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name').trim();
        const phone = formData.get('phone').trim();
        const date = formData.get('date');
        const time = formData.get('time');
        const guests = formData.get('guests');
        const message = formData.get('message').trim();
        
        // Валидация формы
        if (!name || name.length < 2) {
            showNotification('Имя должно содержать минимум 2 символа', 'error');
            return;
        }
        
        if (!phone || phone.length < 10) {
            showNotification('Введите корректный номер телефона', 'error');
            return;
        }
        
        if (!date) {
            showNotification('Выберите дату', 'error');
            return;
        }
        
        if (!time) {
            showNotification('Выберите время', 'error');
            return;
        }
        
        if (!guests) {
            showNotification('Выберите количество гостей', 'error');
            return;
        }
        
        // Проверяем, что выбранная дата не в прошлом
        const selectedDate = new Date(date + ' ' + time);
        const now = new Date();
        
        if (selectedDate < now) {
            showNotification('Нельзя забронировать столик на прошедшее время', 'error');
            return;
        }
        
        // Имитация отправки формы
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем...';
        
        // Симуляция задержки
        setTimeout(() => {
            // Здесь должен быть реальный код отправки на сервер
            console.log('Данные бронирования:', {
                name, phone, date, time, guests, message
            });
            
            // Показываем уведомление об успехе
            showNotification('Столик успешно забронирован! Мы свяжемся с вами для подтверждения.', 'success');
            
            // Очищаем форму
            this.reset();
            
            // Восстанавливаем кнопку
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 2000);
    });
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
        background: type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#d4af37',
        color: '#ffffff',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        maxWidth: '400px',
        fontSize: '0.95rem',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        wordWrap: 'break-word',
        lineHeight: '1.4',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
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

// Анимация появления элементов при скролле
function initScrollAnimations() {
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
    const animatedElements = document.querySelectorAll('.menu-item, .event-card, .gallery-item, .stat, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Параллакс эффект для hero секции
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero.querySelector('.hero-background')) {
            hero.querySelector('.hero-background').style.transform = `translateY(${rate}px)`;
        }
    });
}

// Анимация счетчиков в секции "О нас"
function initCounters() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPlus = finalValue.includes('+');
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                
                if (numericValue && !target.classList.contains('animated')) {
                    target.classList.add('animated');
                    animateCounter(target, 0, numericValue, isPlus);
                }
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, isPlus) {
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Функция плавности
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + (isPlus ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Улучшенная навигация с активными ссылками
function initActiveNavigation() {
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
        if (diffX > 50 && Math.abs(diffY) < 50 && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
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
                .gallery-item:hover {
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
}

// Инициализация карты
function initMapWhenReady() {
    // Проверяем, загружен ли API Яндекс.Карт
    if (typeof ymaps !== 'undefined') {
        console.log('API Яндекс.Карт загружен, инициализируем карту...');
        // Используем ymaps.ready для надежной инициализации
        ymaps.ready(function() {
            console.log('API Яндекс.Карт готов, инициализируем карту...');
            initYandexMap();
        });
    } else {
        console.log('API Яндекс.Карт еще не загружен, ждем...');
        // Если API еще не загружен, ждем
        setTimeout(initMapWhenReady, 500);
    }
}

// Альтернативный способ инициализации через событие загрузки API
function initYandexMapAlternative() {
    // Ждем загрузки API
    ymaps.ready(function() {
        console.log('API Яндекс.Карт готов, инициализируем карту...');
        initYandexMap();
    });
}

// Инициализация Яндекс.Карт
function initYandexMap() {
    try {
        console.log('Начинаем инициализацию карты...');
        
        // Проверяем, существует ли элемент для карты
        const mapElement = document.getElementById('yandex-map');
        if (!mapElement) {
            console.error('Элемент yandex-map не найден!');
            return;
        }
        
        // Проверяем, что API полностью загружен
        if (typeof ymaps === 'undefined') {
            console.error('API Яндекс.Карт не загружен!');
            return;
        }
        
        if (!ymaps.Map) {
            console.error('Класс Map не найден в API!');
            return;
        }
        
        if (!ymaps.Placemark) {
            console.error('Класс Placemark не найден в API!');
            return;
        }
        
        console.log('API Яндекс.Карт готов, создаем карту...');
        
        // Координаты трактира "Старая Школа" (Тихвинская ул., 3, корп. 1, Москва)
        // Точные координаты: 55.786192, 37.601103
        const traktirCoords = [55.786192, 37.601103];
        
        console.log('Создаем карту с координатами:', traktirCoords);
        
        // Создаем карту с базовыми параметрами
        const map = new ymaps.Map('yandex-map', {
            center: traktirCoords,
            zoom: 16,
            controls: ['zoomControl']
        });
        
        console.log('Карта создана, ждем загрузки...');
        
        // Ждем загрузки карты перед добавлением метки
        setTimeout(() => {
            console.log('Добавляем метку...');
            
            // Создаем простую метку трактира
            const placemark = new ymaps.Placemark(traktirCoords, {
                balloonContentHeader: 'Трактир Старая Школа',
                balloonContentBody: `
                    <div style="padding: 10px;">
                        <h4 style="margin: 0 0 10px 0; color: #d4af37;">Трактир Старая Школа</h4>
                        <p style="margin: 5px 0;"><strong>Адрес:</strong> Тихвинская ул., 3, корп. 1, Москва</p>
                        <p style="margin: 5px 0;"><strong>Телефон:</strong> +7 (999) 877-87-88</p>
                        <p style="margin: 5px 0;"><strong>Режим работы:</strong> 12:00 - 01:00</p>
                    </div>
                `,
                hintContent: 'Трактир Старая Школа'
            }, {
                preset: 'islands#redDotIcon',
                iconColor: '#d4af37'
            });

            // Добавляем метку на карту
            map.geoObjects.add(placemark);
            
            console.log('Метка добавлена на карту');
            
            // Центрируем карту на метке
            map.setCenter(traktirCoords, 16);
            
            console.log('Метка трактира добавлена на координаты:', traktirCoords);
            console.log('Яндекс.Карта успешно инициализирована!');
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при инициализации карты:', error);
    }
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
    
    // Инициализируем анимации при скролле
    initScrollAnimations();
    
    // Инициализируем параллакс
    initParallax();
    
    // Инициализируем счетчики
    initCounters();
    
    // Инициализируем активную навигацию
    initActiveNavigation();
    
    // Инициализируем карту
    initMapWhenReady();
    
    // Инициализируем форму бронирования
    initReservationForm();
    
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
        // Проверяем, что мы не в локальном режиме
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        } else {
            console.log('ServiceWorker не регистрируется в локальном режиме (file://)');
        }
    });
}

// Функция инициализации формы бронирования
function initReservationForm() {
    const form = document.getElementById('reservationForm');
    if (!form) return;

    // Показываем уведомление о том, что форма работает
    console.log('Форма бронирования инициализирована для прямой отправки в Telegram');

    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляем...';
        submitBtn.disabled = true;

        try {
            // Получаем данные формы
            const formData = new FormData(form);
            const bookingData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                time: formData.get('time'),
                guests: formData.get('guests'),
                message: formData.get('message') || 'Нет дополнительной информации'
            };

            // Формируем сообщение для Telegram
            const telegramMessage = `🆕 *НОВОЕ БРОНИРОВАНИЕ!*

👤 *Имя:* ${bookingData.name}
📞 *Телефон:* ${bookingData.phone}
📅 *Дата:* ${bookingData.date}
🕐 *Время:* ${bookingData.time}
👥 *Гостей:* ${bookingData.guests}
💬 *Дополнительно:* ${bookingData.message}

⏰ *Получено:* ${new Date().toLocaleString('ru-RU')}
🔗 *Источник:* Сайт`;

            // Отправляем в Telegram
            const telegramResponse = await sendTelegramMessage(telegramMessage);

            if (telegramResponse) {
                // Показываем сообщение об успехе
                showNotification('Столик успешно забронирован! Мы свяжемся с вами для подтверждения.', 'success');
                
                // Очищаем форму
                form.reset();
                
                // Прокручиваем к началу формы для показа сообщения
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error('Ошибка отправки в Telegram');
            }
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            showNotification('Произошла ошибка при отправке. Попробуйте еще раз.', 'error');
        } finally {
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Функция валидации поля
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Имя должно содержать минимум 2 символа';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
            break;
            
        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Дата не может быть в прошлом';
            }
            break;
            
        case 'time':
            if (!value) {
                isValid = false;
                errorMessage = 'Выберите время';
            }
            break;
            
        case 'guests':
            if (!value) {
                isValid = false;
                errorMessage = 'Выберите количество гостей';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Функция показа ошибки поля
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

// Функция очистки ошибки поля
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// Экспортируем функции для возможного использования в других модулях
window.AppUtils = {
    showNotification,
    detectDevice,
    isMobile,
    initReservationForm
};
