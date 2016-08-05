var db = require('./db/db');
var path = require('path');
var express = require('express');
var app = express();

var AuthService = require('./utils/AuthService');
var ResponseService = require('./utils/ResponseService');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use('/', express.static(path.join(__dirname, 'public')));
app.set('port', (process.env.PORT || 3000));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var server = app.listen(app.get('port'), function(){
	var host = server.address().address;
	var port = server.address().port;
});

/**
 * Check that there is a matching user in the users table.
 * If they exist create a session and pass back the session id.
 */
app.get('/login/:username/:password', function (req, res) { //TODO: Post
  if(AuthService.checkLoggedIn(req) == true) {
    return ResponseService.sendJSON({"error": "User already logged in"}, res);
  }
  //TODO: Abstract out of the endpoint
  var queryString = "select userId from users where username=? and encPass=?";
  var username = req.params.username;
  var password = req.params.password;

  //TODO: Hash Password
  var query = db.query(queryString, [username, password], function(err, result) {
    if(err) {
      console.log('Error in prepared statement: ' + err);
    } else {
      if(result.length == 1) {
        AuthService.upsertSession(result[0].userId, res);
      } else {
        ResponseService.sendJSON({"error": "Login failed: Invalid credentials"}, res);
      }
    }
  });
});

app.get('/login', function(req, res) { //TODO: testing endpoint only
  if(AuthService.checkLoggedIn(req) == true) {
    ResponseService.sendJSON({"loggedIn": true}, res);
  } else {
    ResponseService.sendJSON({"loggedIn": false}, res);
  }
});

app.post('/register', function(req, res) {
  //TODO: Abstract out of this file
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var username = req.body.username;
  var password = req.body.password;

  if(!firstName || !lastName || !username || !password) {
      ResponseService.sendJSON({"error": "Please Fill Out All Fields"}, res);
  } else {
    //TODO: Hash Password 
    var queryString = "select userId from users where username=?";
    var query = db.query(queryString, username, function(err, result) {
    if(err) {
      } else {
        if(result.length == 0) {
          AuthService.registerUser(req,res);
        } else {
          ResponseService.sendJSON({"error": "Username already in use"}, res);
        }
      }
    });
  }
});

/**
* This is the Login Filter:
* If we did not match on a login/register and we do not have an active session then we cannot continue
*/
app.use(function (req, res, next) {
  // check if client sent a cookie  
  if (AuthService.checkLoggedIn(req) == false) {
    ResponseService.sendJSON({"Error": "No session detected"}, res);
  } else {
    next();
  }  
});

//logout
app.get('/logout', function (req, res) {
  var sessionId = req.cookies.session.sessionId;
  var queryString = "delete from sessions where sessionId=?";

  var query = db.query(queryString, sessionId, function(err, result) {
    if(err){
      console.log("Error in query: " + err);
    } else {
      res.cookie('session',null, { maxAge: 900000, httpOnly: true});
      ResponseService.sendJSON({"Success": "session removed"}, res);
    }
  });
});

/**
 * Using the session query the database for all properties of the user
 */
app.get('/properties', function (req, res) {    
  var sessionId = req.cookies.session.sessionId;
  var queryString = "select * from properties JOIN sessions ON sessions.userId=properties.userId where sessions.sessionId=?";
  var query = db.query(queryString, sessionId, function(err, result) {
    if(err) {
      console.log('Error in query: ' + err);
    } else {
      ResponseService.sendJSON(result, res);
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
  var query = db.query(queryString, [sessionId, propertyId], function(err, result) {
    if(err) {
      console.log('Error in query: ' + err);
    } else {
      ResponseService.sendJSON(result, res);
    }
  });
});

/**
 * Grab all tenants for a property
 */
//properties/:id/tenants/
app.get('/properties/:pid/tenants', function(req, res) {
    var sessionId = req.cookies.session.sessionId;        
    var propertyId = req.params.pid;
    var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?)";
    var query = db.query(queryString, [sessionId, propertyId], function(err, result) {
        if(err) {
            console.log('Error in query: ' + err);
        } else {
            ResponseService.sendJSON(result, res);
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
  var query = db.query(queryString, [sessionId, propertyId, tenantId], function(err, result) {
    if(err) {
      console.log('Error in query: ' + err);
    } else {
      ResponseService.sendJSON(result, res);
    }
  });
});