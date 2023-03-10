import { AssetStore } from "../asset/AssetStore"
import { Live2dModel } from "../asset/Live2dModel"
import { Model } from "../struct/Model"

export enum ModelLayer {
  BackHair,
  Body,
  Eyes,
  FrontHair,
  Outfit
}

export type ModelData = {
  [L in ModelLayer]: Model | null
}

export class ModelState {
  data: ModelData

  constructor() {
    this.data = null as any
  }

  initialize(assets: AssetStore) {
    this.data = {
      [ModelLayer.BackHair]: null, // new Model(assets.get('model/Back_Hair/Back_Messy_Long_Gray') as Live2dModel),
      [ModelLayer.Body]: new Model(assets.get('model/Body/Body') as Live2dModel),
      [ModelLayer.Eyes]: null, // new Model(assets.get('model/Eyes/Blue_Eyes') as Live2dModel),
      [ModelLayer.FrontHair]: null, // new Model(assets.get('model/Front_Hair/Front_Messy_Long_Gray') as Live2dModel),
      [ModelLayer.Outfit]: new Model(assets.get('model/Outfit/Ace_Of_Spades') as Live2dModel)
    }
  }
}