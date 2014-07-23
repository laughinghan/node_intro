var fs = require('fs');

var express = require('express');
var app = express();

app.get('/', function(request, response) {
  fs.readFile('views/index.html', { encoding: 'utf8' }, function(error, contents) {
    if (error) throw error;
    response.send(contents);
  });
});

app.get('/submit', function(request, response) {
  var name = request.query.name;
  var question = request.query.question;
  response.send('The form submission page! Your name is '+name+', and your question is: '+question);
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port', server.address().port);
});
