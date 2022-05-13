require('dotenv').config()
const { Pool } = require('pg')


async function run() {

  const pool = new Pool({
    'user': process.env.USER,
    'host': process.env.HOST,
    'database': process.env.DATABASE,
    'password': process.env.PASSWORD,
    'port': process.env.PORT,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {

    await pool.query(`
      DROP TABLE IF EXISTS db_ver;
      DROP TABLE IF EXISTS token_event;
      DROP TABLE IF EXISTS token;
    `)

  } finally {
    pool.end()
  }

}

run()