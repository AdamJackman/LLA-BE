var db = require('../db');

var PropertyStore = {
    getPropertiesForUser : function(sessionId, success){
      var queryString = "select * from properties JOIN sessions ON sessions.userId=properties.userId where sessions.sessionId=?";
      db.query(queryString, sessionId, success);
      //TODO:
    },
    getPropertyById : function(params, success){
      var queryString = "select * from properties JOIN sessions ON sessions.userId=properties.userId where sessions.sessionId=? and properties.propertyId=?";
      db.query(queryString, params, success);
    }
    /** TODO: Probably more suited to a tenants store
    var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?)";
    var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?) and tenantId=?";
    **/
};
module.exports = PropertyStore;