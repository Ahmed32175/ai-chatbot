import React, {useEffect} from 'react';
import io from 'socket.io-client';

const SpeechRecognitionComponent = () => {

useEffect(() => {

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling', 'flashsocket']
});

recognition.lang = 'en-US';
recognition.interimResults = false;

const butt = document.querySelector('button');
butt.addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.log(text);
    console.log('Confidence: ' + e.results[0][0].confidence);
    socket.emit('chat message', text);

  });

  function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
  }
  
  socket.on('bot reply', function(replyText) {
    synthVoice(replyText);
  });
}, []);
  return (
    <div>
      <button>Chat</button>
    </div>
  );
};

export default SpeechRecognitionComponent;

