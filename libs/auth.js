"use strict";

module.exports = function(db){
    module.login = login;
    module.register = register;
    
    function login(uname, pword, callback)
    {
        db.checkPassword(uname, pword, callback);
    }
    
    function register(uname, pword, email, callback)
    {
        db.addUser(uname, pword, email, regCallback);
        
        function regCallback(err, result)
        {
            if(err)
            {
                callback(err);
            }
            else
            {
                login(uname, pword, callback);
            }
        }
    }
    
    return module;
}