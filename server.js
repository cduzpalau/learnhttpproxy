const http = require('http'),
    httpProxy = require('http-proxy');
const fs = require('fs');
const PORT = process.env.PORT || 8080;
const TARGET_URL = process.env.TARGET_URL || 'https://enip183xw2qhn.x.pipedream.net';
//Inbound authorization header expected for Basic Auth
const IN_AUTH = process.env.IN_AUTH || 'Basic YYYYY';
//Outbound authorization header to be sent towards target URL
const OUT_AUTH = process.env.OUT_AUTH || 'AccessKey XXXXX';

 
//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});
 
// To modify the proxy connection before data is sent, you can listen
// for the 'proxyReq' event. When the event is fired, you will receive
// the following arguments:
// (http.ClientRequest proxyReq, http.IncomingMessage req,
//  http.ServerResponse res, Object options). This mechanism is useful when
// you need to modify the proxy request before the proxy connection
// is made to the target.
//
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.removeHeader('Authorization')
  proxyReq.setHeader('Authorization', OUT_AUTH);
});
 
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  // username whatever password cisco123
  if (req.headers.authorization === IN_AUTH){
    proxy.web(req, res, {
      target: TARGET_URL,
      changeOrigin: true
    });
  } else {
    res.statusCode[401];
    res.statusMessage = 'Unauthorized';
    res.end('Unauthorized');
  }
  
});
 
console.log(`listening on port ${PORT}...`)
server.listen(PORT);