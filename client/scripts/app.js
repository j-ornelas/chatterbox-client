var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  roomList: {},
  friends: {},
  init: function() {
    app.fetch();
  },

  send: function(message, room) {
    
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
        console.log(message);
        console.log(`chatterbox: Message ${JSON.stringify(data)} sent`);
        app.fetch(room);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }});
  },

  fetch: function(room) {
    app.clearMessages();
    var ourData = {};
    if (!room) {
      ourData = {   
        order: '-createdAt'
      };
    } else {
      ourData = {   
        order: '-createdAt',
        where: '{"roomname": "' + room + '"}'
      };  
    }
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      data: ourData,
      // add data without the where
      contentType: 'application/json',
      success: function (data) {
        // app.renderMessage(data.results);
        console.log(data);
        for (var i = 0; i < data.results.length; i++) {
          app.renderMessage(data.results[i]);
          let curRoom = data.results[i].roomname;
          
          if (!app.roomList[curRoom]) {
            app.renderRoom(curRoom);
          }
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

    $('#chats').append('<div class="chat"><div class="addFriend" href="#">' + _.escape(JSON.stringify(message.username)) + "</div> : " + _.escape(JSON.stringify(message.text)) + '</div>');
    $('.addFriend').on('click', function() {
      var currentUserName = $(this).text();
        if (!app.friends[currentUserName]) {
          app.friends[currentUserName] = true;
          $(this).removeClass('addFriend').addClass('friend');
          $('#friendSelect').append(`<option class="friend">${currentUserName}</option>`);
        }
    });
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
    var currentUser = window.location.search.slice(10);
    //check if there is a current user name
    // if (!currentUser) {
    //   currentUser = 'anonymous';
    // }
    var currentRoom = $('#roomSelect').val();
    //check if there is a current room
    if (!currentRoom) {
      currentRoom = 'none';
    }
    var messageToSend = {
      username: currentUser,
      text: msg,
      roomname: currentRoom
    };
    
    app.send(JSON.stringify(messageToSend), currentRoom); 
    
  });
  
  $('#getMessages').on('click', function() {
    app.fetch();
  });
  
  $('#loadRoom').on('click', function() {
    var currentRoom = $('#roomSelect').val();
    app.fetch(currentRoom);
  });



});






