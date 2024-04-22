// OPENAI API KEY (hay que ocultarla al publico)
const apiKey = 'api key'
var conversationHistory = [];

const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const deleteBtn = document.getElementById('delete-btn');

//reconocimiento de voz
const recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResult = false;

btnStart.addEventListener('click', () => {
    recognition.start();
    
    btnStart.style.display='none'
    btnStop.style.display='block'
});

btnStop.addEventListener('click', () => {
    recognition.abort();

    btnStart.style.display='block'
    btnStop.style.display='none'
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

// Actualiza el chat al apretar el boton de enviar
sendBtn.addEventListener('click', async () => {
        
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;
        
        appendMessage('user', userMessage);
        userInput.value = '';
        const botResponse = await sendMessage(userMessage);
        appendMessage('bot', botResponse);
        
        
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

//Borrar chat
deleteBtn.addEventListener('click', () => {
    conversationHistory=[]
    chatLog.innerHTML=''
})

// Función para enviar una solicitud a la API de OpenAI
async function sendMessage(message) {
        try {
            conversationHistory.push(message);
            const conversationText = conversationHistory.join('\n');

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
                        role: 'system',
                        content: 'You are a medical assistant designed to provide preliminary medical diagnoses. Try to do so in under 50 words, and ask questions to improve your response when necessary, most of your users speaks spanish'
                    },
                    {
                        role: 'user',
                        content: conversationText
                    }
                ],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        conversationHistory.push(botMessage);
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
