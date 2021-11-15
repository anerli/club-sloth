const express = require('express');
const socket_server = require('./socket_server')

var PORT = process.env.PORT || 3000;
var app = express();
var server = app.listen(PORT);

// Serve the static HTML
app.use(express.static('public'));

console.log("Server running on http://localhost:"+PORT);

socket_server.build_socket(server);
