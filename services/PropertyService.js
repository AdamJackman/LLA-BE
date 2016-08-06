var ResponseService = require('./ResponseService');
var PropertyStore = require('../db/stores/PropertyStore');

var PropertyService = {
 /**
   * Using the session query the database for all properties of the user
   */
  getProperties: function (sessionId, res) {
    var onSuccess = function(err, result) {
      if(err) { throw new PropertyServiceException('Error Trying to get all Properties'); }
      ResponseService.sendJSON(result, res);
    };
    PropertyStore.getPropertiesForUser(sessionId, onSuccess.bind(this));
  },
  /**
   * Using the session query the database a properties of the user
   * with a matching propertyId
   */
  //properties/:id
  getProperty: function (sessionId, propertyId, res) {
    var onSuccess = function(err, result) {
      if(err) { throw new PropertyServiceException('Error trying to get a specific Property'); }
      ResponseService.sendJSON(result, res);
    };
    PropertyStore.getPropertyById([sessionId, propertyId], onSuccess.bind(this));
  },
  /**
   * Grab all tenants for a property
   */
  //properties/:id/tenants/
  getPropertyTenants: function(req, res) {
    var sessionId = req.cookies.session.sessionId;
    var propertyId = req.params.pid;
    var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?)";
    var onSuccess = function(err, result) {
      if(err) { throw new PropertyServiceException('Error trying to get Tenatnts for a property'); }
      ResponseService.sendJSON(result, res);
    };
    //var query = db.query(queryString, [sessionId, propertyId],
  },
  /**
   * Grab a specific tenant from a property
   */
  //properties/:id/tenants/:id
  getPropertyTenant: function(req, res){
    var sessionId = req.cookies.session.sessionId;
    var propertyId = req.params.pid;
    var tenantId = req.params.tid;
    var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?) and tenantId=?";
    var onSuccess = function(err, result) {
      if(err) { throw new PropertyServiceException('Error Getting a Tenant for a Property') }
      ResponseService.sendJSON(result, res);
    };
    //var query = db.query(queryString, [sessionId, propertyId, tenantId], function(err, result) {
  }
};
function PropertyServiceException(message) {
   this.message = message;
   this.name = "PropertyServiceException";
}
module.exports = PropertyService;