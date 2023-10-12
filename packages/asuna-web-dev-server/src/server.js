const fs = require('fs')
const path = require('path')
const cors = require('cors')
const express = require('express')
const pug = require('pug')

const corePath = path.join(__dirname, '../../cubism-core/dist')
const swapPath = path.join(__dirname, '../../asuna-web-swap-client/dist')
const viewerPath = path.join(__dirname, '../../asuna-web-viewer-client/dist')
const live2dPath = path.join(__dirname, '../../asuna-web-live2d/dist')
const assetPath = path.join(__dirname, '../../asuna-assets/assets')
const appHash = require(path.join(live2dPath, 'stats.json')).hash
const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use('/', express.static(path.join(__dirname, './public')))
app.use('/js', express.static(corePath))
app.use('/js', express.static(path.join(swapPath, 'js')))
app.use('/css', express.static(path.join(swapPath, 'css')))
app.use('/js', express.static(path.join(viewerPath, 'js')))
app.use('/css', express.static(path.join(viewerPath, 'css')))
app.use('/js', express.static(live2dPath))
app.use('/assets', express.static(assetPath))

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
  res.locals.hash = JSON.parse(fs.readFileSync(path.join(viewerPath, 'stats.json'))).hash
  res.render('viewer')
})

app.get('/swap', (req, res) => {
  res.locals.hash = JSON.parse(fs.readFileSync(path.join(swapPath, 'stats.json'))).hash
  res.render('swap')
})

app.get('/embed', (req, res) => {
  // hash prevents browser cache for local dev
  res.locals.hash = JSON.parse(fs.readFileSync(path.join(live2dPath, 'stats.json'))).hash
  // res.locals.hash = appHash
  res.render('embed')
})

app.get('/embed/:tokenId', (req, res) => {
  // hash prevents browser cache for local dev
  res.locals.hash = JSON.parse(fs.readFileSync(path.join(live2dPath, 'stats.json'))).hash
  // res.locals.hash = appHash
  res.render('embed')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
