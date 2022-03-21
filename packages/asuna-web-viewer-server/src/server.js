const fs = require('fs')
const path = require('path')
const cors = require('cors')
const express = require('express')
const pug = require('pug')

const corePath = path.join(__dirname, '../../cubism-core/dist')
const clientPath = path.join(__dirname, '../../asuna-web-viewer-client/dist')
const live2dPath = path.join(__dirname, '../../asuna-web-live2d/dist')
const assetPath = path.join(__dirname, '../../asuna-assets/assets')
const appHash = require(path.join(live2dPath, 'stats.json')).hash
const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.static('./public'))
app.use('/js', express.static(corePath))
app.use('/js', express.static(path.join(clientPath, 'js')))
app.use('/css', express.static(path.join(clientPath, 'css')))
app.use('/js', express.static(live2dPath))
app.use('/assets', express.static(assetPath))

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
  res.locals.hash = JSON.parse(fs.readFileSync(path.join(clientPath, 'stats.json'))).hash
  res.render('client')
})

app.get('/embed', (req, res) => {
  // hash prevents browser cache for local dev
  res.locals.hash = JSON.parse(fs.readFileSync(path.join(live2dPath, 'stats.json'))).hash
  // res.locals.hash = appHash
  res.render('embed')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})