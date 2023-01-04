import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
let chatContainer = document.querySelector("#chat_container");
let form = document.querySelector('form');

let loadInterval;
function loader(element) {
    element.textContent = "";
    loadInterval = setInterval(() => {
        element.textContent += ".";
        if(element.textContent === "....") {
            element.textContent = "";
        }
    }, 300)
}


function typeText(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if(index < text.length) {
            element.innerHTML += text.charAt(index);
        } else {
            clearInterval(interval);
        }
    }, 20);
}

function generateUniqueId() {
    let currentTimeStamp  = Date.now();
    let randomNum = Math.random();
    let hexadecimalStr = randomNum.toString(18);
    return `id-${currentTimeStamp}-${hexadecimalStr}`;
}

function chatStripe(isAi, msg, uniqueId) {
    return(`
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img
                        src="${isAi ? bot: user}"
                        alt="${isAi ? 'bot': 'user'}"
                    />
                </div>
                <div class="message"
                    id="${uniqueId}">
                    ${msg}
                </div>
            </div>
        </div>
    `);
}

const handleFormSubmit = async(e) =>  {
    e.preventDefault();
    const data = new FormData(form);
    //user chat Stripe
    const qUniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'), qUniqueId);

    form.reset();

    //bot chat stripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;
    const msgDiv = document.getElementById(uniqueId);
    loader(msgDiv);
}

form.addEventListener("submit", handleFormSubmit);
form.addEventListener("keyup", (e) => {
    if(e.keyCode === 13) {
        handleFormSubmit(e);
    }
});