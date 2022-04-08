const fs = require('fs')
const path = require('path')
const db = require('better-sqlite3')(path.join(__dirname, '../db.sqlite'))

const data = require('../src/metadata.json')
delete data["67"] // skipping because lack of assets

const TraitIdLookup = {
  'Appendage': 0,
  'Background': 1,
  'Clip Accessory': 2,
  'Ears': 3,
  'Eye Color': 4,
  'Eyebrows': 5,
  'Eyes': 6,
  'Face Accessory': 7,
  'Hair Back': 8,
  'Hair Color': 9,
  'Hair Front': 10,
  'Hand': 11,
  'Head Accessory': 12,
  'Mouth': 13,
  'Nose': 14,
  'Outfit': 15,
  'Skin Marking': 16,
  'Skin Tone': 17,
  'Weapon': 18
}
let TraitValueLookup = {}
let traitCount = {}

for (let idx of Object.keys(data)) {
  const entry = data[idx]

  for (let i = 0; i < entry.attributes.length; i++) {
    let traitType = entry.attributes[i].trait_type
    let val = entry.attributes[i].value

    if (!(traitType in traitCount)) {
      traitCount[traitType] = {}
    }

    if (!(val in traitCount[traitType])) {
      traitCount[traitType][val] = 0
    }

    traitCount[traitType][val]++
  }
}

for (let trait of Object.keys(traitCount)) {
  const sorted = Object.keys(traitCount[trait]).sort((a, b) => {
    a = a.toLowerCase()
    b = b.toLowerCase()
    if (a < b) return -1
    else if (a > b) return 1
    return 0
  })
  console.log(sorted.map((item, idx) => idx + ': ' + item))
  TraitValueLookup[trait] = {}

  for (let i = 0; i < sorted.length; i++) {
    TraitValueLookup[trait][sorted[i]] = i
  }
}

let output = {}

for (let idx of Object.keys(data)) {
  const entry = data[idx]
  let traitData = {}

  for (let attr of entry.attributes) {
    const trait = attr.trait_type

    if (!(trait in TraitIdLookup)) {
      throw `Trait not found ${trait}`
    }

    if (!(attr.value in TraitValueLookup[trait])) {
      throw `Trait value not found ${attr.value}`
    }

    traitData[TraitIdLookup[trait]] = TraitValueLookup[trait][attr.value]
  }

  output[idx] = {
    id: idx,
    traitData
  }
}

fs.writeFileSync(path.join(__dirname, '../src/normalized-metadata.json'), JSON.stringify(output, null, ''))


for (let trait of Object.keys(traitCount)) {
  for (let value of Object.keys(traitCount[trait])) {
    console.log(trait, value, traitCount[trait][value])

    db.prepare(`
      INSERT INTO trait_data (trait_type_id, trait_value_id, trait_type_name, trait_value_name, tags, count)
      VALUES ($1, $2, $3, $4, $5, $6);
    `).run({
      1: TraitIdLookup[trait],
      2: TraitValueLookup[trait][value],
      3: trait,
      4: value,
      5: '',
      6: traitCount[trait][value]
    })
  }
}
