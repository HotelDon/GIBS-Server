"use strict";

module.exports = function(db)
{
    var auth = require("./auth.js")(db);

    var usersLoggedIn = {};

    exports.login = userLogin;
    exports.register = userRegister;
    exports.getUsersLoggedIn = getUsersLoggedIn;

    function userLogin(uname, pword, callback)
    {    
        
    }

    function userRegister(uname, pword, email, callback)
    {
        
    }

    function getUsersLoggedIn()
    {
        
    }
}

