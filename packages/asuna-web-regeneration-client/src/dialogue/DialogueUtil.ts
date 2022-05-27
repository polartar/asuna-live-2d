const SPEED_DEFAULT = 35

export type stageSetting = {
  hand?: boolean,
  smile?: boolean,
  big?: boolean
}

type letter = {
  id: number,
  char: string,
  time: number,
  class: string
}

export function parse(texts: string[]) {
  let ret: letter[][] = []
  let id = 0

  for (let text of texts) {
    let dt = SPEED_DEFAULT
    let effect = ''
    let letters: letter[] = []

    const arr = text.split(/<..?>/g)
    const mods = text.match(/<..?>/g)
    let time = 0

    for (let i = 0; i < arr.length; i++) {
      const str = arr[i]
      if (i > 0) {
        const mod = mods![i - 1]

        for (let s = 0; s <= 20; s++) {
          if (mod === `<${s}>`) {
            dt = s * SPEED_DEFAULT
            break
          }
        }

        if (mod === '<en>') {
          effect = ''
        } else if (mod === '<ef>') {
          effect = ' fancy'
        }
      }

      for (let j = 0; j < str.length; j++) {
        letters.push({
          id: id++,
          char: str.charAt(j),
          class: `${effect}`,
          time
        })

        time += dt
      }
    }

    ret.push(letters)
  }

  return ret
}