// --- 1. Неоновые искры ---
function createSnow() {
    const container = document.getElementById('snow-container');
    const snowflakeCount = 50;
    const colors = ['#ffcc00', '#ff8c00', '#d97736', '#fff3e0'];
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 4 + 2; 
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        snowflake.style.backgroundColor = color;
        snowflake.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        
        snowflake.style.animationDuration = Math.random() * 5 + 5 + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        snowflake.style.opacity = Math.random() * 0.5 + 0.5;
        container.appendChild(snowflake);
    }
}
createSnow();

// --- 2. Ёлка с шарами ---
const tree = document.getElementById('treeContainer'); 
const ornamentsData = [
    { top: '13%', left: '47%', text: '🎁', title: 'Подарок!', message: 'Саша, желаю тебе в новом году кучу крутых подарков и неожиданных приятностей!' },
    { top: '27%', left: '35%', text: '🌟', title: 'Успех', message: 'Пусть все сессии сдаются на отлично, а дедлайны не горят!' },
    { top: '30%', left: '60%', text: '💻', title: 'Код', message: 'Желаю, чтобы твой код компилировался с первого раза, а баги обходили стороной!' },
    { top: '45%', left: '41%', text: '🔥', title: 'Мотивация', message: 'Пусть в новом году у тебя будет много энергии на крутые проекты и интересные идеи!' },
    { top: '48%', left: '66%', text: '💪', title: 'Энергия', message: 'В новом году — на спорт! Или хотя бы на прогулку. Главное — двигайся!' },
    { top: '63%', left: '52%', text: '💰', title: 'Финансы', message: 'Желаю, чтобы стипендия приходила вовремя и не заканчивалась за неделю!' },
    { top: '79%', left: '36%', text: '🚀', title: 'Рост', message: 'Пусть новый год принесет тебе много новых возможностей и крутых знакомств!' }
];

if (tree) {
    ornamentsData.forEach((data) => {
        const orn = document.createElement('div');
        orn.classList.add('ornament');
        orn.style.top = data.top;
        orn.style.left = data.left;
        orn.innerText = data.text;
        orn.setAttribute('tabindex', '0');
        orn.setAttribute('role', 'button');
        orn.setAttribute('aria-label', data.title);
        orn.onclick = () => openModal(data.title, data.message);
        orn.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(data.title, data.message); }
        };
        tree.appendChild(orn);
    });
}

// === ДОБАВЛЕНО: Недостающие функции для модального окна ===
function openModal(title, text) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = text;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) closeModal();
});
// =======================================================

// --- 3. Скретч-карты ---
const scratchContainer = document.getElementById('scratchContainer');
const scratchTexts = [
    'В новом году ты найдёшь ту самую вещь, которую искал весь год!',
    'Тебя ждёт спонтанная поездка, о которой ты не пожалеешь.',
    'Твой код наконец-то перестанет багать! ✨'
];

scratchTexts.forEach((text) => {
    const card = document.createElement('div');
    card.classList.add('scratch-card');
    
    const textDiv = document.createElement('div');
    textDiv.classList.add('scratch-text');
    textDiv.innerText = text;
    card.appendChild(textDiv);

    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 120;
    canvas.setAttribute('tabindex', '0');
    card.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a110b'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, canvas.width-4, canvas.height-4);

    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('СТЕРЕТЬ', 100, 65);

    let isDrawing = false;

    const checkProgress = () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }
        
        const totalPixels = pixels.length / 4;
        const percentScratched = (transparentPixels / totalPixels) * 100;
        
        if (percentScratched > 45) {
            if (!canvas.classList.contains('scratched')) {
                canvas.classList.add('scratched');
                document.dispatchEvent(new CustomEvent('scratchDone'));
            }
        }
    };

    const erase = (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        let x, y;
        if (e.touches) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
    };

    const stopDrawing = () => {
        if(isDrawing) {
            isDrawing = false;
            checkProgress();
        }
    };

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; erase(e); });
    canvas.addEventListener('mousemove', erase);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', (e) => { isDrawing = true; erase(e); }, {passive: true});
    canvas.addEventListener('touchmove', (e) => { erase(e); }, {passive: true});
    canvas.addEventListener('touchend', stopDrawing);

    scratchContainer.appendChild(card);
});

