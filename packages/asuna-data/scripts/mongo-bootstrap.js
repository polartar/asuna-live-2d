const { MongoClient } = require('mongodb')
const metadata = require('../metadata/metadata.json')

const uri = 'mongodb://localhost:27017'

async function run() {
  let client, session

  try {

    let params = {}
    let res

    if (process.env.DATABASE_URL) {
      params = {
        useNewurlParser: true,
        useUnifiedTopology: true,
        tls: true,
        tlsCAFile: './ca-certificate.crt',
      }
    }

    client = await MongoClient.connect(
      process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : 'mongodb://localhost:27017',
      params
    )

    // connect to database
    const db = client.db('livesofasuna')
    const tokenColl = db.collection('token_metadata')
    console.log('Connected successfully to MongoDB')

    // clear data
    await tokenColl.deleteMany({})
    console.log('Collection cleared')

    // add index
    res = await tokenColl.createIndex({ id: 1 })
    console.log(`Index created: ${res}`)

    // prepare transaction
    const transactionOptions = {
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
      readPreference: 'primary'
    }
    session = client.startSession()
    session.startTransaction(transactionOptions)
    console.log('Starting transaction')

    // insert values
    for (let id of Object.keys(metadata)) {
      const token = metadata[id]
      await tokenColl.insertOne(
        {
          id,
          metadata: token
        },
        { session }
      )
    }

    // commit tx
    await session.commitTransaction()
    console.log('Transaction committed')

  } catch (err) {

    console.log(err)
    await session.abortTransaction()

  } finally {

    await session.endSession()
    await client.close()

  }
}

run()
