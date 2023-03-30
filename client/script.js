// Importing basic images
import bot from './assets/bot.svg';
import user from './assets/user.svg';

// Targeting elements
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

// Loader Function 
/// Displays ... while the app is thinking/fetching the output
/// Arguments : element -> div or anything
/// Return : Nothing just shows an animation

let loadInterval;

function loader(element){
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if(element.textContent === '....'){
            element.textContent = '';
        }
    }, 300);    
}


// typeText Function
/// To generate the typing effect while showing output
/// Arguments : element -> div or anything , text -> returned by open AI
/// Return : Nothing just displays the output fetched from server

function typeText(element, text){
    let index = 0;

    let interval = setInterval(() => {
        if(index < text?.length){
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);

}

// generateUniqueId Function
/// For every message/output generated we need unique id
/// We are using combination of current date and random hexadecimal number
/// Return : id in string format with date and random hexadecimal numbers

function generateUniqueId(){

    const date = new Date().getFullYear();
    const hexadecimalString = Math.random().toString(16);

    return `id-${date}-${hexadecimalString}`;
}

// chatStripe Function
/// It will create different stripe shade pattern for AI response and User Response
/// Arguments : isAI -> true/false , text -> output we will get, uniqueId 
/// Returns : a div container with ouput in it

function chatStripe(isAI, text, uniqueId){
    return (
        `
            <div class="wrapper ${isAI && 'ai'}">
                <div class="chat">
                    <div class="profile">
                        <img src="${isAI ? bot : user}" alt="${isAI ? 'bot' : 'user'}" />
                    </div>
                    <div class="message" id=${uniqueId}>${text}</div>
                </div>
            </div>
        `
    );
}


// handleSubmit Function
/// trigger to get AI generated response

const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(form);

    // User Stripe
    chatContainer.innerHTML += chatStripe(false,  data.get('prompt'));

    form.reset();

    // AI Stripe
    const uid = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uid)

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageBox = document.getElementById(uid);

    loader(messageBox);

    // Make our call to api

    const response = await fetch("https://chatit-zisq.onrender.com", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({
            prompt: data.get('prompt')
        })
    });

    clearInterval(loadInterval);

    messageBox.innerHTML = '';

    if(response.ok){
        const data = await response.json();
        // console.log(data);

        const parsedData = data.bot?.choices[0].text.trim();

        // console.log({parsedData});

        typeText(messageBox, parsedData);
    } else {
        const err = response.text();

        messageBox.innerHTML = "Something went wrong";

        alert(err);
    }


}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        handleSubmit(e);
    }
});