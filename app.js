const https = require('https');
const pg = require('pg');
const qs = require('querystring');
const express = require('express');
const app = express();
const path = require('path');

//Server port:
const port = 8888;

//PostgreSQL query function (body can be either an complex object or a string):
function query(body, callback) {
    //DB parameters:
    const pool = new pg.Pool({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'testdb',
        password: '',
        port: '5432'});
    
    //Query and callback:
    pool.query(body, function(err, res) {
        pool.end();
        if(!err) {
            callback(res);
        } else {
            console.log(err, res);
        }
    });
}

//Randomuser.me API query function:
function requestUser(callback) {
    var userOptions = {
        hostname: 'randomuser.me',
        path: '/api',
        method: 'GET',
    };

    https.request(userOptions).on('response', function(userRes) {
        var data = '';

        userRes.on('data', function (chunk) {
            data += chunk;
        });

        userRes.on('end', function () {
            callback(JSON.parse(data).results[0]);
        });
    }).on('error', function(userError) {
        console.error(userError);
        callback(null);
    }).end();
}

//Defining a route for client-side js files:
app.use('/js', express.static(path.join(__dirname, 'js')));

//Route for GET to /
app.get('/', (req, res) => {
    req.on('error', function(err) {
        console.error(err);
        res.statusCode = 400;
        res.end();
    });
    
    res.on('error', function(err) {
        console.error(err);
    });

    //Page initialization, requesting new user and rendering page with json:
    requestUser(function(user) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        res.write('<!DOCTYPE html>\n<html lang="en">\n' +
        '<head>\n' +
        '<meta charset="utf-8">\n<title>User profile</title>\n' + 
        '<style type="text/css">* {font-family:arial, sans-serif;}</style>\n' +
        '<script src="js/scripts.js"></script>\n' +
        '</head>\n<body>\n' +
        '<h1>User profile JSON</h1>\n' + 
        '<div id="content">\n' +
        JSON.stringify(user) +
        '</div>\n' +
        '<button onclick="save()">Save</button>\n' +
        '<button onclick="refresh(\'new\')">Refresh</button>\n' +
        '<button onclick="refresh(\'restore\')">Restore</button>\n' + 
        '</body>\n</html>');

        res.end();
    });
});

//Route for POST to /
app.post('/', (req, res) => {
    var body = '';

    req.on('data', function (data) {
        body += data;

        //POST mem overflow safety
        if (body.length > 1e6)
            req.connection.destroy();
    });
    
    req.on('end', function() {
        //Analyzing purpose of the POST request:
        var post = qs.parse(body, '\\&');

        //If purpose is to save current client's render to DB:
        if(post.command === 'save') {
            query({ text: 'INSERT INTO testtable (data) VALUES ($1::jsonb);', values: [post.save] }, function() {});
        
        //If purpose is to provide new user to ajax query:
        } else if(post.command === 'new') {
            requestUser(function(user) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');

                res.write(JSON.stringify(user));

                res.end();
            });

        //If purpose is to restore earliest record from DB:
        } else if(post.command === 'restore') {
            query('SELECT data FROM testtable LIMIT 1;', function(user) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');

                if(user.rows.length > 0)
                    res.write(JSON.stringify(user.rows[0].data));

                res.end();
            });
        }
    });
});

//Initializing server:
app.listen(port, () => console.log('Server running on 127.0.0.1:' + port));
