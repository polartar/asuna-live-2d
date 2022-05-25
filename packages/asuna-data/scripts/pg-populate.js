require('dotenv').config()
const { Pool } = require('pg')
const metadata = require('../metadata/metadata.json')

const TraitTypes = [
  'Appendage',
  'Background',
  'Clip Accessory',
  'Ears',
  'Eye Color',
  'Eyebrows',
  'Eyes',
  'Face Accessory',
  'Hair Back',
  'Hair Color',
  'Hair Front',
  'Hand',
  'Head Accessory',
  'Mouth',
  'Nose',
  'Outfit',
  'Skin Marking',
  'Skin Tone',
  'Weapon',
  'Legendary'
]


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

    await pool.query('DELETE FROM token WHERE true')

    await pool.query('BEGIN')

    for (let id of Object.keys(metadata)) {

      let token = metadata[id]
      let attrs = {}

      for (let type of TraitTypes) {
        attrs[type] = null
      }

      for (let attr of token.attributes) {
        attrs[attr.trait_type] = attr.value
      }

      await pool.query(`
        INSERT INTO token (
          id,
          nonce,
          last_updated,
          name,
          description,
          image_url,
          external_url,
          trait_appendage,
          trait_background,
          trait_clip_accessory,
          trait_ears,
          trait_eye_color,
          trait_eyebrows,
          trait_eyes,
          trait_face_accessory,
          trait_hair_back,
          trait_hair_color,
          trait_hair_front,
          trait_hand,
          trait_head_accessory,
          trait_mouth,
          trait_nose,
          trait_outfit,
          trait_skin_marking,
          trait_skin_tone,
          trait_weapon,
          trait_legendary
        ) VALUES (
          $1,
          NULL,
          now(),
          $2,
          $3,
          $4,
          $5,
          $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
        )
      `, [
        +id,
        token.name,
        token.description,
        token.image,
        token.external_url,
        ...Object.values(attrs)
      ])
    }

    await pool.query('COMMIT')

  } catch (err) {

    await pool.query('ROLLBACK')
    throw err

  } finally {
    pool.end()
  }

}

run()