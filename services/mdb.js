const mariadb = require('mariadb');
const data = require('../data.json');

// SET @json_document = data

// SELECT * FROM JSON_TABLE(@json_document, '$[*]'
//     COLUMNS (
//     name VARCHAR(255) PATH '$.name',
//     job VARCHAR(50) PATH '$.job',
//     salary INT PATH '$.salary'
//     )
// ) AS salary_table;

// Create a connection pool
const pool = mariadb.createPool({
  //   host: '127.0.0.1',
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: 'hallo',
  multipleStatements: true,
  connectionLimit: 5,
});

async function asyncFunction() {
  let conn;
  try {
    conn = await pool.getConnection();
    //option 2 - import json to table
    //     const foo = await conn.query(
    //       `CREATE TABLE test (name VARCHAR(255), job VARCHAR(50), salary INT)`
    //     );
    //     const boo = await conn.query(`INSERT INTO test
    // SELECT *
    // FROM JSON_TABLE(@${data},
    //                 "$[*]" COLUMNS(
    //                     name VARCHAR(255) PATH '$.name',
    //                     job VARCHAR(50) PATH '$.job',
    //                     salary INT PATH '$.salary'
    //                ) AS jsontable;`);

    // option 1 - import json to table
    // const foo = await conn.query(`SET @json_document = ${data}`);
    // const newTable =
    //   await conn.query(`SELECT * FROM JSON_TABLE(@json_document, '$[*]'
    //                     COLUMNS (
    //                     name VARCHAR(255) PATH '$.name',
    //                     job VARCHAR(50) PATH '$.job',
    //                     salary INT PATH '$.salary'
    //                     )
    //                     ) AS salary_table;`);
    // console.log(foo);
    // console.log(newTable);
    console.log('Connected:)');
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
}

// asyncFunction();

// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
  pool: pool,
});
