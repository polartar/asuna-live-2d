import express from 'express'
import axios from 'axios'
import { ethers } from 'ethers'
import validators, {
  ApprovalParams,
  DepositBody,
  MetadataBody,
  SwapBody,
  WalletParams,
  WithdrawBody,
} from './validators'
import db from './database'
import mockdb from './mockDatabase'
import store from './mockStore'
import { InventoryParams } from './validators'
import { getWalletTokens, isApprovedForAll } from './web3/asunaContract'
import { checkOwnership, getInventoryTokens } from './web3/holderContract'
import msgQueue from './rabbitmq'
import database from './database'

const OPENSEA_API = 'https://testnets-api.opensea.io/api/v1/asset/'

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
    const data = await db.getTokenData(tokenIds)
    res.status(200).send(data)
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
    const data = await db.getTokenData(tokenIds)
    res.status(200).send(data)
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
router.post('/swap', async (req, res) => {
  const validate = validators.validateSwapBody
  const valid = validate(req.body)
  if (!valid) {
    res.status(400).send('400')
    return
  }

  const params: SwapBody = req.body
  const msg = `Swap Asuna #${params.tokenId1} & Asuna #${params.tokenId2}. Traits: ${params.traitTypes.join(', ')}`

  // verify msg signature is valid
  // authenticates address: address initated a swap operation with the parameters in msg
  if (params.address !== ethers.utils.verifyMessage(msg, params.sig)) {
    res.status(403).send('403')
    return
  }

  // authorizes address: address must own both tokens in holding contract
  let owned: boolean = false
  try {
    owned = await checkOwnership(params.address, params.tokenId1, params.tokenId2)
  } catch {
    res.status(403).send('403')
    return
  }
  if (!owned) {
    res.status(403).send('403')
    return
  }

  try {

    const nonce = getNonce()

    // update metadata
    await db.swapTraits(params.tokenId1, params.tokenId2, params.traitTypes, msg, params.sig, nonce)

    // trigger image regeneration
    msgQueue.send({
      tokenId1: params.tokenId1,
      tokenId2: params.tokenId2,
      nonce
    })

    // trigger opensea update
    await axios.get(`${OPENSEA_API}${process.env.ASUNA_ADDRESS}/${params.tokenId1}/?force_update=true`)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await axios.get(`${OPENSEA_API}${process.env.ASUNA_ADDRESS}/${params.tokenId2}/?force_update=true`)

    setTimeout(() => {
      res.status(200).send({})
    }, 4000)

  } catch (err) {
    console.log(err)
    res.status(500).send('500')
  }
})

// get token metadata
router.get('/metadata/:tokenId', async (req, res) => {
  const reqParams = { tokenId: +req.params.tokenId }
  const validate = validators.validateMetadataBody
  const valid = validate(reqParams)
  if (!valid) {
    res.status(400).send('400')
    return
  }

  const params: MetadataBody = reqParams

  try {
    const metadata = await database.getTokenMetadata(params.tokenId)

    res.status(200).send(metadata)
  } catch (err) {
    res.status(500).send('500')
  }
})

// resets trait metadata to initial values
router.get('/resetMetadata', (req, res) => {
  res.send('')
})

export default router

//----------------------------------------------------------------------------------------------------

function getNonce() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let res = Array(20)

  for (let i = 0; i < res.length; i++) {
    res[i] = chars.charAt(Math.floor(chars.length * Math.random()))
  }

  return res.join('')
}
