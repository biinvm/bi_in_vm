// ========== КОНСТАНТЫ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
console.log('🌟 Визардия Analytics Portal v3.0 загружен');
console.log('Время загрузки:', new Date().toLocaleString());

let chartDom, myChart;
let animationCompleted = false;

// ========== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация...');
    
    // Создаем реалистичное звездное небо
    createRealisticStarfield();
    
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
    
    // Запуск анимации
    setTimeout(startAnimation, 100);
});

// ========== СОЗДАНИЕ РЕАЛИСТИЧНОГО ЗВЕЗДНОГО НЕБА ==========
function createRealisticStarfield() {
    // Создаем структуру
    const spaceBG = document.createElement('div');
    spaceBG.className = 'space-background';
    
    // Базовый фон
    const space = document.createElement('div');
    space.className = 'space-bg';
    
    // Млечный путь
    const milkyWay = document.createElement('div');
    milkyWay.className = 'milky-way';
    
    // Контейнер для звезд
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    
    // Собираем
    spaceBG.appendChild(space);
    spaceBG.appendChild(milkyWay);
    spaceBG.appendChild(starsContainer);
    
    // Вставляем в начало body
    document.body.insertBefore(spaceBG, document.body.firstChild);
    
    // Создаем звезды в 3 слоя параллакса
    createStarLayer(starsContainer, 'stars-far', 600);    // Дальние звезды
    createStarLayer(starsContainer, 'stars-medium', 400); // Средние звезды
    createStarLayer(starsContainer, 'stars-near', 200);   // Ближние звезды
    
    // Создаем созвездия
    createConstellations(starsContainer);
    
    // Запускаем метеоры
    startMeteorShower(starsContainer);
    
    console.log('✨ Реалистичное звездное небо создано');
}

function createStarLayer(container, layerClass, count) {
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        
        // Случайный размер и тип
        const sizeType = Math.random();
        let starClass = 'star-small';
        let starSize = 1;
        
        if (sizeType > 0.98) { // 2% - большие звезды
            starClass = Math.random() > 0.7 ? 'star-large' : 'star-medium';
            starSize = starClass === 'star-large' ? 3 : 2;
        } else if (sizeType > 0.9) { // 8% - средние звезды
            starClass = 'star-medium';
            starSize = 2;
        }
        
        // Цвет звезды (очень редко)
        if (Math.random() > 0.995) {
            const colorType = Math.random();
            if (colorType > 0.66) {
                starClass += ' star-blue';
            } else if (colorType > 0.33) {
                starClass += ' star-yellow';
            } else {
                starClass += ' star-red';
            }
        }
        
        star.className = `star ${starClass} ${layerClass}`;
        
        // Случайная позиция (с распределением, имитирующим Млечный Путь)
        let posX, posY;
        if (Math.random() > 0.3) {
            // Больше звезд по центру (Млечный Путь)
            posX = 50 + (Math.random() - 0.5) * 40;
            posY = 50 + (Math.random() - 0.5) * 60;
        } else {
            // Остальные звезды равномерно
            posX = Math.random() * 100;
            posY = Math.random() * 100;
        }
        
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        // Случайная задержка мерцания
        star.style.setProperty('--delay', Math.random() * 5);
        
        // Случайная яркость
        star.style.opacity = (0.2 + Math.random() * 0.5).toString();
        
        fragment.appendChild(star);
    }
    
    container.appendChild(fragment);
}

