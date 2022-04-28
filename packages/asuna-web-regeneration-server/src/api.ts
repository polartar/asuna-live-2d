import express from 'express'
import validators, {
  ApprovalParams,
  DepositBody,
  SwapBody,
  WalletParams,
  WithdrawBody,
} from './validators'
import db from './mockDatabase'
import store from './mockStore'
import { InventoryParams } from './validators'
import { getWalletTokens, isApprovedForAll } from './web3/asunaContract'
import { getInventoryTokens } from './web3/holderContract'
import { MongoClient, ObjectId } from 'mongodb'

let mongoDB: any

// connect to our mongodb database
async function connectToDatabase() {
  let params = {}

  if (process.env.DATABASE_URL) {
    params = {
      useNewurlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsCAFile: './ca-certificate.crt',
    }
  }
  const client = await MongoClient.connect(
    process.env.DATABASE_URL
      ? process.env.DATABASE_URL
      : 'mongodb://localhost:27017',
    params
  )

  mongoDB = client.db('livesofasuna')
  console.log('RegenerationAPI connected successfully to MongoDB')
}

// setTimeout(() => {
//   connectToDatabase()
// }, 1000)

let router = express.Router()

// gets tokens in inventory for wallet address
// req.query: InventoryParams
// res: TokenData[]
router.get('/inventory', async (req, res, next) => {
  const validate = validators.validateInventoryParams
  const valid = validate(req.query)
  if (!valid) {
    res.status(400).send('400')
    return
  }

  const params: InventoryParams = req.query as any
  try {
    const tokenIds = await getInventoryTokens(params.address)
    tokenIds.sort()
    res.status(200).send(db.getTokenData(tokenIds))
  } catch {
    res.status(400).send('400')
  }
})

// get isApprovedForAll
// req.query: ApprovalParams
// res: boolean
router.get('/isApproved', async (req, res) => {
  const validate = validators.validateApprovalParams
  const valid = validate(req.query)
  if (!valid) {
    res.status(400).send('400')
    return
  }

  const params: ApprovalParams = req.query as any
  try {
    const approved = await isApprovedForAll(params.address)
    res.status(200).send({ approved })
  } catch {
    res.status(400).send('400')
  }
})

// gets tokens for wallet address
// req.query: WalletParams
// res: TokenData[]
router.get('/wallet', async (req, res) => {
  const validate = validators.validateWalletParams
  const valid = validate(req.query)
  if (!valid) {
    res.status(400).send('400')
    return
  }

  const params: WalletParams = req.query as any
  try {
    const tokenIds = await getWalletTokens(params.address)
    res.status(200).send(db.getTokenData(tokenIds))
  } catch {
    res.status(400).send('400')
  }
})

// transfers tokens from wallet into inventory
// req.body: DepositBody
router.post('/deposit', (req, res) => {
  const validate = validators.validateDepositBody
  const valid = validate(req.body)
  if (!valid) {
    res.status(400).send('400')
    return
  }

  const params: DepositBody = req.body
  store.deposit(params.address, params.tokenIds)

  setTimeout(() => {
    res.status(200).send({})
  }, 4000)
})

// transfers tokens from inventory into wallet
// req.body: WithdrawBody
router.post('/withdraw', (req, res) => {
  const validate = validators.validateWithdrawBody
  const valid = validate(req.body)
  if (!valid) {
    res.status(400).send('400')
    return
  }

  const params: WithdrawBody = req.body
  store.withdraw(params.address, params.tokenIds)
  res.status(200).send({})
})

// swaps traits
// req.body: SwapBody
router.post('/swap', (req, res) => {
  const validate = validators.validateSwapBody
  const valid = validate(req.body)
  if (!valid) {
    res.status(400).send('400')
    return
  }

  // TODO: validate swap operation

  const params: SwapBody = req.body
  db.swapTraits(params.tokenId1, params.tokenId2, params.traitTypes)

  setTimeout(() => {
    res.status(200).send({})
  }, 4000)
})

// resets trait metadata to initial values
router.get('/resetMetadata', (req, res) => {
  res.send('')
})

export default router
