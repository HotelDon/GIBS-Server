"use strict";

module.exports = function(db){
    module.login = login;
    module.register = register;
    
    var bcrypt = require("bcrypt");
    
    var dummyHash = "$2a$12$jhMgY2jPZuq1OuFxxPRcYur786D5SIdZWTD.E1Go.e2t5PECl.BWC";
    
    function login(uname, pword, callback)
    {
        db.getUserInfo(uname, hashCallback);
        
        function hashCallback(err, row)
        {
            if(!err && row)
            {
                bcrypt.compare(pword, row["password"], bcryptResult);
            }
            else
            {
                bcrypt.compare(pword, dummyHash, dummyCallback);
            }
            
            function bcryptResult(err, matches) 
            {   
                if (!err && matches)
                { 
                    callback(null, {"uid":row["uid"], "uname":row["username"]});
                }
                else
                {
                    callback(new Error("Incorrect Username or Password"));
                }
            }
            
            function dummyCallback(err, matches)
            {
                if(matches)
                {
                    //Wait what? You shouldn't be here.
                    callback(new Error("If you're seeing this, something has gone terribly wrong"));
                }
                else
                {
                    callback(new Error("Incorrect Username or Password"));
                }
            }
        }  
    }
    
    function register(uname, pword, email, callback)
    {
        bcrypt.hash(pword, 12, hashResult);
        
        function hashResult(err, hash)
        {    
            if(!err)
            {
                db.addUser(uname, hash, email, regCallback);
            }
            else
            {
                callback(err); //This should never throw an error. 
            }
            
            function regCallback(err, result)
            {
                if(err)
                {
                    callback(err);
                }
                else
                {
                    callback(null, "Registration Successful!")
                }
            }
        }
    }
    
    return module;
}