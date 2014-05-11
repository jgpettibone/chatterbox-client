
// placing in app object
var app = {

  server: 'https://api.parse.com/1/classes/chatterbox',
  username: 'anonymous',

  init: function() {
    app.username = window.location.search.substr(10);
    app.getMessages();
    $('.getMessages').on('click', function() {
      app.getMessages();
    });
    $('.sendMessage').on('click', function() {
      app.sendMessage();
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
    $('.message').remove();
    _.each(data.results, function(item, index) {
      var $message = $('<li></li>').addClass('message');
      var $user = $('<div></div>').addClass('user').text(item['username']);
      var $text = $('<div></div>').addClass('text').text(item['text']);
      $message.append($user).append($text);
      $('#chats').append($message);
    })
  },

  sendMessage: function() {

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
        console.error('chatterbox: Failed to send message');
      }
    });
  }

};