// --- 4. Бинго 3х3 ---
const bingoGrid = document.getElementById('bingoGrid');
const bingoItems = [
    'Выспаться', 'Не работать в выходные', 'Купить ту самую вещь',
    'Сходить в кино', 'Прочитать книгу', 'Начать бегать',
    'Съездить куда-то', 'Что-то приготовить', 'Провести время с друзьями'
];
let bingoState = new Array(9).fill(false);

bingoItems.forEach((item, index) => {
    const cell = document.createElement('div');
    cell.classList.add('bingo-cell');
    cell.innerText = item;
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'checkbox');
    cell.setAttribute('aria-checked', 'false');
    const toggle = () => {
        bingoState[index] = !bingoState[index];
        cell.classList.toggle('active');
        cell.setAttribute('aria-checked', String(bingoState[index]));
        checkBingo();
    };
    cell.onclick = toggle;
    cell.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    };
    bingoGrid.appendChild(cell);
});

function checkBingo() {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    let hasBingo = false;
    for (let pattern of winPatterns) {
        if (pattern.every(i => bingoState[i])) { hasBingo = true; break; }
    }
    document.getElementById('bingo-result').innerText = hasBingo ? '🎉 БИНГО! Ты выполнил линию! Так держать!' : '';
    if (hasBingo) document.dispatchEvent(new CustomEvent('bingoWin'));
}

// --- 5. Предсказание на год ---
const predictions = [
    'В новом году тебя ждет спонтанная поездка!',
    'Твой код наконец-то перестанет багать.',
    'Ты найдешь ту самую вещь, которую искал весь год.',
    'Сессия сдастся сама собой (ну, почти).',
    'Тебя ждет неожиданная встреча, которая изменит планы.',
    'В новом году ты наконец-то выспишься (нет).',
    'Ты получишь повышение (или просто хорошую оценку).',
    'Твой любимый проект выстрелит!',
    'Ты найдешь идеальный рецепт оливье.',
    'Вернёшь долг (или тебе вернут).',
    'Почувствуешь прилив энергии.',
    'Откажешься от того, что тяготит.',
    'Обрадуешься простой мелочи.',
    'Все дедлайны перенесут (но это не точно).',
    'Найдёшь баг за 5 минут до дедлайна — и победишь его.',
    'Получишь стипендию раньше, чем закончатся деньги.',
    'Закроешь все хвосты без единой пересдачи.',
    'Напишешь код, которым будешь гордиться через год.',
    'Выживешь после первой же пары в 8 утра.',
    'Найдёшь баланс между учёбой, работой и жизнью.',
    'Сделаешь коммит, который спасёт проект.',
    'Твой код скомпилируется без единого варнинга.',
    'Найдёшь конспект лекции, которую пропустил в сентябре.',
    'Получишь ответ от преподавателя за 5 минут до пары.',
    'Закроешь вкладку браузера, которую не закрывал месяц.',
    'Сможешь проснуться на первую пару без будильника.',
    'Твой код будет работать быстрее, чем ты ожидал.',
    'Получишь стипендию и потратишь её на что-то полезное.',
    'Найдёшь человека, с которым можно обсудить баги в 3 ночи.',
    'Закроешь год с чистым репозиторием и чистой совестью.'
];

function generatePrediction() {
    const randomIndex = Math.floor(Math.random() * predictions.length);
    document.getElementById('predictionResult').innerText = predictions[randomIndex];
}

// --- 6. Новогоднее Бинго ---
const holidayBingo = document.getElementById('holidayBingo');
const holidayItems = [
    'Оливье через силу', 'Гулял по украшенному городу', 'Тост на 5 минут', "Услышал песню Jingle Bells",
    'Потерянный носок', 'Подарок не по размеру', 'Салат "Шуба"', "Нарядил ёлку до 31 декабря",
    'Проснуться в 15:00', 'Бой курантов', 'Увидел первый снег в этом году', "Забыл зарядить телефон"
];

