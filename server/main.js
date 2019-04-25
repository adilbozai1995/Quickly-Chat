const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
const port = 3070

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

require('./routes')(app);

app.get('/', function (req, res) {
    out = "<h1>Quickly Chat Backend!</h1><br>";

    app._router.stack.forEach(function(r)
    {
        if (r.route && r.route.path && r.route.path != "/") out += r.route.path$
    });

    res.send( out )
});

app.listen(port, (err) => {
    if ( err ) { console.log( err ); };
    console.log(`Quickly Chat backend server listening on port ${port}!`);
});
