var db = require('./db');
var path = require('path');
var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');

var sessionTimeout_ = "15";


app.use('/', express.static(path.join(__dirname, 'public')));
app.set('port', (process.env.PORT || 3000));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var server = app.listen(app.get('port'), function(){
	var host = server.address().address;
	var port = server.address().port;

});


//TODO: register/:uname/pword

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
                upsertSession(result[0].userId, res);
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
* if the create flag is true then upon finding no matches a new session will be created.
*/ 
function grabSession( userId, res ){
    var queryString = "select sessionId from sessions where userId=? and visited_on > timestamp(DATE_SUB(NOW(), INTERVAL " + sessionTimeout_ + " MINUTE))";
    var query = db.query( queryString, userId, function(err, result){
        if (err){
            console.log('Error in query: ' + err);
        } else {
            if(result.length >= 1){
               res.cookie('session',result[0], { maxAge: 900000, httpOnly: true});
               sendJSON(result[0], res);
            } else {
               sendJSON({"error": "Server Error: Could not allocate a session"}, res);               
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
  if (checkLogged(req) == false) {
    sendJSON({"Error": "No session detected"}, res);
  } else {
    next();    
  }  
});

//logout/
app.get('/logout', function (req, res) {
    var sessionId = req.cookies.session.sessionId;            
    var queryString = "delete from sessions where sessionId=?";
        
    var query = db.query(queryString, sessionId, function(err, result){
       if(err){
           console.log("Error in query: " + err);
       } else {
           res.cookie('session',null, { maxAge: 900000, httpOnly: true});
           sendJSON({"Sucess": "session removed"}, res);          
       }
    });
});

/**
 * Using the session query the database for all properties of the user
 */
app.get('/properties', function (req, res) {    
    var sessionId = req.cookies.session.sessionId;        
    var queryString = "select * from properties JOIN sessions ON sessions.userId=properties.userId where sessions.sessionId=?";
    var query = db.query( queryString, sessionId, function(err, result){
        if(err){
            console.log('Error in query: ' + err);
        } else {
            sendJSON(result, res);
        }     
    });        
});


/**
 * Using the session query the database a properties of the user
 * with a matching propertyId
 */
//properties/:id
app.get('/properties/:id', function (req, res) {    
    var sessionId = req.cookies.session.sessionId;        
    var propertyId = req.params.id;
    
    var queryString = "select * from properties JOIN sessions ON sessions.userId=properties.userId where sessions.sessionId=? and properties.propertyId=?";
    var query = db.query( queryString, [sessionId, propertyId], function(err, result){
        if(err){
            console.log('Error in query: ' + err);
        } else {
            sendJSON(result, res);
        }     
    });        
});


/**
 * Grab all tenants for a property
 */
//properties/:id/tenants/
app.get('/properties/:pid/tenants', function(req, res){
    var sessionId = req.cookies.session.sessionId;        
    var propertyId = req.params.pid;
    var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?)";
    
    var query = db.query( queryString, [sessionId, propertyId], function(err, result){
        if(err){
            console.log('Error in query: ' + err);
        } else {
            sendJSON(result, res);
        }     
    });            
});

/**
 * Grab a specific tenant from a property
 */
//properties/:id/tenants/:id
app.get('/properties/:pid/tenants/:tid', function(req, res){
    var sessionId = req.cookies.session.sessionId;        
    var propertyId = req.params.pid;
    var tenantId = req.params.tid;
    var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?) and tenantId=?";
    
    var query = db.query( queryString, [sessionId, propertyId, tenantId], function(err, result){
        if(err){
            console.log('Error in query: ' + err);
        } else {
            sendJSON(result, res);
        }     
    });            
});


function sendJSON( toSend, res){
    res.setHeader('Content-Type', 'application/json');
    res.json(toSend);
}
