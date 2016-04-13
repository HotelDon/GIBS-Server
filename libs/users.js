"use strict";

module.exports = function(db)
{
    var auth = require("./auth.js")(db);

    var usersLoggedIn = {};

    module.userLogin = userLogin;
    module.userRegister = userRegister;
    module.getUsersLoggedIn = getUsersLoggedIn;

    function userLogin(socket, uname, pword, callback)
    {    
        if(!socket.userData)
        {
            auth.login(uname, pword, loginCallback);
        }
        else
        {
            callback(new Error("You're already logged in!"));
        }
        
        function loginCallback(err, result)
        {
            if(!err && result)
            {
                if(!usersLoggedIn[result.uid])
                {
                    usersLoggedIn[result.uid] = {"uid":result.uid, "uname":result.uname};
                    socket.userData = usersLoggedIn[result.uid];
                    callback(null, "Logged in Successfully");
                }
                else
                {
                    callback(new Error("You're logged in on another device"));
                }
                
            }
            else
            {
                callback(err);
            }
        }
    }

    function userRegister(socket, uname, pword, email, callback)
    {
        if(!socket.userData)
        {
            auth.register(uname, pword, email, regCallback);
        }
        else
        {
            callback(new Error("You're already logged in!"));
        }
        
        function regCallback(err, result)
        {
            if(!err && result)
            {
                callback(null, "Registeration Successful!");
            }
            else
            {
                callback(new Error("That username or email address is already in use."));
            }
        }
    }

    function getUsersLoggedIn()
    {
        
    }
    
    return module;
}

