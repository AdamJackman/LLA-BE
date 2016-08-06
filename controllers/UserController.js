var SessionService = require('../services/SessionService');
var ResponseService = require('../services/ResponseService');
var UserService = require('../services/UserService');

var UserController = function(app){
  /**
   * Check that there is a matching user in the users table.
   * If they exist create a session and pass back the session id.
   */
  app.get('/login/:username/:password', function (req, res) { //TODO: Post
    var username = req.params.username;
    var password = req.params.password;
    SessionService.checkLoggedIn(
      req,
      res,
      function(req, res) {
        ResponseService.sendJSON({"error": "User already logged in"}, res);
      },
      function(req,res) {
        UserService.login(username, password, res);
    });
  });
  //
  app.post('/register', function(req, res) {
    var firstName = req.body.firstName;
    var lastName  = req.body.lastName;
    var username  = req.body.username;
    var password  = req.body.password;
    SessionService.checkLoggedIn(
      req,
      res,
      function(req, res) {
        ResponseService.sendJSON({"error": "User Already logged in"}, res);
      },
      function(req, res) {
        UserService.register(firstName, lastName, username, password, res);
    });
  });
  //
  app.get('/login', function(req, res) { //TODO: testing endpoint only
    SessionService.checkLoggedIn(
      req,
      res,
      function(req, res) {
        ResponseService.sendJSON({"loggedIn": true}, res);
      },
      function(req, res) {
        ResponseService.sendJSON({"loggedIn": false}, res);
    });
  });
};
module.exports = UserController;