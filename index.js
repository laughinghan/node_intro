var express = require('express');
var app = express();

app.get('/', function(request, response) {
  response.send('Hello World');
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port', server.address().port);
});