function createConstellations(container) {
    const constellations = [
        // Большая Медведица (упрощенная)
        {
            name: 'Большая Медведица',
            stars: [[15, 25], [17, 27], [19, 26], [21, 24], [23, 25], [25, 27], [27, 26]],
            lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
        },
        // Орион (пояс)
        {
            name: 'Орион',
            stars: [[65, 35], [67, 37], [69, 35], [71, 33]],
            lines: [[0,1], [1,2], [2,3]]
        },
        // Кассиопея (W-образная)
        {
            name: 'Кассиопея',
            stars: [[75, 55], [77, 53], [79, 55], [81, 53], [83, 55]],
            lines: [[0,1], [1,2], [2,3], [3,4]]
        }
    ];
    
    constellations.forEach((constellation) => {
        const constDiv = document.createElement('div');
        constDiv.className = 'constellation';
        
        // Звезды созвездия (немного крупнее и ярче)
        constellation.stars.forEach(([x, y]) => {
            const star = document.createElement('div');
            star.className = 'star star-medium';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.opacity = '0.9';
            star.style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.9)';
            constDiv.appendChild(star);
        });
        
        // Линии созвездия
        constellation.lines.forEach(([startIdx, endIdx]) => {
            const start = constellation.stars[startIdx];
            const end = constellation.stars[endIdx];
            
            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            
            const line = document.createElement('div');
            line.className = 'constellation-line';
            line.style.left = `${start[0]}%`;
            line.style.top = `${start[1]}%`;
            line.style.width = `${length}%`;
            line.style.transform = `rotate(${angle}deg)`;
            line.style.opacity = '0.15';
            
            constDiv.appendChild(line);
        });
        
        container.appendChild(constDiv);
    });
    
    console.log('✨ Созвездия созданы');
}

function startMeteorShower(container) {
    function createMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // Случайная позиция (только в верхней части экрана)
        meteor.style.left = `${20 + Math.random() * 60}%`;
        meteor.style.top = `${Math.random() * 20}%`;
        
        // Случайная длительность и задержка
        const duration = 1.5 + Math.random() * 2;
        const delay = Math.random() * 2;
        
        meteor.style.animation = `meteor-fall ${duration}s linear ${delay}s`;
        
        container.appendChild(meteor);
        
        // Удаляем после завершения анимации
        setTimeout(() => {
            if (meteor.parentNode) {
                meteor.remove();
            }
        }, (duration + delay) * 1000 + 1000);
    }
    
    // Запускаем метеоры каждые 5-15 секунд
    function scheduleMeteor() {
        const nextMeteor = 5000 + Math.random() * 10000;
        setTimeout(() => {
            if (document.getElementById('analytics-container').style.display !== 'block') {
                createMeteor();
            }
            scheduleMeteor();
        }, nextMeteor);
    }
    
    scheduleMeteor();
    console.log('☄️ Метеорный дождь запущен');
}

// ========== АНИМАЦИЯ ВИЗАРДИИ ==========
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
                        lineWidth: isMobile ? 3 : 4,
                        strokeOpacity: 0.8
                    },
                    keyframeAnimation: {
                        duration: animationDuration,
                        loop: false,
                        keyframes: [
                            {
                                percent: 0.3,
                                style: {
                                    fill: 'transparent',
                                    lineDashOffset: 0,
                                    lineDash: [200, 0]
                                }
                            },
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
                                    stroke: 'transparent',
                                    textShadow: '0 0 30px rgba(255, 215, 0, 0.7), 0 0 60px rgba(255, 215, 0, 0.4)'
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

function startAnimation() {
    console.log('🎬 Запуск анимации Визардии...');
    
    myChart.on('finished', function() {
        console.log('✅ Анимация Визардии завершена');
        animationCompleted = true;
        
        setTimeout(() => {
            hideAnimation();
            showButtons();
        }, 800);
    });
    
    // Фолбэк на случай проблем с анимацией
    setTimeout(() => {
        if (!animationCompleted) {
            console.log('⚠️ Автоматический показ кнопок (таймаут)');
            hideAnimation();
            showButtons();
        }
    }, 3500);
}

function hideAnimation() {
    if (chartDom) {
        chartDom.style.opacity = '0';
        chartDom.style.pointerEvents = 'none';
    }
}

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
    
    console.log('🔘 Кнопки показаны');
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
function setupEventHandlers() {
    // Адаптация к изменению размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (myChart) {
                myChart.resize();
                setupAnimation();
            }
        }, 200);
    });
    
    // Touch события для кнопок
    const buttons = document.querySelectorAll('.portal-button, .back-button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.98)';
            this.style.opacity = '0.9';
        });
        
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = '';
            this.style.opacity = '';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.transform = '';
            this.style.opacity = '';
        });
    });
    
    // Предотвращение двойного тапа для масштабирования
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Отключение контекстного меню на кнопках
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.portal-button, .back-button')) {
            e.preventDefault();
        }
    });
}

