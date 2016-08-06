var db = require('../db/db');
var ResponseService = require('../services/ResponseService');
var PropertyService = require('../services/PropertyService');

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
  //properties/:id/tenants/
  app.get('/properties/:pid/tenants', function(req, res) {
      var sessionId = req.cookies.session.sessionId;
      var propertyId = req.params.pid;
      var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?)";
      var query = db.query(queryString, [sessionId, propertyId], function(err, result) {
          if(err) {
              console.log('Error in query: ' + err);
          } else {
              ResponseService.sendJSON(result, res);
          }
      });
  });
  /**
   * Grab a specific tenant from a property
   */
  //properties/:id/tenants/:id
  app.get('/properties/:pid/tenants/:tid', function(req, res){
    var sessionId = req.cookies.session.sessionId;
    var propertyId = req.params.pid;
    var tenantId = req.params.tid;
    var queryString = "select * from tenants where tenants.propertyId =(select propertyId from properties AS p JOIN sessions AS s ON s.userId=p.userId where s.sessionId=? and p.propertyId=?) and tenantId=?";
    var query = db.query(queryString, [sessionId, propertyId, tenantId], function(err, result) {
      if(err) {
        console.log('Error in query: ' + err);
      } else {
        ResponseService.sendJSON(result, res);
      }
    });
  });
};
module.exports = PropertyController;