# Node.js (Koa) + SQLite basic example

## Initial task:
```
In any programming language and using any frameworks (the use of node.js will be an advantage) write a service that receives user data using the https://randomuser.me/ API and formes a web page with a user card (page design is not important).

On the page, place the "Update" button, which, when clicked, provides new data.

On the page, place the "Save" button, on click of which, user data is saved in a local database or any other local storage.

On the page, place the “Restore” button, which, on click, restores the data of the first saved user.
```
## How to start:
* Install Node.js;
* Install the required Node modules by executing:
```
npm install
```
in the project's directory (using terminal/cmd);
* Start the Node.js app:
```
node app.js
```
*  Go to:
```
http://127.0.0.1:8888/
```
using your web browser.

## Additions:
* To re-initialize database, delete ./db/database.db file (but NOT ./db/ directory!) and do:
```
node initdb.js
```
