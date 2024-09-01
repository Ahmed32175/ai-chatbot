import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

const SpeechRecognitionComponent = () => {

const[recognition, setRecognition] = useState('');
const [text, setText] = useState('');
const [replyText, setReplyText] = useState('');

useEffect(() => {

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionInstance = new SpeechRecognition();
const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling', 'flashsocket']
});

recognitionInstance.lang = 'en-US';
recognitionInstance.interimResults = false;

setRecognition(recognitionInstance);

recognitionInstance.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let saidText = e.results[last][0].transcript;
    console.log(saidText);
    console.log('Confidence: ' + e.results[0][0].confidence);
    setText(saidText);
    socket.emit('chat message', saidText);

  });

  function handleReply(reply) {
    setReplyText(reply);
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = reply;
    synth.speak(utterance);
  }
  
  socket.on('bot reply', handleReply);
  
}, []);

function startChat() {
  if(recognition){
    recognition.start();
  }
  
}

  return (
    <div>
      <button onClick={startChat}>Chat</button>
      <p class = 'chat'>You: {text}</p>
      <p class = 'chat'>ChatterBot: {replyText}</p>
    </div>
  );
};

export default SpeechRecognitionComponent;

