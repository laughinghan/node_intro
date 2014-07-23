## an intro to server side programming

A basic Node.js web app with a form that can be submitted to write to a
database, and whose results can be displayed.

Assumes you have a Heroku account and have installed the [Heroku Toolbelt]
(https://toolbelt.heroku.com/) and are either in an existing trivial Heroku
app, or an empty Node module (which you could create by doing [`npm init`]
(https://www.npmjs.org/doc/cli/npm-init.html) in an empty directory, for
example) that is also a Git repo with the `package.json` (created by `npm init`)
committed ([crash course on Git](www.gitguys.com/topics/skip-the-intro/) if you
don't know what that means).

Initially loosely follows the Heroku "Getting Started with Node.js" guide:
https://devcenter.heroku.com/articles/getting-started-with-nodejs

#### Step 0: `.gitignore`-ing `node_modules`

Our code is gonna use some existing Node modules as external dependencies,
which will be installed into the `node_modules` folder. We don't want Git
to track the actual code of the dependencies, though, only the name and version
(which will be in the `package.json`), since they're not part of _our_ codebase
(and if any of them had to be compiled, they'd be slightly different for each
machine using our code).

Make sure you have a file named `.gitignore` with a line containing just
`node_modules`. You can create it with Sublime, or by just doing:
```sh
echo node_modules > .gitignore
```
(Then add and commit it to Git, of course:
```sh
git add .gitignore
git commit -m '.gitignore-d node_modules'
```
)

#### Step 1: Add Express

The first external dependency we're going to use is the Express web framework.
We'll be loosely following the "Getting started" guide, starting about at
"Now to create the application itself!" (everything before that, we've done or
is outdated): http://expressjs.com/guide.html

To install it, and simultaneously add it to the `dependencies` in our
`package.json`, just do:
```sh
npm install --save express
```
(Then add and commit the change to `package.json`, of course.)

#### Step 2: Express "Hello World"

Now if you create an `index.js` containing:
```js
var express = require('express');
var app = express();

app.get('/', function(request, response) {
  response.send('Hello World');
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port', server.address().port);
});
```
and run `node .` and go to `http://localhost:3000` in your browser, you should
see "Hello World" in your browser.

#### Step 3: Heroku

If you started with an empty Git repo, and not an existing trivial Heroku app,
you'll have to do `heroku create` (which has options; `heroku help create` for
more).

Also make sure you have a `Procfile` with the line:
```
web: node .
```
(More details about the `Procfile`: https://devcenter.heroku.com/articles/procfile )

So if you do `foreman start`, you should get:
```
15:42:59 web.1  | started with pid 46590
15:42:59 web.1  | Listening on port 5000
```
(but with different timestamps and `pid`, of course.)
And if you now visit `http://localhost:5000` in your browser, you should again
see "Hello World" in your browser.

(Remember to add and commit the `Procfile`.)

Part of the charm of Heroku is that if it works locally on your machine with
`foreman start`, it should work on the Big Bad Web. Try it,
`git push heroku master` should result in (in something like):
```sh
Fetching repository, done.
Counting objects: 27, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (25/25), done.
Writing objects: 100% (27/27), 3.98 KiB | 0 bytes/s, done.
Total 27 (delta 8), reused 0 (delta 0)

-----> Node.js app detected

       PRO TIP: Specify a node version in package.json
       See https://devcenter.heroku.com/articles/nodejs-support

-----> Defaulting to latest stable node: 0.10.29
-----> Downloading and installing node
-----> Exporting config vars to environment
-----> Installing dependencies
       express@4.6.1 node_modules/express
       ├── merge-descriptors@0.0.2
       ├── utils-merge@1.0.0
       ├── parseurl@1.1.3
       ├── cookie@0.1.2
       ├── escape-html@1.0.1
       ├── finalhandler@0.0.3
       ├── cookie-signature@1.0.4
       ├── range-parser@1.0.0
       ├── fresh@0.2.2
       ├── vary@0.1.0
       ├── qs@0.6.6
       ├── media-typer@0.2.0
       ├── methods@1.1.0
       ├── serve-static@1.3.2
       ├── buffer-crc32@0.2.3
       ├── depd@0.3.0
       ├── path-to-regexp@0.1.3
       ├── debug@1.0.3 (ms@0.6.2)
       ├── proxy-addr@1.0.1 (ipaddr.js@0.1.2)
       ├── type-is@1.3.2 (mime-types@1.0.1)
       ├── send@0.6.0 (ms@0.6.2, mime@1.2.11, finished@1.2.2)
       └── accepts@1.0.7 (negotiator@0.4.7, mime-types@1.0.1)
-----> Caching node_modules directory for future builds
-----> Cleaning up node-gyp and npm artifacts
-----> Building runtime environment
-----> Discovering process types
       Procfile declares types -> (none)

-----> Compressing... done, 5.4MB
-----> Launching... done, v3
       http://intense-lake-7035.herokuapp.com/ deployed to Heroku

To git@heroku.com:intense-lake-7035.git
 + 38c4c1d...c8287e2 master -> master
```
Then `heroku open` should open your app in the browser (in my case,
`http://intense-lake-7035.herokuapp.com/`). If ever you open it up in the
browser and see that your app has crashed, `heroku logs` is your friend.
(I was getting `error code=H14 desc="No web processes running"` for some reason;
turned out that when I accidentally forgot to add and commit the `Procfile`
before pushing to Heroku, and adding that in isn't enough to fix that, [you have
to do `heroku ps:scale web=1`](http://stackoverflow.com/q/9970151#comment29633666_19694692).)

#### Step 4: Views

We shouldn't actually have the HTML source of our webpages in `index.js`, of
course. The standard thing to do is to have HTML templates in the `views` folder
in some templating language like [Jade](http://jade-lang.com) (ships with
Express, because it's also by TJ Holowaychuk) or [Handlebars](http://handlebarsjs.com/),
and then do [`response.render()`](http://expressjs.com/api.html#res.render) with
the path to the desired view (the docs are pretty vague, unfortunately).

(The HTML templates would link to static assets like stylesheets, images, and
client-side JS in a `public` directory: https://github.com/visionmedia/express/tree/master/examples/static-files )

We're gonna skip that, and just manually read `.html` files from our `views/`
folder.

Create a `views/index.html` containing:
```html
<!DOCTYPE html>
<html>
<head>
  <title>JS Bin</title>
</head>
<body>
  <h1>Question form</h1>
  <form action="/submit">
    <p><input type="text" name="name" placeholder="Your Name" /></p>
    <p><textarea name="question" placeholder="Your question..."></textarea></p>
    <p><input type="submit" /></p>
  </form>
</body>
</html>
```

Then, in `index.js`, add at the very top:
```js
var fs = require('fs');
```
to access the [File System API](http://nodejs.org/api/fs.html#fs_file_system),
and replace where we currently have:
```js
app.get('/', function(request, response) {
  response.send('Hello World');
});
```
with a [`fs.readFile()`](http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback)
call to read `views/index.html` and send that as a response (pass in an
encoding so that `fs.readFile()` gives us a string and not a buffer, so that
[`response.send()`](http://expressjs.com/api.html#res.send) sends it to the
browser as HTML):
```js
app.get('/', function(request, response) {
  fs.readFile('views/index.html', { encoding: 'utf8' }, function(error, contents) {
    if (error) throw error;
    response.send(contents);
  });
});
```
(Never ignore the `error` parameter to these callbacks, even when it should
be impossible for there to be an error like in this case, where we're reading
a hardcoded file; always at least do what I do here and fail catastrophically,
because at least the error object will be in `heroku logs`. The Right Thing
isn't to do that either of course, the Right Thing is to log the error and
send an error page to the browser but try to keep chugging along regardless.)

Now if you `foreman start` and open `localhost:5000` in your browser again,
you should see the question form as your homepage, and if you add and commit
all this and push to Heroku, the homepage online should also be the question
form.

#### Step 5: Form Submission

If you try submitting the form, of course, it submits to the `action` URL of
the form, which is `/submit`, but our Express app is only configured to respond
to `/` (those are called routes, by the way).

Let's add a route `/submit` to `index.js`:
```js
app.get('/submit', function(request, response) {
  response.send('The form submission page!');
});
```

You should now see (if you `foreman start` again, of course)
"The form submission page!" when you go to `http://localhost:5000/submit`, or
when you submit the question form.

Note that when you submit the question form, though, you don't actually go
to `http://localhost:5000/submit`, you in fact go to something like
`http://localhost:5000/submit?name=Han&question=What+is+the+meaning+of+life`.

The part of the URL after the question mark `?` is the query string, and those
key/value pairs are query parameters, which Express helpfully parses from the
request as a JS object, [`request.query`](http://expressjs.com/api.html#req.query).
In this case, our form's inputs' names were `name` and `question`, so we can
update our `/submit` route:
```js
app.get('/submit', function(request, response) {
  var name = request.query.name;
  var question = request.query.question;
  response.send('The form submission page! Your name is '+name+', and your question is:'+question);
});
```

If you (`foreman start` again and) go to the homepage and submit the question
form, you should hopefully see that you successfully parsed out and used the
name and question submitted in the form. Good time to commit your code.

#### Step 6: MongoDB

We now have access to data submitted by the form, but we don't save it to any
kind of persistent storage (i.e., a database). We can't just save it to a
global variable or something, our app restarts regularly (every time we push
to Heroku, in fact), and multiple instances could be running at a time (which
wouldn't share global variables).

We're going to use MongoDB for our database because it's relatively easy to
hit the ground running, but the landscape of database offerings is wide and
varied and often have nothing in common but storing persistent data.
(There is a large class of traditionally dominant databases called relational
databases that shared a reasonably uniform interface called SQL; MongoDB is
typically classified as a "NoSQL" database, and one of the ways it contrasts
with relational databases is being easier to get started.)

There's 3 pieces of setup we need to use MongoDB.
- We need to install MongoDB locally on your machine: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
- We need a MongoDB Heroku add-on, which is [apparently](https://devcenter.heroku.com/articles/getting-started-with-nodejs#using-mongodb)
  as easy as `heroku addons:add mongolab`
- The Node.js package we're writing needs, as an external dependency, a Node.js
  module our JS can call to talk to MongoDB: `npm install --save mongodb`
  Just like when you did `npm install --save express`, you'll need to add and
  commit the change to your `package.json`.

Great, so we have MongoDB and the `mongodb` npm module. How do we use them?
This purports to be an intro to both: http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html

First step for our JS to use the `mongodb` npm module, add at the beginning
of `index.js`:
```js
var MongoClient = require('mongodb').MongoClient;
```

Then we want our code to talk to an actual MongoDB database (via `mongodb`)
using `MongoClient.connect()`, but before we quite get there, let's think about
_when_ we want to do so (which helps us figure out _where_ to do so). What we'd
like is, while our Web server is up and running and serving requests, we're able
to store and retrieve stuff from MongoDB. So, we'd like to have a connection to
MongoDB available to us by the time we're up and running and serving requests.

In a real app, you'd do the connection setup in parallel with setting up the
Express web server, but I don't want to have to explain how that would work,
you can learn how to do that on your own (with Promises, for example). We're
just gonna connect to MongoDB first, and only do all that Express stuff once
we've got our connection to MongoDB, so `index.js` looks like this now:
```js
var fs = require('fs');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
MongoClient.connect(mongoUri, function(error, db) {
  if (error) throw error;
  console.log('Connected to MongoDB at', mongoUri);

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
});
```
(the `mongoUri` line is [from the Heroku tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs#using-mongodb))
at which point `foreman start` should yield something like:
```
16:53:29 web.1  | started with pid 48745
16:53:30 web.1  | Connected to MongoDB at mongodb://localhost/mydb
16:53:30 web.1  | Listening on port 5000
```
(If you're instead getting something like:
```
16:51:32 web.1  | started with pid 48726
16:51:32 web.1  | /Users/han/Desktop/node_intro/node_modules/mongodb/lib/mongodb/mongo_client.js:409
16:51:32 web.1  |           throw err
16:51:32 web.1  |                 ^
16:51:32 web.1  | Error: failed to connect to [localhost:27017]
16:51:32 web.1  |     at null.<anonymous> (/Users/han/Desktop/node_intro/node_modules/mongodb/lib/mongodb/connection/server.js:546:74)
16:51:32 web.1  |     at EventEmitter.emit (events.js:106:17)
16:51:32 web.1  |     at null.<anonymous> (/Users/han/Desktop/node_intro/node_modules/mongodb/lib/mongodb/connection/connection_pool.js:150:15)
16:51:32 web.1  |     at EventEmitter.emit (events.js:98:17)
16:51:32 web.1  |     at Socket.<anonymous> (/Users/han/Desktop/node_intro/node_modules/mongodb/lib/mongodb/connection/connection.js:533:10)
16:51:32 web.1  |     at Socket.EventEmitter.emit (events.js:95:17)
16:51:32 web.1  |     at net.js:441:14
16:51:32 web.1  |     at process._tickCallback (node.js:415:13)
16:51:32 web.1  | exited with code 8
16:51:32 system | sending SIGTERM to all processes
SIGTERM received
```
well, the key line there is `Error: failed to connect` to MongoDB, most likely
because there's no MongoDB server to connect to running on your machine, did you
[run `mongod` after installing MongoDB on your machine](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#run-mongodb)?
On my machine with MongoDB v2.6.3, just doing `mongod` actually didn't work,
it died complaining about `/data/db`:
```
...
2014-07-22T17:08:10.157-0700 [initandlisten] exception in initAndListen: 10296
*********************************************************************
 ERROR: dbpath (/data/db) does not exist.
 Create this directory or give existing directory in --dbpath.
 See http://dochub.mongodb.org/core/startingandstoppingmongo
*********************************************************************
, terminating
2014-07-22T17:08:10.158-0700 [initandlisten] dbexit:
...
```
which, like, you think they could've chosen a directory they'd be more likely
to have write permissions to, but anyway, I fixed it by running
`mongod --dbpath /tmp`, and got much less scary log messages ending with:
```
...
2014-07-23T00:35:56.763-0700 [initandlisten] waiting for connections on port 27017
```
at which point `foreman start` of the `MongoClient.connect(...)` code worked.
)

Great, so you're connected to MongoDB. How do we write stuff to it? First, we
need a "collection" to insert "documents" into, as MongoDB calls them, so:
```diff
   if (error) throw error;
   console.log('Connected to MongoDB at', mongoUri);
+  var collection = db.collection('form_results');

   var app = express();
```
Now for the "documents" we want to insert, i.e. form submission data. When do
we have that and want to insert it? When a form is submitted, i.e. `/submit`,
so change your `/submit` route to something like:
```js
  app.get('/submit', function(request, response) {
    var doc = {
      name: request.query.name,
      question: request.query.question,
      timestamp: Date.now()
    };
    collection.insert(doc, function(error) {
      if (error) {
        console.error(error);
        response.send('I\'m sorry, there was a problem saving your form submission: ' + error);
      } else {
        response.send('Your form submission has been successfully saved!');
      }
    });
  });
```

`foreman start` and submitting the form in the browser should now get you
something like "Your form submission was successfully saved on Wed Jul 23 2014
02:25:26 GMT-0700 (PDT)! Your name is Han, and your question is: What is the
meaning of life". Add, commit, check that it also works on Heroku.

