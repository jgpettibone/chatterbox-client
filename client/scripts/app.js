

var getMessages = function(roomname) {
  var roomname = roomname || "lobby";
  var getRoomName = function() {
    return roomname;
  };
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
  	type: 'GET',
    data: 'order=-createdAt',
  	success: function(data) {
      $('.message').remove();
      _.each(data.results, function(item, index) {
        if (item["roomname"] === getRoomName()) {
          // console.log('we are in room ', item["roomname"]);
          var $message = $("<div class='message'></div>");
          $message.append($('<div></div>').text(item["username"]));
          $message.append($('<div></div>').text(item["text"]));
          $('#messages').append($message);
        }
      });
      getRoomList();
      // $('.room').off('click');
      // $('.room').on('click', console.log('I have been clicked')); 

  	},
  	error: function(data) {
  		console.log('Failed to get data!');
  	}
  });
};

var sendMessages = function(roomname) {
  var roomname = roomname || "lobby";
    var getRoomName = function() {
    return roomname;
  };

  var index = window.location.search.lastIndexOf("=");
  var message = {
    'username': window.location.search.slice(index+1),
    'text': $("[name=newMessage]").val(),
    'roomname': "lobby"
  };
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      getMessages();
      $("[name=newMessage]").val("");
    },
    error: function(data) {
      console.log('Failed to send data!');
    }
  });
};

var getRoomList = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-createdAt',
    success: function(data) {
      $('.room').remove();
      var roomList = {};
      _.each(data.results, function(item, index) {
        roomList[item["roomname"]] = 1;
      });
      for (var key in roomList) {
        //first make the key into a link
        $link = $("<a href='#' class='room'></a>").text(key);
        $("#rooms").append($link);
        // console.log($('.room').text());

        // $("#rooms").append($("<div class='room'></div>").text(key));
      }
      // $('.room').off('click');
      // $('.room').on('click', console.log('I have been clicked')); 
    },
    error: function(data) {
      console.log('Failed to get data!');
    }
  });  
  // $('.room').off('click');
  // $('.room').on('click', console.log('I have been clicked')); 

};


$(document).ready(function() {
  getMessages();
  var index = window.location.search.lastIndexOf("=");
  $('.getMessages').on('click', function() {
    getMessages();
  });
  $('.sendMessages').on('click', function() {
    sendMessages();
  });
  $('#rooms').on('click', 'a', function(e) {
    e.preventDefault();
    console.log($(this).text());
    getMessages($(this).text());
  });
});
