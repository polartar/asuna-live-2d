
import { TokenData, TraitType } from './index'

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
