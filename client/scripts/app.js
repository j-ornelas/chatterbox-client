var app = {
  init: function() {



    app.fetch()


  },

  send: function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
	url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
	type: 'POST',
	data: JSON.stringify(message),
	contentType: 'application/json',
	success: function (data) {
	  console.log('chatterbox: Message sent');
    },
    error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
  }
});
  },

  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: {},
      contentType: 'application/json',
      success: function (data) {
      	app.renderMessage(data)
      	console.log('chatterbox: Message recieved!');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to recieve message', data);
    }
});
  },
  
  clearMessages: function() {
    return true;
  },

  renderMessage: function(message) {
  	 // $('#chats').append('<div class="chat"><p>' + '<span class="username" data-username>' + _.escape(message.username) + '</span> : ' + _.escape(message.message) + ' ' + '<span class="roomname" data-roomname>' + _.escape(message.roomname) + '</span></p></div>');
    for (var i = 0; i < message.results.length; i++){
      $('#chats').append('<p>' + JSON.stringify(message.results[i].text) + '</p>')
    }
    console.log(message)
  }
}

$(document).ready(function(){
  app.init()

  $('#messageTextBox').on('click', function(){
  	$(this).attr('value', "")
  })

  $('.sendButton').on('click', function(){
	  var msg = $('#messageTextBox').val()
      console.log(msg)
  })

});






