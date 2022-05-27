import { ethers } from 'ethers'

const ASUNA_ADDRESS = process.env.ASUNA_ADDRESS!
const ASUNA_ABI = require('./asunaABI.json')

const provider = ethers.providers.getDefaultProvider(process.env.NETWORK, {
  alchemy: process.env.ALCHEMY_KEY
})
const contract = new ethers.Contract(ASUNA_ADDRESS, ASUNA_ABI, provider)

export async function getWalletTokens(address: string) {
  const resBalance: [ethers.BigNumber] = await contract.functions.balanceOf(address)
  const count = resBalance[0].toNumber()
  const resTokens: [ethers.BigNumber][] = await Promise.all(Array(count).fill(true).map((_, idx) => contract.functions.tokenOfOwnerByIndex(address, idx)))
  const tokenIds = resTokens.flat().map(bign => bign.toNumber())

  return tokenIds
}

export async function isApprovedForAll(owner: string) {
  const [approved]: boolean[] = await contract.functions.isApprovedForAll(owner, process.env.HOLDER_ADDRESS)

  return approved
}
