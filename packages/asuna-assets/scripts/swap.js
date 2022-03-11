const path = require('path')
const fs = require('fs')
const kdTree = require('kd-tree-javascript').kdTree
const PNG = require('pngjs').PNG
const options = require('command-line-args')([
  { name: 'file', alias: 'f', type: String, defaultOption: true },
  { name: 'table', alias: 't', type: String },
  { name: 'output', alias: 'o', type: String }
])
const util = require('./util')
const table = require(path.join(__dirname, options.table))

const points = Object.keys(table).map(util.stringToObj)
const distance = function (a, b) {
  return Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2)
}
const tree = new kdTree(points, distance, ['r', 'g', 'b'])

fs.createReadStream(path.join(__dirname, options.file))
  .pipe(new PNG())
  .on('parsed', function () {
    let total = this.width * this.height
    let progress = 0

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2
        if (y * this.width / total * 100 > progress + 5) {
          progress += 5
          console.log(progress)
        }
        if (this.data[idx + 3] === 0) {
          continue
        }
        let color = util.serialize(this.data, idx)

        if (!(color in table)) {
          let point = util.stringToObj(color)
          let nearest = util.objToString(tree.nearest(point, 1)[0][0])
          table[color] = util.objToString(util.stringToObj(table[nearest]), point.a)
        }

        if (color in table) {
          let val = util.deserialize(table[color])
          for (let i = 0; i < 4; i++) {
            this.data[idx + i] = val[i]
          }
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(path.join(__dirname, options.output)))
  })