holidayItems.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('holiday-item');
    div.innerText = item;
    div.setAttribute('tabindex', '0');
    div.setAttribute('role', 'checkbox');
    div.setAttribute('aria-checked', 'false');
    const toggle = () => {
        div.classList.toggle('active');
        div.setAttribute('aria-checked', String(div.classList.contains('active')));
        document.dispatchEvent(new CustomEvent('holidayChanged', {
            detail: { activeCount: document.querySelectorAll('.holiday-item.active').length }
        }));
    };
    div.onclick = toggle;
    div.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    };
    holidayBingo.appendChild(div);
});

// --- 7. Генератор идеального вечера ---
const movies = [
    '"Один дома"', '"Ирония судьбы"', '"Гарри Поттер"', '"Начало"', '"Джентльмены"', 
    '"Холодное сердце"', '"Достать ножи"', '"Снежная королева"', '"Ночь в музее"', 
    '"Хроники Нарнии"', '"Гринч"', '"Властелин колец"', '"Дюна"', '"Матрица"', 
    '"Сияние"', '"Звездные войны"'
];
const drinks = [
    'Глинтвейн', 'Какао с маршмеллоу', 'Чай с лимоном', 'Горячий шоколад', 'Кола со льдом', 
    'Имбирный чай с медом', 'Клюквенный морс', 'Облепиховый чай', 'Яблочный сидр', 
    'Виски с имбирным элем', 'Крепкая медовуха с перцем', 'Горячая сангрия с бренди', 
    'Ирландский кофе с виски', 'Водка', 'Шампанское', 'Ром', 'Джин'
];
const activities = [
    'Заказать пиццу и не вставать с дивана', 'Укутаться в плед и смотреть сериал', 'Поиграть в настолки', 
    'Позвонить другу', 'Пойти гулять под снегом', 'Смотреть на падающий снег из окна', 
    'Лепить снеговика во дворе', 'Украшать комнату гирляндами', 'Писать цели на следующий год', 
    'Проходить сюжетную кампанию в любимой RPG', 'Играть в кооперативный шутер с друзьями', 
    'Гонять на спорткарах в Need for Speed', 'Проходить сложные инди-платформеры', 
    'Проходить атмосферные хорроры в наушниках'
];

function generateEvening() {
    const movie = movies[Math.floor(Math.random() * movies.length)];
    const drink = drinks[Math.floor(Math.random() * drinks.length)];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    document.getElementById('eveningResult').innerText = `Сегодня твой идеальный вечер: фильм ${movie}, напиток "${drink}", активность "${activity}".`;
}

// --- 8. Отправка формы через Formspree ---
const form = document.getElementById('replyFormEl');
const successMsg = document.getElementById('successMsg');

if(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('senderName');
        const messageInput = document.getElementById('replyMessage');
        
        if (nameInput.value.trim() === '' || messageInput.value.trim() === '') {
            alert('Пожалуйста, заполни Имя и Сообщение! Пустые поля отправить нельзя.');
            return;
        }

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'ОТПРАВКА...';
        submitBtn.disabled = true;

        fetch('https://formspree.io/f/myeelzqp', { 
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                form.style.display = 'none'; 
                successMsg.style.display = 'block'; 
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Ошибка при отправке. Попробуй еще раз.");
                    }
                });
            }
        })
        .catch(() => alert("Ошибка сети. Проверь подключение к интернету."))
        .finally(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}

// --- 9. Декоративные линии в секциях ---
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const decor = document.createElement('div');
        decor.className = 'section-decor';
        const lineLeft = document.createElement('div');
        lineLeft.className = 'decor-line left-line';
        const lineRight = document.createElement('div');
        lineRight.className = 'decor-line right-line';
        decor.appendChild(lineLeft);
        decor.appendChild(lineRight);
        section.insertBefore(decor, section.firstChild);
    });
});

// --- 10. Кликер ---
let clicks = 0;
const clickMessages = [
    "Ну давай, еще разок!", "Ого, ты быстрый!", "Саша, ты рвешь шаблоны!",
    "Твой палец как процессор!", "Еще чуть-чуть до рекорда!", "Клик-клик-клик!",
    "Это лучший клик в твоей жизни!", "Ты официально крут!", "Не останавливайся!", "Ого, да ты машина!"
];

