//dbcon.js
const dotenv = require('dotenv');
var mysql = require('mysql');

dotenv.config();
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DBHOST,
  user            : process.env.USERNAME,
  password        : process.env.PASSWORD,
  database        : process.env.DB_NAME
});

module.exports.pool = pool;
