const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
const port = 8080

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

require('./routes')(app);

app.get('/', function (req, res) {
    out = "<h1>Quickly Chat Backend!</h1><br>";

    app._router.stack.forEach(function(r)
    {
        if (r.route && r.route.path && r.route.path != "/") out += r.route.path + "<br>"
    });

    res.send( out )
});

// Connect to the database as the insecure bot. use for reading data
var db1 = mysql.createConnection({
    host: 'thestrugglingengineer.com',
    port: '3306',
    user: 'service',
    password: '9nQzDKe2kDs+y7o2VArScg==',
    database: 'Anthologist'
});

db1.connect(function(err) {
    if (err) {
        return console.error('MySQL error: ' + err.message);
    }
    console.log('Connected to the MySQL server as: service');
});
global.sqlcon = db1;

// Connect to the database as the secure bot. use for writing data.
var db2 = mysql.createConnection({
    host: 'thestrugglingengineer.com',
    port: '3306',
    user: 'serviceSecure',
    password: 'C+n9NscBcHbYPmAp6cN5Hw==',
    database: 'Anthologist'
});

db2.connect(function(err) {
    if (err) {
        return console.error('MySQL error: ' + err.message);
    }
    console.log('Connected to the MySQL server as: serviceSecure');
});
global.sqlsec = db2;

app.listen(port, (err) => {
    if ( err ) { console.log( err ); };
    console.log(`Quickly Chat backend server listening on port ${port}!`);
});
