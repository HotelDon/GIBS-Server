"use strict";

var db = require("./dblite.js");
var users = require("./users.js")(db);

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
        
        users.userRegister(socket, data.uname, data.pword, data.email, callback);
    }
    function login(data)
    {
        users.userLogin(socket, data.uname, data.pword, callback);
    }
    
    function callback(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(result);
            console.log(socket.userData);
        }
    }
}