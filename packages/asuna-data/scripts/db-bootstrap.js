const path = require('path')
const db = require('better-sqlite3')(path.join(__dirname, '../db.sqlite'))

const DB_VER = 1

function bootstrap() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS db_ver (
      version         INTEGER,
      last_updated    INTEGER
    );
  `).run()

  let rowVer = db.prepare(`SELECT * FROM db_ver`).get()
  let version = 0
  if (rowVer === undefined) {
    db.prepare(`INSERT INTO db_ver (version, last_updated) VALUES (0, ?);`).run(Date.now())
  } else {
    version = rowVer.version
  }

  if (version === DB_VER) {
    console.log('DB already up to date')
    return
  }

  let trans = 'BEGIN TRANSACTION;'
  while (version < DB_VER) {
    trans += initVer[version]
    version++
    console.log(`Updating db ver ${version}`)
  }
  trans += `UPDATE db_ver SET version=${version}, last_updated=${Date.now()};`
  trans += 'COMMIT;'
  db.exec(trans)

  db.close()
}

//--------------------------------------------------------------------------------//

var initVer = []
initVer[0] = `
  CREATE TABLE IF NOT EXISTS trait_data (
    trait_type_id     INTEGER NOT NULL,
    trait_value_id    INTEGER NOT NULL,
    trait_type_name   TEXT NOT NULL,
    trait_value_name  TEXT NOT NULL,
    tags              TEXT NOT NULL,
    count             INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY       (trait_type_id, trait_value_id)
  );
  CREATE INDEX idx_trait_data_name ON trait_data(trait_value_name);
`

//--------------------------------------------------------------------------------//

bootstrap()
