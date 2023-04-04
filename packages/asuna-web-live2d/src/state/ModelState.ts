import { AssetStore } from "../asset/AssetStore"
import { Live2dModel } from "../asset/Live2dModel"
import { Loader } from "../Loader"
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
  assets: AssetStore
  data: ModelData

  constructor(assets: AssetStore) {
    this.assets = assets
    this.data = {
      [ModelLayer.BackHair]: null,
      [ModelLayer.Body]: null,
      [ModelLayer.Eyes]: null,
      [ModelLayer.FrontHair]: null,
      [ModelLayer.Outfit]: null
    }
  }
}