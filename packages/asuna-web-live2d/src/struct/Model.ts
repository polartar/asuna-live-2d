import { Live2dModelId, Live2dModel } from '../asset/Live2dModel'
import { WorldState } from '../state/WorldState'

export class Model {
  asset: Live2dModel

  constructor(asset: Live2dModel) {
    this.asset = asset
  }

  syncParams(params: WorldState['params']) {

    // for (let [k, v] of Object.entries(params)) {
    //   let id = CubismFramework.getIdManager().getId(k)
    //   this.asset._model.setParameterValueById(id, v)
    // }
  }
}