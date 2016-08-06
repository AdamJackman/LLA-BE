var db = require('../db');

var PropertyStore = {
  getPropertiesForUser : function(sessionId, success){
    var queryString = "select * from properties JOIN sessions ON sessions.userId=properties.userId where sessions.sessionId=?";
    db.query(queryString, sessionId, success);
  },
  getPropertyById : function(params, success){
    var queryString = "select * from properties JOIN sessions ON sessions.userId=properties.userId where sessions.sessionId=? and properties.propertyId=?";
    db.query(queryString, params, success);
  }
};
module.exports = PropertyStore;