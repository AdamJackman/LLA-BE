var path = require('path');
var express = require('express');
var app = express();

var SessionService = require('./services/SessionService');
var ResponseService = require('./services/ResponseService');
var UserService = require('./services/UserService');

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

// Include User Endpoints
require('./controllers/UserController')(app);
/**
* This is the Login Filter:
* If we did not match on a login/register and we do not have an active session then we cannot continue
*/
app.use(function (req, res, next) {
  SessionService.checkLoggedIn(
    req,
    res,
    function(req, res) {
      next();  
    },
    function(req, res) {
      ResponseService.sendJSON({"Error": "No session detected"}, res);
    }) 
});
//Include logout endpoint
app.get('/logout', function (req, res) {
  var sessionId = req.cookies.session.sessionId;
  SessionService.removeSession(sessionId, res);
});
//Include Property Endpoints
require('./controllers/PropertyController')(app);

