var express = require('express');
var app = express();
var http = require('http').Server(app); //the server object
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	
	res.sendFile(__dirname + '/index.htm'); //sends a file
});

app.use(express.static(__dirname + '/public')); 


var userIDlist = [];
var connected = 0;
var thisUserID = "";

io.on('connection', function(socket) {
	console.warn('a user connected');
	
	connected++;
	thisUserID = generateUserID();
	userIDlist.push(thisUserID);

	io.emit('update connected count', connected);
	io.emit('user joined', thisUserID);

	socket.on('disconnect', function() {
		connected--;

		userIDlist.splice(userIDlist.indexOf(thisUserID), 1); //removes this user from the userIDlist[]

		io.emit('update connected count', connected);
		io.emit('user left', thisUserID);

		console.warn('a user disco neck ted');
	});

	socket.on('chat message', function(msg) { //no msg! lol
		console.log('chat_message : %s', msg );
		io.emit('chat message', msg);

	});

});

function generateUserID() {
	var id = ""; //aaa-aaa-aaa
	for(var x = 0; x < 9; x++) {
		if(x == 3 || x == 6) id += '-';
		id += String.fromCharCode(Math.floor(Math.random() * 26 + 97));
	}

	//console.log(id);
	return id;
}

http.listen(3000, function() {
	console.log('listening on 3000')
});

