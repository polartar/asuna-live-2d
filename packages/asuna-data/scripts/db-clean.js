const path = require('path')
const db = require('better-sqlite3')(path.join(__dirname, '../db.sqlite'))

db.exec(`
  BEGIN TRANSACTION;
  DROP TABLE IF EXISTS db_ver;
  DROP TABLE IF EXISTS trait_data;
  COMMIT;
`)
db.close()