var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  roomList: {'Your main lobby': true},
  friends: {},
  init: function() {
    app.fetch();
    app.handleSubmit();
      
  },

  send: function(message, room) {
    
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: message,
      contentType: 'application/json',
      success: function (data) {
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
    if (!room || room === 'Your main lobby') {
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
        for (var i = 0; i < data.results.length; i++) {
          let isFriend = false;
          if (app.friends[data.results[i].username]) {
            isFriend = true;
          }
          app.renderMessage(data.results[i], isFriend);
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

  renderMessage: function(message, isFriend) {
    // let context = this;

    if (isFriend) { 
      $('#chats').append('<div class="chat username"><div class="friend" href="#">@' + _.escape(message.username) + '</div> ' + _.escape(message.text) + '</div>');
    } else {
      $('#chats').append('<div class="chat username"><div class="addFriend" href="#">@' + _.escape(message.username) + '</div>  ' + _.escape(message.text) + '</div>');
    }
    
    app.handleUsernameClick();
    // $('.addFriend').on('click', function() {
    //   var currentUserName = $(this).text();
    //     if (!app.friends[currentUserName]) {
    //       app.friends[currentUserName] = true;
    //       $(this).removeClass('addFriend').addClass('friend');
    //       $('#friendSelect').append(`<option class="friend">${currentUserName}</option>`);
    //       // app.fetch($('#roomSelect').val());
    //     }
    // });
  },
  
  handleUsernameClick: function() {
    $('.addFriend').on('click', function() {
    
      var currentUserName = $(this).text().substr(1);
        if (!app.friends[currentUserName]) {
          app.friends[currentUserName] = true;
          $(this).removeClass('addFriend').addClass('friend');
          $('#friendSelect').append(`<option class="friend">${currentUserName}</option>`);
          app.fetch($('#roomSelect').val());
        }
    });
  },

  renderRoom: function(room) {
    if (!app.roomList[room] && room !== '') { 
      $('#roomSelect').append(`<option class="room">${room}</option>`);
      app.roomList[room] = true;
    }
  },

  handleSubmit: function() {
    $('#send').submit(function(e) {
      e.preventDefault();
      var msg = $('#message').val();
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
      app.fetch(currentRoom);
      $('#message').val('');
    });
  }
};

$(document).ready(function() {
  app.init();
  console.log(window.location.href);
  // $('.sendButton').on('submit', function() {
  //   var msg = $('#messageTextBox').val();
  //   var currentUser = window.location.search.slice(10);
  //   //check if there is a current user name
  //   // if (!currentUser) {
  //   //   currentUser = 'anonymous';
  //   // }
  //   var currentRoom = $('#roomSelect').val();
  //   //check if there is a current room
  //   if (!currentRoom) {
  //     currentRoom = 'none';
  //   }
  //   var messageToSend = {
  //     username: currentUser,
  //     text: msg,
  //     roomname: currentRoom
  //   };
    
  //   app.send(JSON.stringify(messageToSend), currentRoom); 
  //   app.fetch(currentRoom);
  // });
  
  $('#getMessages').on('click', function() {
    app.fetch();
  });
  
  $('#loadRoom').on('click', function() {
    var currentRoom = $('#roomSelect').val();
    app.fetch(currentRoom);
  });
  
  $('#roomForm').submit(function(event) {
    event.preventDefault();
    app.renderRoom($('#createRoom').val());
    $('#createRoom').val('');
  });


  // $('#messageTextBox').keypress(function(event) {
  //   if (event.keyCode === 13) {
  //     var msg = $('#messageTextBox').val();
  //     var currentUser = window.location.search.slice(10);
  //     //check if there is a current user name
  //     // if (!currentUser) {
  //     //   currentUser = 'anonymous';
  //     // }
  //     var currentRoom = $('#roomSelect').val();
  //     //check if there is a current room
  //     if (currentRoom === 'Your main lobby' || !currentRoom) {
  //       currentRoom = 'none';
  //     }
  //     var messageToSend = {
  //       username: currentUser,
  //       text: msg,
  //       roomname: currentRoom
  //     };
      
  //     app.send(JSON.stringify(messageToSend), currentRoom); 
  //     app.fetch(currentRoom);
  //     $(this).val('');
  //   }
  // });



});






