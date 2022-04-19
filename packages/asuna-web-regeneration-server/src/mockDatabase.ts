import { TokenData, TraitData, TraitType } from "asuna-data"

const traitMetadata = require('asuna-data/metadata/normalized-metadata.json')

let metadata: { [tokenId: string]: TokenData }
reloadMetadata()

function reloadMetadata() {
  metadata = JSON.parse(JSON.stringify(traitMetadata))
}

function getTokenData(tokenIds: string[]) {
  let res: { [tokenId: string]: TokenData } = {}
  for (let id of tokenIds) {
    res[id] = metadata[id]
  }
  return res
}

function swapTraits(tokenId1: number, tokenId2: number, traitTypes: TraitType[]) {
  for (let traitType of traitTypes) {
    let temp = metadata[tokenId1].traitData[traitType]
    metadata[tokenId1].traitData[traitType] = metadata[tokenId2].traitData[traitType]
    metadata[tokenId2].traitData[traitType] = temp
  }
}

export default {
  reloadMetadata,
  getTokenData,
  swapTraits
}
