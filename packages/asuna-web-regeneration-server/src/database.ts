import { Pool } from 'pg'
import { TokenData, TraitData, TraitType } from "asuna-data"

const traitTypeNames = require('../../asuna-data/metadata/trait-type-names.json')
const traitValueIds = require('../../asuna-data/metadata/trait-value-ids.json')

const rowNames = {
  [TraitType.Appendage]: 'trait_appendage',
  [TraitType.Background]: 'trait_background',
  [TraitType.ClipAccessory]: 'trait_clip_accessory',
  [TraitType.Ears]: 'trait_ears',
  [TraitType.EyeColor]: 'trait_eye_color',
  [TraitType.Eyebrows]: 'trait_eyebrows',
  [TraitType.Eyes]: 'trait_eyes',
  [TraitType.FaceAccessory]: 'trait_face_accessory',
  [TraitType.HairBack]: 'trait_hair_back',
  [TraitType.HairColor]: 'trait_hair_color',
  [TraitType.HairFront]: 'trait_hair_front',
  [TraitType.Hand]: 'trait_hand',
  [TraitType.HeadAccessory]: 'trait_head_accessory',
  [TraitType.Mouth]: 'trait_mouth',
  [TraitType.Nose]: 'trait_nose',
  [TraitType.Outfit]: 'trait_outfit',
  [TraitType.SkinMarking]: 'trait_skin_marking',
  [TraitType.SkinTone]: 'trait_skin_tone',
  [TraitType.Weapon]: 'trait_weapon',
}

const pool: Pool = new Pool({
  'connectionString': process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function getTokenMetadata(id: number) {
  try {
    let res = await pool.query('SELECT * FROM token WHERE id=$1', [id])

    if (res.rows.length !== 1) {
      throw `id not found ${id}`
    }

    const row = res.rows[0]

    let metadata = {
      name: row.name,
      description: row.description,
      image: row.image_url || 'https://regen.asunaverse.com/regen.gif',
      external_url: row.external_url,
      attributes: [] as any[]
    }

    for (let k of Object.keys(rowNames) as any as TraitType[]) {
      let rowName = rowNames[k]
      if (row[rowName] !== null) {
        metadata.attributes.push({
          trait_type: traitTypeNames[k],
          value: row[rowName]
        })
      }
    }

    if (row['trait_legendary'] !== null) {
      metadata.attributes.push({
        trait_type: 'Legendary',
        value: row['trait_legendary']
      })
    }

    return metadata

  } catch (err) {
    console.log(err)
    throw err
  }
}


async function getTokenData(tokenIds: number[]) {
  let ret: { [tokenId: string]: TokenData } = {}

  try {
    let res = await pool.query(`
      SELECT * FROM token WHERE id = ANY($1::int[])
    `, [tokenIds])

    for (let row of res.rows) {
      let traits: TraitData = {} as any

      for (let k of Object.keys(rowNames) as any as TraitType[]) {
        let rowName = rowNames[k]
        traits[k] = row[rowName] !== null ? traitValueIds[k][row[rowName]] : undefined
      }

      ret[row.id] = {
        id: row.id,
        traitData: traits
      }
    }

  } catch (err) {
    console.log(err)
    throw err
  }

  return ret
}

async function swapTraits(tokenId1: number, tokenId2: number, traitTypes: TraitType[], msg: string, sig: string, nonce: string) {
  try {
    const colParams = traitTypes.map(val => `${rowNames[val]} = data.${rowNames[val]}`).join(', ')

    await pool.query('BEGIN')
    await pool.query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')
    await pool.query(
      'INSERT INTO token_event(token1_id, token2_id, date, message, signature) VALUES($1, $2, now(), $3, $4)',
      [tokenId1, tokenId2, msg, sig]
    )
    let data = await pool.query(`
      WITH
        idx (tgt, src) AS ( VALUES ($1::int, $2::int), ($2::int, $1::int) ),
        data AS (
          SELECT idx.tgt, token.*
          FROM idx
          JOIN token ON idx.src = token.id
        )
      UPDATE token
      SET nonce=$3, image_url=NULL, ${colParams}
      FROM data
      WHERE token.id = data.tgt
  `, [tokenId1, tokenId2, nonce])

    await pool.query('COMMIT')

  } catch (err) {
    await pool.query('ROLLBACK')
    console.log(err)
    throw (err)
  }
}

export default {
  getTokenMetadata,
  getTokenData,
  swapTraits
}
