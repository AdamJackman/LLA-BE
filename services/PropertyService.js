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
  }
};
function PropertyServiceException(message) {
   this.message = message;
   this.name = "PropertyServiceException";
}
module.exports = PropertyService;