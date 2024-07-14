// /src/components/ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ChatComponent.css';

export function ChatComponent() {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [voices, setVoices] = useState([]);
  const chatLogRef = useRef(null);
  const userInputRef = useRef(null);
  const recognition = useRef(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    console.log('ChatComponent mounted');

    recognition.current = new webkitSpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.lang = 'es-ES';
    recognition.current.interimResults = false;

    recognition.current.onresult = (event) => {
      const texto = event.results[event.results.length - 1][0].transcript;
      setUserMessage(texto);
      leerTexto(texto);
    };

    window.speechSynthesis.onvoiceschanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
  }, []);

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    appendMessage('user', userMessage);
    setUserMessage('');

    const botResponse = await sendMessage(userMessage);
    appendMessage('bot', botResponse);
  };

  const handleDelete = () => {
    setConversationHistory([]);
    if (chatLogRef.current) {
      chatLogRef.current.innerHTML = '';
    }
  };

  const appendMessage = (role, message) => {
    setConversationHistory((prev) => [...prev, { role, message }]);
    const messageElement = document.createElement('div');
    messageElement.classList.add(role === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    if (chatLogRef.current) {
      chatLogRef.current.appendChild(messageElement);
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
    if (role === 'bot') {
      textToSpeak(message);
    }
  };

  const sendMessage = async (message) => {
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
              role: 'system',
              content: 'You are a medical assistant designed to provide preliminary medical diagnoses. Try to do so in under 50 words, and ask questions to improve your response when necessary, most of your users speak Spanish'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2
        })
      });

      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      return botMessage;
    } catch (error) {
      console.error('Error al enviar la solicitud a la API de OpenAI:', error);
      return 'Lo siento, no puedo responder en este momento.';
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

  const textToSpeak = (txt) => {
    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.voice = voices.find((voice) => voice.name === userInputRef.current.value);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceChange = (e) => {
    const selectedVoice = voices.find((voice) => voice.name === e.target.value);
    userInputRef.current.value = selectedVoice.name;
  };

  const handleStartRecognition = () => {
    recognition.current.start();
    setIsRecognizing(true);
  };

  const handleStopRecognition = () => {
    recognition.current.stop();
    setIsRecognizing(false);
  };

  return (
    <header>
      <h1>LUC-A</h1>
      <div id="chat-container">
        <div id="chat-log" ref={chatLogRef}></div>
        <input
          type="text"
          id="user-input"
          placeholder="Escribe tu mensaje..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={async (event) => {
            if (event.key === 'Enter') await handleSend();
          }}
        />
        <div id="btns">
          <button id="send-btn" className="btn" onClick={handleSend}>
            Enviar
          </button>
          <button id="delete-btn" className="btn" onClick={handleDelete}>
            Borrar
          </button>
          <button
            id="btnStart"
            className="btn"
            onClick={handleStartRecognition}
            style={{ display: isRecognizing ? 'none' : 'block' }}
          >
            Grabar
          </button>
          <button
            id="btnStop"
            className="btn"
            onClick={handleStopRecognition}
            style={{ display: isRecognizing ? 'block' : 'none' }}
          >
            Grabando...
          </button>
        </div>
        <form id="a">
          <select id="containerVoices" ref={userInputRef} onChange={handleVoiceChange}>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </form>
      </div>
    </header>
  );
}

export default ChatComponent;
