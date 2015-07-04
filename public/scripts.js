var socket = io();

//whenever the value of #userinput changes, emit that, and clear it
$('#userinput').keypress(function(code) {
	console.log('%s', String.fromCharCode(code.charCode));
	socket.emit('drip', $('#userinput').val());
	$('#userinput').val('');
});



socket.on('drip', function(drop) {
  console.log('drip detected');
  $('#aggregate').append(drop);
});

socket.on('update connected count', function(msg) {
  $('#connectedCount').html(msg);
});

socket.on('user joined', function(msg) {
  $('#logger').html(msg).fadeOut(2500);
});

socket.on('user left', function(msg) {
  $('#logger').html(msg).fadeOut(2500, function(){

  });
});