import { TokenId } from 'asuna-data'
import { ethers } from 'ethers'

const HOLDER_ADDRESS = process.env.HOLDER_ADDRESS!
const HOLDER_ABI = require('./holderABI.json')

const provider = ethers.providers.getDefaultProvider(process.env.NETWORK, {
  alchemy: process.env.ALCHEMY_KEY
})
const contract = new ethers.Contract(HOLDER_ADDRESS, HOLDER_ABI, provider)

export async function getInventoryTokens(address: string) {
  const resIds: [number[]] = await contract.functions.getLockedIds(address)
  const tokenIds = resIds[0]

  return tokenIds
}

export async function checkOwnership(address: string, id1: TokenId, id2: TokenId) {
  const resIds: [number[]] = await contract.functions.getLockedIds(address)
  const tokenIds = [...resIds[0]]

  let found1 = false, found2 = false

  for (let i = 0; i < tokenIds.length; i++) {
    if (tokenIds[i] === id1) {
      found1 = true
    }
    if (tokenIds[i] === id2) {
      found2 = true
    }
  }

  return found1 && found2
}

export async function getUnlockDates(ids: TokenId[]) {
  const resTimestamps: [ethers.BigNumber[]] = await contract.functions.getUnlockDates(ids)
  const timestamps = resTimestamps[0].map(bign => bign.toNumber() * 1000)

  return timestamps
}
