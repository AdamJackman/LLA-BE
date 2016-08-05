var db = require('../db');

const sessionTimeout_ = 15;

var SessionStore = {
  getForUser : function(userId, success) {
    var queryString = "select sessionId from sessions where userId=? and visited_on > timestamp(DATE_SUB(NOW(), INTERVAL " 
      + sessionTimeout_ + " MINUTE));";
    db.query(queryString, userId, success);
  },
  addSessionForUser : function(userId, success) {
    var queryString = "insert into sessions(userId) values (?)";
    db.query(queryString, userId, success);
  },
  updateSessionForUser : function(userId, success) {
    var queryString = "update sessions set visited_on=timestamp(NOW()) where userId=?";
    db.query(queryString, userId, success);
  },
  getForSessionId : function(sessionId, success) {
    var queryString = "select sessionId from sessions where sessionId=? and visited_on > timestamp(DATE_SUB(NOW(), INTERVAL " 
      + sessionTimeout_ + " MINUTE));";
    db.query(queryString, sessionId, success);
  }
};
module.exports = SessionStore;