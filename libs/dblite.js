"use strict";

var sqlite = require("sqlite3");
var db = new sqlite.Database("database.db");

//SQL statements
var createUserTable = "CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, email TEXT UNIQUE NOT NULL)";

var insertNewUser = "INSERT INTO users (username, password, email) VALUES (?,?,?)";
var lookupUserInfo = "SELECT * FROM users WHERE username = ?";

exports.addUser = addUser;
exports.getUserInfo = getUserInfo;

db.serialize(initializeDB);

//Makes sure that every table that should exist in the database, does exist.
function initializeDB()
{
    db.run(createUserTable);
}

function addUser(uname, hash, email, callback)
{
    db.run(insertNewUser, uname, hash, email, insertResult);
       
    function insertResult(err)
    {
        if(!err)
        {
            callback(null, "User added successfully");
        }
        else
        {
            callback(new Error("That username or email is already in use."));
        }
    }
}

function getUserInfo(uname, callback)
{
    db.get(lookupUserInfo, uname, lookupResult);
    
    function lookupResult(err, row)
    {
        if(!err && row != undefined)
        {
            callback(null, row);
        }
        else
        {
            callback(new Error("Username does not exist!"));
        }
    }
}