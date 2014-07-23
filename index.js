var fs = require('fs');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
MongoClient.connect(mongoUri, function(error, db) {
  if (error) throw error;
  console.log('Connected to MongoDB at', mongoUri);
  var collection = db.collection('form_results');

  var app = express();

  app.get('/', function(request, response) {
    fs.readFile('views/index.html', { encoding: 'utf8' }, function(error, contents) {
      if (error) throw error;
      response.send(contents);
    });
  });

  app.get('/submit', function(request, response) {
    var doc = {
      name: request.query.name,
      question: request.query.question,
      timestamp: Date.now()
    };
    collection.insert(doc, function(error, inserted) {
      if (error) {
        console.error(error);
        response.send('I\'m sorry, there was a problem saving your form submission: ' + error);
      } else {
        response.send('Your form submission was successfully saved at '+new Date(inserted[0].timestamp)+'! Your name is ' + inserted[0].name + ', and your question is: ' + inserted[0].question);
      }
    });
  });

  app.get('/results', function(request, response) {
    collection.find().toArray(function(error, items) {
      var results = '';
      for (var i = 0; i < items.length; i += 1) {
        results += '<p>Timestamp: '+new Date(items[i].timestamp);
        results += '<p>Name: '+items[i].name;
        results += '<p>Question: '+items[i].question;
      }
      response.send(results);
    });
  });

  var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port', server.address().port);
  });
});
