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
const tree = document.getElementById('tree');
const ornamentsData = [
    { top: '20%', left: '40%', text: '🎁', title: 'Подарок!', message: 'Саша, желаю тебе в новом году кучу крутых подарков и неожиданных приятностей!' },
    { top: '30%', left: '20%', text: '🌟', title: 'Успех', message: 'Пусть все сессии сдаются на отлично, а дедлайны не горят!' },
    { top: '35%', left: '60%', text: '💻', title: 'Код', message: 'Желаю, чтобы твой код компилировался с первого раза, а баги обходили стороной!' },
    { top: '50%', left: '30%', text: '🔥', title: 'Мотивация', message: 'Пусть в новом году у тебя будет много энергии на крутые проекты и интересные идеи!' },
    { top: '55%', left: '70%', text: '💪', title: 'Энергия', message: 'В новом году — на спорт! Или хотя бы на прогулку. Главное — двигайся!' },
    { top: '70%', left: '45%', text: '💰', title: 'Финансы', message: 'Желаю, чтобы стипендия приходила вовремя и не заканчивалась за неделю!' },
    { top: '80%', left: '15%', text: '🚀', title: 'Рост', message: 'Пусть новый год принесет тебе много новых возможностей и крутых знакомств!' }
];

ornamentsData.forEach((data) => {
    const orn = document.createElement('div');
    orn.classList.add('ornament');
    orn.style.top = data.top;
    orn.style.left = data.left;
    orn.innerText = data.text;
    orn.onclick = () => openModal(data.title, data.message);
    tree.appendChild(orn);
});

function openModal(title, text) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = text;
    document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) closeModal();
}

// --- 3. Скретч-карты ---
const scratchContainer = document.getElementById('scratch-container');
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
            canvas.classList.add('scratched');
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
const bingoGrid = document.getElementById('bingo-grid');
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
    cell.onclick = () => {
        bingoState[index] = !bingoState[index];
        cell.classList.toggle('active');
        checkBingo();
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
        if (pattern.every(i => bingoState[i])) {
            hasBingo = true;
            break;
        }
    }
    document.getElementById('bingo-result').innerText = hasBingo ? '🎉 БИНГО! Ты выполнил линию! Так держать!' : '';
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
    'Все дедлайны перенесут (но это не точно).', // <-- ИСПРАВЛЕНО: добавлена запятая
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
    document.getElementById('prediction-result').innerText = predictions[randomIndex];
}

// --- 6. Новогоднее Бинго ---
const holidayBingo = document.getElementById('holiday-bingo');
const holidayItems = [
    'Оливье через силу', 'Гулял по украшенному городу', 'Тост на 5 минут', "Услышал песню Jingle Bells",
    'Потерянный носок', 'Подарок не по размеру', 'Салат "Шуба"', "Нарядил ёлку до 31 декабря",
    'Проснуться в 15:00', 'Бой курантов', 'Увидел первый снег в этом году', "Забыл зарядить телефон"
];

holidayItems.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('holiday-item');
    div.innerText = item;
    div.onclick = () => {
        div.classList.toggle('active');
    };
    holidayBingo.appendChild(div);
});

// --- 7. Генератор идеального вечера ---
// ИСПРАВЛЕНО: Массивы теперь разделены правильно
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
    document.getElementById('evening-result').innerText = `Сегодня твой идеальный вечер: фильм ${movie}, напиток "${drink}", активность "${activity}".`;
}

// --- 8. Отправка формы через Formspree ---
const form = document.getElementById('replyForm');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Останавливаем стандартную перезагрузку страницы
    
    // --- ПРОВЕРКА НА ПУСТЫЕ ПОЛЯ ---
    const nameInput = document.getElementById('senderName');
    const messageInput = document.getElementById('replyMessage');
    
    // trim() удаляет лишние пробелы по краям. Если после этого строка пустая - выдаем ошибку
    if (nameInput.value.trim() === '' || messageInput.value.trim() === '') {
        alert('Пожалуйста, заполни Имя и Сообщение! Пустые поля отправить нельзя.');
        return; // Останавливаем выполнение скрипта
    }
    // -------------------------------

    const formData = new FormData(form);
    
    // Меняем текст кнопки, чтобы показать, что идет отправка
    const submitBtn = form.querySelector('button');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'ОТПРАВКА...';
    submitBtn.disabled = true;

    fetch('https://formspree.io/f/myeelzqp', { 
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Успешная отправка
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
    .catch(error => {
        alert("Ошибка сети. Проверь подключение к интернету.");
    })
    .finally(() => {
        // Возвращаем кнопку в исходное состояние
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    });
});
