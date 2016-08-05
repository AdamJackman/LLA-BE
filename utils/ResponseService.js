var ResponseService = {
  //Set up a JSON Response
  sendJSON: function ( toSend, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json(toSend);
  }
}
module.exports = ResponseService;
