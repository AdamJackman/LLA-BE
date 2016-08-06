var db = require('../db');

var TenantStore = {
    getTenantsForProperty : function(sessionId, propertyId, success){
      var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?)";
      db.query(queryString, sessionId, success);
    },
    getTenantForPropertyAndId : function(sessionId, propertyId, tenantId, success){
      var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?) and tenantId=?";
      db.query(queryString, sessionId, success);
    }
};
module.exports = TenantStore;