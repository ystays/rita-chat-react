const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path')

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 4000;

//app.use(express.static(path.join(__dirname, "src")));

app.use(cors()); // Add cors middleware

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST'],
  },
});

// ******************************************
// ******************************************

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  // Add a user to a room
  socket.on('join_room', (data) => {
    const { username, room } = data;
    socket.join(room);
  });

  socket.on('token', (msg) => {
    
  });

  socket.on('rtc_offer', (rtc_offer) => {
    // console.log("RTC_Offer " + JSON.stringify(rtc_offer));
    socket.broadcast.emit('rtc_offer', rtc_offer);
    console.log("offer emitted")
  });

  socket.on('rtc_answer', (rtc_answer) => {
    // console.log("RTC_Answer " + JSON.stringify(rtc_answer));
    socket.broadcast.emit('rtc_answer', rtc_answer);
    console.log("answer emitted");
  });

  socket.on('new_ice_candidate', (evt) => {
    socket.broadcast.emit('new_ice_candidate', evt);
    console.log("new candidate emitted", evt);
  });


  socket.on('rtc_message', (rtc_message) => {
    socket.broadcast.emit('rtc_message', rtc_message);
    console.log(rtc_message);
  });

  socket.on('close', () => {
    // sendToAll(users, "leave", socket)
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

})

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// app.use('/', express.static(path.join(__dirname, '')));

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


server.listen(port, () => console.log(`Server is running on port ${port}`));