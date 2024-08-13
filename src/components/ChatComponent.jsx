import React, { useState, useEffect, useRef } from 'react';
import "./ChatComponent.css";

const apiKey = import.meta.env.VITE_API_KEY;

const ChatComponent = () => {
    const [conversationHistory, setConversationHistory] = useState([]);
    const chatLog = useRef(null);
    const userInput = useRef(null);
    const btnStart = useRef(null);
    const btnStop = useRef(null);
    const deleteBtn = useRef(null);
    const containerVoices = useRef(null);
    const [fontSize, setFontSize] = useState(16);
    // Función para aumentar el tamaño de la fuente
    const increaseFontSize = () => {
        if (fontSize < 56) {
        setFontSize(prevFontSize => prevFontSize + 2);
        var chatLogElement = document.getElementById('chat-log');
        chatLogElement.style.fontSize = `${fontSize}px`;
    }

    };

  // Función para disminuir el tamaño de la fuente
    const decreaseFontSize = () => {
        if (fontSize > 8) {
        setFontSize(prevFontSize => prevFontSize - 2);
        var chatLogElement = document.getElementById('chat-log');
        chatLogElement.style.fontSize = `${fontSize}px`;
    }
    };

    // Recognition setup
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'es-ES';
    recognition.interimResults = false;

    useEffect(() => {
        if (btnStart.current && btnStop.current) {
            btnStart.current.addEventListener('click', handleStart);
            btnStop.current.addEventListener('click', handleStop);
        }

        recognition.onresult = (event) => {
            const texto = event.results[event.results.length - 1][0].transcript;
            if (userInput.current) {
                userInput.current.value = texto;
            }
            leerTexto(texto);
        };

        window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    }, []);

    const handleStart = () => {
        recognition.start();
        if (btnStart.current && btnStop.current) {
            btnStart.current.style.display = 'none';
            btnStop.current.style.display = 'block';
        }
    };

    const handleStop = () => {
        recognition.abort();
        if (btnStart.current && btnStop.current) {
            btnStart.current.style.display = 'block';
            btnStop.current.style.display = 'none';
        }
    };

    const leerTexto = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.volume = 1;
        speech.rate = 0.5;
        speech.pitch = 0.4;
        speech.lang = 'es-ES';
        window.speechSynthesis.speak(speech);
    };

    // Text to speech setup
    let voices = [];
    let utterance = new SpeechSynthesisUtterance();

    const updateVoices = () => {
        voices = window.speechSynthesis.getVoices();
        if (containerVoices.current) {
            containerVoices.current.innerHTML = '';
            voices.forEach((el) => {
                const option = document.createElement('option');
                option.value = el.name;
                option.textContent = `${el.name} (${el.lang})`;
                containerVoices.current.appendChild(option);
            });
        }
    };

    const textToSpeak = (txt) => {
        utterance.text = txt;
        window.speechSynthesis.speak(utterance);
    };

    const handleVoiceChange = (e) => {
        if (e.target === containerVoices.current) {
            utterance.voice = voices.find((voice) => voice.name === e.target.value);
        }
    };

    const handleSend = async () => {
        if (userInput.current) {
            const userMessage = userInput.current.value.trim();
            if (userMessage === '') return;

            appendMessage('user', userMessage);
            userInput.current.value = '';
            const botResponse = await sendMessage(userMessage);
            appendMessage('bot', botResponse);
        }
    };

    const handleKeyPress = async (event) => {
        if (event.key !== 'Enter') return;
        handleSend();
    };

    const handleDelete = () => {
        setConversationHistory([]);
        if (chatLog.current) {
            chatLog.current.innerHTML = '';
        }
    };

    const sendMessage = async (message) => {
      try {
          // Actualizar el historial de conversación localmente
          const updatedConversationHistory = [...conversationHistory, message];
          
          // Unir el historial actualizado en un solo texto
          const conversationText = updatedConversationHistory.join('\n');
  
          // Enviar la solicitud a la API de OpenAI
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
                          content: 'You are a medical assistant designed to provide preliminary medical diagnoses. Try to do so in under 50 words, and ask questions to improve your response when necessary, Do not recommend medications and treatments, most of your users speak Spanish'
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
  
          // Actualizar el historial de conversación en el estado
          setConversationHistory(prev => [...prev, message, botMessage]);
          
          return botMessage;
      } catch (error) {
          console.error('Error al enviar la solicitud a la API de OpenAI:', error);
          return 'Lo siento, no puedo responder en este momento.';
      }
  };
    

    const appendMessage = (role, message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add(role === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        if (chatLog.current) {
            chatLog.current.appendChild(messageElement);
            if (role === 'bot') {
                textToSpeak(message);
            }
            chatLog.current.scrollTop = chatLog.current.scrollHeight;
        }
    };
    

    return (
        <header>
            <div className='div-contenedor'>
                <fieldset id="chat-container">
                    <legend>LUC-A</legend>
                    <div id="chat-log" ref={chatLog}></div>
                    <div id="user-input-container">
                        <input type="text" id="user-input" placeholder="Escribe tu mensaje..." ref={userInput} onKeyPress={handleKeyPress} autocomplete="off" />
                        <div id="btns">
                            <button id="send-btn" className="btn" onClick={handleSend}>Enviar</button>
                            <button id="delete-btn" className="btn" onClick={handleDelete}>Borrar</button>
                            <button id="btnStart" className="btn" ref={btnStart}>Grabar</button>
                            <button id="btnStop" className="btn" ref={btnStop} style={{ display: 'none' }}>Grabando...</button>
                        </div>
                        <form id="a">
                            <select id="containerVoices" ref={containerVoices} onChange={handleVoiceChange}></select>
                        </form>
                    </div>
                </fieldset>
            </div>
             <div className="font-changer">
                <button className="btn" onClick={increaseFontSize}>Aumentar</button>
                <span className="font-size-label">Tamaño de fuente: <span className="font-size-value">{fontSize}</span>px</span>
                <button className="btn decremento" onClick={decreaseFontSize}>Disminuir</button>
            </div>
      
            
        </header>
    );
};

export default ChatComponent;