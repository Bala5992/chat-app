var express=require('express');
var http=require('http');
var path = require('path');
var socketio=require('socket.io');

let app=express();
var port = normalizePort(process.env.PORT || '4000');

app.set('port',port);

var server=http.createServer(app);

app.use(express.static(path.join(__dirname, '../dist/chat-app')));

var io=socketio(server);

const rooms={};
let users=[];

io.on('connection', (socket) =>{
    console.log('New connection....');

    socket.on('join', (data) =>{
        console.log('User has joined');

        let isAvailable = alteruser(true,data);

        if (isAvailable) {
            users.push(data.user);
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('user join',{user:data.user,message:' has joined this room',rooms:users});
        } else {
            socket.emit('user not available',{error:true,rooms:rooms});
        }
    });

    socket.on('leave', (data) =>{
        console.log('User has left');
        alteruser(false,data);
        users=users.filter(usr => usr!=data.user);
        socket.broadcast.to(data.room).emit('user left',{user:data.user,message:' has left this room',rooms:users});
        socket.leave(data.room);
    });

    socket.on('message', (data)=>{
        console.log('User sent message');
        var roster = socket.adapter.rooms[data.room];
        console.log(Object.keys(io.sockets.sockets));
        io.in(data.room).emit('pass message',{user:data.user,message:':'+data.message,rooms:users});
    });
});

function alteruser(add,data) {
    let valid=false;
    let users=rooms[data.room]?rooms[data.room]:{};
        
    if (users[data.user] && !add) {
        valid=false;
        users[data.user]=false;
    } else if (!users[data.user] && add) {
        valid=true;
        users[data.user]=true;
    }
    rooms[data.room]=users;

    return valid;
}

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

server.listen(port, () => {
	console.log(`Application started at port : ${port}`);
});