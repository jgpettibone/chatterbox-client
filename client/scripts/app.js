

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
        $('#main').append($message);
      });
  	},
  	error: function(data) {
  		console.log('Failed to get data!');
  	}
  });
};

var sendMessages = function(e) {
  // e.preventDefault();
  var message = {
    'username': window.location.search.split("&")[1].slice(9),
    'text': $("[name=newMessage]").val(),
    'roomname': null
  };
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    // data: 'order=-createdAt',
    success: function(data) {
      getMessages();
      console.log(data);
      console.log(message);
    },
    error: function(data) {
      console.log('Failed to send data!');
    }
  });
};


$(document).ready(function() {
  getMessages();
  // console.log(window.location.search.split("&")[1].slice(9));
  $('.getMessages').on('click', getMessages);
  $('.sendMessages').on('click', sendMessages);
});
