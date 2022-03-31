const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const { stringify } = require('querystring')
const options = require('command-line-args')([
  { name: 'path', alias: 'p', type: String, defaultOption: true },
  { name: 'outputdir', alias: 'o', type: String },
  { name: 'width', alias: 'w', type: Number },
  { name: 'height', alias: 'h', type: Number }
])
options.outputdir = options.outputdir || 'layer'
options.width = options.width || 550
options.height = options.height || 750

const basePath = path.resolve(options.path, '..')
let fileList = {}
let override = false

const overrideId = {
  'Black': 0,
  'Blue': 1,
  'Brown': 2,
  'Gray': 3,
  'Green': 4,
  'Lilac': 5,
  'Purple': 6,
  'Red': 7,
  'Yellow': 8,
  'Novice Adventurer': 56,
  'Black Witch Hat': 6,
  'Dragon': 17,
  'Straw Hat': 42,
  'White Witch Hat': 47
}
const hats = [
  'Bat Horns', 'Big Side Horns', 'Black Beret',
  'Black Bunny Headband', 'Black Chinese Hat', 'Black Fox Mask',
  'Black Witch Hat', 'Blue Cap', 'Blue Crystal Horns',
  'Blue Mech Cat Ears', 'Blue Mini Horn', 'Broken Horns',
  'Bull Horns', 'Bunny Ears', 'Cat Ears',
  'Cat Ears With Earring', 'Demon Horns', 'Dragon',
  'Fancy Horns', 'Gold Spike Tiara', 'Goldfish',
  'Green Crystal Horns', 'Halo', 'Large Ears',
  'Little Black Gold Hat', 'Long Cat Ears', 'Mini Crown',
  'Mini Top Hat', 'Newsboy Cap', 'Nurse',
  'Onion Horns', 'Owl Ears', 'Peaked Cap',
  'Pink Bunny Headband', 'Pink Crystal Horns', 'Pirate Hat',
  'Pointed Bow', 'Red Beret', 'Red Mech Cat Ears',
  'Red Mini Horn', 'Ruffles', 'Santa Hat',
  'Straw Hat', 'Top Hat', 'Wagie Cap',
  'White Bunny Headband', 'White Fox Mask', 'White Witch Hat',
  'Wings', 'Yellow Paper Crane'
]

for (let i = 0; i < hats.length; i++) {
  overrideId[hats[i]] = i
}


function shouldOverride(dir) {
  return dir.match(/^(0[46]|1[47]|20)/)
}

function dfs(tgtpath, outdir) {
  const entries = fs.readdirSync(tgtpath, { withFileTypes: true })
  const dirs = entries.filter(dir => dir.isDirectory()).map(dir => dir.name)
  const files = entries.filter(file => file.isFile() && file.name.endsWith('.png')).map(file => file.name)

  try {
    fs.mkdirSync(path.join(basePath, outdir))
  } catch (err) { }

  for (let i = 0; i < dirs.length; i++) {
    if (shouldOverride(dirs[i])) {
      override = true
    }
    let id = i
    if (override && dirs[i] in overrideId) {
      id = overrideId[dirs[i]]
    }

    dfs(path.join(tgtpath, dirs[i]), path.join(outdir, String(id).padStart(6, '0')))
    if (shouldOverride(dirs[i])) {
      override = false
    }
  }

  for (let i = 0; i < files.length; i++) {
    const fileDir = outdir.replace(/\\/g, '/')
    if (!(fileDir in fileList)) {
      fileList[fileDir] = []
    }
    fileList[fileDir].push(files[i])

    sharp(path.join(tgtpath, files[i]))
      .resize(options.width, options.height)
      .toFile(path.join(basePath, outdir, files[i]))
  }
}

dfs(options.path, options.outputdir)
fs.writeFileSync(path.join(basePath, options.outputdir, 'filelist.json'), JSON.stringify(fileList, null, ''))
