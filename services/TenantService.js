var ResponseService = require('./ResponseService');
var TenantStore = require('../db/stores/TenantStore');

var TenantService = {
  /**
   * Grab all tenants for a property
   */
  getPropertyTenants: function(sessionId, propertyId, res) {
    var onSuccess = function(err, result) {
      if(err) { throw new PropertyServiceException('Error trying to get Tenatnts for a property'); }
      ResponseService.sendJSON(result, res);
    };
    TenantStore.getTenantsForProperty(sessionId. propertyId, onSuccess.bind(this));
  },
  /**
   * Grab a specific tenant from a property
   */
  getPropertyTenant: function(sessionId, propertyId, tenantId, res){
    var onSuccess = function(err, result) {
      if(err) { throw new PropertyServiceException('Error Getting a Tenant for a Property') }
      ResponseService.sendJSON(result, res);
    };
    TenantStore.getTenantForPropertyAndId(sessionId, propertyId, tenantId, onSuccess.bind(this));
  }
};
function TenantServiceException(message) {
   this.message = message;
   this.name = "TenantServiceException";
}
module.exports = TenantService;