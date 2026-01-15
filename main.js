console.log('Аналитика Визардии загружена!');
console.log('Время загрузки:', new Date().toLocaleString());

// Глобальные переменные
let chartDom, myChart;
let animationCompleted = false;
let isInitialLoad = true;

// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация...');
    
    // Инициализация ECharts
    chartDom = document.getElementById('main');
    if (!chartDom) {
        console.error('Элемент #main не найден!');
        return;
    }
    
    myChart = echarts.init(chartDom);
    
    // Проверка на мобильное устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
        console.log('Мобильное устройство обнаружено');
    }
    
    // Настройка анимации
    setupAnimation();
    
    // Настройка обработчиков событий
    setupEventHandlers();
    
    // Создание звездного неба
    createStars();
    
    // Запуск анимации
    setTimeout(startAnimation, 100);
});

// СОЗДАНИЕ ЗВЕЗДНОГО НЕБА
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) {
        console.log('Создаем контейнер для звезд');
        const starsDiv = document.createElement('div');
        starsDiv.className = 'stars';
        starsDiv.id = 'stars';
        document.body.insertBefore(starsDiv, document.querySelector('.container'));
    }
    
    const starsElement = document.getElementById('stars');
    if (!starsElement) return;
    
    // Очищаем предыдущие звезды
    starsElement.innerHTML = '';
    
    // Создаем звезды
    const starCount = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 3000));
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Случайный размер
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Случайная позиция
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Случайная длительность мерцания
        const duration = Math.random() * 3 + 2;
        star.style.setProperty('--duration', `${duration}s`);
        
        starsElement.appendChild(star);
    }
    
    console.log(`Создано ${starCount} звезд`);
}

