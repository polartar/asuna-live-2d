export type TextureId = string

export class Texture {
  id: TextureId
  width: number
  height: number
  data: WebGLTexture
  elem: HTMLImageElement
  premultiply: boolean

  constructor({ id, width, height, data, elem, premultiply = true }: {
    id: TextureId,
    width: number,
    height: number,
    data: WebGLTexture,
    elem: HTMLImageElement,
    premultiply: boolean
  }) {
    this.id = id
    this.width = width
    this.height = height
    this.data = data
    this.elem = elem
    this.premultiply = premultiply
  }
}