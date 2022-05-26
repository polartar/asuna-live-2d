const fs = require('fs')
const path = require('path')
const db = require('better-sqlite3')(path.join(__dirname, '../db.sqlite'))

let data = {}
let rareData = {}

let rows = db.prepare('SELECT * FROM trait_data').all()
rows.forEach(row => {
  if (!(row.trait_type_id in data)) {
    data[row.trait_type_id] = {
      name: row.trait_type_name,
      count: 0
    }
  }

  data[row.trait_type_id].count += row.count
})

fs.writeFileSync(path.join(__dirname, '../metadata/trait-count.json'), JSON.stringify(data))
