"use strict";

var db = require("./dblite.js");

var nssocket = require("nssocket");

var server = nssocket.createServer(onConnect);
var port = 6785;

server.listen(port);
console.log("Connected to port "+port);

function onConnect (socket)
{
    socket.send(["connect", "success"]);
    socket.data(["auth","reg"], register);
    socket.data(["auth","login"], login);
    
    function register(data)
    {

    }
    function login(data)
    {
        
    }
}