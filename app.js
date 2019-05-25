const Koa = require('koa');
const app = module.exports = new Koa();
const router = require('koa-router')();
const serve = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');
const sqlite = require('sqlite3').verbose();
const https = require('https');

//Server port:
const port = 8888;

//Defining js user side scripts' serving routes:
app.use(mount('/js/', serve(__dirname + '/js')));

//Defining post and get routes:
router.get('/', getIndex)
  .post('/', postIndex);
app.use(bodyParser());
app.use(router.routes());

//Handling GET requests to /:
async function getIndex(ctx) {
  let user = await requestUser();
  ctx.response.body = '<!DOCTYPE html>\n<html lang="en">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n<title>User profile</title>\n' + 
    '<style type="text/css">* {font-family:arial, sans-serif;}</style>\n' +
    '<script src="js/scripts.js"></script>\n' +
    '</head>\n<body>\n' +
    '<h1>User profile JSON</h1>\n' + 
    '<div id="content">\n' +
    await JSON.stringify(user) +
    '</div>\n' +
    '<button onclick="save()">Save</button>\n' +
    '<button onclick="refresh(\'new\')">Refresh</button>\n' +
    '<button onclick="refresh(\'restore\')">Restore</button>\n' + 
    '</body>\n</html>';
}

//Handling POST requests to /:
async function postIndex(ctx) {
  if (ctx.request.body.command === 'save') {
    let qv = await JSON.stringify(ctx.request.body.save);
    await query({ queryBody: 'INSERT INTO testtable (data) VALUES (?);', queryValues: [qv] });
  //If purpose is to provide new user to ajax query:
  } else if (ctx.request.body.command === 'new') {
    let user = await requestUser();
    ctx.response.body = await JSON.stringify(user); 
  //If purpose is to restore earliest record from DB:
  } else if (ctx.request.body.command === 'restore') {
    let user = await query('SELECT data FROM testtable LIMIT 1;');
    if (typeof user !== 'undefined' && user.hasOwnProperty('data'))
      ctx.response.body = user.data;
    else {
      ctx.response.body = '';
      console.error('Unable to fetch a correct record from the database!');
    }
  }
}

//SQLite query function (body can be either an complex object or a string):
function query(body) {
  return new Promise(function(resolve, reject) {
    let db = new sqlite.Database('./db/database.db', function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      }
    });
    
    //Handling INSERT:
    if (body.hasOwnProperty('queryBody')) {
      db.run(body.queryBody, body.queryValues, function(err) {
        if (err) {
          console.error(err.message);
          reject(err);
        }
      }); 
    //Handling SELECT:
    } else {
      db.get(body, function(err, row) {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    }

    db.close(function(err) {
      if (err) {
        console.error(err.message);
      }
    });
  });
}

//Requesting user from randomuser.me API:
function requestUser(){
  return new Promise(function(resolve, reject) {
    let userOptions = {
        hostname: 'randomuser.me',
        path: '/api',
        method: 'GET',
    };

    https.request(userOptions).on('response', function(userRes) {
        let data = '';

        userRes.on('data', function (chunk) {
            data += chunk;
        });

        userRes.on('end', function () {
            resolve(JSON.parse(data).results[0]);
        });
    }).on('error', function(userError) {
        console.error(userError);
        reject(userError);
    }).end();
  });
}

//Initializing server:
app.listen(port);
console.log('Server started on 127.0.0.1:' + port);
