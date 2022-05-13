require('dotenv').config()
const { Pool } = require('pg')

const DB_VER = 1


async function bootstrap() {

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
      CREATE TABLE IF NOT EXISTS db_ver (
        version         INTEGER,
        last_updated    TIMESTAMPTZ
      );
    `)

    // check db version
    let res = (await pool.query(`SELECT * FROM db_ver`))
    let version = 0

    if (res.rows[0] === undefined) {
      await pool.query(`INSERT INTO db_ver (version, last_updated) VALUES (0, now());`)
    } else {
      version = res.rows[0].version
    }

    if (version === DB_VER) {
      console.log('DB already up to date')
      return
    }

    // update db version
    while (version < DB_VER) {

      try {
        await pool.query('BEGIN')
        await pool.query(initVer[version])
        version++
        await pool.query(`UPDATE db_ver SET version=${version}, last_updated=now();`)
        await pool.query('COMMIT')
      } catch (err) {
        await pool.query('ROLLBACK')
        throw err
      }

      console.log(`Updating db ver ${version}`)
    }

  } catch (err) {
    console.log(err)
  } finally {
    pool.end()
  }
}

//--------------------------------------------------------------------------------//

var initVer = []
initVer[0] = `
  CREATE TABLE IF NOT EXISTS token (
    id                      INTEGER PRIMARY KEY,
    nonce                   VARCHAR(20),
    last_updated            TIMESTAMPTZ,
    name                    VARCHAR(80),
    description             TEXT,
    image_url               TEXT,
    external_url            TEXT,
    trait_appendage         VARCHAR(80),
    trait_background        VARCHAR(80),
    trait_clip_accessory    VARCHAR(80),
    trait_ears              VARCHAR(80),
    trait_eye_color         VARCHAR(80),
    trait_eyebrows          VARCHAR(80),
    trait_eyes              VARCHAR(80),
    trait_face_accessory    VARCHAR(80),
    trait_hair_back         VARCHAR(80),
    trait_hair_color        VARCHAR(80),
    trait_hair_front        VARCHAR(80),
    trait_hand              VARCHAR(80),
    trait_head_accessory    VARCHAR(80),
    trait_mouth             VARCHAR(80),
    trait_nose              VARCHAR(80),
    trait_outfit            VARCHAR(80),
    trait_skin_marking      VARCHAR(80),
    trait_skin_tone         VARCHAR(80),
    trait_weapon            VARCHAR(80)
  );
  CREATE INDEX token_nonce ON token(nonce);

  CREATE TABLE IF NOT EXISTS token_event (
    id           SERIAL PRIMARY KEY,
    token1_id    INTEGER NOT NULL REFERENCES token(id),
    token2_id    INTEGER NOT NULL REFERENCES token(id),
    date         TIMESTAMPTZ,
    message      TEXT,
    signature    TEXT
  )
`

//--------------------------------------------------------------------------------//

bootstrap()
