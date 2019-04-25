module.exports = (app) => {

    app.post('/api/post', function(req, res) {
        if(!req.body
        || !req.body.username
        || !req.body.token
        || !req.body.content)
        {
            console.log("post: missing field")
            return res.sendStatus(400)
        }

        const username = req.body.username
        const token = req.body.token
        const content = req.body.content

        if ( username >= 50 )
        {
            console.log( "post: username too long: " + username )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "post: invalid token: " + token )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM cs252users WHERE username=?;",
        [ username ], function( err, arsql )
        {
            if ( err )
            {
                console.log( "post: sql_error: ", err )
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "post: no account with username: " + username )
                res.json({"status":"fail","reason":"no account with that username"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("post: invalid security token for user: " + username )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                const rightnow = Date.now() / 1000;

                sqlsec.query( "INSERT INTO cs252posts (content, author, born) VALUES (?, ?, ?);",
                [ content, username, rightnow ]);

                console.log("post: a message was posted by user: " + username )
                res.json({"status":"okay"})
            }
        });
    });

    app.post('/api/fetch', function(req, res) {
        if(!req.body
        || !req.body.username
        || !req.body.token
        || typeof(req.body.last) === 'undefined' )
        {
            console.log("fetch: missing field")
            return res.sendStatus(400)
        }

        const username = req.body.username
        const token = req.body.token

        if ( username >= 50 )
        {
            console.log( "fetch: username too long: " + username )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "fetch: invalid token: " + token )
            return res.sendStatus(400)
        }

        const last = parseInt(req.body.last, 10)

        if ( isNaN( last ) || last < -1 )
        {
            console.log( "fetch: invalid last: " + last )
            return res.sendStatus(400)
        }

        sqlcon.query( "SELECT token FROM cs252users WHERE username=?;",
        [ username ], function( err, arsql )
        {
            if ( err )
            {
                console.log( "fetch: sql_error: ", err )
                res.json({"status":"fail","reason":"un-caught sql error"})
            }
            else if ( arsql.length <= 0 )
            {
                console.log( "fetch: no account with username: " + username )
                res.json({"status":"fail","reason":"no account with that username"})
            }
            else if ( arsql[0].token !== token )
            {
                console.log("fetch: invalid security token for user: " + username )
                res.json({"status":"fail","reason":"invalid security token"})
            }
            else
            {
                const rightnow = Date.now() / 1000;

                sqlsec.query( "SELECT * FROM cs252posts WHERE id>? ORDER BY id ASC;", [last], function( err, rsql )
                {
                    if ( err )
                    {
                        console.log( "fetch: sql_error: ", err )
                        res.json({"status":"fail","reason":"un-caught sql error"})
                    }
                    else if ( rsql.length <= 0 )
                    {
                        res.json({"status":"fail","reason":"no new posts"})
                    }
                    else
                    {
                        var out = []
                        var last = -1;

                        for ( var i = 0; i < rsql.length; i++ )
                        {
                            out.append({
                                "author":rsql[i].author,
                                "content":rsql[i].content,
                                "born":rsql[i].born
                            })

                            // Get most recent post
                            if ( rsql[i].id > last ) last = rsql[i].id
                        }

                        res.json({"status":"okay","last":last,"posts":out})
                    }
                });

                console.log("fetch: a message was posted by user: " + username )
                res.json({"status":"okay"})
            }
        });
    });
}
