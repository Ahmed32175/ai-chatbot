import './style.css';
import React from 'react';
import SpeechRecognitionComponent from './components/speechRecognition';
function App() {
  return (
    <div className="App">
      <h1>ChatterBot</h1>
        <SpeechRecognitionComponent/>
    </div>
  );
}

export default App;
