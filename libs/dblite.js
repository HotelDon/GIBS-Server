"use strict";

var sqlite = require("sqlite3");
var db = new sqlite.Database("database.db");
var bcrypt = require("bcrypt");

//SQL statements
var createUserTable = "CREATE TABLE IF NOT EXISTS users (usr_num INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, email TEXT UNIQUE NOT NULL)";

var insertNewUser = "INSERT INTO users (username, password, email) VALUES (?,?,?)";

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
    
    function hashResult(error, hash)
    {    
        if(!error)
        {
            db.run(insertNewUser, uname, hash, email, insertResult);
        }
        else
        {
            console.log("bcrypt hashing failed? "+ err);
            callback(false, "bcrypt");
        }
        
        function insertResult(error)
        {
            if(!error)
            {
                callback(true, "User created successfully.")
            }
            else
            {
                console.log("Database insert failed! Reason: "+ error);
                callback(false, "db");
            }
        }
    }
}