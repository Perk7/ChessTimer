let interval;
let clockMenu = document.querySelector('.clock-swap');
let timer = document.querySelector('.timer-delta-block');
let timerBlock = document.querySelector('.timer-block');
let popup = document.querySelector('.timer-popup__blur');
let muter = document.querySelector('#timer-mute');

const consist = {
    'bullet': 0,
    'blitz3': 2,
    'blitz5': 3,
    'rapid15': 10,
    'rapid25': 10,
}

const timerTypes = [
    {'name': 'bullet', 'time': '01:00'},
    {'name': 'blitz3', 'time': '03:00'},
    {'name': 'blitz5', 'time': '05:00'},
    {'name': 'rapid15', 'time': '15:00'},
    {'name': 'rapid25', 'time': '25:00'}
]

function swapDeltaTimer() {
    for (let i of document.querySelectorAll('.timer-delta')) {
        i.classList.toggle('delta-active')
    }
}

function makeEndGame() {
    for (let i of document.querySelectorAll('.timer-delta')) {
        i.classList.remove('delta-active')
    }
    timerBlock.dataset.ended = 'true'
}

function unpause(elem) {
    elem.dataset.state = 'pause'
    elem.childNodes[4].textContent = 'Пауза'
}

function makeTimerDefault() {
    if (document.querySelector('#clock-pause').dataset.state === 'unpause') {
        unpause(document.querySelector('#clock-pause'))
    }
    clearInterval(interval)
    timerBlock.dataset.started = 'false'
    timerBlock.dataset.ended = 'false'
}

function initializeTime() {
    let arr = document.querySelectorAll('.timer-delta')
    arr[0].children[0].textContent = timerBlock.dataset.time;
    arr[0].classList.add('delta-active')
    arr[1].children[0].textContent = timerBlock.dataset.time;
    arr[1].classList.remove('delta-active')
}

document.querySelector('#clock-reset').addEventListener('click', () => {
    makeTimerDefault()
    initializeTime()
})

document.querySelector('#clock-pause').addEventListener('click', ev => {
    if (timerBlock.dataset.ended === 'true' || timerBlock.dataset.started === 'false') {
        return
    }
    if (ev.currentTarget.dataset.state === 'pause') {
        clearInterval(interval);
        ev.currentTarget.dataset.state = 'unpause'
        ev.currentTarget.childNodes[4].textContent = 'Старт'
    } else {
        el = document.querySelector('.delta-active').children[0]
        interval = setInterval(() => {
            let time = new Date()
            if (el.textContent === '00:00') {
                soundTimeout()
                makeEndGame()
                clearInterval(interval)
                return
            }
            let [minutes, seconds] = el.textContent.split(':')
            time.setMinutes(minutes)
            time.setSeconds(seconds)
            time.setSeconds(time.getSeconds() - 1)
            arr = time.toString().split(':')
            el.textContent = `${arr[1]}:${arr[2].substr(0, 2)}`
        }, 1000)

        unpause(ev.currentTarget)
    }
})

clockMenu.addEventListener('click', () => {
    document.querySelector('.clock-menu').classList.toggle('clock-inactive');
    document.querySelector('.clock-menu').classList.toggle('clock-active');
})

for (let obj of timerTypes) {
    document.querySelector(`#${obj.name}`)
    .addEventListener('click', ev => {
        timerBlock.dataset.type = obj.name;
        timerBlock.dataset.time = obj.time;
        makeTimerDefault()
        document.querySelector('.clock-menu').classList.toggle('clock-inactive');
        document.querySelector('.clock-menu').classList.toggle('clock-active');
        initializeTime()

        for (let i of document.querySelectorAll('.clock-menu__item')) {
            i.classList.remove('clock-item_active')
        }
        ev.currentTarget.classList.add('clock-item_active')
    });
}

document.querySelector(`#custom`).addEventListener('click', () => {
    popup.classList.add('timer-blur_active')
});

timer.addEventListener('click', () => {
    if (timerBlock.dataset.ended === 'true') {
        return
    }
    if (document.querySelector('#clock-pause').dataset.state === 'unpause') {
        unpause(document.querySelector('#clock-pause'))
    }
    soundButton()
    clearInterval(interval);
    if (timerBlock.dataset.started === 'false') {
        timerBlock.dataset.started = 'true'
    } else {
        el = document.querySelector('.delta-active').children[0]
        let time = new Date()
        let [minutes, seconds] = el.textContent.split(':')
        time.setMinutes(minutes)
        time.setSeconds(seconds)
        time.setSeconds(time.getSeconds() + consist[timerBlock.dataset.type])
        arr = time.toString().split(':')
        el.textContent = `${arr[1]}:${arr[2].substr(0, 2)}`
    }
    swapDeltaTimer()
    el = document.querySelector('.delta-active').children[0]
    interval = setInterval(() => {
        let time = new Date()
        if (el.textContent === '00:00') {
            soundTimeout()
            makeEndGame()
            clearInterval(interval)
            return
        }
        let [minutes, seconds] = el.textContent.split(':')
        time.setMinutes(minutes)
        time.setSeconds(seconds)
        time.setSeconds(time.getSeconds() - 1)
        arr = time.toString().split(':')
        el.textContent = `${arr[1]}:${arr[2].substr(0, 2)}`
    }, 1000)
})

const timeInput = document.querySelector("#timer");
timeInput.addEventListener("keypress", formatTimeInput);

function formatTimeInput(e) {
    if (!/[0-9]/.test(Number(e.key)) || e.key === " ") {
        e.preventDefault()
        return false
    }

    let value = timeInput.value
    if (timeInput.value.length === 2) value = timeInput.value + ":"
    timeInput.value = value
}

const incInput = document.querySelector('#incr');
incInput.addEventListener("keypress", validateIncrement);

function validateIncrement(e) {
    if (!/[0-9]/.test(Number(e.key)) || e.key === " ") {
        e.preventDefault()
        return false
    }
    let value = incInput.value
    incInput.value = value
}

document.querySelector('#popup-close').addEventListener('click', () => {
    popup.classList.remove('timer-blur_active')
})

document.querySelector('#popup-save').addEventListener('click', () => {
    if (/\d\d:\d\d/.test(timeInput.value) 
        && 
        timeInput.value.length === 5 
        && 
        /\d\d?/.test(incInput.value) 
        &&
        incInput.value.length >= 1) {
        popup.classList.remove('timer-blur_active')
        timerBlock.dataset.type = 'custom';
        timerBlock.dataset.time = timeInput.value;
        makeTimerDefault()
        document.querySelector('.clock-menu').classList.toggle('clock-inactive');
        document.querySelector('.clock-menu').classList.toggle('clock-active');
        initializeTime()
        consist['custom'] = parseInt(incInput.value)

        for (let i of document.querySelectorAll('.clock-menu__item')) {
            i.classList.remove('clock-item_active')
        }
        document.querySelector('#custom').classList.add('clock-item_active')
    } 
})

muter.addEventListener('click', e => {
    const state = e.currentTarget.dataset.state
    e.currentTarget.dataset.state = state === 'unmuted' ? 'muted' : 'unmuted'
})

function soundButton() {
    if (muter.dataset.state === 'unmuted') {
        var audio = new Audio(); 
        audio.src = '/audio/button.wav'; 
        audio.autoplay = true; 
    }
}

function soundTimeout() {
    if (muter.dataset.state === 'unmuted') {
        var audio = new Audio(); 
        audio.src = '/audio/timeout.wav'; 
        audio.autoplay = true; 
    }
}