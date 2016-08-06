var db = require('../db/db');
var ResponseService = require('../services/ResponseService');
var PropertyService = require('../services/PropertyService');
var TenantService = require('../services/TenantService');

var PropertyController = function(app){
  /**
   * Using the session query the database for all properties of the user
   */
  app.get('/properties', function (req, res) {
    var sessionId = req.cookies.session.sessionId;
    PropertyService.getProperties(sessionId, res);
  });
  /**
   * Using the session query the database a properties of the user
   * with a matching propertyId
   */
  app.get('/properties/:id', function (req, res) {
    var sessionId = req.cookies.session.sessionId;
    var propertyId = req.params.id;
    PropertyService.getProperty(sessionId, propertyId, res);
  });
  /**
   * Grab all tenants for a property
   */
  app.get('/properties/:pid/tenants', function(req, res) {
      var sessionId = req.cookies.session.sessionId;
      var propertyId = req.params.pid;
      TenantService.getPropertyTenants(sessionId, propertyId, res);
  });
  /**
   * Grab a specific tenant from a property
   */
  app.get('/properties/:pid/tenants/:tid', function(req, res){
    var sessionId = req.cookies.session.sessionId;
    var propertyId = req.params.pid;
    var tenantId = req.params.tid;
    TenantService.getPropertyTenant(sessionId, propertyId, tenantId, res);
  });
};
module.exports = PropertyController;