var express = require('express');
var app = express();
var http = require('http').Server(app); //the server object
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	
	res.sendFile(__dirname + '/index.htm'); //sends a file
});

app.use(express.static(__dirname + '/public')); 

var connected = 0;

io.on('connection', function(socket) {
	console.warn('a user connected');
	
	connected++;
	io.emit('update connected count', connected);
	io.emit('user joined', 'user joined');

	socket.on('disconnect', function() {
		connected--;
		io.emit('update connected count', connected);
		io.emit('user left', 'user left');

		console.warn('a user disco neck ted');
	});

	socket.on('chat message', function(msg) { //no msg! lol
		console.log('chat_message : %s', msg );
		io.emit('chat message', msg);

	});

});

http.listen(3000, function() {
	console.log('listening on 3000')
});

