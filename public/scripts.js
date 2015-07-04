var socket = io();

$('form').submit(function() {
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg) {
  console.log('x');
  $('#messages').append($('<li>').text(msg));
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