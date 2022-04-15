const fs = require('fs')
const path = require('path')
const db = require('better-sqlite3')(path.join(__dirname, '../db.sqlite'))

let data = {}

let rows = db.prepare('SELECT * FROM trait_data').all()
rows.forEach(row => {
  if (!(row.trait_type_id in data)) {
    data[row.trait_type_id] = {}
  }
  data[row.trait_type_id][row.trait_value_id] = {
    name: row.trait_value_name,
    tags: row.tags
  }
})

fs.writeFileSync(path.join(__dirname, '../metadata/trait-metadata.json'), JSON.stringify(data))