// ========== УПРАВЛЕНИЕ АНАЛИТИКОЙ ==========
function loadAnalytics(analyticsName) {
    console.log(`📊 Загрузка аналитики: ${analyticsName}`);
    
    // Воспроизводим звук (опционально)
    playPortalSound();
    
    // Анимация перехода
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'scale(0.95)';
        container.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            container.style.display = 'none';
            container.style.opacity = '';
            container.style.transform = '';
        }, 500);
    }
    
    // Показываем контейнер аналитики
    const analyticsContainer = document.getElementById('analytics-container');
    const frame = document.getElementById('analytics-frame');
    
    if (analyticsContainer) {
        analyticsContainer.style.display = 'block';
        analyticsContainer.style.opacity = '0';
        
        setTimeout(() => {
            analyticsContainer.style.opacity = '1';
        }, 50);
    }
    
    // Загружаем iframe
    if (frame) {
        const timestamp = Date.now();
        if (analyticsName === 'analytics1') {
            // Замените на путь к вашему эмбендингу
            frame.src = `./analytics1/index.html?t=${timestamp}`;
        } else if (analyticsName === 'analytics2') {
            frame.src = `./analytics2/index.html?t=${timestamp}`;
        }
    }
    
    // Сохраняем в sessionStorage
    sessionStorage.setItem('lastAnalytics', analyticsName);
}

function returnToMain() {
    console.log('🏠 Возврат на главный экран');
    
    playPortalSound();
    
    // Анимация скрытия аналитики
    const analyticsContainer = document.getElementById('analytics-container');
    if (analyticsContainer) {
        analyticsContainer.style.opacity = '0';
        
        setTimeout(() => {
            analyticsContainer.style.display = 'none';
            analyticsContainer.style.opacity = '';
        }, 500);
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
        container.style.opacity = '0';
        
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
        }, 50);
    }
    
    // Сбрасываем анимацию
    resetAnimation();
}

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

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function playPortalSound() {
    // Создаем звуковой эффект (опционально)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Нота C5
        oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // Нота E5
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Браузер не поддерживает Web Audio API
        console.log('🔇 Звук не поддерживается');
    }
}

function getCurrentVersion() {
    return '3.0';
}

function refreshAnalytics() {
    const frame = document.getElementById('analytics-frame');
    if (frame && frame.src) {
        const url = new URL(frame.src);
        url.searchParams.set('refresh', Date.now());
        frame.src = url.toString();
        console.log('🔄 Аналитика обновлена');
    }
}

// ========== ЭКСПОРТ ФУНКЦИЙ ==========
window.loadAnalytics = loadAnalytics;
window.returnToMain = returnToMain;
window.refreshAnalytics = refreshAnalytics;
window.getCurrentVersion = getCurrentVersion;

// ========== ДОПОЛНИТЕЛЬНЫЕ СЛУЖЕБНЫЕ ФУНКЦИИ ==========
// Проверка поддержки функций
function checkBrowserSupport() {
    const supports = {
        webgl: !!window.WebGLRenderingContext,
        webaudio: !!window.AudioContext || !!window.webkitAudioContext,
        cssanimations: 'animation' in document.body.style,
        cssfilters: 'backdropFilter' in document.body.style || 'webkitBackdropFilter' in document.body.style
    };
    
    console.log('Поддержка браузера:', supports);
    return supports;
}

// Запуск проверки при загрузке
setTimeout(checkBrowserSupport, 1000);