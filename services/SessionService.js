var ResponseService = require('./ResponseService');
var SessionStore = require('../db/stores/SessionStore');

var SessionService = {
  /* 
  * Look for a cookie in the request
  * TODO: Validation on the validity of the cookie
  */
  checkLoggedIn : function(req, res, onSession, onNoSession) {
    if (req.cookies.session === undefined || !req.cookies.session.sessionId) { return onNoSession(req, res); }
    var onSuccess = function(err, result){
      if (err) { throw new SessionServiceException('Error trying to grab session from cookie.' + err); }
      if (result.length >= 1) {
        onSession(req, res);
      } else {
        onNoSession(req, res);
      }
    }
    SessionStore.getForSessionId(req.cookies.session.sessionId, onSuccess.bind(this));
  },
  /*
  * Grab a session that has already been created.
  * if the create flag is true then upon finding no matches a new session will be created.
  */
  grabSession: function(userId, res) {
    var onSuccess = function(err, result) {
      if (err) { throw new SessionServiceException('Error trying to grab session.'); }
      if (result.length >= 1) {
        res.cookie('session',result[0], { maxAge: 900000, httpOnly: true});
        ResponseService.sendJSON(result[0], res);
      } else {
        ResponseService.sendJSON({"error": "Server Error: Could not allocate a session"}, res);
      }
    }
    SessionStore.getForUser(userId, onSuccess.bind(this));
  },
  /*
  * When a user touches an endpoint while logged in we want to either:
  * 1. create a session if one does not exist.
  * 2. update the lastVisited so the session TTL resets.
  */
  upsertSession : function(userId, res) {
    var onSuccess = function(err, result) {
      if (err) { throw new SessionServiceException('Error trying to grab session.'); }
      if (result.length >= 1) {
        this.updateSession(userId, res);
      } else {
        this.createSession(userId, res);
      }
    }
    SessionStore.getForUser(userId, onSuccess.bind(this));
   },
  //
  createSession : function(userId, res) {
    var onSuccess = function (err, result) {
      if (err) { throw new SessionServiceException('Error trying to grab session.'); }
      //Session has been created attempt again to grab it
      this.grabSession(userId, res);
    }
    SessionStore.addSessionForUser(userId, onSuccess.bind(this));
  },
  //
  updateSession : function(userId, res) {
    var onSuccess = function(err, result) {
      if (err) { throw new SessionServiceException('Error trying to grab session.'); }      
      this.grabSession( userId, res );
    }
    SessionStore.updateSessionForUser(userId, onSucess.bind(this));
  },
  //
  removeSession : function(sessionId, res) {
    if(!sessionId) { throw new SessionServiceException('')}
    var onSuccess = function(err, result) {
      if (err) { throw new SessionServiceException('Error trying to delete session'); }
      res.cookie('session', null, { maxAge: 900000, httpOnly: true});
      ResponseService.sendJSON({"Success": "session removed"}, res);
    }
    SessionStore.removeForSessionId(sessionId, onSuccess.bind(this));
  }
};
function SessionServiceException(message) {
   this.message = message;
   this.name = "SessionServiceException";
}
module.exports = SessionService;