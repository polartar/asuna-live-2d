import 'dotenv/config'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'

import apiRouter from './api'

const port = process.env.PORT || 8081
const app = express()

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.use(express.static(path.join(__dirname, '../../asuna-web-regeneration-client', 'build')))
app.use(express.static('public'))
app.use('/assets', express.static(path.join(__dirname, '../../asuna-assets/assets')))
app.use('/api', apiRouter)

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../../asuna-web-regeneration-client', 'build', 'index.html'))
})

app.listen(port, () =>
  console.log(`Listening on port ${port}!`)
)