// НАСТРОЙКА АНИМАЦИИ ВИЗАРДИЯ
function setupAnimation() {
    const isMobile = document.body.classList.contains('mobile-device');
    const fontSize = isMobile ? (window.innerWidth <= 480 ? 70 : 90) : 140;
    const animationDuration = isMobile ? 2000 : 2500;
    
    const option = {
        backgroundColor: 'transparent',
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: 'center',
                    top: '50%',
                    style: {
                        text: 'Визардия',
                        fontSize: fontSize,
                        fontWeight: 'bold',
                        fontFamily: 'Cinzel, serif',
                        lineDash: [0, 200],
                        lineDashOffset: 0,
                        fill: 'transparent',
                        stroke: '#FFD700',
                        lineWidth: isMobile ? 3 : 4
                    },
                    keyframeAnimation: {
                        duration: animationDuration,
                        loop: false,
                        keyframes: [
                            {
                                percent: 0.6,
                                style: {
                                    fill: 'transparent',
                                    lineDashOffset: 200,
                                    lineDash: [200, 0]
                                }
                            },
                            {
                                percent: 0.7,
                                style: {
                                    fill: 'transparent'
                                }
                            },
                            {
                                percent: 1,
                                style: {
                                    fill: '#FFD700',
                                    textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
    
    myChart.setOption(option);
}

// ЗАПУСК АНИМАЦИИ
function startAnimation() {
    console.log('Запуск анимации Визардии...');
    
    // Слушаем завершение анимации
    myChart.on('finished', function() {
        console.log('Анимация Визардии завершена');
        animationCompleted = true;
        
        // Скрываем анимацию и показываем кнопки
        setTimeout(() => {
            hideAnimation();
            showButtons();
        }, 500);
    });
    
    // На случай если анимация не сработает
    setTimeout(() => {
        if (!animationCompleted) {
            console.log('Автоматический показ кнопок (таймаут)');
            hideAnimation();
            showButtons();
        }
    }, 3500);
}

// СКРЫТЬ АНИМАЦИЮ
function hideAnimation() {
    if (chartDom) {
        chartDom.style.opacity = '0';
        chartDom.style.pointerEvents = 'none';
    }
}

// ПОКАЗАТЬ КНОПКИ
function showButtons() {
    const buttonsContainer = document.getElementById('buttons-container');
    const subtitle = document.getElementById('subtitle');
    
    if (buttonsContainer) {
        buttonsContainer.style.opacity = '1';
        buttonsContainer.style.transform = 'translateY(0)';
    }
    
    if (subtitle) {
        setTimeout(() => {
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    console.log('Кнопки показаны');
}

// НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ
function setupEventHandlers() {
    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (myChart) {
                myChart.resize();
                setupAnimation();
            }
            // Обновляем звездное небо
            createStars();
        }, 200);
    });
    
    // Настройка touch событий для кнопок
    const buttons = document.querySelectorAll('.portal-button, .back-button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.opacity = '0.9';
        });
        
        button.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
    
    // Предотвращение двойного тапа для масштабирования
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
}

// ЗАГРУЗКА CLOUDFLARE
function loadCF() {
    console.log('Загрузка Cloudflare...');
    
    // Скрываем главный экран
    const container = document.querySelector('.container');
    if (container) container.style.display = 'none';
    
    // Показываем контейнер аналитики
    const analyticsContainer = document.getElementById('analytics-container');
    const frame = document.getElementById('analytics-frame');
    
    if (analyticsContainer) {
        analyticsContainer.style.display = 'block';
    }
    
    // Загружаем iframe с CF
    if (frame) {
        const timestamp = Date.now();
        frame.src = `CF/index.html?nocache=${timestamp}`;
    }
    
    // Запоминаем что загружен CF
    sessionStorage.setItem('lastAnalytics', 'cf');
}

// ЗАГРУЗКА АНАЛИТИКИ
function loadAnalytics(analyticsName) {
    console.log(`Загрузка аналитики: ${analyticsName}`);
    
    // Скрываем главный экран
    const container = document.querySelector('.container');
    if (container) container.style.display = 'none';
    
    // Показываем контейнер аналитики
    const analyticsContainer = document.getElementById('analytics-container');
    const frame = document.getElementById('analytics-frame');
    
    if (analyticsContainer) {
        analyticsContainer.style.display = 'block';
    }
    
    // Загружаем iframe с параметром для избежания кэширования
    if (frame) {
        const timestamp = Date.now();
        // Загружаем аналитику из соответствующих папок
        if (analyticsName === 'analytics1') {
            frame.src = `./${analyticsName}/index.html?nocache=${timestamp}`;
        } else if (analyticsName === 'analytics2') {
            frame.src = `./${analyticsName}/index.html?nocache=${timestamp}`;
        }
    }
    
    // Запоминаем какая аналитика загружена
    sessionStorage.setItem('lastAnalytics', analyticsName);
}

// ВОЗВРАТ НА ГЛАВНЫЙ ЭКРАН
function returnToMain() {
    console.log('Возврат на главный экран');
    
    // Скрываем контейнер аналитики
    const analyticsContainer = document.getElementById('analytics-container');
    if (analyticsContainer) {
        analyticsContainer.style.display = 'none';
    }
    
    // Очищаем iframe
    const frame = document.getElementById('analytics-frame');
    if (frame) {
        frame.src = 'about:blank';
    }
    
    // Показываем главный экран
    const container = document.querySelector('.container');
    if (container) {
        container.style.display = 'flex';
    }
    
    // Сбрасываем анимацию
    resetAnimation();
}

// СБРОС АНИМАЦИИ
function resetAnimation() {
    // Скрываем кнопки
    const buttonsContainer = document.getElementById('buttons-container');
    const subtitle = document.getElementById('subtitle');
    
    if (buttonsContainer) {
        buttonsContainer.style.opacity = '0';
        buttonsContainer.style.transform = 'translateY(30px)';
    }
    
    if (subtitle) {
        subtitle.style.opacity = '0';
        subtitle.style.transform = 'translateY(20px)';
    }
    
    // Показываем анимацию
    if (chartDom) {
        chartDom.style.opacity = '1';
        chartDom.style.pointerEvents = 'auto';
    }
    
    // Сбрасываем флаги
    animationCompleted = false;
    
    // Перезапускаем анимацию
    setTimeout(() => {
        if (myChart) {
            myChart.resize();
            setupAnimation();
            setTimeout(startAnimation, 100);
        }
    }, 100);
}

// Экспорт функций для глобального доступа
window.loadAnalytics = loadAnalytics;
window.loadCF = loadCF;
window.returnToMain = returnToMain;
window.refreshAnalytics = function() {
    const frame = document.getElementById('analytics-frame');
    if (frame && frame.src) {
        const url = new URL(frame.src);
        url.searchParams.set('refresh', Date.now());
        frame.src = url.toString();
        console.log('Аналитика обновлена');
    }
};
window.getCurrentVersion = function() {
    return '2.2';
};