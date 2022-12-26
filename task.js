const chatWidget = document.querySelector(".chat-widget");
const chatWidgetInput = document.getElementById("chat-widget__input");
const chatWidgetMessages = document.getElementById("chat-widget__messages");

let botMesageList = ["M1", "M2", "M3", "M4", "M5"];
let botProstoiMessage = "Вопрос?";
let timeRepit = 2_000; //Как часто бот пишет сообщения о время простоя (мс)

//Расчет времени сообщения:
function getTimeMesage() {
    let timeMesage = "";
    //Расчет времени сообщения Час:
    if (new Date().getHours() < 10) {
        timeMesage = "0" + new Date().getHours() + ":";
    } else {timeMesage = new Date().getHours() + ":";}
    //Расчет времени сообщения Минута:
    if (new Date().getMinutes() < 10) {
        timeMesage = timeMesage + "0" + new Date().getMinutes();
    } else {timeMesage = timeMesage + new Date().getMinutes();}
    return timeMesage;
}

//Сообщение Пользвателя:
function userMessage(text) {
    chatWidgetMessages.innerHTML += `
        <div class="message message_client">
        <div class="message__time">${getTimeMesage()}</div>
        <div class="message__text">${text}</div>
        </div>
    `;
    //Прокрутка к сообщению:
    scrolDown(chatWidgetMessages.parentElement);
}

//Сообщение бота:
function botMessage(quest = false) {
    let text = "";
    let min = Math.ceil(0);
    let max = Math.floor(botMesageList.length);
    let numMes = Math.floor(Math.random() * (max - min)) + min;
    if (quest) {text = botProstoiMessage} else {text = botMesageList[numMes]}
    chatWidgetMessages.innerHTML += `
        <div class="message">
            <div class="message__time">${getTimeMesage()}</div>
            <div class="message__text">${text}</div>
        </div>
    `;
    //Прокрутка к сообщению:
    scrolDown(chatWidgetMessages.parentElement);
}

//Перезапуск таймера сообщения простоя:
function mesProstReset () {
    clearTimeout(messageProstoi);
    messageProstoi = setInterval(function() {botMessage(true)}, timeRepit);
}

//Прокрутка к сообщению:
function scrolDown(elem) {
    //Почему значение "Infinity" не прокручивает чат в самый низ? Хотя согласно статье https://learn.javascript.ru/size-and-scroll должно...
    //chatWidgetMessages.parentElement.scrollTop = Infinity;
    elem.scrollTop = elem.scrollHeight;
}

let messageProstoi = setInterval(function() {}, timeRepit);

//Открытие окна чата:
chatWidget.onclick = function(event) {
    if (chatWidget.className != "chat-widget chat-widget_active") {
        chatWidget.className = "chat-widget chat-widget_active";
        //Отправление сообщения ботом, если окно чата открыто и простаивает 30 сек:
        mesProstReset();
    }
}

//Ивент при отжатии кнопки:
document.addEventListener('keyup', function(event) {
    //Если была отжата кнопка Enter:
    if (String(event.key).toLowerCase() == "enter") {
        //Если сообщение пользователя не пустое:
        if (chatWidgetInput.value > "") {
            //Сообщение пользователя:
            userMessage(chatWidgetInput.value);

            //Обнуление окна ввода:
            chatWidgetInput.value = "";

            //Сообщение бота:
            botMessage();

            //Перезапуск таймера на сообщение бота при простое:
            mesProstReset();
        }
    }
})