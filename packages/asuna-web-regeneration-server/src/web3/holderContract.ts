import { ethers } from 'ethers'

const HOLDER_ADDRESS = process.env.HOLDER_ADDRESS!
const HOLDER_ABI = require('./holderABI.json')

const provider = ethers.providers.getDefaultProvider('rinkeby')
const contract = new ethers.Contract(HOLDER_ADDRESS, HOLDER_ABI, provider)

export async function getInventoryTokens(address: string) {
  const resIds: [ethers.BigNumber[]] = await contract.functions.getLockedIds(address)
  const tokenIds = resIds[0].map(bign => '' + bign.toNumber())

  return tokenIds
}
