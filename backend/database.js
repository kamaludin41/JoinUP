const mariadb = require("mariadb");
const config = require("./config.json");

const pool = mariadb.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.connectionLimit || 5,
});

module.exports = pool;
