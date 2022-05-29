import { TokenData, TraitData, TraitType } from './index'

const traitTags = require('../metadata/trait-value-tags.json')
const clipTags = {
  'clip_face': true,
  'clip_hf_hat': true,
  'clip_hf_elf': true,
  'clip_hb_hat': true,
  'clip_hat_elf': true,
  'clip_hand': true,
  'clip_mask': true,
  'clip_hat': true
}

export function canSwapAll(token1: TokenData, token2: TokenData, traitTypes: TraitType[]) {
  let traits1 = { ...token1.traitData }
  let traits2 = { ...token2.traitData }

  for (let type of traitTypes) {
    const temp = traits1[type]
    traits1[type] = traits2[type]
    traits2[type] = temp
  }

  const ret1 = checkValid(traits1)
  const ret2 = checkValid(traits2)

  return {
    valid: ret1.valid && ret2.valid,
    clips: [
      ret1.clips,
      ret2.clips
    ]
  }
}

export function canSwap(token1: TokenData, token2: TokenData, type: TraitType) {
  let swappable = true
  let message = undefined

  if (token1.traitData[type] === token2.traitData[type]) {
    swappable = false
  }

  return {
    swappable,
    message
  }
}

function checkValid(traitData: TraitData) {
  let tagCount: { [tag: string]: { [traitType: string]: boolean } } = {}

  for (let traitType of Object.keys(traitData) as any as TraitType[]) {
    const traitValue = traitData[traitType]
    if (traitValue === undefined) {
      continue
    }

    let tags: string[] = []
    if (traitType in traitTags && traitValue in traitTags[traitType]) {
      tags = traitTags[traitType][traitValue]
    }

    for (let tag of tags) {
      if (!(tag in tagCount)) {
        tagCount[tag] = {}
      }
      tagCount[tag][traitType] = true
    }
  }

  let clips = [] as TraitType[]

  for (let tag of Object.keys(tagCount)) {
    if ((tag in clipTags) && Object.keys(tagCount[tag]).length >= 2) {
      clips.push(...Object.keys(tagCount[tag]).map(str => Number.parseInt(str) as TraitType))
    }
  }

  return {
    valid: clips.length === 0,
    clips
  }
}
