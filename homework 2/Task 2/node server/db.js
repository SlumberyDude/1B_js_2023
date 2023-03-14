const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "123456",
    host: "localhost",
    port: 5433,
    database: "movies",
})

module.exports = pool;
