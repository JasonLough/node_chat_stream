var socket = io();

$( document ).ready( function() { 

  //////////////////following are local vars
  var myIdentity = '';


  ////////////////following are socket events

  socket.on('identity', function(msg){
    myIdentity = msg;
    $('#myid span').html(msg);
    console.log('you');

  });


  socket.on('drop', function(msg) {
    //add to allChars{}, then call fn to display allChars in #aggregate
    console.log(msg.usr);
    $('#aggregate').append("<span class='" + msg.usr + "'>" + msg.content + "</span>");

  });
 

  socket.on('join', function(msg) {
    console.log('msg.connected:%s msg.userName:%s', msg.conn, msg.un);
    $('#connected span').html(msg.conn);
    $('#userlist ul').append('<li>' + msg.un + '</li>');
    $('#notification').html("<span class='joined'>" + msg.un + '</span>').fadeTo(2500, 0.0);
  });

  socket.on('user left', function(msg) {
    $('#notification').html("<span class='left'>" + msg + '</span>').fadeTo(2500, 0.0);
  });


  //////////////////following are UI interactions///////

  //whenever the value of #userinput changes, emit that, and clear it
  $('#userinput').keyup(function(code) {
    var val = $('#userinput').val();
    //console.log('%s', String.fromCharCode(code.charCode));
    socket.emit('drip', val); 
    $('#userinput').val('');
    $('#mytext').append(val);
  });


  //clicking on an item in user list gets the ID element to search for in aggregate
  $('ul').on('click', 'li', function() {
    $('#usertext').html(''); //blank the usertext area

    var extractID = "." + $(this).text();
    //console.log(extractID);

    var text = $(extractID).text();
    //console.log(text);

    $('#usertext').html(text);
   
  });
  
	

});

