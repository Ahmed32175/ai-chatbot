require('dotenv').config();

const express = require('express');
const app = express();
const dialogflow = require('@google-cloud/dialogflow');
const cors = require('cors');
app.use(cors());


const PROJECT_ID = process.env.PROJECT_ID;
const SESSION_ID= process.env.SESSION_ID;

console.log('Project ID:', PROJECT_ID);
console.log('Session ID:', SESSION_ID);


const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server,{
  cors:{
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', function(socket){
  console.log('a user connected');

socket.on('chat message', async (text) => {
  console.log(`Message ${text}`);


//new session client
const sessionClient = new dialogflow.SessionsClient();

//define path
const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, SESSION_ID);
console.log('Session Path:', sessionPath);
// Create the request object
const request = {
  session: sessionPath,
  queryInput: {
    text: {
      text: text,
      languageCode: 'en-US',
    },
  },
};

sessionClient.detectIntent(request)
  .then(responses => {
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);
    socket.emit('bot reply', result);
  })
.catch(err => {
  console.error('ERROR:', err);
  socket.emit('bot reply', 'Sorry, there was an error processing your request.');
});
});
});

