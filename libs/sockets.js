"use strict";

var db = require("./dblite.js");
var auth = require("./auth.js")(db);

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
        auth.register(data.uname, data.pword, data.email, callback);
    }
    function login(data)
    {
        auth.login(data.uname, data.pword, callback);
    }
    
    function callback(err, result)
    {
        if(err)
        {
            console.log("Error: "+err);
        }
        else
        {
            console.log("Result: "+result);
        }
    }
}