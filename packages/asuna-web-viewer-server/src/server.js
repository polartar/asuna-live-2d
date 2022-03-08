const fs = require('fs')
const path = require('path')
const cors = require('cors')
const express = require('express')
const pug = require('pug')

const corePath = path.join(__dirname, '../../cubism-core/dist')
const distPath = path.join(__dirname, '../../asuna-web-live2d/dist')
const assetPath = path.join(__dirname, '../../asuna-assets/assets')
const appHash = require(path.join(distPath, 'stats.json')).hash
const app = express()
const port = 8080

app.use(cors())
app.use(express.static('./public'))
app.use('/js', express.static(corePath))
app.use('/js', express.static(distPath))
app.use('/assets', express.static(assetPath))

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.get('/embed', (req, res) => {
  // hash prevents browser cache for local dev
  res.locals.hash = JSON.parse(fs.readFileSync(path.join(distPath, 'stats.json'))).hash
  // res.locals.hash = appHash

  res.render('embed')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})