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
	io.sockets.connected[userID].emit('identity', 
		{
			'un': userName, 
		}
	);

	//push the current list of users to the newly joined user


	//tell everyone someone joined, and how many current connected is
	io.emit('join', {un:userName, conn:connected, totalconnections: totalEverConnected});	

	//console.log('socket.id : ' + socket.id);

	//someone is pushing a letter to the server
	socket.on('drip', function(msg) { // msg = { un : _ , letter : _ }
		//console.log('userIDdict[userName]:%s socket.id:%s', userIDdict[userName], socket.id)
		if( ( 1 ) &&
			( msg.letter[0] != undefined) &&
			( userIDdict[msg.un] === socket.id ) ) {
				console.log('emitting a drop from %s : %s', msg.un, msg.letter[0]);
				io.emit('drop', {content : msg.letter[0], usr : msg.un}); 
		} else {
			console.log('FAILED validation check. un : %s val : "%s" UID : %s SID : %s',
				msg.un, msg.letter, userIDdict[msg.un], socket.id );
		}		
	});

	socket.on('disconnect', function() {
		connected--;

		if(userIDdict[userID]) {
			delete(userIDdict[userID]); //removes this user from the userIDlist[]
		}

		io.emit('leave', {un:userName, conn:connected});	
		console.warn('%s has disco neck ted', userName);
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

