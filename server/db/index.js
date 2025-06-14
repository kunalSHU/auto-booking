const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });  // one level up from server/

//require('dotenv').config();  --> has trouble with paths
const postgres = require ('pg-promise')();

console.log("DB Config:", {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

const db = postgres({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD)
});

module.exports = db;