const clickerBtn = document.getElementById('clickerBtn');
if(clickerBtn) {
    clickerBtn.addEventListener('click', () => {
        clicks++;
        document.getElementById('clickCount').innerText = clicks;
        if (clicks % 5 === 0 || clicks === 1) {
            const randomMsg = clickMessages[Math.floor(Math.random() * clickMessages.length)];
            document.getElementById('clickMessage').innerText = randomMsg;
        }
        document.dispatchEvent(new CustomEvent('clickerTick', { detail: { clicks } }));
    });
}

// --- 11. Комплименты ---
const compliments = [
    "Ты лучший одногруппник в мире!", "С тобой любой проект по плечу.",
    "У тебя отличное чувство юмора!", "Ты очень надежный друг.",
    "Твой код всегда работает (почти).", "Ты умеешь найти выход из любой ситуации.",
    "С тобой всегда весело на парах.", "Ты классный собеседник.",
    "Все баги тебя боятся.", "Ты крутой! Не забывай об этом.",
    "Пусть новый год принесет тебе только лучшее!"
];

const complimentBtn = document.getElementById('complimentBtn');
if(complimentBtn) {
    complimentBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * compliments.length);
        document.getElementById('complimentText').innerText = compliments[randomIndex];
        document.dispatchEvent(new CustomEvent('complimentGot'));
    });
}

// --- 12. Кубик ---
function rollDice() {
    const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const randomFace = diceFaces[Math.floor(Math.random() * diceFaces.length)];
    document.getElementById('diceResult').innerText = randomFace;
    document.dispatchEvent(new CustomEvent('diceRolled'));
}

/* ============================================================
   === РАСШИРЕНИЯ (ТОЛЬКО ДЛЯ ПК) ===
   ============================================================ */
const isPC = window.matchMedia('(min-width: 769px)').matches;

