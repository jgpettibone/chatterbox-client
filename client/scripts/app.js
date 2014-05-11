
// placing in app object
var app = {

  server: 'https://api.parse.com/1/classes/chatterbox' 

  init: function() {
    app.getMessages();
    $('.getMessages').on('click', function() {
      app.getMessages();
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
        console.log('chatterbox: Error getting messages.');
      }
    });
  },

  displayMessages: function(data) {
    $('.message').remove();
    _.each(data.results, function(item, index) {
      var message = $('<li></li>').addClass('message');
      var user = $('<div></div>').addClass('user');
      var text = $('<div></div>').addClass('text');
      message.append(user).append(text);
      $('#chats').append(message);
    })
  }
}
