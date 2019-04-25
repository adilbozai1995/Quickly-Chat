const crypto = require("crypto")
const uuid = require("uuid/v4")
const isuuid = require("is-uuid")

module.exports = (app) => {

    app.post('/api/signup', function(req, res) {
        if(!req.body
        || !req.body.username
        || !req.body.password)
        {
            console.log( "signup: missing field" );
            return res.sendStatus(400)
        }

        const username = req.body.username
        const password = req.body.password

        if ( username.length > 50 )
        {
            console.log( "signup: username too long" );
            return res.sendStatus(400)
        }

        if ( password.length > 32 )
        {
            console.log( "signup: password too long" );
            return res.sendStatus(400)
        }

        const salt = crypto.randomBytes(32);
        const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" );
        const token = crypto.randomBytes(32).toString('hex');

        sqlsec.query( "INSERT INTO cs252users (username, password, salt, token) VALUES (?, ?, ?, ?);",
        [ username, hashpass, salt, token ], function( err, rsql )
        {
            if ( err )
            {
                if ( err.code === "ER_DUP_ENTRY" )
                {
                    console.log( "signup: failed to create account, username taken: " + username )
                    res.json({"status":"fail","reason":"username already taken"})
                }
                else
                {
                    console.log( "signup: sql_error: ", err )
                    res.json({"status":"fail","reason":"un-caught sql error"})
                }
            }
            else
            {
                console.log( "signup: created account for user: " + username )
                res.json({"status":"okay","token":token})
            }
        });
    });

    app.post('/api/login', function(req, res) {
        if(!req.body
        || !req.body.username
        || !req.body.password)
        {
            console.log( "login: missing field" );
            return res.sendStatus(400)
        }

        const username = req.body.username
        const password = req.body.password

        if ( username.length > 50 )
        {
            console.log( "login: username too long" );
            return res.sendStatus(400)
        }

        if ( password.length > 32 )
        {
            console.log( "login: password too long" );
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT password, salt FROM cs252users WHERE username=?;",
        [ username ], function( err, rsql )
        {
            if ( err )
            {
                console.log( "login: sql_error: ", err );
                res.json({"status":"fail","reason":"un-caught sql error"});
            }
            else if ( rsql.length <= 0 )
            {
                console.log( "login: no account with username: " + username )
                res.json({"status":"fail","reason":"unknown account"})
            }
            else
            {
                const salt = Buffer.from( rsql[0].salt, 'hex' )
                const hashpass = crypto.pbkdf2Sync( password, salt, 100000, 32, "sha512" )

                if ( hashpass.toString('hex') === rsql[0].password )
                {
                    const token = crypto.randomBytes(32).toString('hex');

                    sqlsec.query( 'UPDATE cs252users SET token=? WHERE username=?;', [ token, username ] );

                    console.log( "login: correct password for user: " + username );
                    res.json({"status":"okay","token":token})
                }
                else
                {
                    console.log( "login: incorrect password for user: " + username );
                    res.json({"status":"fail","reason":"incorrect password"})
                }
            }
        });
    });
}
