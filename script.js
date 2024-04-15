const axios = require('axios');
// OPENAI API KEY (hay que ocultarla al publico)
const apiKey = 'API KEY'

const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');

//reconocimiento de voz
const recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResult = false;

btnStart.addEventListener('click', () => {
    recognition.start();
    
    btnStart.style.display="none"
    btnStop.style.display="block"
});

btnStop.addEventListener('click', () => {
    recognition.abort();

    btnStart.style.display="block"
    btnStop.style.display="none"
});

recognition.onresult = (event) => {
    const texto = event.results[event.results.length - 1][0].transcript;
    userInput.value = texto;
    leerTexto(texto);
}

function leerTexto(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.volume = 1;
    speech.rate = 0.5;
    speech.pitch = 0.4;
    speech.lang = 'es-ES'

    window.speechSynthesis.speak(speech);
}
//

let contextoPrevio = [];


// Actualiza el chat al apretar el boton de enviar
sendBtn.addEventListener('click', async () => {
        
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;
        
        const textoCompleto = contextoPrevio.join('/n') + '/n' + userMessage;
        
        const respuesta = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: "text-davinci-002",
                prompt: textoCompleto,
                max_tokens: 100
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        contextoPrevio.push(respuesta.data.choices[0].text.trim());

        appendMessage('user', userMessage);
        userInput.value = '';
        //const botResponse = await sendMessage(userMessage);
        appendMessage('bot', respuesta.data.choices[0].text.trim());
        
        
});

// Actualiza el chat al apretar enter
userInput.addEventListener('keypress', async (event) => {
        if (event.key !== 'Enter') return
        
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;
        
        appendMessage('user', userMessage);
        userInput.value = '';
        const botResponse = await sendMessage(userMessage);
        appendMessage('bot', botResponse);
});

// Función para enviar una solicitud a la API de OpenAI
async function sendMessage(message) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });
        
        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        return botMessage;
    } catch (error) {
        console.error('Error al enviar la solicitud a la API de OpenAI:', error);
        return 'Lo siento, no puedo responder en este momento.';
    }
}

//Pone el mensaje en la pantalla
function appendMessage(role, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(role === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    
    chatLog.scrollTop = chatLog.scrollHeight;
}
