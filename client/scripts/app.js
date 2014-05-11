
// placing in app object
var app = {

  // Initial Variables
  server: 'https://api.parse.com/1/classes/chatterbox',
  username: 'anonymous',
  roomname: 'lobby',
  friends: {},

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
      app.changeRoom();
    });
    $('#main').on('click', '.username', function() {
      app.addFriend();
    });
  },

  getMessages: function() {
    $.ajax({
      url: app.server,
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function(data) {
        app.getRooms(data.results);
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
      if (item['roomname'] === app.roomname || app.roomname === 'lobby') {
        var $message = $('<li></li>').addClass('message');
        var $user = $('<div></div>').addClass('username').text(item['username']);
        var $text = $('<div></div>').addClass('text').text(item['text']);
        $message.append($user).append($text);
        $('#chats').append($message);
      }
    })
  },

  clearMessages: function() {
    $('.message').remove();
  },

  postMessage: function() {

    var message = {
      username: app.username,
      text: $('[name=newMessage').val(),
      roomname: app.roomname || 'lobby'
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
  },

  getRooms: function(results) {
    $('#roomSelect').html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

    if (results) {
      var rooms = {};
      results.forEach(function(data){
        var roomname = data.roomname;
        if (roomname && !rooms[roomname]){
          app.addRoom(roomname);
          rooms[roomname];
        }
      });
    }

    $('#roomSelect').val(app.roomname);
  },

  changeRoom: function() {
    if ($('#roomSelect').prop('selectedIndex') === 0) {
      var roomname = prompt('Enter roomname');
      if (roomname) {
        app.roomname = roomname;
        app.addRoom(roomname);
        $('#roomSelect').val(roomname);
        app.getMessages();
      }
    }
    else {
      app.roomname = $('#roomSelect').val();
      app.getMessages();
    }
  }, 

  addRoom: function(roomname) {
    var $roomOption = $('<option/>').val(roomname).text(roomname);
    $('#roomSelect').append($roomOption);
  },

  addFriend: function() {

  }

};
