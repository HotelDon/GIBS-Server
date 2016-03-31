"use strict";

var sqlite = require("sqlite3");
var db = new sqlite.Database("database.db");

//SQL statements
var createUserTable = "CREATE TABLE IF NOT EXISTS users (usr_num INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)";
var insertNewUser = "INSERT INTO users (username, password) VALUES (?,?)";

db.serialize(initializeDB);

//Makes sure that every table that should exist in the database, does exist.
function initializeDB()
{
    db.run(createUserTable);
}