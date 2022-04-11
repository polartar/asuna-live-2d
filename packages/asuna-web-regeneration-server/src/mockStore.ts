let inventory: { [address: string]: { [id: string]: boolean } } = {}
let wallet: { [address: string]: { [id: string]: boolean } } = {}


function getInventoryTokens(address: string) {
  if (!(address in inventory)) {
    inventory[address] = {}
  }
  return inventory[address]
}

function getWalletTokens(address: string) {
  if (!(address in wallet)) {
    populateWallet(address)
  }
  return wallet[address]
}

function deposit(address: string, tokenIds: number[]) {
  const wallet = getWalletTokens(address)
  const inventory = getInventoryTokens(address)

  for (let id of tokenIds) {
    if (id in wallet) {
      delete wallet[id]
      inventory[id] = true
    }
  }
}

function withdraw(address: string, tokenIds: number[]) {
  const wallet = getWalletTokens(address)
  const inventory = getInventoryTokens(address)

  for (let id of tokenIds) {
    if (id in inventory) {
      delete inventory[id]
      wallet[id] = true
    }
  }
}

function populateWallet(address: string) {
  let tokens: { [id: string]: boolean } = {}
  let count = 5 + Math.floor(40 * Math.random())

  for (let i = 0; i < count; i++) {
    tokens[Math.floor(10000 * Math.random())] = true
  }

  delete tokens['67'] // don't have assets

  wallet[address] = tokens
}

export default {
  getInventoryTokens,
  getWalletTokens,
  deposit,
  withdraw
}