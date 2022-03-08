import { Live2dModelId, Live2dModel } from '../asset/Live2dModel'

export class Model {
  id: number
  asset: Live2dModel

  constructor(asset: Live2dModel) {
    this.id = -1
    this.asset = asset
  }
}