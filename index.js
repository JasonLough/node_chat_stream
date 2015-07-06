var express = require('express');
var app = express();
var http = require('http').Server(app); //the server object
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public')); 

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.htm'); //sends a file when / is the path
});

app.get('/ex1', function(req, res) {
	res.sendFile(__dirname + '/ex1.htm'); //for experiments
});

var userIDdict = {}; //will hold {userName : userID}
var connected = 0; //number of connected users
var totalEverConnected = 0;

io.on('connection', function(socket) {
	
	totalEverConnected++;
	connected++;

	//mask the socket.id from public view, b/c idk wtf it may permit
	userName = generateUserID();
	userID = socket.id;

	userIDdict[userName] = userID; 

	//push the userName to the client that just connected
	io.sockets.connected[userID].emit('identity', userName);

	//tell everyone someone joined, and how many current connected is
	io.emit('join', {conn:connected, un:userName});	

	console.log('socket.id : ' + socket.id);

	socket.on('drip', function(letter) {//someone posted letter
		
		io.emit('drop', {content:letter, usr:userName}); 
		console.log('emitting a drop : %s', letter);
		console.log('socket.id : ' + socket.id);
	});

	socket.on('disconnect', function() {
		connected--;

		if(userIDdict['UserID']) {
			delete(userIDdict['UserID']); //removes this user from the userIDlist[]

		}

		io.emit('user left', userID);

		io.emit('update connected count', connected);

		console.warn('a user disco neck ted');
	});

	console.log('%s user connected', userName);
});

function generateUserID() {
	var id = ""; //aaa-aaa-aaa
	for(var x = 0; x < 9; x++) {
		if(x == 3 || x == 6) id += '-';
		id += String.fromCharCode(Math.floor(Math.random() * 26 + 97));
	}

	//console.log('generated id : %s', id);
	return id;
}

http.listen(3000, function() {
	console.log('listening on 3000')
});

