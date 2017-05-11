const net = require("net");
var log4js = require('log4js');

log4js.configure({
   appenders: [
      { type: 'console' },
      { type: 'file', filename: 'logs/dispatcher.log', category: 'dispatcher' }
   ]
});

const logger = log4js.getLogger('dispatcher'); 

var m_server;
var m_socketList = [];

function createServer () {
   m_server = net.createServer();

   m_server.on("connection", function (socket) {

      m_socketList.push(socket);

      logger.debug(socket.remoteAddress + ":" + socket.remotePort + " connected");

      socket.once("close", function () {
         var index = m_socketList.indexOf(socket);

         if (index > -1) {
            m_socketList.splice(index, 1);
         }

         logger.debug(socket.remoteAddress + ":" + socket.remotePort + " closed connection")
      });

      socket.on("error", function (error) {
         logger.error("Socket " + socket.remoteAddress + ":" + socket.remotePort + " error: " + error.message)
      });
   });

   // Listen for connections
   m_server.listen(61337, "localhost", function () {
      logger.debug("Listening on port " + m_server.address().port);
   });
}

function dispatch(remoteAddress) {

   // Dispatch to all workers
   m_socketList.forEach(function (socket) {
      socket.write("Dispatching " + remoteAddress);
   });
}

module.exports = { createServer, dispatch }