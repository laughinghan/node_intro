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

