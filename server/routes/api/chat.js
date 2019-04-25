module.exports = (app) => {

    app.post('/api/post', function(req, res) {
        if(!req.body
        || !req.body.username
        || !req.body.token
        || !req.body.content
        || !req.body.room)
        {
            console.log("post: missing field")
            return res.sendStatus(400)
        }

        const username = req.body.username
        const token = req.body.token
        const content = req.body.content
        const room = req.body.room

        if ( username.length >= 50 )
        {
            console.log( "post: username too long: " + username )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "post: invalid token: " + token )
            return res.sendStatus(400)
        }

        if ( room.length >= 50 )
        {
            console.log( "post: room too long: " + room )
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

                sqlsec.query( "INSERT INTO cs252posts (content, author, born, room) VALUES (?, ?, ?, ?);",
                [ content, username, rightnow, room ]);

                console.log("post: a message was posted by user: " + username + ", to room: " + room )
                res.json({"status":"okay"})
            }
        });
    });

    app.post('/api/fetch', function(req, res) {
        if(!req.body
        || !req.body.username
        || !req.body.token
        || typeof(req.body.last) === 'undefined'
        || !req.body.room )
        {
            console.log("fetch: missing field")
            return res.sendStatus(400)
        }

        const username = req.body.username
        const token = req.body.token
        const room = req.body.room

        if ( username.length >= 50 )
        {
            console.log( "fetch: username too long: " + username )
            return res.sendStatus(400)
        }

        if ( token.length != 64 )
        {
            console.log( "fetch: invalid token: " + token )
            return res.sendStatus(400)
        }

        if ( room.length >= 50 )
        {
            console.log( "fetch: room too long: " + room )
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
                sqlsec.query( "SELECT * FROM cs252posts WHERE id>? AND room=? ORDER BY id ASC;", [last, room], function( err, rsql )
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
                        var out = [];
                        var last = 0;

                        for ( var i = 0; i < rsql.length; i++ )
                        {
                            var tmsp = new Date(rsql[i].born * 1000)

                            var seconds = tmsp.getSeconds()
                            if ( seconds < 10 ) seconds = "0" + seconds
                            var minutes = tmsp.getMinutes()
                            if ( minutes < 10 ) minutes = "0" + minutes
                            var day = tmsp.getDate()
                            if ( day < 10 ) day = "0" + day


                            var stamp = tmsp.getHours() + ":" + minutes + ":" + seconds
                            stamp += " - " + tmsp.getMonth() + "/" + day + "/" + tmsp.getFullYear()

                            out.push({
                                "author":rsql[i].author,
                                "content":rsql[i].content,
                                "timestamp": stamp
                            })

                            // Get most recent post
                            if ( rsql[i].id > last ) last = rsql[i].id
                        }

                        res.json({"status":"okay", "last":last, "posts": out})
                    }
                });
            }
        });
    });
}
