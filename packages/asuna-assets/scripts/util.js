function deserialize(str) {
  return str.split(',').map(v => +v)
}

function serialize(arr, idx) {
  // suppress low alpha anomalies
  if (arr[idx + 3] <= 2) {
    arr[idx + 3] = 0
  }
  return `${arr[idx]},${arr[idx + 1]},${arr[idx + 2]},${arr[idx + 3]}`
}

function stringToObj(str) {
  const arr = str.split(',')
  return {
    r: +arr[0],
    g: +arr[1],
    b: +arr[2],
    a: +arr[3]
  }
}

function objToString(obj, alpha) {
  return `${obj.r},${obj.g},${obj.b},${alpha || obj.a}`
}

module.exports = {
  serialize,
  deserialize,
  stringToObj,
  objToString
}