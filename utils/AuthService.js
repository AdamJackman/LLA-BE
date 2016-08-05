var db = require('../db/db');
var ResponseService = require('./ResponseService');
var AuthStore = require('../db/stores/AuthStore');

var AuthService = {
  /* 
  * Look for a cookie in the request
  * TODO: Validation on the validity of the cookie
  */
  checkLoggedIn : function(req) {
    var cookie = req.cookies.session;
    return (cookie !== undefined && cookie.sessionId)? true : false;
  },

  /*
  * Grab a session that has already been created.
  * if the create flag is true then upon finding no matches a new session will be created.
  */
  grabSession: function(userId, res) {
    var onSuccess = function(err, result){
      if (err) {
        console.log('Error in query: ' + err);
      } else {
        if(result.length >= 1) {
          res.cookie('session',result[0], { maxAge: 900000, httpOnly: true});
          ResponseService.sendJSON(result[0], res);
        } else {
          ResponseService.sendJSON({"error": "Server Error: Could not allocate a session"}, res);
        }
      }
    }
    AuthStore.getForUser(userId, onSuccess.bind(this));
  },

  /**
  * Insert into the database a new user
  */
  registerUser : function(req,res) {   
    var firstName = req.body.firstName;
    var lastName  = req.body.lastName;
    var username  = req.body.username;
    var password  = req.body.password;
    var registerQueryString = "insert into users(firstName, lastName, username, encPass) values(?,?,?,?)";
    var onSuccess = function(err, result) {
      if (err) {
        console.log('Error in query: ' + err);
      } else {
        ResponseService.sendJSON({"success": "Registration Complete: Successfully Registered"}, res);
      }
    }
    var registerQuery = db.query( registerQueryString, [firstName, lastName, username, password], onSucess.bind(this));
  },
  createSession : function(userId, res) {
    var onSuccess = function (err, result) {
      if (err) {
        console.log('Error in query: ' + err);
      } else {
        this.grabSession(userId, res);
      }
    }
    AuthStore.addSessionForUser(userId, onSuccess.bind(this));
  },
  updateSession : function(userId, res) {
    var onSuccess = function(err, result) {
      if (err) {
        console.log('Error in query: ' + err);
      } else {
        this.grabSession( userId, res );
      }
    }
    AuthStore.updateSessionForUser(userId, onSucess.bind(this));
  },
   /*
   * Initially create a session or update the session that can be used after logging in
   */
   upsertSession : function(userId, res) {
     var onSuccess = function(err, result) {
       if (err) {
         console.log("Error in query: " + err);
       } else {
         if (result.length >= 1) {
           this.updateSession(userId, res);
         } else {
           this.createSession(userId, res);
         }
       }
     }
     AuthStore.getForUser(userId, onSuccess.bind(this));
   }
};
module.exports = AuthService;