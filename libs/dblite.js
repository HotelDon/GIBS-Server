"use strict";

var sqlite = require("sqlite3");
var db = new sqlite.Database("database.db");
var bcrypt = require("bcrypt");

//SQL statements
var createUserTable = "CREATE TABLE IF NOT EXISTS users (usr_num INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, email TEXT UNIQUE NOT NULL)";

var insertNewUser = "INSERT INTO users (username, password, email) VALUES (?,?,?)";
var getUserPassword = "SELECT password FROM users WHERE username = ?";

var dummyHash = "$2a$12$jhMgY2jPZuq1OuFxxPRcYur786D5SIdZWTD.E1Go.e2t5PECl.BWC";

exports.addUser = addUser;

db.serialize(initializeDB);

//Makes sure that every table that should exist in the database, does exist.
function initializeDB()
{
    db.run(createUserTable);
}

function addUser(uname, pword, email, callback)
{
    bcrypt.hash(pword, 12, hashResult);
    
    function hashResult(err, hash)
    {    
        if(!err)
        {
            db.run(insertNewUser, uname, hash, email, insertResult);
        }
        else
        {
            callback(err);
        }
        
        function insertResult(err)
        {
            if(!err)
            {
                callback(null);
            }
            else
            {
                callback(err);
            }
        }
    }
}

function checkPassword(uname, pword, callback)
{
    db.get(getUserPassword, uname, usernameResult);
    
    function usernameResult(err, row)
    {
        if(row != undefined)
        {
            bcrypt.compare(pword, row["password"], bcryptResult);
        }
        else
        {
            bcrypt.compare(pword, dummyHash, dummyCallback);
        }
    }
    
    function bcryptResult(err, res) 
    {   
        if (!err && res)
        { 
            callback(null);
        }
        else
        {
            callback(new Error("Incorrect Username or Password"));
        }
    }
    
    function dummyCallback(err, res)
    {
        if(res)
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