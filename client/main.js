import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import { SERVER_API } from "./utils/constant";

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
            ++index;
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

    if (data.get('prompt').trim().length < 3) return;

    //user chat Stripe
    const qUniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(false, " ", qUniqueId);
    const questDiv = document.getElementById(qUniqueId);
    questDiv.innerHTML = data.get('prompt');

    form.reset();

    //bot chat stripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;
    const msgDiv = document.getElementById(uniqueId);
    loader(msgDiv);

    const response = await fetch(SERVER_API, {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });

    clearInterval(loadInterval);
    msgDiv.innerHTML = " ";

    if(response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        typeText(msgDiv, parsedData);
    } else {
        const errorMsg = await response.text();
        console.error(errorMsg);
        typeText(msgDiv, "Something went wrong! 🙁 \nkindly contact `anand` by clicking link given in the topmost right corner!");
    }
}

form.addEventListener("submit", handleFormSubmit);
form.addEventListener("keyup", (e) => {
    if(e.keyCode === 13) {
        handleFormSubmit(e);
    }
});