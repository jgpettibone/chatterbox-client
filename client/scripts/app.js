var friends = {};
var currentRoom = "lobby";

var retrieveRoomName = function() {

  var re = RegExp("room-");
  var thisLocation = window.location.search;

  if (re.test(thisLocation)) {
    var index = window.location.search.lastIndexOf('-');
    roomname = window.location.search.slice(index+1);    
  }
  else {
    roomname = "lobby";
  }

  return roomname;
};


var getMessages = function() {
  // var roomname = retrieveRoomName();
  console.log(currentRoom);
  var roomname = currentRoom;

  // console.log('from', getFriends());

  var getRoomName = function() {
    return roomname;
  };

  var findFriends = function() {
    var friendArray = [];
    $.each($('.friend'), function() {
      friendArray.push($(this).text());
    });
    friendArray = _.uniq(friendArray);
    // console.log('fri array ', fri)
  }
  findFriends();


  // var getFriends = function() {
  //   return friends;
  // }
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
  	type: 'GET',
    data: 'order=-createdAt',
  	success: function(data) {
      $('.message').remove();
      _.each(data.results, function(item, index) {
        if (item["roomname"] === getRoomName()) {
          // console.log('friends within getMessages ', getFriends());
          // console.log('we are in room ', item["roomname"]);
          var $message = $("<div class='message'></div>");
          if (item["username"] in getFriends()) {
            $message.append($("<a href='#' class='username friend'></a>").text(item["username"]));
          } else {
            $message.append($("<a href='#' class='username'></a>").text(item["username"]));            
          }
          $message.append($('<div></div>').text(item["text"]));
          $('#messages').append($message);
        }
        getRoomList();
      });

  	},
  	error: function(data) {
  		console.log('Failed to get data!');
  	}
  });
};

var sendMessages = function(roomname) {

  // var roomname = retrieveRoomName();
  var roomname = currentRoom;

  var getRoomName = function() {
    return roomname;
  };

  var index = window.location.search.lastIndexOf("=");
  var message = {
    'username': window.location.search.slice(index+1,index+2),
    'text': $("[name=newMessage]").val(),
    'roomname': roomname
  };
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      getMessages();
      $("[name=newMessage]").val("");
      console.log(message);
    },
    error: function(data) {
      console.log('Failed to send data!');
    }
  });
};

var getRoomList = function() {

  // var roomname = retrieveRoomName();
  var roomname = currentRoom;
    var getRoomName = function() {
    return roomname;
  };

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
        $link = $("<a href='#' class='room'></a>").text(key);
        $("#rooms").append($link);
      }

      // console.log($("<a href='#' class='room'></a>"));

      var re = RegExp(getRoomName());
      if (re.test($(".room").text())) {
        console.log('already in the list');
      } else {
        $link = $("<a href='#' class='room'></a>").text(getRoomName());
        $("#rooms").append($link);        
      }

      // $link = $("<a href='#' class='room'></a>").text(getRoomName());
      // $("#rooms").append($link);

    },
    error: function(data) {
      console.log('Failed to get data!');
    }
  });  

};

var createRoom = function() {

  console.log('creating room');
  var newRoom = $("[name=newRoom]").val();
  setRoomName(newRoom);
  console.log('before getMessages ', newRoom);

  getMessages();
  $("[name=newRoom]").val("");

  // console.log('trying to append ', newRoom);
  // $link = $("<a href='#' class='room'></a>").text(newRoom);
  // $("#rooms").append($link);
  // console.log('finishing');
};

var setRoomName = function(roomname) {

  currentRoom = roomname;
  // console.log('in setRoomName');
  // var re = RegExp("room-");
  // var thisLocation = window.location.search;

  // if (re.test(thisLocation)) {
  //   var index = window.location.search.lastIndexOf('-');
  //   thisLocation = window.location.search.slice(0,index-4);    
  // }
  // var newSearch = thisLocation + 'room-' + roomname;
  // window.location.search = newSearch;

};


var makeFriends = function(username, friends) {
  console.log('i am making a friend');
  username.addClass('friend');
  friends[username.text()] = true;
  console.log(friends);
};

var getFriends = function() {
  // console.log('in getFriends ', friends);
  return friends;
};

$(document).ready(function() {
  getMessages();
  // setRoomName("lobby");
  getRoomList();
  $('.getMessages').on('click', function() {
    getMessages();
  });
  $('.sendMessages').on('click', function() {
    sendMessages();
  });
  $('#rooms').on('click', 'a', function(e) {
    e.preventDefault();
    // console.log($(this).text());
    console.log('in the room click', friends);
    setRoomName($(this).text());
    getMessages($(this).text());
  });
  $('.createRoom').on('click', function() {
    createRoom();
  });
  $('#messages').on('click', 'a', function(e) {
    e.preventDefault();
    makeFriends($(this), friends);
    // console.log(friends);
  })
});
