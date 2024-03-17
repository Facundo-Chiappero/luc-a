// OPENAI API KEY (hay que ocultarla al publico)
const apiKey = 'API KEY AQUI'

const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

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