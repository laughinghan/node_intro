var fs = require('fs');

var express = require('express');
var app = express();

app.get('/', function(request, response) {
  fs.readFile('views/index.html', { encoding: 'utf8' }, function(error, contents) {
    response.send(contents);
  });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port', server.address().port);
});
