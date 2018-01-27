var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  roomList: {},
  init: function() {

    app.fetch();
  },

  send: function(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log(message);
        console.log(`chatterbox: Message ${JSON.stringify(data)} sent`);
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }});
  },

  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      data: {   
        order: '-createdAt'
        // where: 'roomname:' + room;        
      },
      contentType: 'application/json',
      success: function (data) {
        // app.renderMessage(data.results);
        console.log(data);
        for (var i = 0; i < data.results.length; i++) {
          app.renderMessage(data.results[i]);
        }
        console.log('chatterbox: Message recieved!');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to recieve message', data);
      }});
  },
  
  clearMessages: function() {
    $('#chats').children().remove();
  },

  renderMessage: function(message) {
    // $('#chats').append('<div class="chat"><p>' + '<span class="username" data-username>' + _.escape(message.username) + '</span> : ' + _.escape(message.message) + ' ' + '<span class="roomname" data-roomname>' + _.escape(message.roomname) + '</span></p></div>');
    
    // for (var i = 0; i < message.length; i++) {
    //   $('#chats').append('<div class="chat">' + JSON.stringify(message.results[i].text) + '</div>');
    // }
    $('#chats').append('<div class="chat">' + JSON.stringify(message.username) + " : " + JSON.stringify(message.text) + '</div>');
    
  },

  renderRoom: function(room) {
    if (app.roomList[room] === undefined) { 
      $('#roomSelect').append(`<option class="room">${room}</option>`);
      app.roomList[room] = true;
    }
  }
};

$(document).ready(function() {
  app.init();
  console.log(window.location.href);
  $('#messageTextBox').on('click', function() {
    $(this).attr('value', '');
  });

  $('.sendButton').on('click', function() {
    var msg = $('#messageTextBox').val();
    var messageToSend = {
      username: name,
      text: msg,
      roomname: 'none'
    };
    
    app.send(JSON.stringify(messageToSend)); 
    
  });
  
  $('#getMessages').on('click', function(){
    app.fetch();
  });

});