if (isPC) {
    (function () {
        'use strict';

        /* ---------- ЗВУКИ ---------- */
        let audioCtx = null;
        let soundEnabled = true;

        function getAudioCtx() {
            if (!audioCtx) {
                try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
                catch (e) { soundEnabled = false; }
            }
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
            return audioCtx;
        }

        function playTone(freq, duration, type = 'sine', volume = 0.08) {
            if (!soundEnabled) return;
            const ctx = getAudioCtx(); if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + duration);
        }

        const playClick = () => playTone(880, 0.05, 'square', 0.05);
        const playSuccess = () => { playTone(523.25,0.1); setTimeout(()=>playTone(659.25,0.1),80); setTimeout(()=>playTone(783.99,0.2),160); };
        const playAchievement = () => { playTone(659.25,0.12); setTimeout(()=>playTone(783.99,0.12),100); setTimeout(()=>playTone(1046.5,0.25),200); };
        const playDice = () => playTone(440, 0.06, 'triangle', 0.06);

        const soundBtn = document.getElementById('soundToggle');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                soundEnabled = !soundEnabled;
                soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
                soundBtn.style.opacity = soundEnabled ? '1' : '0.5';
                if (soundEnabled) playClick();
            });
        }

        /* ---------- localStorage ---------- */
        const STORAGE_KEY = 'sasha_ny_progress_v1';
        const defaultProgress = {
            clicks: 0, diceRolls: 0, complimentsGot: 0,
            scratchDone: 0, bingoLine: false, holidayChecked: 0,
            openedSections: [], achievements: [], theme: 'gold'
        };
        let progress = loadProgress();

        function loadProgress() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return { ...defaultProgress };
                return { ...defaultProgress, ...JSON.parse(raw) };
            } catch (e) { return { ...defaultProgress }; }
        }
        function saveProgress() {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) {}
        }

        /* Восстановление кликера */
        (function restoreClicks() {
            const el = document.getElementById('clickCount');
            if (el && progress.clicks > 0) {
                el.innerText = progress.clicks;
                clicks = progress.clicks;
            }
        })();

        /* Восстановление темы */
        if (progress.theme && progress.theme !== 'gold') {
            document.documentElement.setAttribute('data-theme', progress.theme);
            document.querySelectorAll('.theme-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.theme === progress.theme);
            });
        }

        /* ---------- ПАРАЛЛАКС ---------- */
        const decorLeft = document.querySelector('.bg-decor-left');
        const decorRight = document.querySelector('.bg-decor-right');
        let mouseX = 0, mouseY = 0, rafPending = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!rafPending) { rafPending = true; requestAnimationFrame(applyParallax); }
        });
        function applyParallax() {
            rafPending = false;
            if (decorLeft)  decorLeft.style.transform  = `translate(${mouseX*25}px, ${mouseY*25}px) rotate(${mouseX*10}deg)`;
            if (decorRight) decorRight.style.transform = `translate(${mouseX*-25}px, ${mouseY*-25}px) rotate(${mouseX*-10}deg)`;
        }

        /* ---------- ДОСТИЖЕНИЯ ---------- */
        const ACHIEVEMENTS = [
            { id: 'clicker10',   icon: '👆', title: 'Кликер-новичок',   desc: '10 кликов' },
            { id: 'clicker100',  icon: '🔥', title: 'Кликер-мастер',    desc: '100 кликов' },
            { id: 'scratchAll',  icon: '🎟️', title: 'Все карты стёрты', desc: 'Стёрты все скретч-карты' },
            { id: 'bingoLine',   icon: '🎯', title: 'БИНГО!',           desc: 'Собрана линия' },
            { id: 'holidayAll',  icon: '🎉', title: 'Новогодний марафон', desc: 'Отмечено 6+ пунктов бинго' },
            { id: 'sectionsAll', icon: '📖', title: 'Всё изучено',      desc: 'Открыты все разделы' },
            { id: 'dice10',      icon: '🎲', title: 'Кубик-мастер',     desc: '10 бросков кубика' },
            { id: 'compliment5', icon: '💬', title: 'Приятно слышать',  desc: '5 комплиментов' }
        ];

        function unlockAchievement(id) {
            if (progress.achievements.includes(id)) return;
            progress.achievements.push(id);
            saveProgress();
            renderAchievements();
            const a = ACHIEVEMENTS.find(x => x.id === id);
            if (a) showAchievementToast(a);
            playAchievement();
        }

        let toastTimeout = null;
        function showAchievementToast(achievement) {
            let toast = document.getElementById('achievementToast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'achievementToast';
                toast.className = 'achievement-toast';
                toast.innerHTML = `
                    <div class="toast-icon"></div>
                    <div class="toast-text">
                        <div class="toast-title">Достижение открыто!</div>
                        <div class="toast-desc"></div>
                    </div>`;
                document.body.appendChild(toast);
            }
            toast.querySelector('.toast-icon').textContent = achievement.icon;
            toast.querySelector('.toast-desc').textContent = `${achievement.title} — ${achievement.desc}`;
            toast.classList.add('show');
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
        }

        function renderAchievements() {
            const bar = document.getElementById('achievementsBar');
            if (!bar) return;
            bar.innerHTML = '';
            ACHIEVEMENTS.forEach(a => {
                const badge = document.createElement('div');
                badge.className = 'achievement-badge' + (progress.achievements.includes(a.id) ? ' unlocked' : '');
                badge.textContent = a.icon;
                badge.setAttribute('data-title', `${a.title} — ${a.desc}`);
                badge.setAttribute('title', `${a.title}: ${a.desc}`);
                bar.appendChild(badge);
            });
        }
        renderAchievements();

        /* ---------- ПРОГРЕСС-БАР ---------- */
        const ALL_SECTIONS = ['tree', 'scratch-container', 'bingo-grid', 'prediction-result', 'holiday-bingo', 'evening-result', 'replyForm', 'hero-image-container'];
        const progressTracker = document.getElementById('progressTracker');
        if (progressTracker) {
            const fill = progressTracker.querySelector('.tracker-bar-fill');
            const label = progressTracker.querySelector('.tracker-count');

            function updateProgressTracker() {
                const count = progress.openedSections.length;
                const total = ALL_SECTIONS.length;
                fill.style.width = (count / total * 100) + '%';
                label.textContent = `${count}/${total}`;
                if (count === total) unlockAchievement('sectionsAll');
            }

            function markSectionOpened(id) {
                if (!progress.openedSections.includes(id)) {
                    progress.openedSections.push(id);
                    saveProgress();
                    updateProgressTracker();
                }
            }

            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id || entry.target.dataset.sectionId;
                        if (id && ALL_SECTIONS.includes(id)) markSectionOpened(id);
                    }
                });
            }, { threshold: 0.3 });

            ALL_SECTIONS.forEach(id => {
                const el = document.getElementById(id);
                if (el) io.observe(el);
            });
            updateProgressTracker();
        }

        /* ---------- СВЯЗКА С БАЗОВЫМИ СОБЫТИЯМИ ---------- */
        document.addEventListener('clickerTick', (e) => {
            playClick();
            progress.clicks = e.detail.clicks;
            if (progress.clicks >= 10) unlockAchievement('clicker10');
            if (progress.clicks >= 100) unlockAchievement('clicker100');
            saveProgress();
        });

        document.addEventListener('complimentGot', () => {
            playClick();
            progress.complimentsGot++;
            if (progress.complimentsGot >= 5) unlockAchievement('compliment5');
            saveProgress();
        });

        document.addEventListener('diceRolled', () => {
            playDice();
            progress.diceRolls++;
            if (progress.diceRolls >= 10) unlockAchievement('dice10');
            saveProgress();
        });

        document.addEventListener('scratchDone', () => {
            const done = document.querySelectorAll('.scratch-card canvas.scratched').length;
            if (done > progress.scratchDone) {
                progress.scratchDone = done;
                saveProgress();
                playSuccess();
                if (done === document.querySelectorAll('.scratch-card').length) unlockAchievement('scratchAll');
            }
        });

        document.addEventListener('bingoWin', () => {
            if (!progress.bingoLine) {
                progress.bingoLine = true;
                saveProgress();
                playSuccess();
                unlockAchievement('bingoLine');
            }
        });

        document.addEventListener('holidayChanged', (e) => {
            playClick();
            progress.holidayChecked = e.detail.activeCount;
            saveProgress();
            if (e.detail.activeCount >= 6) unlockAchievement('holidayAll');
        });

        /* ---------- ПЕРЕКЛЮЧАТЕЛЬ ТЕМ ---------- */
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const t = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', t);
                progress.theme = t;
                saveProgress();
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                playClick();
            });
        });

    })();
}

