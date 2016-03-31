"use strict";

var db = require("./dblite.js");

var nssocket = require("nssocket");

var server = nssocket.createServer(onConnect);
var port = 6785;

server.listen(port);
console.log("Connected to port "+port);

function onConnect (socket)
{
    socket.send(["you", "there"], {data:true, string:"I'm a string", number:43});
    socket.data(["iam","here"], testMessage);
    
    function testMessage(data)
    {
        console.log(typeof(data));
        console.log(data["iam"]);
        console.log(data["indeedHere"]);
    }
}