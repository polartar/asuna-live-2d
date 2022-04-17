const fs = require('fs')
const path = require('path')
const db = require('better-sqlite3')(path.join(__dirname, '../db.sqlite'))

let traitTypes = {}
let traitValues = {}

let rows = db.prepare('SELECT * FROM trait_data').all()
rows.forEach(row => {
  if (!(row.trait_type_id in traitValues)) {
    traitValues[row.trait_type_id] = {}
  }

  traitTypes[row.trait_type_name] = row.trait_type_id
  traitValues[row.trait_type_id][row.trait_value_name] = row.trait_value_id
})

fs.writeFileSync(path.join(__dirname, '../metadata/trait-type-ids.json'), JSON.stringify(traitTypes))
fs.writeFileSync(path.join(__dirname, '../metadata/trait-value-ids.json'), JSON.stringify(traitValues))
