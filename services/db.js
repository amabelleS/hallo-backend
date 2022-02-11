const mariadb = require('mariadb');

// Create a connection pool
const pool = mariadb.createPool({
  // host: localhost || 127.0.0.1,
  host: process.env.DB_HOST,
  port: 3306,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PWD,
  user: 'root',
  password: 'password66',
  database: 'hallo',
});

async function asyncFunction() {
  let conn;
  try {
    // Create a new connection
    conn = await pool.getConnection();

    // Print connection thread
    console.log(`Connected! (id=${conn.threadId})`);
  } catch (err) {
    // Print error
    console.log(err);
  } finally {
    // Close connection
    if (conn) await conn.close();
  }
}

asyncFunction();

module.exports = Object.freeze({
  pool: pool,
});
