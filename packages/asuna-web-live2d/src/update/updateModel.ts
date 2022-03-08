import { WorldState } from "../state/WorldState"

import { CubismFramework } from 'cubism-framework/dist/live2dcubismframework'
import { CubismDefaultParameterId } from 'cubism-framework/dist/cubismdefaultparameterid'

export function updateModel(state: WorldState, dt: number) {
  for (let m of Object.values(state.models)) {
    // m.asset._model.loadParameters()
    // m.asset._model.saveParameters()

    if (m.asset._breath != null) {
      const pid = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath)
      m.asset._model.setParameterValueById(pid, 0)
      m.asset._breath.updateParameters(m.asset._model, dt)
    }

    if (m.asset._eyeBlink !== null) {
      m.asset._eyeBlink.updateParameters(m.asset._model, dt)
    }

    if (m.asset._physics != null) {
      m.asset._physics.evaluate(m.asset._model, dt)
    }

    m.asset._model.update()
  }
}