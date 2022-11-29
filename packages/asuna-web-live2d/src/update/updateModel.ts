import { WorldState } from "../state/WorldState"

import { CubismFramework } from 'cubism-framework/dist/live2dcubismframework'
import { CubismDefaultParameterId } from 'cubism-framework/dist/cubismdefaultparameterid'

export function updateModel(state: WorldState, dt: number) {
  for (let m of Object.values(state.models)) {
    // move this to input
    let screenX = 2 * (-.5 + state.input.x / state.view.width)
    let screenY = 1.2 * 2 * (.5 - state.input.y / state.view.height)

    /* disable drag
    if (!state.input.drag) {
      screenX = 0
      screenY = 0
    }
    */
    m.asset.setDragging(screenX, screenY)

    m.asset._dragManager.update(3 * dt)
    const dragX = m.asset._dragManager.getX()
    const dragY = m.asset._dragManager.getY()

    let uniform = CubismFramework.getIdManager().getId('Param4')
    let xId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleX)
    let yId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleY)
    let bxId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleX)
    let byId = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleY)

    m.asset._model.setParameterValueById(uniform, 1)
    m.asset._model.setParameterValueById(xId, 0)
    m.asset._model.setParameterValueById(yId, 0)
    m.asset._model.setParameterValueById(bxId, 0)
    m.asset._model.setParameterValueById(byId, 0)

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

    if (m.asset._motionManager != null) {
      if (m.asset._motionManager.isFinished()) {
        m.asset._motionManager.startMotionPriority(m.asset.motions['idle_0'], false, 3)
      } else {
        m.asset._motionManager.updateMotion(m.asset._model, dt)
      }
    }

    m.asset._model.addParameterValueById(xId, dragX * 30)
    m.asset._model.addParameterValueById(yId, dragY * 30)
    m.asset._model.addParameterValueById(bxId, dragX * 10)
    m.asset._model.addParameterValueById(byId, dragY * 10)

    if (m.asset._physics != null) {
      m.asset._physics.evaluate(m.asset._model, dt)
    }

    if (state.external.override) {
      m.asset._model.setParameterValueById(xId, 30 * state.external.faceX)
      m.asset._model.setParameterValueById(yId, 30 * state.external.faceY)
      m.asset._model.setParameterValueById(bxId, 10 * state.external.bodyX)
      m.asset._model.setParameterValueById(byId, 10 * state.external.bodyY)
    }

    m.asset._model.update()
  }
}