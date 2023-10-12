const express = require('express');
const app = express();
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');


const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {

  console.log('user:'+socket.id+' connected');
  
  socket.on('disconnect', () => {
    console.log('user:'+socket.id+' disconnected');
  });
  
  
  socket.on('chat message', (msg) => {
    //socket.broadcast.to(msg.roomNumber).emit('chat message', msg.msg);
    io.to(msg.roomNumber).emit('chat message', msg.msg);
    console.log('message: ' + msg);
  });
  
  //畫畫
  socket.on('turn_to_draw', (data) => {
    io.to(data.roomNumber).emit('turn_to_draw', data);
    console.log(socket.id+"/"+ data.whoWantToDraw +" now is drawing");
  });
  
  socket.on('drawing', (data, roomNumber) => socket.broadcast.to(roomNumber).emit('drawing', data, roomNumber));
  
  //房間
  socket.on('join_room', function (room) {
    socket.join(room);
    console.log('user: ' + socket.id + ' join the room: ' + room);
  });
  
  socket.on('leave_room', function (room) {
    socket.leave(room);
    console.log('user: ' + socket.id + ' leave the room: ' + room);
  });

});

// now, it's easy to send a message to just the clients in a given room
//room = "abc123";
//io.sockets.in(room).emit('message', 'what is going on, party people?');

// this message will NOT go to the client defined above
//io.sockets.in('foobar').emit('message', 'anyone in this room yet?');


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});