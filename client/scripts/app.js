

var getMessages = function(e) {
  // e.preventDefault();
  $.ajax({
  	url: 'https://api.parse.com/1/classes/chatterbox',
  	type: 'GET',
    data: 'order=-createdAt',
  	success: function(data) {
  		// console.log(data.results[0]);
      $('.message').remove();
      _.each(data.results, function(item, index) {
       // console.log(item);
        var $message = $("<div class='message'></div>");
        // console.log(item);
        $message.append($('<div></div>').text(item["username"]));
        $message.append($('<div></div>').text(item["text"]));
        $('#messages').append($message);
        console.log(data);
      });
  	},
  	error: function(data) {
  		console.log('Failed to get data!');
  	}
  });
};

var sendMessages = function(e) {
  // e.preventDefault();
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
    // data: 'order=-createdAt',
    success: function(data) {
      getMessages();
      // console.log(data);
      // console.log(message);
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
      var roomList = {};
      _.each(data.results, function(item, index) {
        roomList[item["roomname"]] = 1;
      });
      for (var key in roomList) {
        $("#rooms").append($('<div></div>').text(key));
      }
    },
    error: function(data) {
      console.log('Failed to get data!');
    }
  });  




};


$(document).ready(function() {
  getMessages();
  getRoomList();
  var index = window.location.search.lastIndexOf("=");
  console.log(window.location.search.slice(index+1));
  $('.getMessages').on('click', getMessages);
  $('.sendMessages').on('click', sendMessages);
});
