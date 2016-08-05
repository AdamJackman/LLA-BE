var ResponseService = {
  sendJSON: function ( toSend, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json(toSend);
  }
}
module.exports = ResponseService;
