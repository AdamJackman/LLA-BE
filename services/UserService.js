var SessionService = require('./SessionService');
var ResponseService = require('./ResponseService');
var UserStore = require('../db/stores/UserStore');

var UserService = {
	/**
	* Lookup if there is a userName and password match,
	* if there is then upsert
	*/
	login : function(username, password, res) {
	  var onSuccess = function(err, result) {
	    if (err) { throw new UserServiceException('Error trying to login user.'); }
      if (result.length == 1) {
        SessionService.upsertSession(result[0].userId, res);
      } else {
        ResponseService.sendJSON({"error": "Login failed: Invalid credentials"}, res);
      }
	  }
	  UserStore.getUser([username, password], onSuccess.bind(this))
	},
	/**
  * Insert into the database a new user
  */
  registerUser : function(firstName, lastName, username, password, res) {   
  	if(!firstName || !lastName || !username || !password) {
      return ResponseService.sendJSON({"error": "Please Fill Out All Fields"}, res);
  	}
    var onSuccess = function(err, result) {
      if (err) { throw new UserServiceException('Error trying to register user.'); }
      ResponseService.sendJSON({"success": "Registration Complete: Successfully Registered"}, res);
    }
    UserStore.addUser([firstName, lastName, username, password], onSuccess.bind(this));
  }
};
function UserServiceException(message) {
   this.message = message;
   this.name = "UserServiceException";
}
module.exports = UserService;