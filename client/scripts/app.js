
// placing in app object
var app = {

  // Initial Variables
  server: 'https://api.parse.com/1/classes/chatterbox',
  username: 'anonymous',
  roomname: 'lobby',

  init: function() {
    app.username = window.location.search.substr(10);
    app.getMessages();
    // Event Handlers
    $('.getMessages').on('click', function() {
      app.getMessages();
    });
    $('.postMessage').on('click', function() {
      app.postMessage();
    });
    $('#roomSelect').on('change', function() {
      app.getRoom();
    });
  },

  getMessages: function() {
    $.ajax({
      url: app.server,
      type: GET,
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function(data) {
        app.displayMessages(data);
      },
      error: function(data) {
        console.log('chatterbox: Failed to get messages');
      }
    });
  },

  displayMessages: function(data) {
    app.clearMessages();
    _.each(data.results, function(item, index) {
      var $message = $('<li></li>').addClass('message');
      var $user = $('<div></div>').addClass('user').text(item['username']);
      var $text = $('<div></div>').addClass('text').text(item['text']);
      $message.append($user).append($text);
      $('#chats').append($message);
    })
  },

  clearMessages: function() {
    $('.message').remove();
  },

  postMessage: function() {

    var message = {
      username: app.username,
      text: $('[name=newMessage').val()
    }

    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        app.getMessages();
        $('[name=newMessage').val('');
      },
      error: function(data) {
        console.error('chatterbox: Failed to post message');
      }
    });
  }


};
