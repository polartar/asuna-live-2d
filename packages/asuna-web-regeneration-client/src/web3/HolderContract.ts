export const HOLDER_ADDRESS = '0xd5587825564f77ef9Fbbf5DF9D1Cc378eF23e230'
export const HOLDER_ABI = [
  'function lock(uint16[] calldata tokenId) external',
  'function withdraw(uint16[] calldata orderedTokenIds) external',
  'function getLockedIds(address _address) external view returns(uint256[] memory)',
  'function getUnlockDates(uint16[] calldata tokenIds) external view returns (uint256[] memory)'
]
export function getOrderedInput(arr: number[], find: number[]) {
  let ordered = []

  let lookup: { [id: string]: boolean } = {}
  for (let n of find) {
    lookup[n] = true
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] in lookup) {
      ordered.push(arr[i])
      delete lookup[arr[i]]
      arr[i] = arr[arr.length - 1]
      arr.pop()
      i--
    }
  }

  if (Object.keys(lookup).length > 0) {
    throw `Not found: ${Object.keys(lookup)}`
  }

  return ordered
}
