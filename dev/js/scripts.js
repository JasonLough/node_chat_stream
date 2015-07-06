var socket = io();

$( document ).ready( function() { 

  //////////////////following are local vars
  var myIdentity = '';
  var maxLenAggregate = 1250; //1250 chars can fit comfortably in #aggregate at default
  var maxLenMyText = 4;
  var maxLenUserText = 40;

  ////////////////following are socket events

  //set your identity
  socket.on('identity', function(msg){  // msg = { un : _ }
    myIdentity = msg.un;
    $('#myid span').html(msg.un);
  });


  //the server is pushing a letter to you (dropping a letter)
  socket.on('drop', function(msg) { // msg = { content : _ , usr : _ }
    //console.log(msg.usr);

    //keep (#aggregate span) length to below maxLenAggregate
    var aggLen = $('#aggregate span').length;

    if( aggLen > maxLenAggregate ) {
      $('#aggregate').find("span:nth-last-child(" + aggLen + ")").remove();
    }

    $('#aggregate').append("<span class='" + msg.usr + "'>" + msg.content + "</span>");

    if( $('#userlist ' + '.' + msg.usr).length === 0 ) {
      $('#connected span').html(msg.conn + 1);
      $('#userlist ul').append("<li class='" + msg.usr + "'>" + msg.usr + '</li>');
    }
  });
 

  //someone joins
  socket.on('join', function(msg) { // msg = { un : _ , conn : _ , totalconnections : _}
    //console.log('msg.connected:%s msg.userName:%s', msg.conn, msg.un);
    $('#connected span').html(msg.conn);
    $('#totalconnections span').html(msg.totalconnections);
    $('#userlist ul').append("<li class='" + msg.un + "'>" + msg.un + '</li>');
    $('#notification').html("<span class='joined'>" + msg.un + '</span>');
  });


  //someone leaves
  socket.on('leave', function(msg) { // msg = { un : _ , conn : _ }
    $('#notification').html("<span class='left'>" + msg.un + '</span>');
    $('#connected span').html(msg.conn);
    $('.' + msg.un).remove();
    //console.log('someone left');
  });


  //////////////////following are UI interactions///////

  //whenever the value of #userinput changes, emit that, and clear it
  $('#userinput').keyup(function(code) {
    var val = $('#userinput').val();
    
    socket.emit('drip', {un: myIdentity, letter:val}); 
    $('#userinput').val('');

    $('#mytext').append(val);

    var myTextLen = $('#mytext span').length;
    if( myTextLen > maxLenMyText ) {
      //var chop = aggLen - maxLenAggregate;
      $('#mytext').find("span:nth-last-child(" + myTextLen + ")").remove();
    }
    
  });


  //clicking on a user in the User List gets the ID element to search for in aggregate
  $('ul').on('click', 'li', function() {
    $('#usertext').html(''); //blank the usertext area

    var extractID = "." + $(this).text();
    //console.log(extractID);

    var text = $('#aggregate ' + extractID).text();
    //console.log(text);

    $('#usertext').html(text);
   
  });
  
	

});

