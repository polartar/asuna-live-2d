import { Live2dModelId, Live2dModel } from "./Live2dModel"
import { Texture, TextureId } from "./Texture"

enum AssetType {
  Model = 'model',
  Texture = 'texture'
}

export type Asset = Live2dModel | Texture
export type AssetId = Live2dModelId | TextureId

export class AssetStore {

  modelRegistry: { [id: Live2dModelId]: Live2dModel }
  textureRegistry: { [id: TextureId]: Texture }

  constructor() {
    this.modelRegistry = {}
    this.textureRegistry = {}
  }

  // TODO: refactor using getassetregistry
  has(id: AssetId) {
    const type = this.getAssetType(id)
    if (type === AssetType.Model) {
      return id as Live2dModelId in this.modelRegistry
    } if (type === AssetType.Texture) {
      return id as TextureId in this.textureRegistry
    }
    return false
  }

  get(id: AssetId) {
    const type = this.getAssetType(id)
    if (type === AssetType.Model) {
      if (!(id as Live2dModelId in this.modelRegistry)) {
        throw `Asset not found ${id}`
      }
      return this.modelRegistry[id]
    } if (type === AssetType.Texture) {
      if (!(id as TextureId in this.textureRegistry)) {
        throw `Asset not found ${id}`
      }
      return this.textureRegistry[id]
    }
  }

  set(id: AssetId, asset: Asset) {
    const type = this.getAssetType(id)
    if (type === AssetType.Model) {
      this.modelRegistry[id] = asset as Live2dModel
    } else if (type === AssetType.Texture) {
      this.textureRegistry[id] = asset as Texture
    }
    return asset
  }

  delete(id: AssetId) {
    const type = this.getAssetType(id)
    if (type === AssetType.Model) {
      this.modelRegistry[id].release()
      delete this.modelRegistry[id]
    }
  }

  getAssetType(id: AssetId): AssetType {
    if (id.startsWith(AssetType.Model)) {
      return AssetType.Model
    } else if (id.startsWith(AssetType.Texture)) {
      return AssetType.Texture
    }
    throw `Unknown asset type ${id}`
  }
}