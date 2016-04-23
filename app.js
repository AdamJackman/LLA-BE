var express = require('express');
var app = express();
var db = require('./db');
var cookieParser = require('cookie-parser');

var sessionTimeout_ = "15";

app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

});

app.get('/', function (req, res) {  
    res.send('LLA API');
});


//TODO: register/:uname/pword
//TODO: logout

/**
 * Check that there is a matching user in the users table.
 * If they exist create a session and pass back the session id.
 */
app.get('/login/:username/:password', function (req, res) {    
    if(checkLogged(req) == true){
        return sendJSON({"error": "User already logged in"}, res);        
    }
    
    var queryString = "select userId from users where username=? and encPass=?";
    var username = req.params.username;
    var password = req.params.password;
        
    var query = db.query( queryString, [username, password], function(err, result){
        if(err){
           console.log('Error in prepared statement: ' + err);
        } else {
            if(result.length == 1){ 
                grabSession(result[0].userId, res, true);
            } else {
                sendJSON({"error": "Login failed: Invalid credentials"}, res);
            }
       }
    });
});

function checkLogged(req){
    var cookie = req.cookies.session;
    return (cookie !== undefined && cookie.sessionId)? true : false;
}

/*
* Grab a session that has already been created.
*/
function grabSession( userId, res){
    grabSession( userId, res, false );
}
/*
* Grab a session that has already been created.
* if the create flag is true then upon finding no matches a new session will be created.
*/ 
function grabSession( userId, res, create ){
    var queryString = "select sessionId from sessions where userId=? and visited_on > timestamp(DATE_SUB(NOW(), INTERVAL " + sessionTimeout_ + " MINUTE))";
    var query = db.query( queryString, userId, function(err, result){
        if (err){
            console.log('Error in query: ' + err);
        } else {
            if(result.length >= 1){
               res.cookie('session',result[0], { maxAge: 900000, httpOnly: true});
               sendJSON(result[0], res);
            } else {
               if(create){
                   upsertSession(userId, res);
               } else {
                   sendJSON({"error": "Session invalid: Login required"}, res);
               }
            }
        }
    });        
}

/*
* Initially create a session or update the session that can be used after logging in
*/
function upsertSession(userId, res){
    var queryString = "select sessionId from sessions where userId = ?";
    var query = db.query( queryString, userId, function(err, result){
       if(err){
           console.log("Error in quert: " + err);
       } else {
           if(result.length >= 1){               
               updateSession( userId, res);
           } else {
               createSession( userId, res);
           }
       }
    });
}

function createSession( userId, res ){
    var queryString = "insert into sessions(userId) values (?)";
    var query = db.query( queryString, userId, function(err, result){
        if(err){
            console.log('Error in query: ' + err);
        } else {
            grabSession( userId, res );
        }     
    });
}

function updateSession( userId, res ){
    var queryString = "update sessions set visited_on=timestamp(NOW()) where userId=?";
    var query = db.query( queryString, userId, function(err, result){
        if(err){
            console.log('Error in query: ' + err);
        } else {
            grabSession( userId, res );
        }     
    });
}

/**
* If we did not match on a login/register and we do not have a cookie then we should be creating an error at this point.
*/
app.use(function (req, res, next) {
  // check if client sent a cookie
  var cookie = req.cookies.session;    
  if (cookie === undefined) {
    sendJSON({"Error": "No session detected"}, res);
  }
  next();
});



//properties/
//properties/:id

//properties/:id/tenants/
//properties/:id/tenants/:id


    























/*
* Create a helper to query the database
* Note that db.query is asynchronous
*/
function runQuery( queryString , res){
    var query = db.query( queryString, function(err, result){
        if(err){
            console.log('Error in query: ' + err);
        } else {
            sendJSON(result, res);
        } 
    });
}

/*
* Create a helper for a simple single prepared statement
* Note that db.query is asynchronous.
*/
function runPreparedStatment( queryString, val, res){
    var resultSet_;
    var query = db.query( queryString, val, function(err, result){
       if(err){
           console.log('Error in prepared statement: ' + err);
       } else {
           sendJSON(result, res);
       }
    });
}

function sendJSON( toSend, res){
    res.setHeader('Content-Type', 'application/json');
    res.json(toSend);
}
