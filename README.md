## an intro to server side programming

A basic Node.js web app with a form that can be submitted to write to a
database, and whose results can be displayed.

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