/* ============================================================
   === ВИЗУАЛЬНЫЕ УЛУЧШЕНИЯ ===
   ============================================================ */
(function () {
    'use strict';

    const isPC = window.matchMedia('(min-width: 769px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* 1. НЕОНОВОЕ СВЕЧЕНИЕ ЗА КУРСОРОМ */
    if (isPC && !reduceMotion) {
        const glow = document.createElement('div');
        glow.id = 'cursorGlow';
        document.body.appendChild(glow);

        let gx = 0, gy = 0, tx = 0, ty = 0, glowRaf = null;

        function animateGlow() {
            gx += (tx - gx) * 0.18;
            gy += (ty - gy) * 0.18;
            glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
            if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) {
                glowRaf = requestAnimationFrame(animateGlow);
            } else {
                glowRaf = null;
            }
        }

        document.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
            glow.classList.add('active');
            if (!glowRaf) glowRaf = requestAnimationFrame(animateGlow);
        });

        document.addEventListener('mouseleave', () => glow.classList.remove('active'));
        document.addEventListener('mouseenter', () => glow.classList.add('active'));
    }

    /* 2. 3D-НАКЛОН КАРТОЧЕК */
    if (isPC && !reduceMotion) {
        const TILT_SELECTOR = [
            '.side-widget',
            'section',
            '.scratch-card',
            '.bingo-cell',
            '.holiday-item',
            '.hero-image-container'
        ].join(', ');

        const MAX_TILT = 6;

        document.querySelectorAll(TILT_SELECTOR).forEach(card => {
            card.classList.add('tilt-card');

            let rafId = null;
            let lastEvent = null;

            card.addEventListener('mousemove', (e) => {
                lastEvent = e;
                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        rafId = null;
                        if (!lastEvent) return;
                        const rect = card.getBoundingClientRect();
                        const x = lastEvent.clientX - rect.left;
                        const y = lastEvent.clientY - rect.top;
                        const px = x / rect.width;
                        const py = y / rect.height;

                        const rotateY = (px - 0.5) * 2 * MAX_TILT;
                        const rotateX = -(py - 0.5) * 2 * MAX_TILT;

                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                        card.style.setProperty('--mx', (px * 100) + '%');
                        card.style.setProperty('--my', (py * 100) + '%');
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                card.style.setProperty('--mx', '50%');
                card.style.setProperty('--my', '50%');
            });
        });
    }

    /* 3. КУРСОР-ШЛЕЙФ */
    if (isPC && !reduceMotion) {
        const canvas = document.createElement('canvas');
        canvas.id = 'trailCanvas';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const MAX_PARTICLES = 40;
        const PALETTE_GOLD = ['#ffcc00', '#ff8c00', '#fff3e0', '#d97736'];

        function getPalette() {
            const t = document.documentElement.getAttribute('data-theme') || 'gold';
            if (t === 'ice')     return ['#7dd3fc', '#38bdf8', '#e0f2fe', '#0ea5e9'];
            if (t === 'classic') return ['#ff4545', '#16a34a', '#ffe0e0', '#dc2626'];
            if (t === 'terminal')return ['#00ff66', '#00cc44', '#aaffaa', '#88ff88'];
            return PALETTE_GOLD;
        }

        let lastX = null, lastY = null;
        let mouseVX = 0, mouseVY = 0;

        document.addEventListener('mousemove', (e) => {
            if (lastX !== null) {
                mouseVX = e.clientX - lastX;
                mouseVY = e.clientY - lastY;
            }
            lastX = e.clientX;
            lastY = e.clientY;

            const speed = Math.hypot(mouseVX, mouseVY);
            const spawnCount = Math.min(3, 1 + Math.floor(speed / 15));

            for (let i = 0; i < spawnCount; i++) {
                const palette = getPalette();
                particles.push({
                    x: e.clientX + (Math.random() - 0.5) * 12,
                    y: e.clientY + (Math.random() - 0.5) * 12,
                    vx: -mouseVX * 0.15 + (Math.random() - 0.5) * 1.2,
                    vy: -mouseVY * 0.15 + (Math.random() - 0.5) * 1.2 + 0.3,
                    life: 1,
                    decay: 0.018 + Math.random() * 0.012,
                    size: 1.5 + Math.random() * 2.5,
                    color: palette[Math.floor(Math.random() * palette.length)]
                });
            }

            if (particles.length > MAX_PARTICLES) {
                particles.splice(0, particles.length - MAX_PARTICLES);
            }
        });

        function drawTrail() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.04;
                p.vx *= 0.97;
                p.vy *= 0.97;
                p.life -= p.decay;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            requestAnimationFrame(drawTrail);
        }
        drawTrail();
    }

    /* 4. РИППЛ-ЭФФЕКТ */
    function addRipple(e) {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (e.clientX || (e.touches && e.touches[0].clientX) || rect.left + rect.width / 2) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY) || rect.top + rect.height / 2) - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (x - size / 2) + 'px';
        ripple.style.top = (y - size / 2) + 'px';

        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
    }

    const RIPPLE_SELECTOR = [
        '.btn',
        'button:not(.theme-btn):not(.sound-toggle)',
        '.bingo-cell',
        '.holiday-item',
        '.ornament'
    ].join(', ');

    function initRipple() {
        document.querySelectorAll(RIPPLE_SELECTOR).forEach(el => {
            if (el.dataset.rippleInit) return;
            el.dataset.rippleInit = '1';
            el.classList.add('ripple-host');
            el.addEventListener('click', addRipple);
        });
    }
    initRipple();
    const rippleObserver = new MutationObserver(() => initRipple());
    rippleObserver.observe(document.body, { childList: true, subtree: true });

})();
