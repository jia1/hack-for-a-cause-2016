var root = 'http://nightautumn.com/api/';
var messages_url = root + 'messages';
var replies_url = root + 'replies';
var first = 1;
var reply_label = "Reply";

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
});

function sprintf(format) {
  for (var i = 1; i < arguments.length; i++) {
    format = format.replace(/%s/, arguments[i]);
  }
  return format;
}

function reply(message_id, message_author) {
  var dayspring_timestamp = "";
  var dayspring_author = prompt("My name is ");
  var dayspring_reply = prompt("My reply to " + message_author);
  $('#message_' + message_id).parent().append(sprintf(
        '<tr class="dayspring-reply">'
      + '<td class="dayspring-date">%s</td>'
      + '<td class="dayspring-message">%s</td>'
      + '<td class="dayspring-author">%s</td>'
      + '</tr>',
      dayspring_timestamp,
      dayspring_reply,
      dayspring_author
  ));

  var reply = {
     name: dayspring_author,
     message_id: message_id,
     message: dayspring_reply
  };

  $.ajax({
    url: replies_url,
    method: 'POST',
    data: JSON.stringify(reply)
  }).then(function() {
    location.href = location.href; // this window's URL
  });
}

$.ajax({
  url: messages_url,
  method: 'GET'
}).then(function(data) {
  for (var m = 0; m < data.length; m++) {
    var msg = data[m];

    var donor_message = sprintf(
      '<table class="table">'
      + '<tr class="donor-post" id="message_%s">'
      + '<td class="donor-date">%s</td>'
      + '<td class="donor-message">%s</td>'
      + '<td class="donor-name">%s</td>'
      + '</tr>',
      msg.id,
      msg.timestamp,
      msg.message,
      msg.name
    );

    var replies = msg.replies;
    var db_replies = '';
    for (var r = 0; r < replies.length; r++) {
      var reply = replies[r];
      db_replies += sprintf('<tr class="dayspring-reply">' 
                    + '<td class="dayspring-date">%s</td>' 
                    + '<td class="dayspring-message">%s</td>' 
                    + '<td class="dayspring-author">%s</td>' 
                    + '</tr>',
                    reply.timestamp,
                    reply.message,
                    reply.name);
    }

    db_replies += '</table>';
    
    var button = '<div align="center"><button type="button" class="btn btn-default reply-btn" onclick="reply(' + 
      msg.id + ', \'' + msg.name + '\')">' + 
      reply_label + '</button></div>';

    var table_data = donor_message + db_replies + button;
    console.log(table_data);
    $('.message-board').append(table_data);
  }     
});