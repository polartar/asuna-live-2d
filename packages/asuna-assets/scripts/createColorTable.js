const path = require('path')
const fs = require('fs')
const PNG = require('pngjs').PNG
const options = require('command-line-args')([
  { name: 'files', alias: 'f', type: String, multiple: true, defaultOption: true },
  { name: 'output', alias: 'o', type: String }
])
const util = require('./util')

let src = PNG.sync.read(fs.readFileSync(path.join(__dirname, options.files[0])))
let tgt = PNG.sync.read(fs.readFileSync(path.join(__dirname, options.files[1])))

if (src.width !== tgt.width || src.height !== tgt.height) {
  throw `Image dimensions do not match ${src.width}x${src.height}, ${tgt.width}x${tgt.height}`
}

let mapping = {}

for (let y = 0; y < src.height; y++) {
  for (let x = 0; x < src.width; x++) {
    let idx = (src.width * y + x) << 2
    let srcColor = util.serialize(src.data, idx)
    let tgtColor = util.serialize(tgt.data, idx)

    if (srcColor in mapping) {
      if (mapping[srcColor] !== tgtColor && !(src.data[idx + 3] === 0 && tgt.data[idx + 3] === 0)) {
        throw `Colors don't have 1-1 mapping: mapping ${srcColor} to ${tgtColor}, prior value ${mapping[srcColor]}`
      }
    } else {
      mapping[srcColor] = tgtColor
    }
  }
}

fs.writeFileSync(path.join(__dirname, options.output), JSON.stringify(mapping, null, 2))
